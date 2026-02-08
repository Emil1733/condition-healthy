
import { supabaseAdmin } from '../lib/supabase.admin';
import { generateContent } from '../lib/gemini';

async function hydra() {
  console.log("🐲 HYDRA CONTENT ENGINE: STARTING BUST...");

  // 1. Get all base data
  const { data: locations } = await supabaseAdmin.from('locations').select('slug, city, state');
  const { data: studies } = await supabaseAdmin.from('studies').select('condition');
  
  if (!locations || !studies) {
    console.error("❌ Failed to fetch base data.");
    return;
  }

  // Unique conditions
  const conditions = [...new Set(studies.map(s => s.condition))];
  
  // Handle --limit flag
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : (process.argv.includes('--limit') ? 10 : Infinity);
  let processedCount = 0;

  console.log(`📊 Found ${locations.length} cities and ${conditions.length} conditions.`);
  console.log(`🎯 Target: ${locations.length * conditions.length} unique pages (Limit: ${limit}).`);

  // 2. Iterate and check for work
  for (const loc of locations) {
    if (processedCount >= limit) break;
    for (const condition of conditions) {
      if (processedCount >= limit) break;
      const pathSlug = `${condition.toLowerCase()}/${loc.slug}`;

      // Check if already generated
      const { data: existing } = await supabaseAdmin
        .from('page_content')
        .select('id, intro_text')
        .eq('path_slug', pathSlug)
        .single();
      
      // If intro_text exists AND we are skipping, move on
      // or if intro_text exists but other parts are missing, we might want to update?
      // For now, let's skip if something is there.
      if (existing?.intro_text) {
        process.stdout.write("."); // skip
        continue;
      }

      console.log(`\n🤖 STEP 1: Preparing Generation for [${condition}] x [${loc.city}]`);

      // 3. Multi-Module Generation
      const prompt = `
        Return a JSON object with fields: intro (80 words), medical (60 words), environment (60 words), faqs (Array of 3 objects), meta_title, meta_description.
        For patients with ${condition} in ${loc.city}, ${loc.state}.
        TONE: Empathetic, professional.
        FORMAT: Strictly JSON.
      `;

      try {
        console.log(`📡 STEP 2: Calling Gemini API... (This may take 10-20 seconds)`);
        const aiResponse = await generateContent(prompt);
        console.log(`📥 STEP 3: Received AI Response (${aiResponse.length} chars)`);
        
        // Clean up markdown if any
        const cleaned = aiResponse.replace(/```json|```/g, '').trim();
        console.log(`🧹 STEP 4: Cleaning JSON...`);
        const content = JSON.parse(cleaned);
        console.log(`🧠 STEP 5: Successfully Parsed JSON!`);

        // 4. Upsert to DB
        console.log(`💾 STEP 6: Upserting to Supabase [${pathSlug}]...`);
        const { error } = await supabaseAdmin.from('page_content').upsert({
          path_slug: pathSlug,
          condition: condition,
          city_slug: loc.slug,
          intro_text: content.intro,
          medical_context: content.medical,
          environmental_factors: content.environment,
          local_faq: content.faqs,
          meta_title: content.meta_title,
          meta_description: content.meta_description
        }, { onConflict: 'path_slug' });

        if (error) {
          console.error(`❌ STEP 7: DB Error:`, error.message);
        } else {
          console.log(`✅ STEP 8: Success! Content is Live.`);
          processedCount++;
          console.log(`📈 PROCESSED: ${processedCount} / ${limit}`);
        }

      } catch (err) {
        console.error(`❌ Generation pipeline failed:`, err);
      }

      // 5. THE BURN RATE (4.1s delay to respect 15 RPM)
      if (processedCount < limit) {
        console.log(`⏳ STEP 9: Pausing 4.1s for Rate Limit...`);
        await new Promise(r => setTimeout(r, 4100));
      }
    }
  }

  console.log(`\n🏁 HYDRA RUN COMPLETE. Total Processed: ${processedCount}`);
  process.exit(0);
}

hydra().catch(err => {
  console.error("💥 CRITICAL HYDRA FAILURE:", err);
  process.exit(1);
});
