import { a as products, n as getProductGallery, r as getProductVariants } from "./products-CxldZzZM.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.migrate-catalog-CXMbC-mv.js
var runMigration_createServerFn_handler = createServerRpc({
	id: "19b1f3b106f12ea0640b997bbec7a5ebd4094663a38094348aca0c2ab50f24cb",
	name: "runMigration",
	filename: "src/routes/admin.migrate-catalog.tsx"
}, (opts) => runMigration.__executeServer(opts));
var runMigration = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(runMigration_createServerFn_handler, async () => {
	const { count: beforeCount } = await supabase.from("products").select("*", {
		count: "exact",
		head: true
	});
	const allProducts = products;
	const results = {
		totalStatic: allProducts.length,
		totalBefore: beforeCount || 0,
		migrated: 0,
		errors: []
	};
	for (const p of allProducts) try {
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
			published: true
		}, { onConflict: "slug" }).select("id").single();
		if (pErr) throw new Error(`Product ${p.slug}: ${pErr.message}`);
		const productId = prodData.id;
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
	} catch (e) {
		results.errors.push(e.message);
	}
	const { count: afterCount } = await supabase.from("products").select("*", {
		count: "exact",
		head: true
	});
	return {
		...results,
		totalAfter: afterCount || 0
	};
});
//#endregion
export { runMigration_createServerFn_handler };
