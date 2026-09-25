import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data } = await supabase.from('site_settings').select('key, value').eq('key', 'company');
  console.log("Settings:", JSON.stringify(data, null, 2));
}
main();
