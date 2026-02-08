
import { supabaseAdmin } from '../lib/supabase.admin';
import axios from 'axios';

const CONDITIONS = ['Psoriasis', 'Diabetes', 'Migraine', 'Eczema', 'Arthritis'];
const BASE_URL = 'https://clinicaltrials.gov/api/v2/studies';

async function ingestStudies() {
  console.log("📥 STARTING CLINICAL TRIALS INGESTION Swarm...");

  const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 50;
  
  const isTest = process.argv.includes('--test');

  for (const condition of CONDITIONS) {
    console.log(`\n🔍 Fetching studies for [${condition}]...`);

    try {
      // API v2 Parameters:
      // query.cond: The condition
      // filter.overallStatus: RECRUITING
      // pageSize: batches
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

      console.log(`✅ Found ${studies.length} studies for ${condition}.`);

      if (isTest) {
        console.log("🧪 TEST MODE: Logging first 3 results and skipping DB upsert.");
        studies.slice(0, 3).forEach((s: any) => {
          const id = s.protocolSection.identificationModule.nctId;
          const title = s.protocolSection.identificationModule.briefTitle;
          const locations = s.protocolSection.contactsLocationsModule?.locations || [];
          const firstLoc = locations[0];
          console.log(`- [${id}] ${title} | ${firstLoc?.city || 'N/A'}, ${firstLoc?.state || 'N/A'}`);
        });
        continue;
      }

      // Prepare for Supabase
      const upsertData = studies.map((s: any) => {
        const locations = s.protocolSection.contactsLocationsModule?.locations || [];
        const firstLoc = locations[0]; // Take first location as representative
        
        return {
          nct_id: s.protocolSection.identificationModule.nctId,
          title: s.protocolSection.identificationModule.briefTitle,
          status: s.protocolSection.statusModule.overallStatus,
          condition: condition,
          location_city: firstLoc?.city || null,
          location_state: firstLoc?.state || null
        };
      });

      console.log(`💾 Upserting ${upsertData.length} rows to Supabase...`);
      const { error } = await supabaseAdmin.from('studies').upsert(upsertData, { onConflict: 'nct_id' });

      if (error) {
        console.error(`❌ DB Error for ${condition}:`, error.message);
      } else {
        console.log(`✨ Successfully ingested ${condition}!`);
      }

    } catch (err: any) {
      console.error(`💥 API Failure for ${condition}:`, err.message);
    }
    
    // Slight pause to be polite to the gov API
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("\n🏁 INGESTION COMPLETE.");
  process.exit(0);
}

ingestStudies();
