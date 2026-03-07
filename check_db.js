const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkData() {
    const slug = 'wilmington-north carolina'; // It's url-decoded here from the browser
    const condition = 'migraine';
    
    // Check pageContent
    const pathSlug = `${condition}/${slug}`;
    console.log("Checking pathSlug:", pathSlug);
    
    const { data: pageContent, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('path_slug', pathSlug)
        .single();
        
    console.log("Page Content:", pageContent ? "FOUND" : "NOT FOUND", error ? error.message : "");
    if (pageContent) {
        console.log("local_faq Type:", typeof pageContent.local_faq, Array.isArray(pageContent.local_faq) ? '(Array)' : '');
        console.log("local_facilities Type:", typeof pageContent.local_facilities, Array.isArray(pageContent.local_facilities) ? '(Array)' : '');
    }
}

checkData();
