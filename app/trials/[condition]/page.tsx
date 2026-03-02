import { supabase } from "@/lib/supabase.custom";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Activity, MapPin, ChevronRight, ShieldCheck } from "lucide-react";
import Script from "next/script";
import StudyCard from "@/components/StudyCard";
import { SITE_CONFIG } from "@/lib/constants";

export const runtime = "edge";

// Phase 13: Edge Cache Optimization (24 hours)
export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    condition: string;
  }>;
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { condition } = params;
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);

  return {
    title: `Clinical Trials for ${formattedCondition} | ${SITE_CONFIG.brandingSuffix}`,
    description: `Browse all available ${formattedCondition} clinical trials by city. Find new treatment options, expert medical care, and compensation near you. Part of ${SITE_CONFIG.brandingSuffix}.`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/trials/${condition}`,
    }
  };
}

export default async function ConditionHubPage(props: PageProps) {
  const params = await props.params;
  const { condition } = params;
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);

  // 1. Fetch cities that have trials for this condition
  const { data: cityData, error } = await supabase
    .from("studies")
    .select("location_city, location_state")
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting");

  if (error || !cityData) {
    return notFound();
  }

  // 2. Fetch Nationwide Studies (Showcase)
  const { data: nationwideStudies } = await supabase
    .from("studies")
    .select("*")
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting")
    .limit(6);

  // 3. Group and Count trials per city
  const cityCounts = cityData.reduce((acc: Record<string, { city: string, state: string, count: number }>, curr) => {
    if (!curr.location_city) return acc;
    const citySlug = curr.location_city.toLowerCase().replace(/ /g, "-");
    const key = `${citySlug}-${curr.location_state?.toLowerCase() || 'tx'}`;
    
    if (!acc[key]) {
      acc[key] = { 
        city: curr.location_city, 
        state: curr.location_state || "TX", 
        count: 0 
      };
    }
    acc[key].count++;
    return acc;
  }, {});

  const sortedCities = Object.values(cityCounts).sort((a, b) => b.count - a.count);

  // 4. Get unique states for State Hubs
  const uniqueStates = [...new Set(cityData.map(item => item.location_state || "TX"))].sort();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* Breadcrumb Schema */}
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
            }
          ]
        })}
      </Script>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* UI Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/trials" className="hover:text-blue-600 transition-colors">All Trials</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{formattedCondition} Trials</span>
            </nav>

            <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                    <Activity className="w-4 h-4" />
                    Active Research Directory
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                    {formattedCondition} Clinical Trials <br/>
                    <span className="text-blue-600">Browse by Location</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Connect with leading research facilities conducting {formattedCondition} studies. Select your city below to view local eligibility requirements, compensation details, and available treatments.
                </p>
            </div>
        </div>
      </section>

      {/* Quick Facts Section (Citation Fishing for Bing AI) */}
      <section className="relative -mt-8 mb-16 px-4">
        <div className="max-w-4xl mx-auto bg-blue-900 rounded-3xl shadow-xl overflow-hidden text-white flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-blue-800">
            <div className="flex-1 p-6 text-center">
                <div className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">Recruiting Areas</div>
                <div className="text-3xl font-black">{sortedCities.length}+</div>
                <div className="text-sm text-blue-200 mt-1">Major US Cities</div>
            </div>
            <div className="flex-1 p-6 text-center">
                <div className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">Compensation</div>
                <div className="text-3xl font-black">$50—$1,500</div>
                <div className="text-sm text-blue-200 mt-1">Per Study Completed</div>
            </div>
            <div className="flex-1 p-6 text-center">
                <div className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">Eligibility</div>
                <div className="text-3xl font-black">18+</div>
                <div className="text-sm text-blue-200 mt-1">Inclusive Age Range</div>
            </div>
        </div>
      </section>

      {/* State Hub Directory (Authority Swarm) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Browse {formattedCondition} Trials by State
          </h2>
          <div className="flex flex-wrap gap-3">
              {uniqueStates.map(state => (
                  <Link 
                      key={state} 
                      href={`/trials/${condition}/${state.toLowerCase()}`}
                      className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all font-bold text-gray-700"
                  >
                      {state}
                  </Link>
              ))}
          </div>
      </section>

      {/* City Directory */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            Research Centers in {formattedCondition} High-Opportunity Areas
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCities.map((item) => {
              const citySlug = `${item.city.toLowerCase().replace(/ /g, "-")}-${item.state.toLowerCase()}`;
              return (
                <Link 
                   key={citySlug}
                   href={`/trials/${condition}/${citySlug}`}
                   className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                            <MapPin className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                {item.city} {formattedCondition} Trials
                            </h3>
                            <p className="text-sm text-gray-500">
                                {item.state} • {item.count} Active {item.count === 1 ? 'Trial' : 'Trials'}
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
         </div>

         {/* NEW: Nationwide Studies Grid */}
         <div className="mt-24 pt-16 border-t border-gray-200">
            <div className="text-center mb-12">
               <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-2 block">
                  Nationwide Opportunities
               </span>
               <h2 className="text-3xl font-extrabold text-gray-900">
                  Featured {formattedCondition} Studies
               </h2>
               <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                  Can't find your city above? These active clinical trials are recruiting participants from across the United States.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nationwideStudies?.map((study) => (
                   <StudyCard 
                      key={study.nct_id}
                      nctId={study.nct_id}
                      title={study.title}
                      status={study.status}
                      condition={study.condition}
                      city={study.location_city}
                      state={study.location_state}
                      showLocation={true}
                   />
                ))}
            </div>
         </div>

         {/* Eligibility FAQ (For Bing AI Context) */}
         <div className="mt-24 pt-16 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{formattedCondition} Clinical Trial FAQ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h3 className="font-bold text-gray-900 mb-2">What is the cost of participation?</h3>
                   <p className="text-gray-600 text-sm">There is absolutely no cost to participate in {formattedCondition} clinical trials. Study-related medical exams, treatments, and medications are provided at no cost, and participants often receive compensation for their time.</p>
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 mb-2">Are these studies safe?</h3>
                   <p className="text-gray-600 text-sm">Every clinical trial on {SITE_CONFIG.siteName} is strictly overseen by Institutional Review Boards (IRB) and follows FDA-compliant safety protocols to protect patient health throughout the study.</p>
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 mb-2">Do I need a referral from my doctor?</h3>
                   <p className="text-gray-600 text-sm">No referral is typically required. You can check your eligibility directly through our screening tools and connect with local research sites in your area.</p>
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 mb-2">Will I receive compensation?</h3>
                   <p className="text-gray-600 text-sm">Most {formattedCondition} trials offer financial compensation ranging from $500 to $1,500 depending on the length and complexity of the study phase.</p>
                </div>
            </div>
         </div>

         {/* Related Conditions Swarm (Task 8.4) */}
         <div className="mt-24 pt-16 border-t border-gray-100 mb-20">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Explore Related Research</h4>
            <div className="flex flex-wrap gap-4">
                {['Psoriasis', 'Diabetes', 'Migraine', 'Eczema', 'Arthritis'].filter(c => c.toLowerCase() !== condition).map(cond => (
                    <Link key={cond} href={`/trials/${cond.toLowerCase()}`} className="bg-white border border-gray-200 px-6 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
                        {cond} Trials
                    </Link>
                ))}
            </div>
         </div>

         {/* Trust Footer */}
         <div className="mt-20 flex flex-col items-center">
            <div className="flex items-center gap-12 opacity-40 grayscale filter hover:grayscale-0 transition-all">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> NIH DATA VERIFIED
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">IRB STANDARDS</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">HIPAA COMPLIANT</div>
            </div>
         </div>
      </section>

    </main>
  );
}
