const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS = 'c:/Users/tevat/searchniche/gsc_credentials.json';
const SITE_URL = 'sc-domain:conditionhealthy.com';
const OUT_DIR = 'c:/Users/tevat/searchniche/condition-healthy/gsc/05-23-2026';

const CURRENT_START = '2026-05-09';
const CURRENT_END   = '2026-05-22';
const PREV_START    = '2026-04-25';
const PREV_END      = '2026-05-08';

async function query(sc, startDate, endDate, dimensions, extraBody = {}) {
  try {
    const res = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: { startDate, endDate, dimensions, rowLimit: 1000, ...extraBody },
    });
    return res.data.rows || [];
  } catch (err) {
    console.error(`Error querying ${dimensions.join(',')} for ${startDate} to ${endDate}:`, err.message);
    return [];
  }
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const sc = google.searchconsole({ version: 'v1', auth });

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Fetching CURRENT period:', CURRENT_START, '->', CURRENT_END);
  console.log('Fetching PREVIOUS period:', PREV_START, '->', PREV_END);

  const usFilter = {
    dimensionFilterGroups: [{
      filters: [{
        dimension: 'country',
        operator: 'equals',
        expression: 'usa',
      }]
    }]
  };

  const [
    curDaily, curQueries, curPages, curCombined,
    prevDaily, prevQueries, prevPages, prevCombined
  ] = await Promise.all([
    query(sc, CURRENT_START, CURRENT_END, ['date'], usFilter),
    query(sc, CURRENT_START, CURRENT_END, ['query'], usFilter),
    query(sc, CURRENT_START, CURRENT_END, ['page'], usFilter),
    query(sc, CURRENT_START, CURRENT_END, ['query', 'page'], usFilter),
    query(sc, PREV_START, PREV_END, ['date'], usFilter),
    query(sc, PREV_START, PREV_END, ['query'], usFilter),
    query(sc, PREV_START, PREV_END, ['page'], usFilter),
    query(sc, PREV_START, PREV_END, ['query', 'page'], usFilter),
  ]);

  const outputData = {
    metadata: {
      startDate: CURRENT_START,
      endDate: CURRENT_END,
      siteUrl: SITE_URL,
      country: 'USA',
      pulledAt: new Date().toISOString(),
      previousPeriod: { start: PREV_START, end: PREV_END }
    },
    queries: curQueries.map(r => ({
      keys: r.keys,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position
    })),
    pages: curPages.map(r => ({
      keys: r.keys,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position
    })),
    combined: curCombined.map(r => ({
      keys: r.keys,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position
    })),
    daily: curDaily.map(r => ({
      keys: r.keys,
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position
    })),
    previous: {
      daily: prevDaily.map(r => ({
        keys: r.keys,
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position
      })),
      queries: prevQueries.map(r => ({
        keys: r.keys,
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position
      })),
      pages: prevPages.map(r => ({
        keys: r.keys,
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position
      })),
      combined: prevCombined.map(r => ({
        keys: r.keys,
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position
      }))
    }
  };

  const jsonPath = path.join(OUT_DIR, 'gsc_usa_data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(outputData, null, 2));
  console.log(`Saved USA data to ${jsonPath}`);

  // Summary analysis
  const getSum = rows => rows.reduce((a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }), { clicks: 0, impressions: 0 });
  const curTotals = getSum(curDaily);
  const prevTotals = getSum(prevDaily);

  console.log('\n--- PERFORMANCE SUMMARY (USA) ---');
  console.log(`CURRENT (${CURRENT_START} to ${CURRENT_END}):`);
  console.log(`  Clicks     : ${curTotals.clicks}`);
  console.log(`  Impressions: ${curTotals.impressions}`);
  console.log(`PREVIOUS (${PREV_START} to ${PREV_END}):`);
  console.log(`  Clicks     : ${prevTotals.clicks}`);
  console.log(`  Impressions: ${prevTotals.impressions}`);

  // Check how many pages got impressions in current vs previous
  const curPageCount = curPages.filter(p => p.impressions > 0).length;
  const prevPageCount = prevPages.filter(p => p.impressions > 0).length;
  console.log(`Active pages (with impressions): ${prevPageCount} -> ${curPageCount}`);

  // Check how many queries got impressions
  const curQueryCount = curQueries.filter(q => q.impressions > 0).length;
  const prevQueryCount = prevQueries.filter(q => q.impressions > 0).length;
  console.log(`Active queries (with impressions): ${prevQueryCount} -> ${curQueryCount}`);

  // Build markdown audit summary
  let md = `# GSC USA-Only Performance Audit & Improvement Verification

**Current Period (After universal rollout):** ${CURRENT_START} to ${CURRENT_END} (14 days)
**Previous Period (Before/during rollout):** ${PREV_START} to ${PREV_END} (14 days)

## 1. High-Level Comparison

| Metric | Previous Period | Current Period | Change | % Change |
| :--- | :--- | :--- | :--- | :--- |
| **Clicks** | ${prevTotals.clicks} | ${curTotals.clicks} | ${curTotals.clicks - prevTotals.clicks} | ${prevTotals.clicks === 0 ? 'N/A' : ((curTotals.clicks - prevTotals.clicks) / prevTotals.clicks * 100).toFixed(1) + '%'} |
| **Impressions** | ${prevTotals.impressions} | ${curTotals.impressions} | ${curTotals.impressions - prevTotals.impressions} | ${prevTotals.impressions === 0 ? 'N/A' : ((curTotals.impressions - prevTotals.impressions) / prevTotals.impressions * 100).toFixed(1) + '%'} |
| **Active Pages** | ${prevPageCount} | ${curPageCount} | ${curPageCount - prevPageCount} | ${prevPageCount === 0 ? 'N/A' : ((curPageCount - prevPageCount) / prevPageCount * 100).toFixed(1) + '%'} |
| **Active Queries** | ${prevQueryCount} | ${curQueryCount} | ${curQueryCount - prevQueryCount} | ${prevQueryCount === 0 ? 'N/A' : ((curQueryCount - prevQueryCount) / prevQueryCount * 100).toFixed(1) + '%'} |

## 2. Top Queries (Current Period)

| Query | Clicks | Impressions | CTR | Avg Position |
| :--- | :--- | :--- | :--- | :--- |
`;

  curQueries.slice(0, 30).forEach(q => {
    md += `| ${q.keys[0]} | ${q.clicks} | ${q.impressions} | ${(q.ctr * 100).toFixed(2)}% | ${q.position.toFixed(1)} |\n`;
  });

  md += `\n## 3. Top Pages (Current Period)\n\n| Page | Clicks | Impressions | CTR | Avg Position |\n| :--- | :--- | :--- | :--- | :--- |\n`;
  curPages.slice(0, 30).forEach(p => {
    md += `| ${p.keys[0]} | ${p.clicks} | ${p.impressions} | ${(p.ctr * 100).toFixed(2)}% | ${p.position.toFixed(1)} |\n`;
  });

  // Specifically check for improvements in thickened content
  // Thickened pages match '/study/[condition]_[city]-[state]' (e.g. study/arthritis_columbus-oh)
  // Trial pages match '/study/NCT...' or similar
  const isCityGuide = (url) => url.includes('/study/') && !url.match(/\/study\/NCT[0-9]+/i);
  const isTrialNode = (url) => url.includes('/study/') && !!url.match(/\/study\/NCT[0-9]+/i);

  const curCityGuides = curPages.filter(p => isCityGuide(p.keys[0]));
  const prevCityGuides = prevPages.filter(p => isCityGuide(p.keys[0]));
  const curTrialNodes = curPages.filter(p => isTrialNode(p.keys[0]));
  const prevTrialNodes = prevPages.filter(p => isTrialNode(p.keys[0]));

  const curCityGuideImp = curCityGuides.reduce((s, p) => s + p.impressions, 0);
  const prevCityGuideImp = prevCityGuides.reduce((s, p) => s + p.impressions, 0);
  const curTrialNodeImp = curTrialNodes.reduce((s, p) => s + p.impressions, 0);
  const prevTrialNodeImp = prevTrialNodes.reduce((s, p) => s + p.impressions, 0);

  md += `\n## 4. Verification of Authority Rollout (Thickened City Guides vs Trial Nodes)

| Content Type | Prev Impressions | Cur Impressions | Change | Active Pages (Prev -> Cur) |
| :--- | :--- | :--- | :--- | :--- |
| **City Guides (Thickened Hubs)** | ${prevCityGuideImp} | ${curCityGuideImp} | ${curCityGuideImp - prevCityGuideImp} | ${prevCityGuides.length} -> ${curCityGuides.length} |
| **Trial Nodes (Long-tail Studies)** | ${prevTrialNodeImp} | ${curTrialNodeImp} | ${curTrialNodeImp - prevTrialNodeImp} | ${prevTrialNodes.length} -> ${curTrialNodes.length} |

### Key Takeaways on Improvements:
- **Indexation Expansion**: Do we see new pages debuting in GSC search results? ${curPageCount > prevPageCount ? 'Yes, the page footprint has expanded.' : 'No significant change in page footprint.'}
- **Impression Momentum**: Are impressions growing? ${curTotals.impressions > prevTotals.impressions ? 'Yes, the site is gaining search visibility.' : 'No, search visibility is stable or lagging.'}
- **Thickened City Hubs**: Are the localized authority hubs showing signs of life? They pulled **${curCityGuideImp}** impressions in the current period compared to **${prevCityGuideImp}** in the previous period.
`;

  const mdPath = path.join(OUT_DIR, 'audit_summary.md');
  fs.writeFileSync(mdPath, md);
  console.log(`Saved audit summary to ${mdPath}`);
}

main().catch(console.error);
