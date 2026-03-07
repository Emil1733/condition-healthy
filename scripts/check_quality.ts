
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSample() {
  console.log("📝 BATCH 1 CONTENT QUALITY CHECK\n");

  const { data: sample } = await supabase
    .from('page_content')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!sample) {
    console.error("❌ No recent content found.");
    return;
  }

  console.log(`📍 Page: /trials/${sample.path_slug}`);
  console.log(`🔹 Intro Preview: ${sample.intro_text.substring(0, 150)}...`);
  console.log(`🔹 Meta Title: ${sample.meta_title}`);
  
  const fluffCheck = ["journey", "unlock", "beacon", "cutting-edge", "revolutionary"];
  const containsFluff = fluffCheck.filter(word => sample.intro_text.toLowerCase().includes(word));

  if (containsFluff.length === 0) {
    console.log("\n✅ Anti-Fluff Check Passed: No banned phrases found.");
  } else {
    console.warn(`\n⚠️ Anti-Fluff Warning: Found phrases: ${containsFluff.join(', ')}`);
  }
}

checkSample();
