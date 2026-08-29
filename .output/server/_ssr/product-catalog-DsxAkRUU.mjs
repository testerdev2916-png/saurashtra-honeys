import { a as products } from "./products-CxldZzZM.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { i as resolveImage } from "./product-images-CLm3Xqgk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-catalog-DsxAkRUU.js
function fallbackImage(slug) {
	return products.find((p) => p.slug === slug)?.image ?? "";
}
function toProduct(r, varMap) {
	const dbVariants = r.id && varMap ? varMap.get(r.id) : void 0;
	const mappedVariants = dbVariants && dbVariants.length > 0 ? dbVariants.map((v) => ({
		id: v.id,
		label: v.label,
		price: v.price,
		mrp: v.mrp ?? void 0,
		stock: v.stock_quantity ?? 100,
		inStock: v.is_active !== false && (v.stock_quantity ?? 100) > 0,
		isDefault: !!v.is_default,
		sku: v.sku ?? void 0,
		weightG: v.weight_g ?? void 0
	})) : void 0;
	const activeSizes = mappedVariants && mappedVariants.length > 0 ? mappedVariants.map((v) => v.label) : Array.isArray(r.sizes) ? r.sizes : [];
	const defaultVariant = mappedVariants && mappedVariants.length > 0 ? mappedVariants.find((v) => v.isDefault) || mappedVariants[0] : void 0;
	const staticMatch = products.find((p) => p.slug === r.slug);
	const rawImages = Array.isArray(r.images) ? r.images.filter((u) => typeof u === "string" && u.trim().length > 0) : [];
	const galleryImages = rawImages.length > 0 ? Array.from(new Set(rawImages)).slice(0, 9).map((img) => resolveImage(img, null, fallbackImage(r.slug), r.updated_at)) : staticMatch?.images;
	const primaryImg = resolveImage(r.image_key, r.image_url, galleryImages && galleryImages.length > 0 ? galleryImages[0] : fallbackImage(r.slug), r.updated_at);
	const rawAdditional = Array.isArray(r.additional_images) ? r.additional_images.filter((u) => typeof u === "string" && u.trim().length > 0) : r.attributes && typeof r.attributes === "object" && Array.isArray(r.attributes.additional_images) ? r.attributes.additional_images.filter((u) => typeof u === "string" && u.trim().length > 0) : [];
	const additionalImages = rawAdditional.length > 0 ? Array.from(new Set(rawAdditional)).slice(0, 8).map((img) => resolveImage(img, null, fallbackImage(r.slug), r.updated_at)) : staticMatch?.additionalImages;
	return {
		slug: r.slug,
		name: r.name,
		tagline: r.tagline ?? "",
		description: r.description ?? "",
		category: r.category ?? "Honey",
		flora: r.flora ?? void 0,
		badge: r.badge ?? void 0,
		price: defaultVariant ? defaultVariant.price : r.price,
		priceMax: r.price_max ?? void 0,
		mrp: defaultVariant ? defaultVariant.mrp : r.mrp ?? void 0,
		rating: typeof r.rating === "string" ? Number(r.rating) : r.rating,
		reviews: r.reviews_count,
		sizes: activeSizes,
		variants: mappedVariants,
		benefits: Array.isArray(r.benefits) ? r.benefits : [],
		image: primaryImg,
		images: galleryImages,
		additionalImages,
		attributes: r.attributes && typeof r.attributes === "object" ? r.attributes : void 0,
		showOnHomepage: !!r.show_on_homepage,
		updatedAt: r.updated_at
	};
}
async function fetchAllVariantsMap() {
	try {
		const { data: vData } = await supabase.from("product_variants").select("id,product_id,label,price,mrp,stock_quantity,is_active,is_default,sku,sort_order,weight_g").order("sort_order", { ascending: true });
		if (vData && Array.isArray(vData)) {
			const varMap = /* @__PURE__ */ new Map();
			for (const v of vData) {
				if (!varMap.has(v.product_id)) varMap.set(v.product_id, []);
				varMap.get(v.product_id).push(v);
			}
			return varMap;
		}
	} catch {}
}
async function fetchProducts() {
	try {
		const { data, error } = await supabase.from("products").select("id,slug,name,tagline,description,category,flora,badge,price,price_max,mrp,rating,reviews_count,sizes,benefits,image_key,image_url,images,attributes,show_on_homepage,updated_at").eq("status", "published").order("sort_order", { ascending: true });
		if (error) {
			console.error("[fetchProducts] Supabase error:", error);
			throw error;
		}
		if (!data || data.length === 0) {
			console.warn("[fetchProducts] No products found in Supabase. Returning empty array.");
			return [];
		}
		const varMap = await fetchAllVariantsMap();
		return data.map((r) => toProduct(r, varMap));
	} catch (err) {
		console.error("[fetchProducts] Exception:", err);
		throw err;
	}
}
async function fetchProduct(rawSlug) {
	const slug = decodeURIComponent(rawSlug).trim().replace(/\/+$/, "");
	try {
		const { data, error } = await supabase.from("products").select("id,slug,name,tagline,description,category,flora,badge,price,price_max,mrp,rating,reviews_count,sizes,benefits,image_key,image_url,images,attributes,show_on_homepage,updated_at").eq("slug", slug).maybeSingle();
		if (error) {
			console.error("[fetchProduct] Supabase error:", error);
			throw error;
		}
		if (!data) return null;
		return toProduct(data, await fetchAllVariantsMap());
	} catch (err) {
		console.error("[fetchProduct] Exception:", err);
		throw err;
	}
}
//#endregion
export { fetchProducts as n, fetchProduct as t };
