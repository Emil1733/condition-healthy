const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS = 'c:/Users/tevat/searchniche/gsc_credentials.json';
const SITE_URL = 'sc-domain:conditionhealthy.com';
const OUT_DIR = 'c:/Users/tevat/searchniche/condition-healthy/gsc/06-20-2026';

// 30 days current, 30 days previous (incorporating 2-day delay for GSC)
const CURRENT_START = '2026-05-20';
const CURRENT_END   = '2026-06-18';
const PREV_START    = '2026-04-20';
const PREV_END      = '2026-05-19';

async function query(sc, startDate, endDate, dimensions, extraBody = {}) {
  try {
    const res = await sc.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: { startDate, endDate, dimensions, rowLimit: 2000, ...extraBody },
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

  console.log('Fetching CURRENT 30-day period:', CURRENT_START, '->', CURRENT_END);
  console.log('Fetching PREVIOUS 30-day period:', PREV_START, '->', PREV_END);

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

  const jsonPath = path.join(OUT_DIR, 'gsc_30days_usa_data.json');
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
}

main().catch(console.error);
