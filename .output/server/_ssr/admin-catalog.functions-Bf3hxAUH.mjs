import { c as recordType, i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType, t as anyType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-catalog.functions-Bf3hxAUH.js
var listAdminProducts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("a32abab4650c5a3b5fef5d2e251b48ad14347a9b834661483829db6b8f34e74a"));
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
var upsertProduct = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => productSchema.parse(d)).handler(createSsrRpc("74c993255a202107cc06ab7e404d3747af494495f6991406ff92d3b1a0333cf2"));
var deleteProduct = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("c9bce9eec5f43da06911222daea8b864220239a6f1e0874762facbb4e266e88d"));
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
var listProductVariants = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ product_id: stringType().uuid() }).parse(d)).handler(createSsrRpc("3d5b62df6fcbb8a302bf03a4190aa18f34ed8bae1cc7c6ae6aaf7c395b382fea"));
var saveProductVariants = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	product_id: stringType().uuid(),
	variants: arrayType(variantInputSchema)
}).parse(d)).handler(createSsrRpc("e412a378e90a591112c547ff9415fc2c5ed817cf98b5b88434dd7206648929f5"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("e34f4d2c512cd3ac4bb4151cfab2f8494d33fb710160d786fb02f31f1b7f7f1d"));
var listAdminSlides = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3539ff1a3fbac348dca9bc15e95c6e99d7743238786b63bbc05048db01b6e9c7"));
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
var upsertSlide = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => slideSchema.parse(d)).handler(createSsrRpc("96fe4ca4cd0afa7d43aa58d696dd337e407ce7bf5d5c19531cc5e9a3785d2c4b"));
var deleteSlide = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("8c8416c6f58c6a7b83ae8797fee5eeaf3981185571f1c18ada6f12336d31ba0b"));
var listAdminReviews = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("1de726e43aad0d83f0e93cc0eee40718bd143db6f6abe3782d243d6ae362399c"));
var moderateReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"approved",
		"pending",
		"rejected"
	])
}).parse(d)).handler(createSsrRpc("66ccc84383690350723e48d6016ca9050d4c00fca43fd14457e10041705e5573"));
var deleteReview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("ae23f45225762e3822cb40e28e4027976c361ccc81d08106896acaa5eaf8cac1"));
//#endregion
export { listAdminReviews as a, moderateReview as c, upsertSlide as d, listAdminProducts as i, saveProductVariants as l, deleteReview as n, listAdminSlides as o, deleteSlide as r, listProductVariants as s, deleteProduct as t, upsertProduct as u };
