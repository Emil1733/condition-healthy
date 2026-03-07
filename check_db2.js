const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkData() {
    const slug = 'wilmington-north carolina'; // Decoded from URL
    console.log("Checking location slug:", slug);
    
    const { data: locationData, error } = await supabase
        .from('locations')
        .select('*')
        .eq('slug', slug)
        .single();
        
    console.log("Location Data:", locationData ? "FOUND" : "NOT FOUND", error ? error.message : "");
}

checkData();
