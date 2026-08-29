import { supabase } from "../src/integrations/supabase/client";
import { products, getProductVariants, getProductGallery, getProductAdditionalImages } from "../src/lib/products";

async function seedProducts() {
  console.log("Checking for existing products in Supabase...");
  
  const { data: existing, error } = await supabase.from("products").select("slug");
  
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  const existingSlugs = new Set(existing?.map((p: any) => p.slug) || []);
  
  let addedCount = 0;
  
  for (const product of products) {
    if (existingSlugs.has(product.slug)) {
      console.log(`Product ${product.slug} already exists. Skipping...`);
      continue;
    }
    
    console.log(`Adding ${product.slug}...`);
    
    const gallery = getProductGallery(product);
    const additional = getProductAdditionalImages(product);
    
    const imageUrl = gallery[0] || product.image || "";
    
    const dbProduct = {
      slug: product.slug,
      name: product.name,
      tagline: product.tagline || null,
      description: product.description || null,
      category: product.category || null,
      flora: product.flora || null,
      badge: product.badge || null,
      price: product.price,
      price_max: product.priceMax || null,
      mrp: product.mrp || null,
      rating: product.rating,
      reviews_count: product.reviews,
      sizes: product.sizes,
      benefits: product.benefits,
      image_key: null,
      image_url: imageUrl, 
      images: gallery,
      stock_quantity: 100,
      in_stock: true,
      published: true,
      status: 'published'
    };
    
    const { data: inserted, error: insertError } = await supabase.from("products").insert(dbProduct).select("id").single();
    
    if (insertError) {
      console.error(`Failed to insert product ${product.slug}:`, insertError);
      continue;
    }
    
    const productId = inserted.id;
    const variants = getProductVariants(product);
    
    const dbVariants = variants.map(v => ({
      product_id: productId,
      label: v.label,
      price: v.price,
      mrp: v.mrp || null,
      stock_quantity: v.stock || 100,
      is_active: true,
      is_default: v.isDefault || false,
      sku: v.sku || null,
      weight_g: v.weightG || null
    }));
    
    const { error: variantsError } = await supabase.from("product_variants").insert(dbVariants);
    if (variantsError) {
      console.error(`Failed to insert variants for ${product.slug}:`, variantsError);
    }
    
    addedCount++;
  }
  
  console.log(`Seed complete. Added ${addedCount} products.`);
}

seedProducts().catch(console.error);
