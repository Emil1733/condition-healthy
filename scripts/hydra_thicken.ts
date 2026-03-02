import { supabaseAdmin } from '../lib/supabase.admin';
import { generateContent } from '../lib/gemini';
import pc from 'picocolors';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('limit', {
    alias: 'l',
    type: 'number',
    description: 'Number of pages to thicken',
    default: 5,
  })
  .option('delay', {
    alias: 'd',
    type: 'number',
    description: 'Delay between API calls in ms',
    default: 2500, // Gemini rate limit safety
  })
  .parseSync();

const LIMIT = argv.limit as number;
const DELAY_MS = argv.delay as number;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function formatSlugToName(slug: string): string {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function thickenPages() {
  console.log(pc.cyan(`\n🚀 STARTING HYDRA THICKEN (Limit: ${LIMIT})\n`));

  // 1. Fetch pages that lack the new high-density data
  const { data: pages, error: fetchError } = await supabaseAdmin
    .from('page_content')
    .select('id, path_slug, condition, city_slug')
    .is('local_facilities', null) // Target un-thickened pages
    .limit(LIMIT);

  if (fetchError) {
    console.error(pc.red(`❌ Database error fetching pages: ${fetchError.message}`));
    process.exit(1);
  }

  if (!pages || pages.length === 0) {
    console.log(pc.green('🏁 All pages are fully thickened!'));
    process.exit(0);
  }

  console.log(pc.yellow(`Found ${pages.length} pages needing density injection. Beginning synthesis...\n`));

  let successCount = 0;
  let failCount = 0;

  for (const page of pages) {
    const formattedCity = formatSlugToName(page.city_slug);
    const formattedCondition = formatSlugToName(page.condition);
    
    // Only target City pages (skip State Hubs for now)
    if (page.city_slug.length <= 2) {
       console.log(pc.gray(`⏭️  Skipping State Hub: [${page.path_slug}]`));
       continue;
    }

    console.log(pc.blue(`\n💉 INJECTING DENSITY: [${formattedCondition}] in [${formattedCity}]`));

    const prompt = `
      You are a clinical data researcher building an SEO-optimized directory for clinical trials in ${formattedCity}.
      Your task is to provide hyper-local, specific logistical and demographic data for patients seeking ${formattedCondition} research studies.

      Generate a JSON object with the following schema:
      {
        "local_facilities": [
          {
            "name": "Name of a major hospital, research clinic, or university medical center in ${formattedCity} (or nearest major metro) known for ${formattedCondition} or general clinical research",
            "type": "e.g., University Hospital, Private Clinic, Research Network"
          },
          // Provide exactly 3 facilities
        ],
        "transit_info": "A 2-3 sentence paragraph detailing how patients can travel to medical centers in ${formattedCity}. Mention specific local highways, public transit systems (like buses or trains), or parking realities. Be hyper-specific to the local geography.",
        "demographic_context": "A 2-3 sentence clinical paragraph explaining why ${formattedCondition} research or general health research is relevant in the ${formattedCity} area. Mentioning local climate factors, lifestyle, or general population health trends is acceptable. Keep it strictly clinical and objective."
      }

      Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
    `;

    try {
      const gptResponse = await generateContent(prompt);
      
      // Attempt to clean markdown block wrappers if present
      let cleanResponse = gptResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
         console.error(pc.red(`Raw Response was: ${gptResponse}`));
         throw new Error("Invalid format returned from Gemini. Could not extract JSON.");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        console.error(pc.red(`Failed to parse: ${jsonMatch[0]}`));
        throw new Error("Invalid JSON syntax returned from Gemini.");
      }

      // 3. Save back to Supabase
      const { error: updateError } = await supabaseAdmin
        .from('page_content')
        .update({
          local_facilities: parsedData.local_facilities,
          transit_info: parsedData.transit_info,
          demographic_context: parsedData.demographic_context
        })
        .eq('id', page.id);

      if (updateError) throw updateError;

      console.log(pc.green(`✅ Success! Thickened [${page.path_slug}]`));
      successCount++;

    } catch (error: any) {
      console.error(pc.red(`❌ Failed [${page.path_slug}]: ${error.message}`));
      failCount++;
    }

    // Rate Limiting
    await sleep(DELAY_MS);
  }

  console.log(pc.cyan(`\n🏁 THICKEN BATCH COMPLETE.`));
  console.log(`Success: ${pc.green(successCount.toString())}`);
  console.log(`Failed: ${pc.red(failCount.toString())}`);
}

thickenPages();
