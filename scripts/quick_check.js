const { createClient } = require('@supabase/supabase-js');

// Using keys from .env.local view
const URL = "https://scyqunlpvfpqmevqanqy.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeXF1bmxwdmZwcW1ldnFhbnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTAzMTQsImV4cCI6MjA4NTc4NjMxNH0.e6GNrf5FexLUR79_cLr1Av4T1BUBf7s-4Cnb7wbSqdU";

console.log("STARTING DB CHECK");

const supabase = createClient(URL, KEY);

async function run() {
  const { data: statuses, error } = await supabase.from('studies').select('status').limit(10);
  if(error) {
    console.error("ERROR:", error);
  } else {
    console.log("Unique statuses:", [...new Set(statuses.map(s => s.status))]);
  }
}

run();
