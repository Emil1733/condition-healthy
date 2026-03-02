import { createClient } from "@supabase/supabase-js";
// Load env vars from .env.local only in local script environments (not Next.js runtime)
if (!process.env.NEXT_RUNTIME) {
  try {
    const dotenv = require('dotenv');
    dotenv.config({ path: '.env.local' });
  } catch (e) {
    // dotenv might not be available in production, ignore
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
