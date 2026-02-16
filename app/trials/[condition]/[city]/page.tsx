
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase.custom";
import { generateContent } from "@/lib/gemini";
import TrustBar from "@/components/TrustBar";
import EligibilityCard from "@/components/EligibilityCard";
import { ShieldCheck, MapPin, Activity, ChevronRight } from "lucide-react";
import Link from "next/link"; // Import Link
import TrialConversionFlow from "@/components/TrialConversionFlow";
import Script from "next/script";
import QuizTrigger from "@/components/QuizTrigger";
import MedicalByline from "@/components/MedicalByline";

import { SITE_CONFIG } from "@/lib/constants";

// Elite SEO: Dynamic Metadata Generation
export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { condition, city } = params;
  
  // 1. Fetch Location Data
  const { data: locationData } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", city)
    .single();

  // 2. Fetch Helper Data to Determine Page Quality (Index vs NoIndex)
  const { data: pageContent } = await supabase
    .from("page_content")
    .select("id")
    .eq("path_slug", `${condition}/${city}`)
    .single();

  const { count: localStudyCount } = await supabase
    .from("studies")
    .select("nct_id", { count: 'exact', head: true })
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting")
    .ilike("location_city", city.replace(/-/g, ' '));
  
  // Quality Gate: Only index if we have AI content OR actual local studies
  const shouldIndex = !!pageContent || (localStudyCount || 0) > 0;

  const formattedCity = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);

  return {
    title: `${formattedCondition} Clinical Trials in ${formattedCity} | ${SITE_CONFIG.brandingSuffix}`,
    description: `Find recruiting ${formattedCondition} clinical trials in ${formattedCity}. Access new treatment options at no cost + compensation up to $1,500 via ${SITE_CONFIG.brandingSuffix}.`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/trials/${condition}/${city}`,
    },
    robots: {
      index: shouldIndex,
      follow: true, // Always follow links to find other good pages
    }
  };
}

// This function tells Next.js which pages to build at build time (SSG)
// For now, we return an empty array or a few examples to keep builds fast.
// In production, we would fetch all cities here.
export async function generateStaticParams() {
  return []; 
}

// Set revalidation time (ISR) - regenerate page every 24 hours
export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    condition: string;
    city: string;
  }>;
}

export default async function TrialPage(props: PageProps) {
  const params = await props.params;
  const { condition, city } = params;
  
  // formatting
  const formattedCity = city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);
  const pathSlug = `${condition}/${city}`;

  // 1. Fetch Location Data
  const { data: locationData } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", city)
    .single();

  // 2. Fetch Study Data (Multi-Tier Strategy for Max Relevance)
  // Tier 1: Local City Match
  const { data: localStudies } = await supabase
    .from("studies")
    .select("*")
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting")
    .ilike("location_city", formattedCity)
    .limit(3);

  let finalStudies = localStudies || [];

  // Tier 2: State Match (if city didn't fill the 3 slots)
  if (finalStudies.length < 3) {
    const { data: stateStudies } = await supabase
      .from("studies")
      .select("*")
      .ilike("condition", `%${condition}%`)
      .ilike("status", "recruiting")
      .ilike("location_state", `%${locationData?.state || ""}%`)
      .neq("location_city", formattedCity) // Don't repeat Tier 1
      .limit(3 - finalStudies.length);
    
    if (stateStudies) finalStudies = [...finalStudies, ...stateStudies];
  }

  // Tier 3: National Fallback (if still < 3)
  if (finalStudies.length < 3) {
    const { data: fallbackStudies } = await supabase
      .from("studies")
      .select("*")
      .ilike("condition", `%${condition}%`)
      .ilike("status", "recruiting")
      .not("nct_id", "in", `(${finalStudies.map(s => s.nct_id).join(",") || "0"})`)
      .limit(3 - finalStudies.length);
    
    if (fallbackStudies) finalStudies = [...finalStudies, ...fallbackStudies];
  }

  const studies = finalStudies;
  
  // 3. Fetch PRE-GENERATED Content (Static Strategy)
  const { data: pageContent } = await supabase
    .from("page_content")
    .select("*")
    .eq("path_slug", pathSlug)
    .single();

  // 4. Fetch Nearby Locations (for SEO linking)
  const { data: nearbyLocations } = await supabase
    .from("locations")
    .select("city, slug")
    .eq("state", locationData?.state || "TX")
    .neq("slug", city)
    .limit(5);

  // Determine Payout (Generic fallback if no DB data yet)
  const firstStudy = studies[0];
  const payout = firstStudy?.compensation || "Up to $1,200";
  
  // Use DB content or fallback if missing (e.g. during dev)
  const introText = pageContent?.intro_text || `Residents of ${formattedCity}, ${locationData?.state || 'the local area'} struggling with ${formattedCondition} may qualify for a new investigational treatment study being conducted by leading ${formattedCity} facilities.`;

  // Spintax / Dynamic Variation Engine for Medical Insight
  const insightPatterns = [
    `Clinical research for ${formattedCondition} in ${formattedCity} is supported by major ${locationData?.state || ''} medical networks and research universities, ensuring state-of-the-art care and oversight for all participants in ${formattedCity}.`,
    `The ${formattedCondition} research landscape in ${formattedCity} features cutting-edge initiatives from top-tier institutional providers, offering local ${formattedCity} residents access to advanced therapeutic options.`,
    `Facilities across ${formattedCity}, ${locationData?.state || ''} are currently advancing ${formattedCondition} treatment through rigorous clinical evaluation protocols, maintaining the highest standards of medical oversight.`
  ];
  // Simple deterministic picker based on city name length to ensure consistency but uniqueness across cities
  const insightFallback = insightPatterns[formattedCity.length % insightPatterns.length];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* Medical Schema (Elite SEO) */}
      <Script id="medical-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalStudy",
          "name": `${formattedCondition} Clinical Research in ${formattedCity}`,
          "description": `Clinical trials for ${formattedCondition} in ${formattedCity}, ${locationData?.state || 'US'}.`,
          "status": "Recruiting",
          "location": {
            "@type": "City",
            "name": formattedCity
          },
          "sponsor": {
            "@type": "Organization",
            "name": "ConditionHealthy Research Network"
          }
        })}
      </Script>

      {/* Breadcrumb Schema (On-Page SEO) */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": SITE_CONFIG.baseUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "All Trials",
              "item": `${SITE_CONFIG.baseUrl}/trials`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": formattedCondition,
              "item": `${SITE_CONFIG.baseUrl}/trials/${condition}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": formattedCity,
              "item": `${SITE_CONFIG.baseUrl}/trials/${condition}/${city}`
            }
          ]
        })}
      </Script>

      {/* FAQ Schema for Rich Snippets */}
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": (pageContent?.local_faq as any[] || [
            { q: "Is travel compensation available?", a: "Yes, many trials in the area provide stipends for travel expenses." },
            { q: "Do I need insurance?", a: "No, all study-related care and medication are provided at no cost." },
            { q: "Can I keep my current doctor?", a: "Absolutely. Study participation is a supplemental care option." }
          ]).map(faq => ({
            "@type": "Question",
            "name": faq.q || faq.question || faq.Question || "Frequently Asked Question",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a || faq.answer || faq.Answer || "Please contact us for more details."
            }
          }))
        })}
      </Script>

      {/* 1. Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-8 pb-12 md:pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* UI Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <Link href="/trials" className="hover:text-blue-600 transition-colors">All Trials</Link>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <Link href={`/trials/${condition}`} className="hover:text-blue-600 transition-colors">{formattedCondition} Trials</Link>
              <ChevronRight className="w-4 h-4 text-gray-300" aria-hidden="true" />
              <span className="text-gray-900 font-medium">{formattedCity}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Recruiting Now in {formattedCity}
                <span className="ml-2 text-[10px] text-blue-400 uppercase tracking-tighter hidden sm:inline">• Last Verified: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                New {formattedCondition} Clinical Trials in <span className="text-blue-700">{formattedCity}</span>
              </h1>
              
              <div className="mb-8">
                 <MedicalByline />
              </div>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                {introText}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-green-600" aria-hidden="true" />
                   <span>No Insurance Needed</span>
                </div>
                <div className="flex items-center gap-2">
                   <Activity className="w-5 h-5 text-green-600" aria-hidden="true" />
                   <span>Identify New Options</span>
                </div>
              </div>
            </div>

            {/* Right Col: The Eligibility Card (Sticky) */}
            <div className="flex justify-center lg:justify-end">
               <div className="w-full max-w-md">
                   {/* Conversion Flow (Client Component) */ }
                   <TrialConversionFlow 
                      condition={formattedCondition}
                      city={formattedCity}
                      payout={payout}
                   />
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. "Medical Grade" Info Section */}
      <section className="py-10 md:py-20 max-w-4xl mx-auto px-4">
             {/* Main Content Sections */}
             <div className="mt-8 md:mt-16 grid lg:grid-cols-3 gap-12">
               
               {/* Column 1 & 2: Main Details */}
               <div className="lg:col-span-2 space-y-12">
                 
                 {/* Local Medical Insight */}
                 <section>
                   <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                     <ShieldCheck className="w-6 h-6 text-blue-600" />
                     Local Medical Insight
                   </h2>
                   <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm leading-relaxed text-gray-700">
                     {pageContent?.medical_context || insightFallback}
                   </div>
                 </section>

                 <div className="grid md:grid-cols-2 gap-8">
                    {/* Location Info */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <MapPin className="w-5 h-5" />
                        <h3 className="font-bold">Location</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        The research center is conveniently located in <span className="font-semibold text-gray-900">{formattedCity}</span>. Validation parking is provided for all visits. (Specific address revealed upon qualification).
                      </p>
                    </div>

                    {/* Qualification Info */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <Activity className="w-5 h-5" />
                        <h3 className="font-bold">Qualification</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          Age 18 - 65
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          Diagnosed with {formattedCondition}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          Trying to find better management options
                        </li>
                      </ul>
                    </div>
                 </div>

                 {/* Available Studies Section */}
                 <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-blue-600" />
                      Available Trials in {formattedCity}
                    </h2>
                    <div className="space-y-4">
                      {studies.length > 0 ? studies.map((study) => (
                        <div key={study.nct_id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-blue-200 transition-all group">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                {study.nct_id}
                                <a 
                                  href={`https://clinicaltrials.gov/study/${study.nct_id}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-gray-400 hover:text-blue-500 underline lowercase"
                                >
                                  (Verify on ClinicalTrials.gov)
                                </a>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {study.title}
                              </h3>
                              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                  <Activity className="w-4 h-4 text-green-500" />
                                  {study.status}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span>{formattedCondition}</span>
                              </div>
                            </div>
                            <QuizTrigger className="hidden sm:block whitespace-nowrap bg-gray-50 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                              Check Eligibility
                            </QuizTrigger>
                          </div>
                        </div>
                      )) : (
                        <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                          <p className="text-gray-500 font-medium">Currently evaluating new studies for {formattedCondition} in this area.</p>
                        </div>
                      )}
                    </div>
                  </section>

                 {/* Environmental Context */}
                 <section className="bg-blue-50 rounded-3xl p-8 border border-blue-100">
                    <h2 className="text-xl font-bold text-blue-900 mb-4">Environmental Factors in {formattedCity}</h2>
                    <p className="text-blue-800/80 leading-relaxed italic">
                      {pageContent?.environmental_factors || `Living in ${formattedCity} presents unique lifestyle factors that can influence the management of ${formattedCondition}. Local weather patterns and urban stressors are important considerations for ongoing clinical research.`}
                    </p>
                 </section>

               </div>

               {/* Column 3: Local FAQ */}
               <div className="space-y-8">
                 <h2 className="text-xl font-bold text-gray-900">Patient FAQ: {formattedCity}</h2>
                 <div className="space-y-4">
                   {(pageContent?.local_faq as { q: string; a: string }[] || [
                     { q: "Is travel compensation available?", a: "Yes, many trials in the area provide stipends for travel expenses." },
                     { q: "Do I need insurance?", a: "No, all study-related care and medication are provided at no cost." },
                     { q: "Can I keep my current doctor?", a: "Absolutely. Study participation is a supplemental care option." }
                   ]).map((faq, i) => (
                     <div key={i} className="group">
                        <div className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors mb-1">
                          {faq.q}
                        </div>
                        <div className="text-gray-500 text-sm leading-relaxed">
                          {faq.a}
                        </div>
                     </div>
                   ))}
                 </div>

                  {/* Internal Links for Indexing */}
                  <div className="pt-8 border-t border-gray-100">
                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Browse by Condition</h4>
                     <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
                        {['Psoriasis', 'Diabetes', 'Migraine', 'Eczema', 'Arthritis'].map(cond => (
                          <Link key={cond} href={`/trials/${cond.toLowerCase()}/${city}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            {cond} in {formattedCity}
                          </Link>
                        ))}
                     </div>

                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Nearby Locations</h4>
                     <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {nearbyLocations?.map(loc => (
                          <Link key={loc.slug} href={`/trials/${condition}/${loc.slug}`} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                            {loc.city} {formattedCondition}
                          </Link>
                        ))}
                     </div>
                  </div>
               </div>

             </div>

      </section>
    </main>
  );
}
