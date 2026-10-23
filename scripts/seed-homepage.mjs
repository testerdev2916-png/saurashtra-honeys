import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const CANONICAL_SECTIONS = [
  "hero",
  "trust_strip",
  "shop_by_category",
  "featured_products",
  "shoppable_videos",
  "farm_banner",
  "heritage_video",
  "testimonials",
  "journal",
];

async function seed() {
  const { data: existing } = await supabase.from('homepage_sections').select('section_key');
  const existingKeys = new Set((existing || []).map(r => r.section_key));
  
  let order = existingKeys.size;
  for (const key of CANONICAL_SECTIONS) {
    if (!existingKeys.has(key)) {
      order++;
      await supabase.from('homepage_sections').insert({
        section_key: key,
        enabled: true,
        sort_order: order,
        settings: {}
      });
      console.log('Inserted', key);
    }
  }
  console.log('Done');
}
seed();
