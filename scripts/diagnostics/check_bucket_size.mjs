import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.storage.from('media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' }});
  if (error) {
    console.error(error);
    return;
  }
  let total = 0;
  for (const file of data) {
    if (file.metadata && file.metadata.size) {
      total += file.metadata.size;
      console.log(`${file.name}: ${(file.metadata.size / 1024 / 1024).toFixed(2)} MB`);
    }
  }
  console.log(`Total of last 100 files: ${(total / 1024 / 1024).toFixed(2)} MB`);
}
run();
