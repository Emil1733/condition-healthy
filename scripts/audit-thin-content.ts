
import { supabaseAdmin } from '../lib/supabase.admin';

async function auditThinContent() {
  try {
    const { count: aiPageCount } = await supabaseAdmin.from('page_content').select('*', { count: 'exact', head: true });
    const { count: totalLocations } = await supabaseAdmin.from('locations').select('*', { count: 'exact', head: true });
    
    // Conditions used in the app
    const conditions = ['psoriasis', 'diabetes', 'migraine', 'eczema', 'arthritis'];
    const potentialPages = (totalLocations || 0) * conditions.length;
    
    console.log('--- THIN CONTENT AUDIT ---');
    console.log(`Unique AI-Generated Pages: ${aiPageCount}`);
    console.log(`Total Potential Programmatic Pages: ${potentialPages}`);
    console.log(`Coverage Ratio: ${((aiPageCount || 0) / potentialPages * 100).toFixed(2)}%`);
    
    if ((aiPageCount || 0) < potentialPages) {
      console.log(`Warning: ${potentialPages - (aiPageCount || 0)} pages are currently using generic template fallbacks.`);
    }
  } catch (err) {
    console.error(err);
  }
}

auditThinContent();
