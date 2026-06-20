const fs = require('fs');
const path = require('path');

const dataPath = 'c:/Users/tevat/searchniche/condition-healthy/gsc/06-20-2026/gsc_30days_usa_data.json';
if (!fs.existsSync(dataPath)) {
  console.error("Data file not found");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Helper to classify page types
const getPageType = (url) => {
  if (url === 'https://www.conditionhealthy.com/' || url === 'https://www.conditionhealthy.com') return 'Homepage';
  if (url.includes('/trials/')) {
    if (url.split('/trials/')[1].includes('/')) return 'Trials Subcategory/Geographic';
    return 'Condition Hubs';
  }
  if (url.includes('/study/')) {
    if (url.match(/\/study\/NCT[0-9]+/i)) return 'Trial Nodes (NCT)';
    return 'City Guides (Thickened Hubs)';
  }
  return 'Other';
};

const curPagesByType = {};
const prevPagesByType = {};

// Sum by page types for current
data.pages.forEach(p => {
  const type = getPageType(p.keys[0]);
  if (!curPagesByType[type]) curPagesByType[type] = { clicks: 0, impressions: 0, count: 0, pages: [] };
  curPagesByType[type].clicks += p.clicks;
  curPagesByType[type].impressions += p.impressions;
  curPagesByType[type].count++;
  curPagesByType[type].pages.push(p);
});

// Sum by page types for previous
data.previous.pages.forEach(p => {
  const type = getPageType(p.keys[0]);
  if (!prevPagesByType[type]) prevPagesByType[type] = { clicks: 0, impressions: 0, count: 0, pages: [] };
  prevPagesByType[type].clicks += p.clicks;
  prevPagesByType[type].impressions += p.impressions;
  prevPagesByType[type].count++;
  prevPagesByType[type].pages.push(p);
});

console.log('=== PAGE TYPE COMPARISON ===');
const allTypes = new Set([...Object.keys(curPagesByType), ...Object.keys(prevPagesByType)]);
allTypes.forEach(type => {
  const cur = curPagesByType[type] || { clicks: 0, impressions: 0, count: 0 };
  const prev = prevPagesByType[type] || { clicks: 0, impressions: 0, count: 0 };
  console.log(`Type: ${type}`);
  console.log(`  Current : Count: ${cur.count} | Imp: ${cur.impressions} | Clicks: ${cur.clicks}`);
  console.log(`  Previous: Count: ${prev.count} | Imp: ${prev.impressions} | Clicks: ${prev.clicks}`);
  console.log(`  Diff    : Count: ${cur.count - prev.count} | Imp: ${cur.impressions - prev.impressions} | Clicks: ${cur.clicks - prev.clicks}`);
  console.log('---');
});

console.log('\n=== TOP 25 CURRENT QUERIES ===');
data.queries.sort((a, b) => b.impressions - a.impressions).slice(0, 25).forEach(q => {
  console.log(`Query: ${q.keys[0]} | Imp: ${q.impressions} | Clicks: ${q.clicks} | Pos: ${q.position.toFixed(1)}`);
});

console.log('\n=== TOP 20 CURRENT PAGES ===');
data.pages.sort((a, b) => b.impressions - a.impressions).slice(0, 20).forEach(p => {
  console.log(`Page: ${p.keys[0]} | Imp: ${p.impressions} | Clicks: ${p.clicks} | Pos: ${p.position.toFixed(1)}`);
});
