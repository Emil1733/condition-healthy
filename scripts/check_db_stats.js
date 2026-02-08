const { createClient } = require('@supabase/supabase-js');
const path = require('path');
// Use the absolute path I just viewed
require('dotenv').config({ path: 'c:\\Users\\tevat\\searchniche\\condition-healthy\\.env.local' });

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Loaded" : "Missing");
console.log("Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Loaded" : "Missing");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStats() {
  console.log("Checking DB Stats...");

  // Check unique statuses
  const { data: statuses, error: statusError } = await supabase
    .from('studies')
    .select('status')
    .range(0, 500); // Limit to check a sample
  
  if (statusError) {
    console.error("Error fetching statuses:", statusError);
  } else {
    // Basic object equality dedupe
    const uniqueStatuses = [...new Set(statuses.map(s => s.status))];
    console.log("Unique Statuses Sample:", uniqueStatuses);
  }

  // Check counts for active conditions
  const conditions = ['Arthritis', 'Psoriasis', 'Diabetes', 'Migraine', 'Eczema'];
  
  for (const condition of conditions) {
    // 1. Total matches for string
    const { count: total } = await supabase
      .from('studies')
      .select('*', { count: 'exact', head: true })
      .ilike('condition', `%${condition}%`);
    
    // 2. Matches with "Recruiting" (Case Sensitive)
    const { count: recruitingCS } = await supabase
      .from('studies')
      .select('*', { count: 'exact', head: true })
      .ilike('condition', `%${condition}%`)
      .eq('status', 'Recruiting');

    // 3. Matches with "recruiting" (Case Insensitive)
    const { count: recruitingCI } = await supabase
      .from('studies')
      .select('*', { count: 'exact', head: true })
      .ilike('condition', `%${condition}%`)
      .ilike('status', 'recruiting');

    console.log(`Condition: ${condition}`);
    console.log(`  - Total Mentioned: ${total}`);
    console.log(`  - Status='Recruiting': ${recruitingCS}`);
    console.log(`  - Status~='recruiting': ${recruitingCI}`);
    console.log('---');
  }
}

checkStats();
