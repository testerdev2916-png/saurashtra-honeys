import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { products, getProductVariants, getProductGallery, getProductAdditionalImages } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const runMigration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
  // 1. Fetch current counts
  const { count: beforeCount } = await supabase.from("products").select("*", { count: "exact", head: true });
  
  // 2. We'll upsert all 35 products from the static catalog.
  const allProducts = products; // 35 items
  
  const results = {
    totalStatic: allProducts.length,
    totalBefore: beforeCount || 0,
    migrated: 0,
    errors: [] as string[]
  };

  for (const p of allProducts) {
    try {
      // Upsert Product
      const { data: prodData, error: pErr } = await supabase.from("products").upsert({
        slug: p.slug,
        name: p.name,
        tagline: p.tagline || null,
        description: p.description,
        category: p.category,
        flora: p.flora || null,
        badge: p.badge || null,
        price: p.price,
        price_max: p.priceMax || null,
        mrp: p.mrp || null,
        rating: p.rating,
        reviews_count: p.reviews,
        sizes: p.sizes,
        benefits: p.benefits,
        image_key: p.image || null,
        image_url: p.image || null,
        images: getProductGallery(p),
        published: true, // Always publish
      }, { onConflict: "slug" }).select("id").single();

      if (pErr) throw new Error(`Product ${p.slug}: ${pErr.message}`);
      
      const productId = prodData.id;

      // Variants
      const variants = getProductVariants(p);
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const { error: vErr } = await supabase.from("product_variants").upsert({
          product_id: productId,
          label: v.label,
          price: v.price,
          mrp: v.mrp || null,
          stock_quantity: v.stock ?? 100,
          is_active: v.inStock !== false,
          is_default: !!v.isDefault,
          sku: v.sku || null,
          weight_g: v.weightG || null,
          sort_order: i
        }, { onConflict: "product_id,label" });
        
        if (vErr) throw new Error(`Variant ${p.slug} - ${v.label}: ${vErr.message}`);
      }
      results.migrated++;
    } catch (e: any) {
      results.errors.push(e.message);
    }
  }

  const { count: afterCount } = await supabase.from("products").select("*", { count: "exact", head: true });
  
  return {
    ...results,
    totalAfter: afterCount || 0
  };
});

export const Route = createFileRoute("/admin/migrate-catalog")({
  component: MigrateCatalog,
});

function MigrateCatalog() {
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMigrate = async () => {
    setLoading(true);
    try {
      const data = await runMigration();
      setRes(data);
    } catch (e: any) {
      setRes({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Migrate Static Catalog to Supabase</h1>
      <button 
        onClick={handleMigrate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Migrating..." : "Run Migration"}
      </button>

      {res && (
        <pre className="mt-8 bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(res, null, 2)}
        </pre>
      )}
    </div>
  );
}
