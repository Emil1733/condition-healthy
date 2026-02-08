const { createClient } = require('@supabase/supabase-js');
const path = require('path');
// Use the absolute path
require('dotenv').config({ path: 'c:\\Users\\tevat\\searchniche\\condition-healthy\\.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteNonUsTrials() {
  console.log("Checking for Non-US Trials...");

  // 1. Count Non-US
  const { count: nonUsCount, error: countError } = await supabase
    .from('studies')
    .select('*', { count: 'exact', head: true })
    .neq('location_country', 'United States');
  
  if (countError) {
    console.error("Error counting non-US trials:", countError);
    return;
  }
  
  console.log(`Found ${nonUsCount} trials outside the United States.`);
  
  if (nonUsCount > 0) {
    console.log("Deleting...");
    
    // 2. Delete Non-US
    const { count: deletedCount, error: deleteError } = await supabase
      .from('studies')
      .delete({ count: 'exact' }) // Request count of deleted rows
      .neq('location_country', 'United States');

    if (deleteError) {
      console.error("Error deleting non-US trials:", deleteError);
    } else {
      console.log(`Successfully deleted ${deletedCount || 'rows'} from the database.`);
    }
  } else {
    console.log("No non-US trials found. Database is clean.");
  }
}

deleteNonUsTrials();
