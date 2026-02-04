
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase.custom";
import { generateContent } from "@/lib/gemini";
import TrustBar from "@/components/TrustBar";
import EligibilityCard from "@/components/EligibilityCard";
import { ShieldCheck, MapPin, Activity } from "lucide-react";
import Link from "next/link"; // Import Link
import TrialConversionFlow from "@/components/TrialConversionFlow";

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

  // 2. Fetch Study Data
  const { data: studyData } = await supabase
    .from("studies")
    .select("*")
    .ilike("condition", `%${condition}%`)
    .eq("status", "Recruiting")
    .limit(1)
    .single();
  
  // 3. Fetch PRE-GENERATED Content (Static Strategy)
  const { data: pageContent } = await supabase
    .from("page_content")
    .select("*")
    .eq("path_slug", pathSlug)
    .single();

  // Determine Payout (Generic fallback if no DB data yet)
  const payout = studyData?.compensation || "Up to $1,200";
  
  // Use DB content or fallback if missing (e.g. during dev)
  const introText = pageContent?.intro_text || `Residents of ${formattedCity} struggling with ${formattedCondition} may qualify for a new investigational treatment study.`;


  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-16 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col: Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Recruiting Now in {formattedCity}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                New <span className="text-blue-700">{formattedCondition}</span> Treatment Option.
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                {introText}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-green-600" />
                   <span>No Insurance Needed</span>
                </div>
                <div className="flex items-center gap-2">
                   <Activity className="w-5 h-5 text-green-600" />
                   <span>Identify New Options</span>
                </div>
              </div>
            </div>

            {/* Right Col: The Eligibility Card (Sticky) */}
            <div className="flex justify-center lg:justify-end">
               <div className="w-full max-w-md">
                   {/* Create a client wrapper for interactivity */}
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
      <section className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Study Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600"/> Location
                </h3>
                <p className="text-gray-600">
                    The research center is conveniently located in <b>{formattedCity}</b>. 
                    Validation parking is provided for all visits.
                    (Specific address revealed upon qualification).
                </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                 <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600"/> Qualification
                </h3>
                <ul className="space-y-3 text-gray-600">
                    <li>• Age 18 - 65</li>
                    <li>• Diagnosed with {formattedCondition}</li>
                    <li>• Trying to find better management options</li>
                </ul>
            </div>
        </div>
        
        {/* Nearby Cities SEO Spiderweb */}
        <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-4">NEARBY LOCATIONS</p>
            <div className="flex flex-wrap gap-4">
                {/* Normally these would be dynamic from the DB */}
                <Link href={`/trials/${condition}/dallas-tx`} className="text-blue-600 hover:underline">Dallas {formattedCondition}</Link>
                <Link href={`/trials/${condition}/houston-tx`} className="text-blue-600 hover:underline">Houston {formattedCondition}</Link>
                <Link href={`/trials/${condition}/san-antonio-tx`} className="text-blue-600 hover:underline">San Antonio {formattedCondition}</Link>
            </div>
        </div>

      </section>
    </main>
  );
}
