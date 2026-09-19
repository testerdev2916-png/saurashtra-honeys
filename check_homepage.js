import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY);

async function main() {
  const { data } = await supabase.from('homepage_sections').select('content').eq('section_type', 'featured_products').single();
  console.log("Featured Products Content:", JSON.stringify(data, null, 2));
}
main();
