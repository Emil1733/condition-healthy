
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const pathSlug = 'psoriasis/nashville-davidson-tn';
const url = `https://scyqunlpvfpqmevqanqy.supabase.co/rest/v1/page_content?path_slug=eq.${encodeURIComponent(pathSlug)}&select=*`;
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const options = {
  method: 'GET',
  headers: {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`
  }
};

const req = https.request(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed[0], null, 2));
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
