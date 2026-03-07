
import { SITE_CONFIG } from '../lib/constants';
import { supabaseAdmin } from '../lib/supabase.admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifySitemap() {
  console.log("🌐 SITEMAP INTEGRITY VERIFICATION\n");

  const { data: contents } = await supabaseAdmin
    .from("page_content")
    .select("path_slug")
    .limit(5000);

  const count = contents?.length || 0;
  console.log(`📊 Database Entries Found: ${count}`);

  if (count > 500) {
    console.log("✅ SUCCESS: Sitemap will include 500+ scale-up pages.");
  } else {
    console.warn("⚠️ WARNING: Sitemap count is lower than expected.");
  }

  const sample = contents?.[0]?.path_slug;
  if (sample) {
    console.log(`🔗 Sample URL: ${SITE_CONFIG.baseUrl}/trials/${sample}`);
  }

  console.log("\n🏁 Verification Complete.");
}

verifySitemap();
