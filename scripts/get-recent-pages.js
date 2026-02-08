
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const url = 'https://scyqunlpvfpqmevqanqy.supabase.co/rest/v1/page_content?select=path_slug,condition,city_slug&order=id.desc&limit=5';
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
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
