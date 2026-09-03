import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching existing categories...");
  
  // Try fetching shop_categories. Wait, it's inside `shopCategories` array in the frontend, OR we can fetch from products and group, or maybe there's a `shop_categories` table?
  // Let's look at `category-catalog.ts` or just use the known ones for now, but I will query the products to find distinct categories if possible, or just use a predefined list.
  
  // Since we know the typical categories for this shop:
  const defaultCategories = [
    { slug: 'honey', name: 'Raw Honey' },
    { slug: 'beeswax', name: 'Beeswax' },
    { slug: 'bee-pollen', name: 'Bee Pollen' },
    { slug: 'beeswax-candles', name: 'Beeswax Candles' },
    { slug: 'all-products', name: 'All Products' },
  ];

  console.log("Checking if category_hero_slides table exists...");
  const { error: tableCheckError } = await supabase.from('category_hero_slides').select('id').limit(1);
  
  if (tableCheckError) {
    console.error("❌ ERROR: The table 'category_hero_slides' does not exist or the schema cache is not updated.");
    console.error(tableCheckError.message);
    console.error("Please make sure you have run the CREATE TABLE script in your Supabase SQL Editor and reloaded the schema cache.");
    process.exit(1);
  }

  console.log("Table exists! Inserting temp slides for all categories...");

  for (const cat of defaultCategories) {
    console.log(`Inserting slide for ${cat.name}...`);
    
    // We will insert 1 temp slide per category for demonstration.
    const tempSlide = {
      category_slug: cat.slug,
      image_url: 'https://images.unsplash.com/photo-1587049352847-4d45548ceb9f?q=80&w=1920&h=600&fit=crop', // Generic Honey/Bee Image
      mobile_image_url: 'https://images.unsplash.com/photo-1587049352847-4d45548ceb9f?q=80&w=768&h=960&fit=crop',
      title: `Pure ${cat.name}`,
      subtitle: 'Experience the finest quality straight from the hive.',
      cta_label: 'Shop Now',
      cta_href: `/shop/${cat.slug}`,
      sort_order: 1,
      active: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('category_hero_slides').insert([tempSlide]);
    if (error) {
      console.error(`Failed to insert slide for ${cat.slug}:`, error.message);
    } else {
      console.log(`✅ Success for ${cat.slug}`);
    }
  }

  console.log("🎉 All temp slides inserted successfully!");
}

main().catch(console.error);
