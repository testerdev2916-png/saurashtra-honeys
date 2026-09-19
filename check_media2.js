import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("--- Carousel Slides ---");
  const { data: slides } = await supabase.from('carousel_slides').select('image_url, mobile_image_url').limit(5);
  console.log(JSON.stringify(slides, null, 2));

  console.log("--- Review Media ---");
  const { data: revs } = await supabase.from('product_reviews').select('media_urls').not('media_urls', 'is', null).limit(2);
  console.log(JSON.stringify(revs, null, 2));
}
main();
