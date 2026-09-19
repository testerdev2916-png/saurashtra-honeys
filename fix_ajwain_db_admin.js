import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key to bypass RLS!
);

async function main() {
  const bottleUrl = 'https://res.cloudinary.com/yzmffalu/image/upload/f_auto,q_auto/v1789746585/saurashtra-honey/products/1_vop6t68ghzk_1789746583009.png';
  
  const { data: updatedProd, error } = await supabase.from('products').update({ image_url: bottleUrl }).eq('slug', 'ajwain-honey').select();
  if (error) console.error("Error:", error);
  else console.log("Ajwain Honey main image updated successfully!", updatedProd?.length, "rows updated.");
  
  // Also update any variants that have supabase URLs to use the bottle
  const { data: prod } = await supabase.from('products').select('id').eq('slug', 'ajwain-honey').single();
  const { data: variants } = await supabase.from('product_variants').select('id, image_url').eq('product_id', prod.id);
  
  for (const v of variants) {
    if (v.image_url && v.image_url.includes('supabase.co')) {
      const { data } = await supabase.from('product_variants').update({ image_url: bottleUrl }).eq('id', v.id).select();
      console.log(`Updated variant ${v.id}, rows:`, data?.length);
    }
  }
}
main();
