import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('category_hero_slides').select('*').limit(1);
  if (error) {
    console.error("Error querying table:", error.message, error.code, error.details);
  } else {
    console.log("Table exists! Data:", data);
  }
}

main().catch(console.error);
