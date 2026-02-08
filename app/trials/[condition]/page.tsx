import { supabase } from "@/lib/supabase.custom";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Activity, MapPin, ChevronRight, ShieldCheck } from "lucide-react";
import Script from "next/script";

import { SITE_CONFIG } from "@/lib/constants";

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://conditionhealthy.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "All Trials",
        "item": "https://conditionhealthy.com/trials"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": formattedCondition,
        "item": `https://conditionhealthy.com/trials/${condition}`
      }
    ]
  };

  // 1. Fetch cities that have trials for this condition
  // We'll query our 'studies' table to find all unique cities with this condition
  const { data: cityData, error } = await supabase
    .from("studies")
    .select("location_city, location_state")
    .ilike("condition", `%${condition}%`)
    .eq("status", "Recruiting");

  if (error || !cityData) {
    return notFound();
  }

  // 2. Group and Count trials per city
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
      <section className="bg-white border-b border-gray-200 pt-8 pb-20">
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
                    Connect with leading research facilities conducting ${formattedCondition} studies. Select your city below to view local eligibility requirements, compensation details, and available treatments.
                </p>
            </div>
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

         {/* Trust Footer */}
         <div className="mt-20 flex flex-col items-center">
            <div className="flex items-center gap-12 opacity-40 grayscale filter hover:grayscale-0 transition-all">
                {/* Placeholders for partner logos */}
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">NIH Data Verified</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">IRB Approved Standards</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">HIPAA Compliant</div>
            </div>
         </div>
      </section>

    </main>
  );
}
