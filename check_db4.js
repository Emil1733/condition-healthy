const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkData() {
    const { data: studies, error } = await supabase
        .from('studies')
        .select('location_city, location_state')
        .ilike('location_city', '%wilmington%')
        .limit(5);
        
    console.log("Studies Location States:", studies);
}

checkData();
