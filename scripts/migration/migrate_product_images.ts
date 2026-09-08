import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!);

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function run() {
  const mapPath = 'scripts/migration/migration_map.json';
  const migrationMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

  const bucket = 'product-images';
  const { data: files, error } = await supabase.storage.from(bucket).list();
  if (error) throw error;

  for (const file of files || []) {
    if (file.name === '.emptyFolderPlaceholder') continue;

    const filePath = file.name;
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    console.log(`Uploading ${publicUrl}...`);
    try {
      const uploadResult = await cloudinary.uploader.upload(publicUrl, {
        folder: `saurashtra-honey/${bucket}`,
        resource_type: 'auto',
      });
      console.log(`Success: ${uploadResult.secure_url}`);
      migrationMap[publicUrl] = { secure_url: uploadResult.secure_url };
    } catch (err: any) {
      console.error(`Failed ${publicUrl}:`, err.message);
    }
  }

  fs.writeFileSync(mapPath, JSON.stringify(migrationMap, null, 2));
  console.log('product-images migration done.');
}

run().catch(console.error);
