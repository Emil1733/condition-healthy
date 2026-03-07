
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase.custom";
import TrustBar from "@/components/TrustBar";
import EligibilityCard from "@/components/EligibilityCard";
import { ShieldCheck, MapPin, Activity, ChevronRight } from "lucide-react";
import Link from "next/link"; 
import TrialConversionFlow from "@/components/TrialConversionFlow";
import Script from "next/script";
import QuizTrigger from "@/components/QuizTrigger";
import MedicalByline from "@/components/MedicalByline";
import { SITE_CONFIG } from "@/lib/constants";
import { unstable_noStore } from "next/cache";

export const dynamic = 'force-dynamic';

// Helper to identify State vs City
const isStateCode = (slug: string) => slug.length === 2 && /^[a-z]{2}$/i.test(slug);

// Helper to expand 2 letter state codes back to full state names for reliable database filtering
const getFullStateName = (abbr: string) => {
  const states: Record<string, string> = {
    'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas', 'ca': 'California',
    'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware', 'fl': 'Florida', 'ga': 'Georgia',
    'hi': 'Hawaii', 'id': 'Idaho', 'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa',
    'ks': 'Kansas', 'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
    'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi', 'mo': 'Missouri',
    'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada', 'nh': 'New Hampshire', 'nj': 'New Jersey',
    'nm': 'New Mexico', 'ny': 'New York', 'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio',
    'ok': 'Oklahoma', 'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
    'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah', 'vt': 'Vermont',
    'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia', 'wi': 'Wisconsin', 'wy': 'Wyoming',
    'dc': 'District of Columbia'
  };
  return states[abbr.toLowerCase()] || abbr.toUpperCase();
};

interface PageProps {
  params: Promise<{
    condition: string;
    cityState: string;
  }>;
}

// Elite SEO: Dynamic Metadata Generation
export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { condition, cityState: slug } = params;
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
        index: !!pageContent, 
        follow: true,
      }
    };
  }

  // City Logic
  const slugParts = slug.split('-');
  const formattedCity = slugParts.length > 0 ? slugParts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : slug;
  
  const { data: pageContent } = await supabase
    .from("page_content")
    .select("id")
    .eq("path_slug", `${condition}/${slug}`)
    .single();

  const countRaw = await supabase
    .from("studies")
    .select("nct_id", { count: 'exact', head: true })
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting")
    .ilike("location_city", formattedCity);
    
  const localStudyCount = countRaw?.count || 0;
  
  const shouldIndex = !!pageContent || localStudyCount > 0;
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

export default async function TrialPage(props: PageProps) {
  unstable_noStore();
  
  const params = await props.params;
  const { condition, cityState: slug } = params;
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
    
    const { data: stateCities } = await supabase
      .from("locations")
      .select("city, slug")
      .eq("state", stateName)
      .order('city', { ascending: true });

    const fullStateNameMatch = getFullStateName(stateName);
    const { data: stateStudies } = await supabase
      .from("studies")
      .select("*")
      .ilike("condition", `%${condition}%`)
      .ilike("status", "recruiting")
      .ilike("location_state", `%${fullStateNameMatch}%`)
      .limit(5);

    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <section className="bg-white border-b border-gray-200 pt-8 pb-12 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12">
                <Link href="/" prefetch={false} className="hover:text-blue-600">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/trials" prefetch={false} className="hover:text-blue-600">All Trials</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/trials/${condition}`} prefetch={false} className="hover:text-blue-600">{formattedCondition} Trials</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{stateName} Hub</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {formattedCondition} Clinical Trials in <span className="text-blue-700">{getFullStateName(stateName)}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {pageContent?.intro_text || `Exploring modern treatment options for ${formattedCondition} across ${getFullStateName(stateName)}.`}
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
                                    prefetch={false}
                                    className="bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
                                >
                                    {city.city}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </section>
      </main>
    );
  }

  // City Logic
  const slugParts = slug.split('-');
  const currentStateAbbr = slugParts.length > 1 ? slugParts.pop()?.toUpperCase() || "TX" : "TX";
  const formattedCity = slugParts.length > 0 ? slugParts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : slug;
  
  const { data: locationData } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .single();

  const { data: localStudies } = await supabase
    .from("studies")
    .select("*")
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting")
    .ilike("location_city", formattedCity)
    .limit(3);

  let finalStudies = localStudies || [];

  if (finalStudies.length < 3) {
    const fullStateNameMatch = getFullStateName(locationData?.state || currentStateAbbr);
    const { data: stateStudies } = await supabase
      .from("studies")
      .select("*")
      .ilike("condition", `%${condition}%`)
      .ilike("status", "recruiting")
      .ilike("location_state", `%${fullStateNameMatch}%`)
      .neq("location_city", formattedCity)
      .limit(3 - finalStudies.length);
    
    if (stateStudies) finalStudies = [...finalStudies, ...stateStudies];
  }

  const studies = finalStudies || [];

  const currentState = locationData?.state || currentStateAbbr;
  const { data: nearbyLocations } = await supabase
    .from("locations")
    .select("city, slug")
    .eq("state", currentState)
    .neq("slug", slug)
    .order('city', { ascending: true })
    .limit(10);

  const payout = studies[0]?.compensation || "Up to $1,200";
  const introText = pageContent?.intro_text || `Residents of ${formattedCity} may qualify for a new investigational treatment study for ${formattedCondition}.`;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <section className="bg-slate-50/50 border-b border-slate-200/60 pt-8 pb-12 md:pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400 mb-12 uppercase">
              <Link href="/" prefetch={false} className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/trials" prefetch={false} className="hover:text-blue-600 transition-colors">All Trials</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/trials/${condition}`} prefetch={false} className="hover:text-blue-600 transition-colors">{formattedCondition} Trials</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href={`/trials/${condition}/${currentState.toLowerCase()}`} prefetch={false} className="hover:text-blue-600 transition-colors">{getFullStateName(currentState)} Hub</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-800 font-bold">{formattedCity}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mb-6 leading-[1.1]">
                New {formattedCondition} Clinical Trials in <span className="text-blue-700">{formattedCity}</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg font-medium">
                {introText}
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
               <TrialConversionFlow 
                  condition={formattedCondition}
                  city={formattedCity}
                  payout={payout}
               />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-20 max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-500" />
                Available Trials in {formattedCity}
              </h2>
              <div className="space-y-4">
                {studies.length > 0 ? studies.map((study) => (
                  <div key={study.nct_id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all group">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 mb-2">{study.title}</h3>
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">{study.status}</span>
                      <span>NCT ID: {study.nct_id}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500">No active trials found in {formattedCity} currently.</p>
                )}
              </div>
            </section>
          </div>
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Nearby {formattedCondition} Trials</h2>
            <div className="flex flex-wrap gap-2">
              {nearbyLocations?.map(loc => (
                <Link key={loc.slug} href={`/trials/${condition}/${loc.slug}`} prefetch={false} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  {loc.city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <TrustBar />
    </main>
  );
}
