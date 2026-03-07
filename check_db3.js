const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkData() {
    const { data: locations, error } = await supabase
        .from('locations')
        .select('slug, city, state')
        .ilike('city', 'wilmington')
        .limit(5);
        
    console.log("Locations:", locations);
}

checkData();
