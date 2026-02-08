
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function count() {
  const { count: contentCount, error: contentError } = await supabase
    .from('page_content')
    .select('*', { count: 'exact', head: true });

  const { count: studyCount, error: studyError } = await supabase
    .from('studies')
    .select('*', { count: 'exact', head: true });

  if (contentError) console.error('Content Error:', contentError);
  if (studyError) console.error('Study Error:', studyError);

  console.log(`--- SE0 Audit Statistics ---`);
  console.log(`Total AI Content Ready Pages (page_content): ${contentCount || 0}`);
  console.log(`Total Recruiting Studies (studies): ${studyCount || 0}`);
  
  // Also check how many pages intersect (have both content AND studies for indexing)
  // This is a bit more complex for a simple script but let's just get the raw numbers first.
}

count();
