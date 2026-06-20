import Link from "next/link";
import { MapPin, Activity, ChevronRight } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase.admin";

interface RelatedHubsProps {
  currentCity: string;
  currentState: string;
  currentCondition: string;
}

export default async function RelatedHubs({ currentCity, currentState, currentCondition }: RelatedHubsProps) {
  try {
    // Stress Test Fix: Handle state-only pages where city is null
    if (!currentCity) {
      // For state-only pages, we can show research hubs in major cities of that state
      const { data: stateHubs } = await supabaseAdmin
        .from("page_content")
        .select("path_slug, city_slug")
        .ilike("condition", currentCondition)
        .ilike("path_slug", `%-${currentState.toLowerCase()}`)
        .limit(16);

      if (!stateHubs || stateHubs.length === 0) return null;

      return (
        <section className="bg-gray-50/50 py-24 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
             <div className="flex items-center gap-3 mb-12 justify-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{currentCondition} Research Hubs in {currentState}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Select a local center to view active trials</p>
                </div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stateHubs.map((peer) => {
                  const cityName = peer.city_slug.split('-')[0].charAt(0).toUpperCase() + peer.city_slug.split('-')[0].slice(1);
                  return (
                    <Link 
                      key={peer.path_slug}
                      href={`/study/${peer.path_slug.replace("/", "_")}`}
                      className="group bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all flex items-center justify-between"
                    >
                      <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{cityName}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  );
                })}
             </div>
          </div>
        </section>
      );
    }

    const citySlug = `${currentCity.toLowerCase().replace(/ /g, "-")}-${currentState.toLowerCase()}`;
    
    // 1. Fetch other conditions in the SAME city
    const { data: localPeers } = await supabaseAdmin
      .from("page_content")
      .select("path_slug, condition")
      .eq("city_slug", citySlug)
      .neq("condition", currentCondition)
      .limit(6);

    // 2. Fetch the same condition in other cities in the SAME state
    const { data: statePeers } = await supabaseAdmin
      .from("page_content")
      .select("path_slug, city_slug")
      .ilike("condition", currentCondition)
      .ilike("path_slug", `%-${currentState.toLowerCase()}`)
      .neq("city_slug", citySlug)
      .limit(12);

    if ((!localPeers || localPeers.length === 0) && (!statePeers || statePeers.length === 0)) {
      return null; // Graceful exit if no peers found
    }

    return (
      <section className="bg-gray-50/50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Column 1: Other Conditions in City */}
            {localPeers && localPeers.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Research Hubs in {currentCity}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Explore other local breakthroughs</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {localPeers.map((peer) => (
                    <Link 
                      key={peer.path_slug}
                      href={`/study/${peer.path_slug.replace("/", "_")}`}
                      className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all flex items-center justify-between"
                    >
                      <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {peer.condition} Trials
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Column 2: Same Condition in State */}
            {statePeers && statePeers.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{currentCondition} Hubs in {currentState}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Regional Network of Excellence</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {statePeers.map((peer) => {
                    // Extract city name from slug (e.g., "houston-tx" -> "Houston")
                    const cityName = peer.city_slug.split('-')[0].charAt(0).toUpperCase() + peer.city_slug.split('-')[0].slice(1);
                    return (
                      <Link 
                        key={peer.path_slug}
                        href={`/study/${peer.path_slug.replace("/", "_")}`}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-50/50 transition-all flex items-center justify-between"
                      >
                        <span className="font-bold text-gray-700 group-hover:text-green-600 transition-colors">
                          {cityName} Center
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("RelatedHubs Error:", error);
    return null; // Stress test pass: Never break the main page on link failures
  }
}
