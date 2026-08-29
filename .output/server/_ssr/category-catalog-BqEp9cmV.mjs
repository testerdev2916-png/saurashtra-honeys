import { a as honeycomb_bees_default, f as prod_giftpack_default, g as prod_lychee_default, p as prod_honeycomb_default } from "./team-beekeepers-DfClHD0g.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { i as resolveImage, r as hero_honey_default } from "./product-images-CLm3Xqgk.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { t as hero_products_default } from "./hero-products-Bb1IPyNq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category-catalog-BqEp9cmV.js
var mortar_herbs_default = "/assets/mortar-herbs-D6gNKyKY.jpg";
var listPublicCategoriesFn_createServerFn_handler = createServerRpc({
	id: "0ecc0eed542cf92ebb78d194ee7f8f39b0568a7fadc9b3a725d906dbad6ebfdd",
	name: "listPublicCategoriesFn",
	filename: "src/lib/category-catalog.ts"
}, (opts) => listPublicCategoriesFn.__executeServer(opts));
var listPublicCategoriesFn = createServerFn({ method: "POST" }).handler(listPublicCategoriesFn_createServerFn_handler, async () => {
	const mapCategory = (c) => {
		let fallback = hero_products_default;
		if (c.slug === "honey") fallback = hero_honey_default;
		else if (c.slug === "beeswax") fallback = prod_honeycomb_default;
		else if (c.slug === "bee-pollen") fallback = mortar_herbs_default;
		else if (c.slug === "beeswax-candles") fallback = honeycomb_bees_default;
		else if (c.slug === "premium-gift-pack" || c.slug === "gift-hampers") fallback = prod_giftpack_default;
		else if (c.slug === "beauty-products") fallback = prod_lychee_default;
		if (!c.image_url) console.warn("CATEGORY IMAGE MISSING", {
			slug: c.slug,
			name: c.name,
			image_url: c.image_url,
			source: "database/cache"
		});
		const resolvedImg = resolveImage(null, c.image_url, fallback, c.updated_at);
		console.log("[CATEGORY FINAL IMAGE]", {
			slug: c.slug,
			name: c.name,
			image_url: resolvedImg
		});
		return {
			...c,
			image_url: resolvedImg
		};
	};
	const { data, error } = await supabase.from("categories").select("id, slug, name, image_url, parent_id, sort_order, active, updated_at").eq("active", true).order("sort_order", { ascending: true }).order("name", { ascending: true });
	if (error && error.code === "42501") {
		const { data: prodData } = await supabase.from("products").select("category");
		if (prodData) {
			const uniqueCats = [...new Set(prodData.map((p) => p.category).filter(Boolean))];
			const sortOrder = [
				"All Products",
				"Honey",
				"Beeswax",
				"Bee Pollen",
				"Beeswax Candles",
				"Beauty Products"
			];
			const dynamicCats = [{
				id: "all-products",
				slug: "all-products",
				name: "All Products",
				image_url: null,
				parent_id: null,
				sort_order: 0,
				active: true
			}];
			uniqueCats.forEach((name) => {
				const strName = name;
				const slug = strName.toLowerCase().replace(/\s+/g, "-");
				dynamicCats.push({
					id: slug,
					slug,
					name: strName,
					image_url: null,
					parent_id: null,
					sort_order: sortOrder.indexOf(strName) !== -1 ? sortOrder.indexOf(strName) + 1 : 99,
					active: true
				});
			});
			const finalCats = dynamicCats.map(mapCategory).sort((a, b) => a.sort_order - b.sort_order);
			if (!finalCats.find((c) => c.slug === "gift-hamper" || c.slug === "gift-hampers")) finalCats.push({
				id: "gift-hamper",
				slug: "gift-hamper",
				name: "Gift Hamper",
				image_url: prod_giftpack_default,
				parent_id: null,
				sort_order: 99,
				active: true
			});
			console.log("[CATEGORY PIPELINE]", {
				source: "PRODUCTS_FALLBACK (42501)",
				categories: finalCats
			});
			return finalCats;
		}
	}
	if (error && error.code !== "42501") console.error("Failed to fetch categories from Supabase:", error);
	const finalCats = (data || []).map(mapCategory);
	if (!finalCats.find((c) => c.slug === "gift-hamper" || c.slug === "gift-hampers")) finalCats.push({
		id: "gift-hamper",
		slug: "gift-hamper",
		name: "Gift Hamper",
		image_url: prod_giftpack_default,
		parent_id: null,
		sort_order: 99,
		active: true
	});
	console.log("[CATEGORY PIPELINE]", {
		source: "SUPABASE_DB",
		categories: finalCats
	});
	return finalCats;
});
//#endregion
export { listPublicCategoriesFn_createServerFn_handler };
