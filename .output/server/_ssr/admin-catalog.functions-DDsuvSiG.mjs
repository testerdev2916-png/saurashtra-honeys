import { c as recordType, i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType, t as anyType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-catalog.functions-DDsuvSiG.js
async function assertAdmin(supabase, userId) {
	const { data, error } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden: admin role required");
}
var listAdminProducts_createServerFn_handler = createServerRpc({
	id: "a32abab4650c5a3b5fef5d2e251b48ad14347a9b834661483829db6b8f34e74a",
	name: "listAdminProducts",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => listAdminProducts.__executeServer(opts));
var listAdminProducts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listAdminProducts_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("products").select("*").order("sort_order", { ascending: true });
	if (error) throw new Error(error.message);
	return { rows: (data ?? []).map((row) => {
		const attrs = row.attributes || {};
		return {
			...row,
			additional_images: Array.isArray(attrs.additional_images) ? attrs.additional_images : []
		};
	}) };
});
var productSchema = objectType({
	id: stringType().uuid().optional(),
	slug: stringType().min(2).max(120),
	name: stringType().min(1).max(200),
	tagline: stringType().max(300).nullable().optional(),
	description: stringType().max(4e3).nullable().optional(),
	category: stringType().max(60).nullable().optional(),
	flora: stringType().max(60).nullable().optional(),
	badge: stringType().max(40).nullable().optional(),
	price: numberType().int().nonnegative(),
	price_max: numberType().int().nonnegative().nullable().optional(),
	mrp: numberType().int().nonnegative().nullable().optional(),
	rating: numberType().min(0).max(5).optional(),
	reviews_count: numberType().int().nonnegative().optional(),
	sizes: arrayType(stringType()).default([]),
	benefits: arrayType(stringType()).default([]),
	image_key: stringType().max(120).nullable().optional(),
	image_url: stringType().max(2e3).nullable().optional(),
	images: arrayType(stringType()).optional(),
	additional_images: arrayType(stringType()).optional(),
	attributes: recordType(anyType()).optional(),
	stock_quantity: numberType().int().nonnegative().default(100),
	in_stock: booleanType().default(true),
	published: booleanType().default(true),
	sort_order: numberType().int().default(0),
	sku: stringType().max(80).nullable().optional(),
	barcode: stringType().max(80).nullable().optional(),
	brand: stringType().max(80).nullable().optional(),
	ingredients: stringType().max(4e3).nullable().optional(),
	usage_instructions: stringType().max(4e3).nullable().optional(),
	warnings: stringType().max(2e3).nullable().optional(),
	cost_price_paise: numberType().int().nonnegative().nullable().optional(),
	gst_percent: numberType().min(0).max(50).nullable().optional(),
	hsn_code: stringType().max(40).nullable().optional(),
	weight_g: numberType().int().nonnegative().nullable().optional(),
	low_stock_limit: numberType().int().nonnegative().default(5),
	status: enumType([
		"draft",
		"published",
		"archived"
	]).default("published"),
	is_featured: booleanType().default(false),
	is_bestseller: booleanType().default(false),
	is_new_arrival: booleanType().default(false),
	show_on_homepage: booleanType().default(false),
	images: arrayType(stringType().max(2e3)).default([]),
	additional_images: arrayType(stringType().max(2e3)).default([]).optional(),
	video_url: stringType().max(2e3).nullable().optional(),
	meta_title: stringType().max(200).nullable().optional(),
	meta_description: stringType().max(400).nullable().optional(),
	meta_keywords: stringType().max(400).nullable().optional(),
	canonical_url: stringType().max(2e3).nullable().optional(),
	attributes: recordType(stringType(), anyType()).optional()
});
var upsertProduct_createServerFn_handler = createServerRpc({
	id: "74c993255a202107cc06ab7e404d3747af494495f6991406ff92d3b1a0333cf2",
	name: "upsertProduct",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => upsertProduct.__executeServer(opts));
var upsertProduct = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => productSchema.parse(d)).handler(upsertProduct_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { id, ...rest } = data;
	if (rest.images && Array.isArray(rest.images) && rest.images.length > 0) {
		const validPrimary = rest.images.find((img) => typeof img === "string" && img.trim() !== "");
		if (validPrimary) rest.image_url = validPrimary;
	}
	const attrs = { ...rest.attributes || {} };
	if (rest.additional_images) attrs.additional_images = rest.additional_images;
	rest.attributes = attrs;
	delete rest.additional_images;
	console.log("Saving product payload:", JSON.stringify({
		images: rest.images,
		attrs: rest.attributes
	}));
	if (id) {
		const { data: updated, error } = await context.supabase.from("products").update(rest).eq("id", id).select("id").single();
		if (error) {
			console.error("Supabase update error:", error);
			throw new Error(error.message);
		}
		return {
			ok: true,
			id: updated?.id || id
		};
	}
	const { data: inserted, error } = await context.supabase.from("products").insert(rest).select("id").single();
	if (error) throw new Error(error.message);
	return {
		ok: true,
		id: inserted?.id
	};
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "c9bce9eec5f43da06911222daea8b864220239a6f1e0874762facbb4e266e88d",
	name: "deleteProduct",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteProduct_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { data: product, error: fetchErr } = await context.supabase.from("products").select("slug, image_url, images, attributes").eq("id", data.id).single();
	if (fetchErr && fetchErr.code !== "PGRST116") throw new Error(fetchErr.message);
	if (product) {
		const allImages = /* @__PURE__ */ new Set();
		if (product.image_url) allImages.add(product.image_url);
		if (Array.isArray(product.images)) product.images.forEach((img) => typeof img === "string" && allImages.add(img));
		if (product.attributes && Array.isArray(product.attributes.additional_images)) product.attributes.additional_images.forEach((img) => typeof img === "string" && allImages.add(img));
		const pathsToRemove = Array.from(allImages).filter((url) => url.includes("/storage/v1/object/public/media/")).map((url) => url.split("/storage/v1/object/public/media/")[1]).filter(Boolean);
		if (pathsToRemove.length > 0) await context.supabase.storage.from("media").remove(pathsToRemove);
		await context.supabase.from("reviews").delete().eq("product_slug", product.slug);
		await context.supabase.from("wishlists").delete().eq("product_slug", product.slug);
	}
	const { data: deletedRow, error } = await context.supabase.from("products").delete().eq("id", data.id).select("id").maybeSingle();
	if (error) throw new Error("Unable to permanently delete product: " + error.message);
	if (!deletedRow) throw new Error("Product was not deleted (it may not exist or you lack permission).");
	return { ok: true };
});
var variantInputSchema = objectType({
	id: stringType().uuid().optional(),
	product_id: stringType().uuid(),
	label: stringType().min(1, "Size/Label is required"),
	weight_g: numberType().nullable().optional(),
	price: numberType().int().nonnegative(),
	mrp: numberType().int().nullable().optional(),
	cost_price: numberType().int().nullable().optional(),
	stock_quantity: numberType().int().default(0),
	low_stock_threshold: numberType().int().default(5),
	sku: stringType().nullable().optional(),
	barcode: stringType().nullable().optional(),
	is_default: booleanType().default(false),
	is_active: booleanType().default(true),
	sort_order: numberType().int().default(0)
});
var listProductVariants_createServerFn_handler = createServerRpc({
	id: "3d5b62df6fcbb8a302bf03a4190aa18f34ed8bae1cc7c6ae6aaf7c395b382fea",
	name: "listProductVariants",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => listProductVariants.__executeServer(opts));
var listProductVariants = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ product_id: stringType().uuid() }).parse(d)).handler(listProductVariants_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { data: rows, error } = await context.supabase.from("product_variants").select("*").eq("product_id", data.product_id).order("sort_order", { ascending: true });
	if (error) {
		if (error.message.includes("does not exist")) return { rows: [] };
		throw new Error(error.message);
	}
	return { rows: rows || [] };
});
var saveProductVariants_createServerFn_handler = createServerRpc({
	id: "e412a378e90a591112c547ff9415fc2c5ed817cf98b5b88434dd7206648929f5",
	name: "saveProductVariants",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => saveProductVariants.__executeServer(opts));
var saveProductVariants = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	product_id: stringType().uuid(),
	variants: arrayType(variantInputSchema)
}).parse(d)).handler(saveProductVariants_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { product_id, variants } = data;
	let hasDefault = false;
	const normalized = variants.map((v, i) => {
		let isDefault = !!v.is_default;
		if (isDefault) if (hasDefault) isDefault = false;
		else hasDefault = true;
		return {
			...v,
			is_default: isDefault,
			sort_order: i
		};
	});
	if (!hasDefault && normalized.length > 0) normalized[0].is_default = true;
	const { data: existing } = await context.supabase.from("product_variants").select("id").eq("product_id", product_id);
	const existingIds = new Set((existing || []).map((x) => x.id));
	const incomingIds = new Set(normalized.map((x) => x.id).filter(Boolean));
	const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
	if (toDelete.length > 0) {
		const { error: delErr } = await context.supabase.from("product_variants").delete().in("id", toDelete);
		if (delErr) throw new Error(delErr.message);
	}
	await context.supabase.from("product_variants").update({ is_default: false }).eq("product_id", product_id);
	const results = [];
	for (const v of normalized) if (v.id) {
		const { id, ...rest } = v;
		const { data: updated, error: updErr } = await context.supabase.from("product_variants").update(rest).eq("id", id).select("*").single();
		if (updErr) throw new Error(updErr.message);
		results.push(updated);
	} else {
		const { data: inserted, error: insErr } = await context.supabase.from("product_variants").insert(v).select("*").single();
		if (insErr) throw new Error(insErr.message);
		results.push(inserted);
	}
	const defaultVar = results.find((x) => x.is_default) || results[0];
	if (defaultVar) {
		const activeLabels = results.filter((x) => x.is_active).map((x) => x.label);
		const totalStock = results.filter((x) => x.is_active).reduce((sum, x) => sum + (x.stock_quantity || 0), 0);
		await context.supabase.from("products").update({
			price: defaultVar.price,
			mrp: defaultVar.mrp,
			stock_quantity: totalStock,
			sku: defaultVar.sku,
			weight_g: defaultVar.weight_g,
			sizes: activeLabels,
			in_stock: totalStock > 0
		}).eq("id", product_id);
	}
	return {
		ok: true,
		variants: results
	};
});
var deleteProductVariant_createServerFn_handler = createServerRpc({
	id: "e34f4d2c512cd3ac4bb4151cfab2f8494d33fb710160d786fb02f31f1b7f7f1d",
	name: "deleteProductVariant",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => deleteProductVariant.__executeServer(opts));
var deleteProductVariant = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteProductVariant_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { error } = await context.supabase.from("product_variants").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listAdminSlides_createServerFn_handler = createServerRpc({
	id: "3539ff1a3fbac348dca9bc15e95c6e99d7743238786b63bbc05048db01b6e9c7",
	name: "listAdminSlides",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => listAdminSlides.__executeServer(opts));
var listAdminSlides = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listAdminSlides_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("hero_slides").select("*").order("page", { ascending: true }).order("sort_order", { ascending: true });
	if (error) throw new Error(error.message);
	return { rows: data ?? [] };
});
var slideSchema = objectType({
	id: stringType().uuid().optional(),
	page: stringType().min(1).max(40).default("home"),
	eyebrow: stringType().max(120).nullable().optional(),
	title: stringType().min(1, "Title is required for Admin / SEO").max(120),
	subtitle: stringType().max(300).nullable().optional(),
	image_key: stringType().max(120).nullable().optional(),
	image_url: stringType().max(2e3).nullable().optional(),
	mobile_image_url: stringType().max(2e3).nullable().optional(),
	cta_label: stringType().max(60).nullable().optional(),
	cta_href: stringType().min(1).max(300).default("/shop"),
	sort_order: numberType().int().default(0),
	active: booleanType().default(true)
});
var upsertSlide_createServerFn_handler = createServerRpc({
	id: "96fe4ca4cd0afa7d43aa58d696dd337e407ce7bf5d5c19531cc5e9a3785d2c4b",
	name: "upsertSlide",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => upsertSlide.__executeServer(opts));
var upsertSlide = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => slideSchema.parse(d)).handler(upsertSlide_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { data: { session } } = await context.supabase.auth.getSession();
	const { data: { user }, error: userError } = await context.supabase.auth.getUser();
	console.log("[HERO_SAVE_AUTH]", {
		hasSession: !!session,
		userId: user?.id,
		email: user?.email,
		accessTokenExists: !!session?.access_token,
		userError
	});
	const { id, ...rest } = data;
	console.log("[HERO_SAVE_START]", {
		operation: id ? "UPDATE" : "INSERT",
		table: "hero_slides",
		userId: user?.id
	});
	if (id) {
		const result = await context.supabase.from("hero_slides").update(rest).eq("id", id);
		console.log("[HERO_SAVE_RESULT]", {
			data: result.data,
			error: result.error
		});
		if (result.error) throw new Error(result.error.message);
		return { ok: true };
	}
	const result = await context.supabase.from("hero_slides").insert(rest);
	console.log("[HERO_SAVE_RESULT]", {
		data: result.data,
		error: result.error
	});
	if (result.error) throw new Error(result.error.message);
	return { ok: true };
});
var deleteSlide_createServerFn_handler = createServerRpc({
	id: "8c8416c6f58c6a7b83ae8797fee5eeaf3981185571f1c18ada6f12336d31ba0b",
	name: "deleteSlide",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => deleteSlide.__executeServer(opts));
var deleteSlide = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteSlide_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { error } = await context.supabase.from("hero_slides").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listAdminReviews_createServerFn_handler = createServerRpc({
	id: "1de726e43aad0d83f0e93cc0eee40718bd143db6f6abe3782d243d6ae362399c",
	name: "listAdminReviews",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => listAdminReviews.__executeServer(opts));
var listAdminReviews = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(listAdminReviews_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	let q = context.supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(500);
	if (data.status && data.status !== "all") q = q.eq("status", data.status);
	if (data.product_slug) q = q.eq("product_slug", data.product_slug);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	return { rows: rows ?? [] };
});
var moderateReview_createServerFn_handler = createServerRpc({
	id: "66ccc84383690350723e48d6016ca9050d4c00fca43fd14457e10041705e5573",
	name: "moderateReview",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => moderateReview.__executeServer(opts));
var moderateReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"approved",
		"pending",
		"rejected"
	])
}).parse(d)).handler(moderateReview_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { error } = await context.supabase.from("reviews").update({ status: data.status }).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteReview_createServerFn_handler = createServerRpc({
	id: "ae23f45225762e3822cb40e28e4027976c361ccc81d08106896acaa5eaf8cac1",
	name: "deleteReview",
	filename: "src/lib/admin-catalog.functions.ts"
}, (opts) => deleteReview.__executeServer(opts));
var deleteReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteReview_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { error } = await context.supabase.from("reviews").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { deleteProductVariant_createServerFn_handler, deleteProduct_createServerFn_handler, deleteReview_createServerFn_handler, deleteSlide_createServerFn_handler, listAdminProducts_createServerFn_handler, listAdminReviews_createServerFn_handler, listAdminSlides_createServerFn_handler, listProductVariants_createServerFn_handler, moderateReview_createServerFn_handler, saveProductVariants_createServerFn_handler, upsertProduct_createServerFn_handler, upsertSlide_createServerFn_handler };
