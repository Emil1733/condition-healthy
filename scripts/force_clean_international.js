const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: 'c:\\Users\\tevat\\searchniche\\condition-healthy\\.env.local' });

// Setup logging
const logStream = fs.createWriteStream("force_clean_log.txt", { flags: 'a' });
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg); // Still try stdout
  logStream.write(line);
}

log("Starting Force Clean Script...");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Target IDs we know exist and should be deleted
const TARGET_IDS = new Set([
  '9e6b601f-d18b-4a19-b3e9-da1a05afb16a', // Amsterdam
  '8c74c5a0-d076-4d35-a1eb-756dd36c56d5', // Taichung
  '8a4f32cd-9a52-4cd4-b8b5-545a7f075dad'  // Shenyang
]);

// List of exactly 50 US States + DC + PR
const US_STATES = new Set([
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "District of Columbia", "Puerto Rico"
]);

async function forceClean() {
  log("Fetching ALL trials via pagination...");
  
  let allTrials = [];
  let page = 0;
  const pageSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('studies')
      .select('id, location_state, location_city')
      .range(page * pageSize, (page + 1) * pageSize - 1);
    
    if (error) {
      log(`Error fetching page ${page}: ${JSON.stringify(error)}`);
      break;
    }
    
    if (data.length === 0) {
      hasMore = false;
    } else {
      allTrials = allTrials.concat(data);
      page++;
      log(`Fetched page ${page}, total so far: ${allTrials.length}`);
    }
  }

  log(`Total trials analyzed: ${allTrials.length}`);

  const toKeep = [];
  const toDelete = [];

  for (const t of allTrials) {
    const state = t.location_state ? t.location_state.trim() : null;
    
    // Explicit check for target IDs
    if (TARGET_IDS.has(t.id)) {
      log(`DEBUG: Target ID ${t.id} found. State: "${state}"`);
    }

    // Check if strict US state match
    if (state && US_STATES.has(state)) {
      toKeep.push(t.id);
    } else {
      toDelete.push(t.id);
      if (TARGET_IDS.has(t.id)) {
        log(`DEBUG: Target ID ${t.id} added to DELETE list.`);
      }
    }
  }

  log(`\nIdentified ${toDelete.length} trials to DELETE.`);
  log(`Identified ${toKeep.length} trials to KEEP (US Only).`);

  if (toDelete.length > 0) {
    log("Deleting in batches of 100...");
    
    let deletedCount = 0;
    const batchSize = 100;
    
    for (let i = 0; i < toDelete.length; i += batchSize) {
      const batch = toDelete.slice(i, i + batchSize);
      
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
    log(`Successfully deleted ${deletedCount} trials.`);
  } else {
    log("No trials to delete.");
  }
}

forceClean().catch(err => log(`UNHANDLED ERROR: ${err}`));
