import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data, error } = await supabase.from('homepage_sections').select('section_type, content');
  if (error) console.error("Error:", error);
  else {
    const featured = data.find(d => d.content && typeof d.content === 'object' && JSON.stringify(d.content).includes('ajwain-honey'));
    console.log("Section containing Ajwain:", featured?.section_type);
    if (featured) {
      console.log("Content:", JSON.stringify(featured.content, null, 2));
    } else {
      console.log("No hardcoded Ajwain found in homepage_sections");
    }
  }
}
main();
