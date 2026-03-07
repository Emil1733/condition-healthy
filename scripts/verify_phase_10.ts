
import { supabaseAdmin } from '../lib/supabase.admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyPhase10() {
  console.log("🏁 PHASE 10: FINAL VERIFICATION\n");

  // 1. Check State Hub Count
  const { data: stateContent } = await supabaseAdmin
    .from("page_content")
    .select("path_slug")
    .ilike("path_slug", "%/%") // condition/slug
    .filter("city_slug", "not.ilike", "%-%"); // Logic: state slugs are 2 chars, no dashes

  const stateHubs = (stateContent || []).filter(item => {
    const parts = item.path_slug.split('/');
    return parts[1].length === 2;
  });

  console.log(`📊 State Hubs in DB: ${stateHubs.length} / 255`);

  if (stateHubs.length >= 250) {
    console.log("✅ SUCCESS: Mass generation complete.");
  } else {
    console.warn("⚠️ INFO: Generation still in progress or partially complete.");
  }

  // 2. Check a few State Hubs for content quality
  const sample = stateHubs[0];
  if (sample) {
    const { data: content } = await supabaseAdmin
        .from("page_content")
        .select("*")
        .eq("path_slug", sample.path_slug)
        .single();
    
    console.log(`\n🔍 Quality Audit [${sample.path_slug}]:`);
    console.log(`   - Intro: ${content?.intro_text?.substring(0, 50)}...`);
    console.log(`   - FAQs: ${content?.local_faq ? "Present" : "Missing"}`);
  }

  console.log("\n🏁 Verification Complete.");
}

verifyPhase10();
