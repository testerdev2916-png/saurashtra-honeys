import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY);

async function main() {
  const { data: prod } = await supabase.from('products').select('image_url, images').eq('slug', 'ajwain-honey').single();
  console.log("Product:", prod);
  
  const { data: variants } = await supabase.from('product_variants').select('size, image_url').eq('product_id', '630dadbf-171c-4a2d-bdb4-5cc9f2ad486b');
  console.log("Variants:", variants);
}
main();
