import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tables = [
    { name: 'products', cols: ['image_url'], arrCols: ['images', 'additional_images'] },
    { name: 'hero_slides', cols: ['image_url', 'mobile_image_url'] },
    { name: 'category_hero_slides', cols: ['image_url', 'mobile_image_url'] },
    { name: 'categories', cols: ['image_url'] },
    { name: 'blog_posts', cols: ['cover_image_url'] },
    { name: 'homepage_videos', cols: ['video_url', 'thumbnail_url', 'poster_url'] },
    { name: 'homepage_heritage_video', cols: ['video_url', 'poster_url'] },
    { name: 'media_library', cols: ['url'] }
  ];

  let cloudinaryCount = 0;
  let supabaseCount = 0;
  let invalidCount = 0;

  function checkUrl(url: string | null) {
    if (!url) return;
    if (url.includes('res.cloudinary.com')) {
      cloudinaryCount++;
      if (!url.includes('f_auto,q_auto')) {
        console.log(`[WARNING] Missing f_auto,q_auto: ${url}`);
        invalidCount++;
      }
      if (url.includes('/video/upload/v') || url.includes('/image/upload/v')) {
        console.log(`[WARNING] Missing transform folder: ${url}`);
        invalidCount++;
      }
    } else if (url.includes('supabase.co')) {
      supabaseCount++;
      console.log(`[WARNING] Remaining Supabase URL: ${url}`);
    } else if (url.startsWith('http')) {
       // External URL?
    } else {
       console.log(`[WARNING] Invalid/Broken URL: ${url}`);
       invalidCount++;
    }
  }

  for (const table of tables) {
    const { data: records, error } = await supabase.from(table.name).select('*');
    if (error) {
      if (error.code !== '42P01') console.error(`Error on ${table.name}:`, error.message);
      continue;
    }
    for (const record of records || []) {
      for (const col of table.cols) checkUrl(record[col]);
      if (table.arrCols) {
        for (const col of table.arrCols) {
          if (Array.isArray(record[col])) {
             record[col].forEach(checkUrl);
          }
        }
      }
    }
  }

  console.log(`--- DB SCAN REPORT ---`);
  console.log(`Cloudinary URLs: ${cloudinaryCount}`);
  console.log(`Remaining Supabase URLs: ${supabaseCount}`);
  console.log(`Broken/Invalid URLs: ${invalidCount}`);
}

run().catch(console.error);
