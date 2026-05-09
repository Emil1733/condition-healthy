
import { supabase } from "@/lib/supabase.custom";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Activity, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Hospital, 
  Stethoscope, 
  Globe,
  FileText,
  Clock,
  ArrowRight
} from "lucide-react";
import StudyTabs from "@/components/StudyTabs";
import RelatedHubs from "@/components/RelatedHubs";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

const STATE_MAP: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas",
  CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
  KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia",
  WI: "Wisconsin", WY: "Wyoming",
};

function parseSlug(slug: string) {
  const underscoreIdx = slug.indexOf("_");
  if (underscoreIdx === -1) return null;

  const condition = slug.slice(0, underscoreIdx);
  const locationPart = slug.slice(underscoreIdx + 1);

  if (!condition || !locationPart) return null;

  const parts = locationPart.split("-");
  const stateAbbr = (parts.pop() || "").toUpperCase();
  const city = parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const stateName = STATE_MAP[stateAbbr] || stateAbbr;
  const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1).replace(/-/g, " ");

  return { condition, city, stateAbbr, stateName, formattedCondition };
}

export async function generateMetadata(props: PageProps) {
  const { slug } = props.params;
  const parsed = parseSlug(slug);

  if (slug.startsWith("NCT") || !parsed) {
    const { data: study } = await supabase
      .from("studies")
      .select("title, location_city, location_state, condition")
      .eq("nct_id", slug)
      .single();

    if (!study) return { title: "Clinical Research Hub" };

    return {
      title: `${study.condition} Study in ${study.location_city}: ${study.title} | ${SITE_CONFIG.brandingSuffix}`,
      description: `Participate in a verified ${study.condition} clinical trial in ${study.location_city}, ${study.location_state}. View eligibility, sponsor details, and compensation information.`,
      alternates: { canonical: `${SITE_CONFIG.baseUrl}/study/${slug}` },
    };
  }

  const { formattedCondition, city, stateAbbr, stateName } = parsed;
  const locationTitle = city ? `${city}, ${stateAbbr}` : stateName;
  return {
    title: `${formattedCondition} Clinical Trials in ${locationTitle} | ${SITE_CONFIG.brandingSuffix}`,
    description: `Access high-authority ${formattedCondition} research in ${locationTitle}. Connect with top hospitals and receive compensation for your participation.`,
    alternates: { canonical: `${SITE_CONFIG.baseUrl}/study/${props.params.slug}` },
  };
}

export default async function TrialCityPage(props: PageProps) {
  const { slug } = props.params;
  const parsed = parseSlug(slug);

  // 1. Handle Individual Clinical Trial (NCT ID)
  if (slug.startsWith("NCT") || !parsed) {
    const { data: study } = await supabase
      .from("studies")
      .select("*")
      .eq("nct_id", slug)
      .single();

    if (!study) return notFound();

    // Find the parent Hub Slug for internal linking
    const conditionSlug = study.condition?.toLowerCase().replace(/ /g, "-") || "general";
    const citySlug = study.location_city?.toLowerCase().replace(/ /g, "-") || "";
    const stateSlug = study.location_state?.toLowerCase() || "";
    const hubSlug = `${conditionSlug}_${citySlug}-${stateSlug}`;

    return (
      <main className="min-h-screen bg-gray-50/30 font-sans">
        {/* Trial Header */}
        <section className="bg-white border-b border-gray-100 pt-12 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 overflow-x-auto no-scrollbar">
              <Link href="/" className="hover:text-blue-600">Portal</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link href={`/study/${hubSlug}`} className="text-blue-700 font-black">{study.location_city} {study.condition}</Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-300">NCT {study.nct_id}</span>
            </nav>
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black mb-6 uppercase border border-green-100">
                 <ShieldCheck className="w-3 h-3" />
                 Verified Clinical Study
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                {study.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location</p>
                    <Link href={`/study/${hubSlug}`} className="text-lg font-bold text-blue-600 hover:underline flex items-center gap-2">
                       <MapPin className="w-5 h-5" />
                       {study.location_city}, {study.location_state}
                    </Link>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Condition</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <Activity className="w-5 h-5 text-blue-600" />
                       {study.condition}
                    </p>
                 </div>
                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phase</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <Globe className="w-5 h-5 text-blue-600" />
                       {study.phase || 'N/A'}
                    </p>
                 </div>
              </div>

              {/* The Key "Link-Harden" Component */}
              <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                 <h3 className="text-2xl md:text-3xl font-black mb-4 relative z-10">Access Local Care in {study.location_city}</h3>
                 <p className="text-blue-100 text-lg mb-8 max-w-xl relative z-10">
                   Get personalized support, travel compensation details, and access to all related {study.condition} studies at our regional research hub.
                 </p>
                 <Link 
                   href={`/study/${hubSlug}`} 
                   className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-xl active:scale-95"
                 >
                   Open {study.location_city} Hub
                   <ArrowRight className="w-5 h-5" />
                 </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Study Content Section */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-16">
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                       <FileText className="w-8 h-8 text-blue-600" />
                       Study Overview
                    </h2>
                    <div className="prose prose-blue max-w-none text-gray-600 text-lg leading-relaxed font-medium">
                       {study.description}
                    </div>
                 </div>
                 
                 <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">Eligibility Requirements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-4">Inclusion Criteria</p>
                          <p className="text-gray-600 font-medium leading-relaxed">{study.inclusion_criteria || 'Consult with study coordinator.'}</p>
                       </div>
                       <div>
                          <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">Exclusion Criteria</p>
                          <p className="text-gray-600 font-medium leading-relaxed">{study.exclusion_criteria || 'Consult with study coordinator.'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-gray-900 rounded-[40px] p-8 text-white sticky top-8">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-white" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sponsor</p>
                          <p className="font-bold text-sm truncate max-w-[180px]">{study.sponsor}</p>
                       </div>
                    </div>
                    
                    <div className="space-y-6 mb-10">
                       <div className="flex items-center justify-between py-4 border-b border-white/10">
                          <span className="text-gray-400 text-sm font-bold">Status</span>
                          <span className="text-green-400 font-black uppercase text-xs">{study.status}</span>
                       </div>
                       <div className="flex items-center justify-between py-4 border-b border-white/10">
                          <span className="text-gray-400 text-sm font-bold">Duration</span>
                          <span className="text-white font-bold">12-24 Months</span>
                       </div>
                       <div className="flex items-center justify-between py-4 border-b border-white/10">
                          <span className="text-gray-400 text-sm font-bold">Compensation</span>
                          <span className="text-blue-400 font-black">Provided</span>
                       </div>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 mb-4">
                       Check Eligibility
                    </button>
                    <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                       Secure Recruitment Portal
                    </p>
                 </div>
              </div>
           </div>
        </section>
      </main>
    );
  }

  // 2. Handle City/Condition Hub (The "Thick" Pages)
  const { condition, city, stateAbbr, stateName, formattedCondition } = parsed;
  const locationTitle = city ? `${city}, ${stateAbbr}` : stateName;

  // 1. Fetch "Thick" Content
  const { data: pageContent } = await supabase
    .from("page_content")
    .select("*")
    .eq("path_slug", slug.replace("_", "/"))
    .single();

  // 2. Fetch Trials
  let query = supabase
    .from("studies")
    .select("*")
    .ilike("condition", `%${condition.replace(/-/g, " ")}%`)
    .ilike("status", "recruiting")
    .or(`location_city.ilike.${city},location_city.ilike.${city.replace(/ /g, '-')}`);

  const { data: trials } = await query.limit(40);
  const activeTrials = trials ?? [];

  return (
    <main className="min-h-screen bg-gray-50/30 font-sans">
      {/* Elite Dashboard Hero */}
      <section className="bg-white border-b border-gray-100 relative overflow-hidden pt-12 pb-24">
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
          <Image 
            src="/medical_hero.png" 
            alt="Clinical Research Hub"
            fill
            className="object-cover opacity-40 object-right-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href="/" className="hover:text-blue-600 transition-colors">Portal</Link>
            <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
            <Link href="/trials" className="hover:text-blue-600 transition-colors">Directory</Link>
            <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
            <span className="text-blue-700">{city || stateName} {condition}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-blue-100">
               <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
               Live Research Database
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8">
              {formattedCondition} <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">Hub: {locationTitle}</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl font-medium">
              Connecting patients in {city} with breakthrough clinical trials, specialized care, and study-related compensation.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4 items-center">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                       <Image src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="User" width={40} height={40} />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">+4k</div>
               </div>
               <div className="text-[11px] md:text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Join 4,200+ participants tracking trials in {stateName}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Dashboard Core (Tabs + Dynamic Content) */}
      <StudyTabs 
        activeTrials={activeTrials} 
        pageContent={pageContent}
        locationTitle={locationTitle}
        condition={formattedCondition}
        stateName={stateName}
        city={city}
      />

      <RelatedHubs 
        currentCity={city}
        currentState={stateAbbr}
        currentCondition={formattedCondition}
      />

      {/* Standalone Authority Strip */}
      <section className="bg-white border-t border-gray-50 py-16">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-20 grayscale hover:opacity-40 transition-opacity duration-500">
               <span className="text-xl font-black italic tracking-tighter">ClinicalTrials.gov</span>
               <span className="text-xl font-black italic tracking-tighter">FDA REGISTERED</span>
               <span className="text-xl font-black italic tracking-tighter">IRB OVERSIGHT</span>
               <span className="text-xl font-black italic tracking-tighter">HIPAA COMPLIANT</span>
            </div>
         </div>
      </section>
    </main>
  );
}
