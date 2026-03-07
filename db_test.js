const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("slug", "wilmington-nc")
      .single();
    
    if (error) throw error;
    console.log("Location found:", data.city);

    const { data: studies, error: sError } = await supabase
      .from("studies")
      .select("count", { count: 'exact', head: true })
      .ilike("location_city", "wilmington")
      .ilike("condition", "%migraine%");
    
    if (sError) throw sError;
    console.log("Studies count:", studies);
    console.log("SUCCESS");
  } catch (e) {
    console.error("FAILED:", e.message);
    process.exit(1);
  }
}

test();
