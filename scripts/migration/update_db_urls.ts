import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}
const supabase = createClient(supabaseUrl, supabaseKey);

const mapData = fs.readFileSync('scripts/migration/migration_map.json', 'utf-8');
const migrationMap = JSON.parse(mapData);

function replaceUrl(url: string | null) {
  if (!url) return url;
  if (migrationMap[url]) {
    let secure = migrationMap[url].secure_url;
    // apply transformation if not present
    if (!secure.includes('f_auto,q_auto')) {
      secure = secure.replace('/upload/v', '/upload/f_auto,q_auto/v');
    }
    return secure;
  }
  
  // Handle /render/image/public/ URLs
  if (url.includes('/storage/v1/render/image/public/')) {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/storage/v1/render/image/public/');
    if (pathParts.length > 1) {
      const bucketAndPath = pathParts[1]; // e.g. "product-images/178879...png"
      const slashIndex = bucketAndPath.indexOf('/');
      const relativePath = bucketAndPath.substring(slashIndex); // e.g. "/178879...png"
      
      // Search migration map for a key that ends with this relative path
      for (const key of Object.keys(migrationMap)) {
        if (key.endsWith(relativePath)) {
          let secure = migrationMap[key].secure_url;
          if (!secure.includes('f_auto,q_auto')) {
            secure = secure.replace('/upload/v', '/upload/f_auto,q_auto/v');
          }
          return secure;
        }
      }
    }
  }

  return url;
}

function replaceArray(urls: any) {
  if (!urls || !Array.isArray(urls)) return urls;
  return urls.map(u => replaceUrl(u));
}

async function processTable(tableName: string, columns: string[], arrayColumns: string[] = []) {
  console.log(`Processing table: ${tableName}`);
  
  // 1. Fetch all records
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

  // 2. Process each record
  for (const record of records) {
    let needsUpdate = false;
    const updates: any = {};

    for (const col of columns) {
      if (record[col]) {
        const newUrl = replaceUrl(record[col]);
        if (newUrl !== record[col]) {
          updates[col] = newUrl;
          needsUpdate = true;
        }
      }
    }

    for (const col of arrayColumns) {
      if (record[col]) {
        const newArr = replaceArray(record[col]);
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
  await processTable('heritage_media', ['media_url']);
  await processTable('homepage_heritage_video', ['video_url', 'poster_url']);
  await processTable('homepage_customer_stories', ['media_url', 'poster_image']);
  await processTable('media_library', ['url']);
  console.log("DB update complete.");
}

run().catch(console.error);
