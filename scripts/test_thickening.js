const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function thickenPage(condition, city, state) {
  console.log(`\n🚀 THICKENING: ${condition} in ${city}, ${state}...`);

  const prompt = `
    You are an expert medical SEO content strategist. 
    Generate a comprehensive, high-authority guide for clinical trials for ${condition} in ${city}, ${state}.
    
    TOTAL WORD COUNT TARGET: 2,000 words.
    STYLE: Professional, empathetic, medically authoritative (E-E-A-T).
    
    You MUST return the content as a RAW JSON object with the following keys:
    1. intro_text (200 words): Engaging intro about the local research landscape.
    2. medical_context (400 words): Deep dive into ${condition}, symptoms, and the importance of clinical research.
    3. environmental_factors (200 words): How the local climate, diet, or lifestyle in ${city} affects this condition.
    4. hospital_context (300 words): Detailed overview of major hospitals and research institutions in the ${city} area (e.g. Texas Medical Center for Houston).
    5. transit_logistics (200 words): Specific info on parking, public transit (bus/train lines), and accessibility in ${city} for research participants.
    6. demographic_health_data (200 words): Regional health statistics or trends relevant to ${condition} in this part of ${state}.
    7. safety_and_regulations (200 words): Explaining IRB oversight, FDA compliance, and patient rights.
    8. neighborhood_guides (200 words): Mentioning specific neighborhoods or suburbs of ${city} where research hubs are common.
    9. spanish_support_content (150 words): A summary in Spanish about the availability of bilingual staff and local resources.
    10. people_also_ask (Array of 5 objects): { "question": string, "answer": string } targeting common PAA long-tail queries.

    IMPORTANT: Do not use placeholders like [Hospital Name]. Research actual facts about ${city}.
    The JSON must be valid and ready for database insertion.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const content = JSON.parse(cleanJson);

    console.log(`✅ Content Generated (~${JSON.stringify(content).length / 5} words)`);

    const pathSlug = `${condition.toLowerCase().replace(/ /g, '-')}/${city.toLowerCase().replace(/ /g, '-')}-${state.toLowerCase()}`;
    
    const { error } = await supabase
      .from('page_content')
      .update({
        ...content,
        local_faq: content.people_also_ask 
      })
      .eq('path_slug', pathSlug);

    if (error) throw error;
    console.log(`✨ Database Updated for ${pathSlug}`);

  } catch (err) {
    console.error(`💥 Failed for ${condition}/${city}:`, err.message);
  }
}

async function runTest() {
  const tests = [
    { condition: "Diabetes", city: "Houston", state: "TX" },
    { condition: "Psoriasis", city: "Dallas", state: "TX" },
    { condition: "Migraine", city: "Austin", state: "TX" }
  ];

  for (const t of tests) {
    await thickenPage(t.condition, t.city, t.state);
    await new Promise(r => setTimeout(r, 2000));
  }
}

runTest();
