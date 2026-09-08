import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');
const files = fs.readdirSync(routesDir).filter(f => f.startsWith('admin.') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  if (content.includes('supabase.storage.from("media").upload(') || content.includes("supabase.storage.from('media').upload(")) {
    // Inject import
    if (!content.includes('uploadToCloudinary')) {
      content = content.replace('import { supabase } from "@/integrations/supabase/client";', 
        'import { supabase } from "@/integrations/supabase/client";\nimport { uploadToCloudinary } from "@/lib/cloudinary-upload";');
    }

    // Replace upload block
    // We are replacing lines like:
    // const ext = file.name.split(".").pop();
    // const path = `heritage/media_${Date.now()}.${ext}`;
    // const { data, error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
    // if (error) throw error;
    // const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
    // setM({ ...m, media_url: pubData.publicUrl });
    
    // It's too complex to regex robustly, so we'll just do manual replacement since there are only a few.
    // I'll log them out and modify them manually if needed, or just let the user know.
    console.log(`Found upload in ${file}`);
  }
}
