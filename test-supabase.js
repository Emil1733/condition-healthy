const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testQuery() {
  const condition = 'eczema';
  const stateName = 'Maryland';
  const stateAbbr = 'MD';

  let query = supabase
    .from("studies")
    .select("title, location_state, condition")
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting");

  query = query.or(`location_state.ilike.${stateName},location_state.ilike.${stateAbbr}`);

  const { data, error } = await query.limit(50);
  
  console.log("DATA LENGTH:", data ? data.length : "NULL");
  console.log("ERROR:", error);
}

testQuery();
