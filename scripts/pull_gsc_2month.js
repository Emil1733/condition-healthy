const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS = 'c:/Users/tevat/searchniche/gsc_credentials.json';
const SITE_URL = 'sc-domain:conditionhealthy.com';
const OUT_DIR = 'c:/Users/tevat/searchniche/condition-healthy/gsc/05-03-2026';

// Periods
const CURRENT_START = '2026-03-03';
const CURRENT_END   = '2026-05-02';
const PREV_START    = '2026-01-03';
const PREV_END      = '2026-03-02';

async function query(sc, startDate, endDate, dimensions, extraBody = {}) {
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions, rowLimit: 500, ...extraBody },
  });
  return res.data.rows || [];
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

  // Country filter for US only
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
    curDaily, curQueries, curPages, curCountries, curDevices,
    prevDaily, prevQueries, prevPages,
  ] = await Promise.all([
    query(sc, CURRENT_START, CURRENT_END, ['date'], usFilter),
    query(sc, CURRENT_START, CURRENT_END, ['query'], usFilter),
    query(sc, CURRENT_START, CURRENT_END, ['page'], usFilter),
    query(sc, CURRENT_START, CURRENT_END, ['country'], {}),
    query(sc, CURRENT_START, CURRENT_END, ['device'], usFilter),
    query(sc, PREV_START, PREV_END, ['date'], usFilter),
    query(sc, PREV_START, PREV_END, ['query'], usFilter),
    query(sc, PREV_START, PREV_END, ['page'], usFilter),
  ]);

  const data = {
    meta: {
      pulled_at: new Date().toISOString(),
      current_period: { start: CURRENT_START, end: CURRENT_END },
      previous_period: { start: PREV_START, end: PREV_END },
      country_filter: 'USA only',
    },
    current: { daily: curDaily, queries: curQueries, pages: curPages, countries: curCountries, devices: curDevices },
    previous: { daily: prevDaily, queries: prevQueries, pages: prevPages },
  };

  const outPath = path.join(OUT_DIR, 'raw_data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`\nData saved to ${outPath}`);
  console.log(`Current period: ${curDaily.length} days, ${curQueries.length} queries, ${curPages.length} pages`);
  console.log(`Previous period: ${prevDaily.length} days, ${prevQueries.length} queries, ${prevPages.length} pages`);

  // Quick totals
  const sum = rows => rows.reduce((a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }), { clicks: 0, impressions: 0 });
  const cur = sum(curDaily);
  const prev = sum(prevDaily);
  console.log('\nCURRENT  :', cur);
  console.log('PREVIOUS :', prev);
  console.log('Clicks change:', cur.clicks - prev.clicks, `(${prev.clicks === 0 ? '∞' : ((cur.clicks - prev.clicks) / prev.clicks * 100).toFixed(1)}%)`);
  console.log('Impressions change:', cur.impressions - prev.impressions, `(${prev.impressions === 0 ? '∞' : ((cur.impressions - prev.impressions) / prev.impressions * 100).toFixed(1)}%)`);
}

main().catch(console.error);
