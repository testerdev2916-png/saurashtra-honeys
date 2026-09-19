import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY);

async function main() {
  const { data: prod } = await supabase.from('products').select('*').eq('slug', 'ajwain-honey').single();
  const { data: variants } = await supabase.from('product_variants').select('size, image_url, is_default').eq('product_id', prod.id);
  console.log("Variants:", variants);
}
main();
