const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

const getFullStateName = (abbr) => {
  const states = {
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

async function generatePageData() {
    try {
        const condition = 'migraine';
        const slug = 'wilmington-nc';
        
        console.log("---- SIMULATING PAGE LOAD ----");
        
        const slugParts = slug.split('-');
        const currentStateAbbr = slugParts.length > 1 ? slugParts.pop().toUpperCase() || "TX" : "TX";
        const formattedCity = slugParts.length > 0 ? slugParts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : slug;
        
        console.log("currentStateAbbr:", currentStateAbbr);
        console.log("formattedCity:", formattedCity);

        console.log("1. Fetching locationData...");
        const { data: locationData, error: lErr } = await supabase
            .from("locations")
            .select("*")
            .eq("slug", slug)
            .single();
        if (lErr) console.warn("locationData error:", lErr);
            
        console.log("2. Fetching localStudies...");
        const { data: localStudies, error: sErr } = await supabase
            .from("studies")
            .select("*")
            .ilike("condition", `%${condition}%`)
            .ilike("status", "recruiting")
            .ilike("location_city", formattedCity)
            .limit(3);
        if (sErr) console.warn("localStudies error:", sErr);
            
        let finalStudies = localStudies || [];
        
        console.log("3. Fetching stateStudies... Final Studies Count:", finalStudies.length);
        if (finalStudies.length < 3) {
            const fullStateNameMatch = getFullStateName(locationData?.state || currentStateAbbr);
            console.log("   -> using fullStateNameMatch:", fullStateNameMatch);
            const { data: stateStudies, error: stErr } = await supabase
              .from("studies")
              .select("*")
              .ilike("condition", `%${condition}%`)
              .ilike("status", "recruiting")
              .ilike("location_state", `%${fullStateNameMatch}%`)
              .neq("location_city", formattedCity)
              .limit(3 - finalStudies.length);
            if (stErr) console.warn("stateStudies error:", stErr);
            
            if (stateStudies) finalStudies = [...finalStudies, ...stateStudies];
        }

        console.log("4. Fetching fallbackStudies... Final Studies Count:", finalStudies.length);
        if (finalStudies.length < 3 && finalStudies.length > 0) {
             const ids = finalStudies.map(s => s.nct_id).join(",") || "0";
             console.log("   -> Excluded IDs:", ids);
        } else if (finalStudies.length === 0) {
             console.log("   -> Excluded IDs: 0");
        }
        
    } catch (e) {
        console.error("CRITICAL FATAL SSR CRASH DETECTED:");
        console.error(e);
    }
}

generatePageData();
