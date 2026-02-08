
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function count() {
  try {
    const { count: contentCount, error: contentError } = await supabase
      .from('page_content')
      .select('*', { count: 'exact', head: true });

    const { count: studyCount, error: studyError } = await supabase
      .from('studies')
      .select('*', { count: 'exact', head: true });

    if (contentError) throw contentError;
    if (studyError) throw studyError;

    console.log(`--- SE0 Audit Statistics ---`);
    console.log(`Total AI Content Ready Pages (page_content): ${contentCount || 0}`);
    console.log(`Total Recruiting Studies (studies): ${studyCount || 0}`);
  } catch (err) {
    console.error('Error executing query:', err.message);
  }
}

count();
