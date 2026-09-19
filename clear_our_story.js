import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function run() {
  console.log("Deleting CMS data for our-story to fallback to source code using Service Role Key...");
  
  // First, verify what exists
  const { data: existingData } = await supabase.from('page_content').select('*').eq('page_slug', 'our-story');
  console.log("Found rows:", existingData?.length);
  
  const { error } = await supabase
    .from('page_content')
    .delete()
    .eq('page_slug', 'our-story');

  if (error) {
    console.error('Error deleting our-story content:', error);
  } else {
    console.log('Successfully cleared our-story content from DB so fallbacks are used.');
  }
}
run();
