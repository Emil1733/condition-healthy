
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyContent(condition: string) {
  console.log(`\n🔍 Verifying content for: ${condition}`);
  
  const { count, error } = await supabase
    .from('page_content')
    .select('*', { count: 'exact', head: true })
    .ilike('condition', condition)
    .not('intro_text', 'is', null);

  if (error) {
    console.error(`❌ Error fetching counts for ${condition}:`, error.message);
  } else {
    console.log(`✅ Found ${count} pages with intro_text for ${condition}.`);
  }

  // Check one sample to ensure FAQ is parsed
  const { data: sample } = await supabase
    .from('page_content')
    .select('local_faq')
    .ilike('condition', condition)
    .limit(1)
    .single();

  if (sample?.local_faq && Array.isArray(sample.local_faq) && sample.local_faq.length > 0) {
    console.log(`✅ Sample FAQ for ${condition} is valid and contains ${sample.local_faq.length} items.`);
  } else {
    console.error(`❌ Sample FAQ for ${condition} is missing or invalid.`);
  }
}

async function runTests() {
  await verifyContent('Arthritis');
  await verifyContent('Diabetes');
  console.log('\n🏁 Verification 1 (DB) Complete.');
}

runTests();
