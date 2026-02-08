
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const url = 'https://scyqunlpvfpqmevqanqy.supabase.co/rest/v1/page_content?select=id&limit=1';
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const options = {
  method: 'GET',
  headers: {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
    'Prefer': 'count=exact'
  }
};

const req = https.request(url, options, (res) => {
  const range = res.headers['content-range'];
  if (range) {
    const total = range.split('/')[1];
    console.log(`TOTAL AI READY PAGES: ${total}`);
  } else {
    console.log('No content-range header found.');
  }
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
