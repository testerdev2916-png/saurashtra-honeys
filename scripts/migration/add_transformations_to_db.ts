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

function addTransform(url: string | null) {
  if (!url) return url;
  if (!url.includes('res.cloudinary.com')) return url;
  if (url.includes('/f_auto,q_auto/')) return url; // already added

  // Add transformations for both images and videos
  let newUrl = url.replace('/image/upload/v', '/image/upload/f_auto,q_auto/v');
  newUrl = newUrl.replace('/video/upload/v', '/video/upload/f_auto,q_auto/v');
  return newUrl;
}

function processArray(urls: any) {
  if (!urls || !Array.isArray(urls)) return urls;
  return urls.map(u => addTransform(u));
}

async function processTable(tableName: string, columns: string[], arrayColumns: string[] = []) {
  console.log(`Processing table: ${tableName}`);
  
  let { data: records, error } = await supabase.from(tableName).select('*');
  if (error) {
    if (error.code === '42P01') {
      console.log(`Table ${tableName} does not exist, skipping.`);
      return;
    }
    console.error(`Error fetching ${tableName}:`, error);
    return;
  }
  if (!records || records.length === 0) return;

  let updateCount = 0;

  for (const record of records) {
    let needsUpdate = false;
    const updates: any = {};

    for (const col of columns) {
      if (record[col]) {
        const newUrl = addTransform(record[col]);
        if (newUrl !== record[col]) {
          updates[col] = newUrl;
          needsUpdate = true;
        }
      }
    }

    for (const col of arrayColumns) {
      if (record[col]) {
        const newArr = processArray(record[col]);
        if (JSON.stringify(newArr) !== JSON.stringify(record[col])) {
          updates[col] = newArr;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      const { error: updateError } = await supabase.from(tableName).update(updates).eq('id', record.id);
      if (updateError) {
        console.error(`Failed to update ${tableName} ID ${record.id}:`, updateError);
      } else {
        updateCount++;
      }
    }
  }
  console.log(`Updated ${updateCount} records in ${tableName}.`);
}

async function run() {
  await processTable('products', ['image_url'], ['images', 'additional_images']);
  await processTable('hero_slides', ['image_url', 'mobile_image_url']);
  await processTable('category_hero_slides', ['image_url', 'mobile_image_url']);
  await processTable('categories', ['image_url']);
  await processTable('blog_posts', ['cover_image_url']);
  await processTable('homepage_videos', ['video_url', 'thumbnail_url', 'poster_url']);
  await processTable('homepage_heritage_video', ['video_url', 'poster_url']);
  await processTable('media_library', ['url']);
  console.log("DB transformations complete.");
}

run().catch(console.error);
