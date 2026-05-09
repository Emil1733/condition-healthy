const { google } = require('googleapis');
const path = require('path');

async function main() {
  const credentialsPath = 'c:/Users/tevat/searchniche/gsc_credentials.json';
  
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  try {
    console.log('Fetching sites...');
    const res = await searchconsole.sites.list();
    const sites = res.data.siteEntry;

    if (!sites || sites.length === 0) {
      console.log('No sites found associated with this service account.');
    } else {
      console.log(`${sites.length} site(s) found:`);
      sites.forEach(site => {
        console.log(`- ${site.siteUrl} (Permission Level: ${site.permissionLevel})`);
      });
    }
  } catch (error) {
    console.error('Error connecting to GSC API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

main();
