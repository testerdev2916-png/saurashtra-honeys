import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data, error } = await supabase.from('categories').select('id, name, slug, image_url');
  if (error) console.error("Error:", error);
  else console.log(JSON.stringify(data, null, 2));
}
main();
