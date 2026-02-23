
import { supabaseAdmin } from '../lib/supabase.admin';
import { generateContent } from '../lib/gemini';

async function hydraState() {
  console.log("🐲 HYDRA STATE ENGINE: STARTING COLD SWEEP...");

  // 1. Get States and Conditions
  const { data: locations } = await supabaseAdmin.from('locations').select('state');
  const { data: studies } = await supabaseAdmin.from('studies').select('condition');
  
  if (!locations || !studies) {
    console.error("❌ Failed to fetch base data.");
    return;
  }

  const states = [...new Set(locations.map(l => l.state))].sort();
  const conditions = [...new Set(studies.map(s => s.condition))];
  
  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

  let processedCount = 0;

  console.log(`📊 Found ${states.length} states and ${conditions.length} conditions.`);
  console.log(`🎯 Target: ${states.length * conditions.length} state-condition hubs.`);

  // 2. Iterate
  for (const state of states) {
    if (processedCount >= limit) break;
    for (const condition of conditions) {
      if (processedCount >= limit) break;

      const pathSlug = `${condition.toLowerCase()}/${state.toLowerCase()}`;

      // Check if exists
      const { data: existing } = await supabaseAdmin
        .from('page_content')
        .select('id, intro_text')
        .eq('path_slug', pathSlug)
        .single();
      
      if (existing?.intro_text) {
        process.stdout.write(".");
        continue;
      }

      console.log(`\n🏛️  GENERATING: [${condition}] in [${state}]`);

      const prompt = `
        Return a JSON object for patients with ${condition} in the state of ${state}.
        FIELDS: 
        - intro: (70-90 words) Professional, clinical summary of the research landscape across the entire state of ${state}. Mention healthcare access or regional clusters.
        - medical: (50-60 words) Specific medical challenges or prevalence of ${condition} in this region.
        - environment: (50-60 words) How ${state}'s regional geography/climate impacts the ${condition} patient population.
        - faqs: (Array of 3 objects with "q" and "a") Focused on state-wide logistics, travel stipends, and legal rights for participants.
        - meta_title: (Under 60 chars) SEO-optimized state hub title.
        - meta_description: (Under 155 chars) Information-dense state summary.

        CRITICAL STYLE GUIDE:
        - NO fluff like "embarking on a journey," "unlocking potential," "a beacon of hope."
        - NO repetitive adjectives like "cutting-edge," "state-of-the-art," "revolutionary."
        - USE: Medically objective and clinical language.
        - FORMAT: Strictly JSON.
      `;

      try {
        const aiResponse = await generateContent(prompt);
        const cleaned = aiResponse.replace(/```json|```/g, '').trim();
        const content = JSON.parse(cleaned);

        const { error } = await supabaseAdmin.from('page_content').upsert({
          path_slug: pathSlug,
          condition: condition,
          city_slug: state.toLowerCase(), // Store state code here for hubs
          intro_text: content.intro,
          medical_context: content.medical,
          environmental_factors: content.environment,
          local_faq: content.faqs,
          meta_title: content.meta_title,
          meta_description: content.meta_description
        }, { onConflict: 'path_slug' });

        if (error) {
          console.error(`❌ DB Error:`, error.message);
        } else {
          console.log(`✅ Success! [${pathSlug}] is Live.`);
          processedCount++;
        }

        // Rate limit: 4.1s
        await new Promise(r => setTimeout(r, 4100));

      } catch (err) {
        console.error(`❌ Pipeline failed for ${pathSlug}:`, err);
      }
    }
  }

  console.log(`\n🏁 HUB GENERATION COMPLETE. Total: ${processedCount}`);
  process.exit(0);
}

hydraState();
