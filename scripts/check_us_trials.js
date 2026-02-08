const { createClient } = require('@supabase/supabase-js');
const path = require('path');
// Use the absolute path I just viewed
require('dotenv').config({ path: 'c:\\Users\\tevat\\searchniche\\condition-healthy\\.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCountries() {
  console.log("Checking DB Countries...");

  // Check unique countries
  const { data: countries, error: countryError } = await supabase
    .from('studies')
    .select('location_country')
    .range(0, 1000); 
  
  if (countryError) {
    console.error("Error fetching countries:", countryError);
  } else {
    // Basic object equality dedupe
    const uniqueCountries = [...new Set(countries.map(s => s.location_country))];
    console.log("Unique Countries Sample:", uniqueCountries);
  }

  // Check counts for active conditions in US vs Non-US
  const conditions = ['Psoriasis', 'Diabetes'];
  
  for (const condition of conditions) {
    // 1. Total matches for string
    const { count: total } = await supabase
      .from('studies')
      .select('*', { count: 'exact', head: true })
      .ilike('condition', `%${condition}%`);
    
    // 2. US Only
    const { count: usOnly } = await supabase
      .from('studies')
      .select('*', { count: 'exact', head: true })
      .ilike('condition', `%${condition}%`)
      .eq('location_country', 'United States');

    // 3. Non-US
    const { count: nonUs } = await supabase
      .from('studies')
      .select('*', { count: 'exact', head: true })
      .ilike('condition', `%${condition}%`)
      .neq('location_country', 'United States');

    console.log(`Condition: ${condition}`);
    console.log(`  - Total: ${total}`);
    console.log(`  - US Only: ${usOnly}`);
    console.log(`  - Non-US: ${nonUs}`);
    console.log('---');
  }
}

checkCountries();
