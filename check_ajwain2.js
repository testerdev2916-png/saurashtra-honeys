import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY);

async function main() {
  const { data: prod, error: prodErr } = await supabase.from('products').select('*').eq('slug', 'ajwain-honey').single();
  console.log("Product:", prod?.image_url);

  if (prod) {
    const { data: variants, error: varErr } = await supabase.from('product_variants').select('*').eq('product_id', prod.id);
    console.log("Variants:", variants?.map(v => v.image_url));
  }
}
main();
