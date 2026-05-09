const { google } = require('googleapis');
const fs = require('fs');

async function main() {
  const credentialsPath = 'c:/Users/tevat/searchniche/gsc_credentials.json';
  const siteUrl = 'sc-domain:conditionhealthy.com';
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: '2026-02-22',
        endDate: '2026-03-21',
        dimensions: ['date'],
      },
    });

    fs.writeFileSync('scripts/gsc_daily_stats.json', JSON.stringify(res.data.rows, null, 2));
    console.log('Daily stats saved.');
  } catch (error) {
    console.error(error.message);
  }
}
main();
