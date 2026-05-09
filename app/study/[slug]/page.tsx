
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
  const parsed = parseSlug(props.params.slug);
  if (!parsed) return { title: "Research Hub" };
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

  if (!parsed) return notFound();

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
        currentState={stateName}
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
