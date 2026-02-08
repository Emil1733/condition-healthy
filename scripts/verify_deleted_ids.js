const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'c:\\Users\\tevat\\searchniche\\condition-healthy\\.env.local' });

// Setup logging
const logStream = fs.createWriteStream("verification_log.txt", { flags: 'a' });
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg); // Still try stdout
  logStream.write(line);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Specific IDs from user's CSV that were international:
// 1. Line 539: Amsterdam, North Holland (ID: 9e6b601f-d18b-4a19-b3e9-da1a05afb16a)
// 2. Line 342: Taichung, Taiwan (ID: 8c74c5a0-d076-4d35-a1eb-756dd36c56d5)
// 3. Line 321: Shenyang, Liaoning (ID: 8a4f32cd-9a52-4cd4-b8b5-545a7f075dad)

const TARGET_IDS = [
  '9e6b601f-d18b-4a19-b3e9-da1a05afb16a',
  '8c74c5a0-d076-4d35-a1eb-756dd36c56d5',
  '8a4f32cd-9a52-4cd4-b8b5-545a7f075dad'
];

async function verifyDeletions() {
  log(`Checking Supabase for ${TARGET_IDS.length} specific international IDs...`);

  const { data: results, error } = await supabase
    .from('studies')
    .select('id, location_city, location_state')
    .in('id', TARGET_IDS);

  if (error) {
    log(`Supabase Error: ${JSON.stringify(error)}`);
    return;
  }

  log(`Found ${results.length} / ${TARGET_IDS.length} records.`);
  
  if (results.length === 0) {
    log("SUCCESS: All international IDs checked are GONE from the database.");
  } else {
    log("WARNING: Some IDs still exist:");
    results.forEach(r => log(`  - FOUND: ${r.id} (${r.location_city}, ${r.location_state})`));
  }
}

verifyDeletions().catch(err => log(err));
