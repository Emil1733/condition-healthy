const { google } = require('googleapis');

async function main() {
  const credentialsPath = 'c:/Users/tevat/searchniche/gsc_credentials.json';
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  try {
    const res = await searchconsole.sites.list();
    console.log(JSON.stringify(res.data.siteEntry, null, 2));
  } catch (error) {
    console.error(error.message);
  }
}
main();
