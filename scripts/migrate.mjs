import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE credentials. Make sure you run with --env-file=.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const productsPath = path.join(__dirname, '..', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const assetsDir = path.join(__dirname, '..', 'src', 'assets');

async function uploadImage(filename) {
    if (!filename) return null;
    const filePath = path.join(assetsDir, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return null;
    }
    
    const fileBuf = fs.readFileSync(filePath);
    const contentType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
    
    const { error } = await supabase.storage.from('product_images').upload(`legacy/${filename}`, fileBuf, {
        upsert: true,
        contentType: contentType
    });
    
    if (error) {
        console.error("Failed to upload", filename, error.message);
        return null;
    }
    
    return `legacy/${filename}`;
}

async function run() {
    let migratedCount = 0;
    console.log(`Starting migration of ${products.length} products...`);
    
    for (const p of products) {
        process.stdout.write(`Migrating ${p.slug}... `);
        
        // 1. Upload images
        const mainImgKey = await uploadImage(p.image);
        const imagesKeys = [];
        for (const img of (p.images || [])) {
            const key = await uploadImage(img);
            if (key) imagesKeys.push(key);
        }
        const additionalKeys = [];
        for (const img of (p.additionalImages || [])) {
            const key = await uploadImage(img);
            if (key) additionalKeys.push(key);
        }
        
        // 2. Insert product
        const { data: prodData, error: pErr } = await supabase.from('products').upsert({
            slug: p.slug,
            name: p.name,
            tagline: p.tagline || null,
            description: p.description || null,
            category: p.category || null,
            flora: p.flora || null,
            badge: p.badge || null,
            price: p.price,
            price_max: p.priceMax || null,
            mrp: p.mrp || null,
            rating: p.rating || 0,
            reviews_count: p.reviews || 0,
            sizes: p.sizes || [],
            benefits: p.benefits || [],
            image_key: mainImgKey,
            image_url: mainImgKey ? supabase.storage.from('product_images').getPublicUrl(mainImgKey).data.publicUrl : null,
            images: imagesKeys,
            additional_images: additionalKeys,
            attributes: p.attributes || null,
            published: true
        }, { onConflict: 'slug' }).select('id').single();
        
        if (pErr) {
            console.error(`\nError inserting product ${p.slug}:`, pErr.message);
            continue;
        }
        
        // 3. Insert variants
        for (let i = 0; i < p.variants.length; i++) {
            const v = p.variants[i];
            const { error: vErr } = await supabase.from('product_variants').upsert({
                product_id: prodData.id,
                label: v.label,
                price: v.price,
                mrp: v.mrp || null,
                stock_quantity: v.stock || 100,
                is_active: v.inStock !== false,
                is_default: !!v.isDefault,
                sku: v.sku || null,
                weight_g: v.weightG || null,
                sort_order: i
            }, { onConflict: 'product_id,label' });
            
            if (vErr) {
                console.error(`\nError inserting variant ${v.label} for ${p.slug}:`, vErr.message);
            }
        }
        migratedCount++;
        console.log(`OK`);
    }
    
    console.log(`\nSuccessfully migrated ${migratedCount} products.`);
    
    // Summary report
    const { count: totalProds } = await supabase.from('products').select('*', { count: 'exact', head: true });
    console.log(`Total Products in Supabase: ${totalProds}`);
}

run();
