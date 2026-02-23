
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNearby(citySlug: string) {
  console.log(`\n🔍 Testing Nearby for: ${citySlug}`);
  
  // 1. Get location data
  const { data: locationData } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", citySlug)
    .single();

  if (!locationData) {
    console.error(`❌ City not found: ${citySlug}`);
    return;
  }

  const currentState = locationData.state || "TX";
  console.log(`📍 State: ${currentState}`);

  // 2. Run new logic
  const { data: nearbyLocations, error } = await supabase
    .from("locations")
    .select("city, slug")
    .eq("state", currentState)
    .neq("slug", citySlug)
    .order('city', { ascending: true })
    .limit(10);

  if (error) {
    console.error(`❌ Error fetching nearby:`, error.message);
    return;
  }

  console.log(`✅ Found ${nearbyLocations.length} nearby locations:`);
  nearbyLocations.forEach(loc => console.log(`   - ${loc.city} (${loc.slug})`));
}

async function runTests() {
  await testNearby('lincoln-ne'); // Nebraska
  await testNearby('chandler-az'); // Arizona
  await testNearby('st.-petersburg-fl'); // Florida
  console.log('\n🏁 Verification Complete.');
}

runTests();
