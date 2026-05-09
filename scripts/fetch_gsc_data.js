const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function main() {
  const credentialsPath = 'c:/Users/tevat/searchniche/gsc_credentials.json';
  const siteUrl = 'sc-domain:conditionhealthy.com';
  
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  try {
    // 1. Fetch overall summary for last 28 days (approx 2026-02-22 to 2026-03-21)
    const startDate = '2026-02-22';
    const endDate = '2026-03-21';

    console.log(`Fetching GSC performance data for ${siteUrl} from ${startDate} to ${endDate}...`);

    const queryResponse = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 50,
      },
    });

    const pageResponse = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 50,
      },
    });

    const overallResponse = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
      },
    });

    const result = {
      overall: overallResponse.data.rows?.[0] || {},
      queries: queryResponse.data.rows || [],
      pages: pageResponse.data.rows || [],
    };

    fs.writeFileSync('scripts/gsc_data_pulled.json', JSON.stringify(result, null, 2));
    console.log('Performance data pulled successfully and saved to scripts/gsc_data_pulled.json');

    // Display top 5 queries
    console.log('\nTop 5 Queries:');
    result.queries.slice(0, 5).forEach(row => {
      console.log(`- ${row.keys[0]}: ${row.clicks} clicks, ${row.impressions} impressions`);
    });

  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

main();
