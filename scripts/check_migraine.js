const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data } = await supabase
    .from('studies')
    .select('location_city, location_state, condition')
    .ilike('condition', '%migraine%')
    .limit(5);
  console.log(JSON.stringify(data, null, 2));
}

check();
