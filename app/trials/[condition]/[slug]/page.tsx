import { supabase } from "@/lib/supabase.custom";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Activity, MapPin, ChevronRight, ShieldCheck, Info } from "lucide-react";
import StudyCard from "@/components/StudyCard";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PageProps {
  params: {
    condition: string;
    slug: string;
  };
}

// Helper to expand state abbreviations for UI display
const getStateName = (abbr: string) => {
  const states: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };
  return states[abbr.toUpperCase()] || abbr.toUpperCase();
};

export async function generateMetadata(props: PageProps) {
  const { condition, slug } = props.params;
  const slugParts = slug.split("-");
  const stateAbbr = slugParts.pop()?.toUpperCase() || "TX";
  const city = slugParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);

  return {
    title: `${formattedCondition} Clinical Trials in ${city}, ${stateAbbr} | ${SITE_CONFIG.brandingSuffix}`,
    description: `Find active ${formattedCondition} studies in ${city}, ${stateAbbr}. View eligibility, pay rates, and connect with top research facilities near you.`,
    alternates: {
      canonical: `${SITE_CONFIG.baseUrl}/trials/${condition}/${slug}`,
    }
  };
}

export default async function TrialCityPage(props: PageProps) {
  const { condition, slug } = props.params;
  
  // 1. Parse Slug (e.g., wilmington-nc)
  const slugParts = slug.split("-");
  const stateAbbr = slugParts.pop()?.toUpperCase() || "TX";
  const city = slugParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const stateName = getStateName(stateAbbr);
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1);

  // 2. Fetch Trials for this City/Condition
  let query = supabase
    .from("studies")
    .select("*")
    .ilike("condition", `%${condition}%`)
    .ilike("status", "recruiting");

  if (city) {
    query = query.ilike("location_city", city);
  }
  
  query = query.or(`location_state.ilike.${stateName},location_state.ilike.${stateAbbr}`);

  const { data: trials, error } = await query;

  if (error || !trials || trials.length === 0) {
    return notFound();
  }

  const activeTrials = trials || [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/trials" className="hover:text-blue-600 transition-colors">All Trials</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/trials/${condition}`} className="hover:text-blue-600 transition-colors">{formattedCondition}</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{city}, {stateAbbr}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                        <MapPin className="w-3 h-3" />
                        Local Research Hub
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        {formattedCondition} Trials in <span className="text-blue-600">{city}, {stateAbbr}</span>
                    </h1>
                    <p className="mt-4 text-gray-500 max-w-2xl leading-relaxed">
                        Currently tracking {activeTrials.length} active clinical research {activeTrials.length === 1 ? 'study' : 'studies'} in the {city} area. 
                        Participants may receive compensations for time and travel.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="text-center px-4 border-r border-gray-200">
                        <div className="text-2xl font-black text-gray-900">{activeTrials.length}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</div>
                    </div>
                    <div className="text-center px-4">
                        <div className="text-2xl font-black text-blue-600">Free</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical Care</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Trials Grid */}
              <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Available {formattedCondition} Studies
                  </h2>
                  
                  {activeTrials.map((study) => (
                      <StudyCard 
                          key={study.nct_id}
                          nctId={study.nct_id}
                          title={study.title}
                          status={study.status}
                          condition={study.condition}
                          city={study.location_city}
                          state={study.location_state}
                          showLocation={false} 
                      />
                  ))}
              </div>

              {/* Sidebar / Info */}
              <div className="space-y-8">
                  <div className="bg-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                          <ShieldCheck className="w-24 h-24" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 relative z-10">How it works</h3>
                      <ul className="space-y-4 relative z-10">
                          <li className="flex gap-3">
                              <div className="bg-blue-500/30 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                              <p className="text-sm text-blue-100 italic">Select a study that matches your condition and location.</p>
                          </li>
                          <li className="flex gap-3">
                              <div className="bg-blue-500/30 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                              <p className="text-sm text-blue-100 italic">Review the eligibility requirements and click "View Full Details".</p>
                          </li>
                          <li className="flex gap-3">
                              <div className="bg-blue-500/30 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                              <p className="text-sm text-blue-100 italic">Contact the research site directly to start your screening.</p>
                          </li>
                      </ul>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-400" />
                        Patient Compensation
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                          Most clinical trials in {city} provide compensation for time and travel, often ranging from <strong>$500 to $3,000</strong> per study. Additionally, participants receive study-related medical care and medications at no cost.
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-gray-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-200/50">
              <div className="flex items-center gap-4 text-gray-600">
                  <ShieldCheck className="w-8 h-8 text-orange-400" />
                  <div>
                      <div className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Security Verified</div>
                      <div className="text-sm">All trials follow strict FDA-compliant safety protocols.</div>
                  </div>
              </div>
              <div className="flex items-center gap-8 opacity-40 grayscale filter">
                  <span className="text-[10px] font-black tracking-widest">NIH DATA</span>
                  <span className="text-[10px] font-black tracking-widest">IRB APPROVED</span>
                  <span className="text-[10px] font-black tracking-widest">HIPAA COMPLIANT</span>
              </div>
          </div>
      </section>
    </main>
  );
}
