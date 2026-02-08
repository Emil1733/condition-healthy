const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Setup logging to file
const logStream = fs.createWriteStream("cleaning_log.txt", { flags: 'a' });
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg); // Still try stdout
  logStream.write(line);
}

log("Starting Cleaning Script...");

require('dotenv').config({ path: 'c:\\Users\\tevat\\searchniche\\condition-healthy\\.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  log("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// List of exactly 50 US States + DC + PR
const US_STATES = new Set([
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "District of Columbia", "Puerto Rico"
]);

async function cleanInternationalTrials() {
  log("Fetching all study IDs and States...");

  // Fetch all trials (limit 3000)
  const { data: trials, error } = await supabase
    .from('studies')
    .select('id, location_state, location_city')
    .range(0, 2999);
  
  if (error) {
    log(`Error fetching trials: ${JSON.stringify(error)}`);
    return;
  }

  log(`Analyzing ${trials.length} trials...`);

  const toDelete = [];

  for (const t of trials) {
    const state = t.location_state ? t.location_state.trim() : null;
    
    // Check if valid state
    if (state && US_STATES.has(state)) {
      // Keep
    } else {
      toDelete.push({
        id: t.id,
        state: state,
        city: t.location_city
      });
    }
  }

  log(`Found ${toDelete.length} NON-US trials (or invalid states).`);
  
  if (toDelete.length > 0) {
    log("First 10 to delete:");
    toDelete.slice(0, 10).forEach(t => log(`  - ${t.city}, ${t.state} (ID: ${t.id})`));

    log("Deleting these records from database...");
    
    const deleteIds = toDelete.map(t => t.id);
    const batchSize = 100;
    let deletedCount = 0;

    for (let i = 0; i < deleteIds.length; i += batchSize) {
      const batch = deleteIds.slice(i, i + batchSize);
      const { error: delErr } = await supabase
        .from('studies')
        .delete()
        .in('id', batch);
      
      if (delErr) {
        log(`Error deleting batch ${i}: ${JSON.stringify(delErr)}`);
      } else {
        deletedCount += batch.length;
      }
    }
    log(`Successfully deleted ${deletedCount} international trials.`);
  } else {
    log("Database is already clean.");
  }
}

cleanInternationalTrials().catch(err => {
  log(`UNHANDLED ERROR: ${err}`);
});
