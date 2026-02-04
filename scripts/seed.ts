
import { supabaseAdmin } from '@/lib/supabase.admin';
import { generateContent } from '@/lib/gemini';

async function seed() {
  console.log("🌱 Starting Database Seed (Static Content Mode)...");

  // 1. Locations (Tier 1 Medical Hubs)
  const locations = [
    { slug: 'houston-tx', city: 'Houston', state: 'TX', zip_codes: ['77030', '77001'], population: 2300000 },
    { slug: 'boston-ma', city: 'Boston', state: 'MA', zip_codes: ['02115', '02118'], population: 675000 },
    { slug: 'philadelphia-pa', city: 'Philadelphia', state: 'PA', zip_codes: ['19104', '19107'], population: 1600000 },
    { slug: 'durham-nc', city: 'Durham', state: 'NC', zip_codes: ['27710', '27705'], population: 280000 },
    { slug: 'new-york-ny', city: 'New York', state: 'NY', zip_codes: ['10021', '10029'], population: 8800000 },
    { slug: 'los-angeles-ca', city: 'Los Angeles', state: 'CA', zip_codes: ['90095', '90033'], population: 3900000 },
    { slug: 'chicago-il', city: 'Chicago', state: 'IL', zip_codes: ['60611', '60637'], population: 2700000 },
    { slug: 'phoenix-az', city: 'Phoenix', state: 'AZ', zip_codes: ['85004', '85006'], population: 1600000 },
    { slug: 'miami-fl', city: 'Miami', state: 'FL', zip_codes: ['33136', '33125'], population: 440000 },
    { slug: 'austin-tx', city: 'Austin', state: 'TX', zip_codes: ['78701', '78712'], population: 970000 }
  ];

  await supabaseAdmin.from('locations').upsert(locations, { onConflict: 'slug' });
  console.log("✅ Locations Verified.");

  // 2. Studies
  const studies = [
    { nct_id: 'NCT04521098', title: 'Phase 3 Efficacy Study of IL-17 Inhibitor for Moderate Plaque Psoriasis', condition: 'Psoriasis', status: 'Recruiting', compensation: 'Up to $1,200', affiliate_link: 'https://maxbounty.com/test-link' },
    { nct_id: 'NCT03928172', title: 'Investigational Insulin Therapy for Type 2 Diabetes Management', condition: 'Diabetes', status: 'Recruiting', compensation: 'Up to $2,500', affiliate_link: 'https://maxbounty.com/test-link' },
    { nct_id: 'NCT05512034', title: 'Acute Migraine Treatment Efficiency in Adults', condition: 'Migraine', status: 'Recruiting', compensation: 'Up to $800', affiliate_link: 'https://maxbounty.com/test-link' },
    { nct_id: 'NCT04412987', title: 'Safety Study of New Biologic for Atopic Dermatitis (Eczema)', condition: 'Eczema', status: 'Recruiting', compensation: 'Up to $1,500', affiliate_link: 'https://maxbounty.com/test-link' },
    { nct_id: 'NCT02837190', title: 'Rheumatoid Arthritis Pain Management Trial', condition: 'Arthritis', status: 'Recruiting', compensation: 'Up to $1,000', affiliate_link: 'https://maxbounty.com/test-link' }
  ];

  await supabaseAdmin.from('studies').upsert(studies, { onConflict: 'nct_id' });
  console.log("✅ Studies Verified.");

  // 3. Generate Static Content (The Magic Step)
  console.log("\n🤖 Generating AI Content for 50 Pages (This may take a moment)...");

  for (const loc of locations) {
    for (const study of studies) {
      const path_slug = `${study.condition.toLowerCase()}/${loc.slug}`;
      const conditionUpper = study.condition; // e.g. "Psoriasis"
      
      // Check if exists first to save API costs
      const { data: existing } = await supabaseAdmin
        .from('page_content')
        .select('*')
        .eq('path_slug', path_slug)
        .single();
      
      if (existing) {
        process.stdout.write("."); // skip
        continue;
      }

      // Generate via Gemini
      const prompt = `
        Write a short, empathetic introduction (approx 80-100 words) for a clinical trial landing page.
        Target Audience: People suffering from ${conditionUpper} in ${loc.city}, ${loc.state}.
        Tone: Empathetic, professional, hopeful. NOT "AI-sounding".
        Focus on the specific struggle of finding treatment in ${loc.city}.
        Mention local context if possible (e.g. weather, lifestyle) but keep it subtle.
        Do not use words like: "testament", "landscape", "delve", "crucial role".
      `;

      const aiText = await generateContent(prompt);
      
      // Insert into DB
      const { error } = await supabaseAdmin.from('page_content').insert({
        path_slug: path_slug,
        condition: study.condition,
        city_slug: loc.slug,
        meta_title: `${conditionUpper} Clinical Trials in ${loc.city} | Paid Research Studies`,
        meta_description: `Find active ${conditionUpper} clinical trials in ${loc.city}, ${loc.state}. Earn compensation up to ${study.compensation}. Check eligibility now.`,
        intro_text: aiText || `Residents of ${loc.city} struggling with ${conditionUpper} may qualify for a new investigational treatment study.`
      });

      if (error) {
        console.error(`\n❌ Failed to save ${path_slug}:`, error.message);
      } else {
        process.stdout.write("✨"); // success
      }
      
      // Small delay to be nice to the API
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log("\n\n✅ Static Content Generation Complete!");
}

seed();
