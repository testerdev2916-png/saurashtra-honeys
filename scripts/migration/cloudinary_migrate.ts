import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Setup Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// Setup Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BUCKET = 'media';
const CLOUDINARY_ROOT_FOLDER = 'saurashtra-honey';

async function listAllFiles(currentPath = ''): Promise<string[]> {
  let allFiles: string[] = [];
  const { data, error } = await supabase.storage.from(BUCKET).list(currentPath, { limit: 1000 });
  if (error) {
    console.error(`Error listing path ${currentPath}:`, error);
    return allFiles;
  }
  for (const item of data) {
    if (item.id === null) {
      // It's a folder
      const folderPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      const subFiles = await listAllFiles(folderPath);
      allFiles = allFiles.concat(subFiles);
    } else {
      // It's a file, ignore empty placeholders
      if (item.name === '.emptyFolderPlaceholder') continue;
      
      const filePath = currentPath ? `${currentPath}/${item.name}` : item.name;
      allFiles.push(filePath);
    }
  }
  return allFiles;
}

async function migrate() {
  console.log("Fetching files from Supabase...");
  const files = await listAllFiles();
  console.log(`Found ${files.length} files to migrate.`);

  const migrationMap: Record<string, { public_id: string, secure_url: string }> = {};
  let successCount = 0;
  let failCount = 0;

  for (const filePath of files) {
    try {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const supabaseUrl = data.publicUrl;

      // Extract filename without extension for public_id
      const ext = path.extname(filePath);
      const basePath = filePath.substring(0, filePath.length - ext.length);
      const publicId = `${CLOUDINARY_ROOT_FOLDER}/${basePath}`;

      console.log(`Uploading: ${filePath}`);
      const uploadResult = await cloudinary.uploader.upload(supabaseUrl, {
        public_id: publicId,
        resource_type: "auto",
        overwrite: true,
      });

      migrationMap[supabaseUrl] = {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
      };
      
      // Also save mapping for encoded URL just in case DB has URL encoded spaces
      const encodedSupabaseUrl = supabaseUrl.replace(/ /g, '%20');
      if (encodedSupabaseUrl !== supabaseUrl) {
          migrationMap[encodedSupabaseUrl] = {
              public_id: uploadResult.public_id,
              secure_url: uploadResult.secure_url,
          };
      }
      
      successCount++;
    } catch (err) {
      console.error(`Failed to upload ${filePath}:`, err);
      failCount++;
    }
  }

  fs.writeFileSync('scripts/migration/migration_map.json', JSON.stringify(migrationMap, null, 2));
  console.log(`\nMigration completed!`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Map saved to scripts/migration/migration_map.json`);
}

runMigration('product-images').catch(console.error);
