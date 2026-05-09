
import { supabaseAdmin } from '../lib/supabase.admin';
import axios from 'axios';

const CONDITIONS = ['Psoriasis', 'Diabetes', 'Migraine', 'Eczema', 'Arthritis'];
const BASE_URL = 'https://clinicaltrials.gov/api/v2/studies';

async function ingestStudies() {
  console.log("📥 STARTING MASSIVE pSEO INGESTION (Multi-City Edition)...");

  // Higher limit for better city coverage
  const limit = 300; 
  
  for (const condition of CONDITIONS) {
    console.log(`\n🔍 Fetching up to ${limit} studies for [${condition}]...`);

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          'query.cond': condition,
          'filter.overallStatus': 'RECRUITING',
          'pageSize': limit,
          'fields': 'protocolSection.identificationModule.nctId,protocolSection.identificationModule.briefTitle,protocolSection.statusModule.overallStatus,protocolSection.contactsLocationsModule'
        }
      });

      const studies = response.data.studies;
      
      if (!studies || studies.length === 0) {
        console.log(`⚠️ No recruiting studies found for ${condition}.`);
        continue;
      }

      console.log(`✅ Found ${studies.length} studies. Expanding locations...`);

      const upsertData: any[] = [];
      const seen = new Set();

      studies.forEach((s: any) => {
        const nctId = s.protocolSection.identificationModule.nctId;
        const title = s.protocolSection.identificationModule.briefTitle;
        const status = s.protocolSection.statusModule.overallStatus;
        const locations = s.protocolSection.contactsLocationsModule?.locations || [];

        locations.forEach((loc: any) => {
          // Only take US locations (they usually have a state)
          if (loc.city && loc.state && loc.country === 'United States') {
            const city = loc.city;
            const state = loc.state;
            const key = `${nctId}_${city}_${state}`;

            if (!seen.has(key)) {
              upsertData.push({
                nct_id: nctId,
                title: title,
                status: status,
                condition: condition,
                location_city: city,
                location_state: state,
                compensation: "Up to $1,500" // Default for pSEO attractiveness
              });
              seen.add(key);
            }
          }
        });
      });

      if (upsertData.length === 0) {
        console.log(`⚠️ No US locations found for ${condition}.`);
        continue;
      }

      console.log(`💾 Found ${upsertData.length} city-specific records. Updating DB...`);

      // Strategy: Delete existing for this condition and re-insert 
      // This bypasses the unique constraint issues with nct_id while keeping data fresh
      const { error: delError } = await supabaseAdmin
        .from('studies')
        .delete()
        .eq('condition', condition);

      if (delError) {
        console.error(`❌ Delete error for ${condition}:`, delError.message);
        continue;
      }

      // Batch insert (Supabase handles up to 1000 at a time well)
      const batchSize = 500;
      for (let i = 0; i < upsertData.length; i += batchSize) {
        const batch = upsertData.slice(i, i + batchSize);
        const { error: insError } = await supabaseAdmin.from('studies').insert(batch);
        
        if (insError) {
          console.error(`❌ Insert error for ${condition} batch:`, insError.message);
        }
      }

      console.log(`✨ Successfully updated ${condition} with ${upsertData.length} locations!`);

    } catch (err: any) {
      console.error(`💥 API Failure for ${condition}:`, err.message);
    }
    
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n🏁 MASS INGESTION COMPLETE.");
  process.exit(0);
}

ingestStudies();
