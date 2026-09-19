import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("--- Homepage Videos ---");
  const { data: vids } = await supabase.from('homepage_videos').select('title, video_url, thumbnail_url, fallbackImage').limit(5);
  console.log(JSON.stringify(vids, null, 2));

  console.log("\n--- Categories ---");
  const { data: cats } = await supabase.from('categories').select('name, image_url').limit(5);
  console.log(JSON.stringify(cats, null, 2));
}
main();
