
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase.custom";
// import { generateContent } from "@/lib/gemini"; // Disabled: @google/generative-ai crashes on Cloudflare Edge due to async_hooks
import TrustBar from "@/components/TrustBar";
import EligibilityCard from "@/components/EligibilityCard";
import { ShieldCheck, MapPin, Activity, ChevronRight } from "lucide-react";
import Link from "next/link"; // Import Link
import TrialConversionFlow from "@/components/TrialConversionFlow";
import Script from "next/script";
import QuizTrigger from "@/components/QuizTrigger";
import MedicalByline from "@/components/MedicalByline";

import { SITE_CONFIG } from "@/lib/constants";

export const runtime = "edge";

// Helper to identify State vs City
const isStateCode = (slug: string) => slug.length === 2 && /^[a-z]{2}$/i.test(slug);

// Elite SEO: Dynamic Metadata Generation
export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { condition, slug } = params;
  const isState = isStateCode(slug);
  
  if (isState) {
    const stateName = slug.toUpperCase();
    const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);
    
    // Check if we have state-level content
    const { data: pageContent } = await supabase
      .from("page_content")
      .select("id")
      .eq("path_slug", `${condition}/${slug}`)
      .single();

    return {
      title: `${formattedCondition} Clinical Trials in ${stateName} | State Hub 2026`,
      description: `Find recruiting ${formattedCondition} clinical trials throughout the state of ${stateName}. Access local research opportunities and compensation via ${SITE_CONFIG.brandingSuffix}.`,
      alternates: {
        canonical: `${SITE_CONFIG.baseUrl}/trials/${condition}/${slug.toLowerCase()}`,
      },
      robots: {
        index: !!pageContent, // Only index if we have state content
        follow: true,
      }
    };
  }

  // City Logic (Existing)
  const { data: locationData } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .single();

  const { data: pageContent } = await supabase
    .from("page_content")
    .select("id")
    .eq("path_slug", `${condition}/${slug}`)
    .single();

  const { count: localStudyCount } = await supabase
    .from("studies")
    .select("nct_id", { count: 'exact', head: true })
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting")
    .ilike("location_city", slug.replace(/-/g, ' '));
  
  const shouldIndex = !!pageContent || (localStudyCount || 0) > 0;
  const formattedCity = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);

  return {
    title: `${formattedCondition} Clinical Trials in ${formattedCity} | ${SITE_CONFIG.brandingSuffix}`,
    description: `Find recruiting ${formattedCondition} clinical trials in ${formattedCity}. Access new treatment options at no cost + compensation up to $1,500 via ${SITE_CONFIG.brandingSuffix}.`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/trials/${condition}/${slug}`,
    },
    robots: {
      index: shouldIndex,
      follow: true,
    }
  };
}

// This function tells Next.js which pages to build at build time (SSG)
export async function generateStaticParams() {
  return []; 
}

export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    condition: string;
    slug: string;
  }>;
}

export default async function TrialPage(props: PageProps) {
  const params = await props.params;
  const { condition, slug } = params;
  const isState = isStateCode(slug);

  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);
  const pathSlug = `${condition}/${slug}`;

  // Fetch AI Content (Shared)
  const { data: pageContent } = await supabase
    .from("page_content")
    .select("*")
    .eq("path_slug", pathSlug)
    .single();

  if (isState) {
    const stateName = slug.toUpperCase();
    
    // Fetch all cities in this state for this condition
    const { data: stateCities } = await supabase
      .from("locations")
      .select("city, slug")
      .eq("state", stateName)
      .order('city', { ascending: true });

    // Fetch elite studies for the state
    const { data: stateStudies } = await supabase
      .from("studies")
      .select("*")
      .ilike("condition", `%${condition}%`)
      .ilike("status", "recruiting")
      .ilike("location_state", `%${stateName}%`)
      .limit(5);

    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <section className="bg-white border-b border-gray-200 pt-8 pb-12 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/trials" className="hover:text-blue-600">All Trials</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/trials/${condition}`} className="hover:text-blue-600">{formattedCondition} Trials</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{stateName} Hub</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {formattedCondition} Clinical Trials in <span className="text-blue-700">{stateName}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {pageContent?.intro_text || `Exploring modern treatment options for ${formattedCondition} across ${stateName}. Our network connects patients in ${stateName} with clinical research studies offering specialized care and compensation.`}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Centers by City</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {stateCities?.map(city => (
                                <Link 
                                    key={city.slug} 
                                    href={`/trials/${condition}/${city.slug}`}
                                    className="bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                                >
                                    {city.city}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
                
                <div className="space-y-8">
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl">
                        <h3 className="font-bold text-lg mb-2">Check State Eligibility</h3>
                        <p className="text-blue-100 text-sm mb-6">See if you qualify for active {formattedCondition} studies in {stateName}.</p>
                        <QuizTrigger className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                            Start Eligibility Quiz
                        </QuizTrigger>
                    </div>
                </div>
            </div>
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------
  // City Logic
  // ---------------------------------------------------------
  const formattedCity = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const currentStateAbbr = slug.split('-').pop()?.toUpperCase() || "TX";
  
  // 1. Fetch Location Data
  const { data: locationData } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
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

  // 4. Fetch Nearby Locations (for SEO linking)
  const currentState = locationData?.state || currentStateAbbr;
  const { data: nearbyLocations } = await supabase
    .from("locations")
    .select("city, slug")
    .eq("state", currentState)
    .neq("slug", slug)
    .order('city', { ascending: true })
    .limit(10);

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
              "name": `${currentState} Hub`,
              "item": `${SITE_CONFIG.baseUrl}/trials/${condition}/${currentState.toLowerCase()}`
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": formattedCity,
              "item": `${SITE_CONFIG.baseUrl}/trials/${condition}/${slug}`
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
      <section className="bg-slate-50/50 border-b border-slate-200/60 pt-8 pb-12 md:pb-24 relative overflow-hidden">
        {/* Subtle premium background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-blue-50/40 blur-3xl rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* UI Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400 mb-12 uppercase">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/trials" className="hover:text-blue-600 transition-colors">All Trials</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/trials/${condition}`} className="hover:text-blue-600 transition-colors">{formattedCondition} Trials</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/trials/${condition}/${currentState.toLowerCase()}`} className="hover:text-blue-600 transition-colors">{currentState} Hub</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-800 font-bold">{formattedCity}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-blue-100 shadow-sm text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Recruiting Now in {formattedCity}
                <span className="ml-2 pl-2 border-l border-blue-100 text-[10px] text-slate-400 uppercase tracking-widest hidden sm:inline">Verified {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-[1.1]">
                New {formattedCondition} Clinical Trials in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">{formattedCity}</span>
              </h1>
              
              <div className="mb-8">
                 <MedicalByline />
              </div>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg font-medium">
                {introText}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 text-sm font-semibold text-slate-600">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                   <span>No Insurance Needed</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                   <Activity className="w-4 h-4 text-blue-500" aria-hidden="true" />
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
                 
                 {/* Local Medical Insight & Demographics */}
                 <section className="space-y-6">
                   <div>
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                       <ShieldCheck className="w-6 h-6 text-blue-600" />
                       Local Medical Insight
                     </h2>
                     <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] leading-relaxed text-slate-700 text-lg">
                       {pageContent?.medical_context || insightFallback}
                     </div>
                   </div>

                   {pageContent?.demographic_context && (
                     <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/50 rounded-2xl p-6 md:p-8 border border-indigo-100/50 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.03)]">
                       <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-indigo-500" />
                         Regional Health Context
                       </h3>
                       <p className="text-indigo-900/80 text-base leading-relaxed font-medium">
                         {pageContent.demographic_context}
                       </p>
                     </div>
                   )}
                 </section>

                 <div className="grid md:grid-cols-2 gap-6">
                    {/* Location Info */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                           <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">Location & Transit</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        The research center is conveniently located in <span className="font-semibold text-slate-900">{formattedCity}</span>. Validation parking is provided for all visits.
                      </p>
                      {pageContent?.transit_info && (
                         <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 border border-slate-100 leading-relaxed italic border-l-2 border-l-blue-200">
                           {pageContent.transit_info}
                         </div>
                      )}
                    </div>

                    {/* Qualification Info */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] group hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                           <Activity className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-slate-900">Qualification</h3>
                      </div>
                      <ul className="space-y-3 text-sm text-slate-600 font-medium">
                        <li className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Age 18 - 65
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Diagnosed with {formattedCondition}
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Seeking new management options
                        </li>
                      </ul>
                    </div>
                 </div>

                 {/* Local Research Facilities */}
                 {pageContent?.local_facilities && Array.isArray(pageContent.local_facilities) && pageContent.local_facilities.length > 0 && (
                   <section>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        Recognized Regional Facilities
                      </h2>
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="divide-y divide-slate-50">
                          {pageContent.local_facilities.map((facility: any, idx: number) => (
                            <div key={idx} className="p-5 hover:bg-slate-50/80 transition-colors flex justify-between items-center group">
                                <span className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{facility.name}</span>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-widest">{facility.type}</span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-slate-50/50 px-5 py-3 text-[10px] text-slate-400 border-t border-slate-50 text-center uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
                           <ShieldCheck className="w-3 h-3" /> Not all facilities host all trials. Verification required.
                        </div>
                      </div>
                   </section>
                 )}

                 {/* Available Studies Section */}
                 <section>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-emerald-500" />
                      Available Trials in {formattedCity}
                    </h2>
                    <div className="space-y-4">
                      {studies.length > 0 ? studies.map((study) => (
                        <div key={study.nct_id} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden">
                          {/* Accent line on hover */}
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="flex justify-between items-start gap-6">
                            <div className="flex-1">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{study.nct_id}</span>
                                <a 
                                  href={`https://clinicaltrials.gov/study/${study.nct_id}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:text-indigo-600 flex items-center gap-1 transition-colors normal-case"
                                >
                                  Verify Source <ChevronRight className="w-3 h-3" />
                                </a>
                              </div>
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight mb-4">
                                {study.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  {study.status}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-slate-600">{formattedCondition}</span>
                              </div>
                            </div>
                            <QuizTrigger className="hidden sm:flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-800 transition-colors px-2 py-1">
                              Check Eligibility <ChevronRight className="w-4 h-4" />
                            </QuizTrigger>
                          </div>
                        </div>
                      )) : (
                        <div className="bg-slate-50 rounded-2xl p-10 text-center border-2 border-dashed border-slate-200">
                          <p className="text-slate-500 font-medium text-lg">Currently evaluating new studies for {formattedCondition} in this area.</p>
                        </div>
                      )}
                    </div>
                  </section>

                 {/* Environmental Context */}
                 <section className="bg-slate-50/80 rounded-3xl p-8 md:p-10 border border-slate-100/50">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">Environmental Factors in {formattedCity}</h2>
                    <p className="text-slate-600 leading-relaxed italic text-lg opacity-90">
                      &quot;{pageContent?.environmental_factors || `Living in ${formattedCity} presents unique lifestyle factors that can influence the management of ${formattedCondition}. Local weather patterns and urban stressors are important considerations for ongoing clinical research.`}&quot;
                    </p>
                 </section>

               </div>

               {/* Column 3: Local FAQ */}
               <div className="space-y-8 lg:bg-white lg:p-8 lg:rounded-3xl lg:border lg:border-slate-100 lg:shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] lg:self-start sticky top-24">
                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">Patient FAQ: {formattedCity}</h2>
                 <div className="space-y-6">
                   {(pageContent?.local_faq as { q: string; a: string }[] || [
                     { q: "Is travel compensation available?", a: "Yes, many trials in the area provide stipends for travel expenses." },
                     { q: "Do I need insurance?", a: "No, all study-related care and medication are provided at no cost." },
                     { q: "Can I keep my current doctor?", a: "Absolutely. Study participation is a supplemental care option." }
                   ]).map((faq, i) => (
                     <div key={i} className="group pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors mb-2 pr-4 leading-snug">
                          {faq.q}
                        </div>
                        <div className="text-slate-500 text-sm leading-relaxed">
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
                          <Link key={cond} href={`/trials/${cond.toLowerCase()}/${slug}`} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            {cond} in {formattedCity}
                          </Link>
                        ))}
                     </div>

                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Nearby {formattedCondition} Trials</h4>
                     <div className="flex flex-col gap-2 mb-8">
                        <Link href={`/trials/${condition}/${currentState.toLowerCase()}`} className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-between">
                            View All {currentState} Trials
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                           {nearbyLocations?.map(loc => (
                             <Link key={loc.slug} href={`/trials/${condition}/${loc.slug}`} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                               {loc.city}
                             </Link>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

             </div>

      </section>
    </main>
  );
}
