import { i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType, u as unknownType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-cms.functions-jTsNSh7F.js
var getDashboardStats = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e24fa16b5983950541d9be7d188f36c3894c4f9209234f1d2ace2f5bf84e21a4"));
var catSchema = objectType({
	id: stringType().uuid().optional(),
	slug: stringType().min(1).max(120),
	name: stringType().min(1).max(200),
	description: stringType().max(2e3).nullable().optional(),
	image_url: stringType().max(2e3).nullable().optional(),
	parent_id: stringType().uuid().nullable().optional(),
	sort_order: numberType().int().default(0),
	active: booleanType().default(true),
	seo_title: stringType().max(200).nullable().optional(),
	seo_description: stringType().max(400).nullable().optional()
});
var listCategories = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("edc87e3ec4ecf40eced8d36b0fe24b8937ebf618ae7f49dfb31ae8cfabd7829e"));
var upsertCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => catSchema.parse(d)).handler(createSsrRpc("b2b121b427a5979ad31ae21dfbb891b925a303169501fe8ab4698dd28b5dc481"));
var deleteCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("3f2908342d69a2e00515b4e1fd791c6deb765f174db96a95608588120141b874"));
var uploadCategoryImage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	filename: stringType().min(1).max(200),
	contentType: stringType().max(120),
	base64: stringType().min(1)
}).parse(d)).handler(createSsrRpc("9640687067aeca3aa933cb654ded992daca3be85a74ca7caf0d3773500ecb0f2"));
var uploadProductImage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	filename: stringType().min(1).max(200),
	contentType: stringType().max(120),
	base64: stringType().min(1)
}).parse(d)).handler(createSsrRpc("f51589917ca7a2ceb41f7b9b8894af50f7b39f0e256fc5d9fecd10dccfb2e0cf"));
var couponSchema = objectType({
	id: stringType().uuid().optional(),
	code: stringType().min(2).max(40).transform((s) => s.toUpperCase()),
	description: stringType().max(400).nullable().optional(),
	discount_type: enumType([
		"percent",
		"fixed",
		"free_shipping"
	]),
	discount_value: numberType().int().nonnegative().default(0),
	min_order_paise: numberType().int().nonnegative().default(0),
	max_discount_paise: numberType().int().nonnegative().nullable().optional(),
	usage_limit: numberType().int().nonnegative().nullable().optional(),
	per_user_limit: numberType().int().nonnegative().nullable().optional(),
	starts_at: stringType().nullable().optional(),
	expires_at: stringType().nullable().optional(),
	active: booleanType().default(true)
});
var listCoupons = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("7b0ceb64348705be4a3068ea6d54b7956aa1dff38526696ced6ac31f8795ff2b"));
var upsertCoupon = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => couponSchema.parse(d)).handler(createSsrRpc("c8c568e348e700f0083fa535ee4b2f1aa44153c625bb32e9a5aa2b98ae2ed40e"));
var deleteCoupon = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("f91e483003604dee204ffd29bb1f2728ab6a399990cb7e81aad0740fc0fc9d25"));
var postSchema = objectType({
	id: stringType().uuid().optional(),
	slug: stringType().min(1).max(160),
	title: stringType().min(1).max(240),
	excerpt: stringType().max(500).nullable().optional(),
	body_markdown: stringType().max(2e5).nullable().optional(),
	cover_image_url: stringType().max(2e3).nullable().optional(),
	category_id: stringType().uuid().nullable().optional(),
	category_name: stringType().max(100).nullable().optional(),
	author_name: stringType().max(100).nullable().optional(),
	reading_time: stringType().max(40).nullable().optional(),
	is_featured: booleanType().default(false),
	is_popular: booleanType().default(false),
	seo_title: stringType().max(200).nullable().optional(),
	seo_description: stringType().max(400).nullable().optional(),
	tags: arrayType(stringType().max(40)).default([]),
	status: enumType([
		"draft",
		"published",
		"archived"
	]).default("draft"),
	published_at: stringType().nullable().optional()
});
var listPosts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("88c320ec17d01527aadfa1a1631af8d989c903564080eb1235677ed041a0622e"));
var upsertPost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => postSchema.parse(d)).handler(createSsrRpc("3fef4b91b7f84627d5838079f4e2fa55ef367231d21d7d48723dc8352b683ced"));
var deletePost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("8b027075e576321fb1f744c1f976eedc638c68f06d68ac326f2723a813546670"));
var listCustomers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ q: stringType().max(200).optional() }).parse(d)).handler(createSsrRpc("47ea3b511292f6e971f05571a0be6515c1a0a1c1cca8215d00a7201eee448c8a"));
var updateCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType(["active", "disabled"]).optional(),
	admin_notes: stringType().max(4e3).optional()
}).parse(d)).handler(createSsrRpc("85cfaf87342d6d2cd9a2e69511a89212f97380246712fd1d74e044422058585c"));
var listSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("2e43593af824a327896c0824a082d426e924c93ccea4ee992612c55bf1993184"));
var upsertSetting = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	key: stringType().min(1).max(80),
	value: unknownType(),
	is_public: booleanType().optional()
}).parse(d)).handler(createSsrRpc("8e48ff5c9a50cfa5966ec5649ebaf3b924920ad80259b82f60be8e3e6e559101"));
var listMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	bucket: stringType().max(60).optional(),
	q: stringType().max(200).optional()
}).parse(d)).handler(createSsrRpc("65daf30c874a3fd0d44fcbebae9ba36a090b605b90a2ba8afd3c76a5afc50a93"));
var deleteMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("f9680c8716d1f23c60f7e58ed680ac443f90d589fe37c44bff5806bad1c2b6fd"));
var uploadMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	bucket: enumType(["product-images", "media"]),
	folder: enumType([
		"logos",
		"hero",
		"banners",
		"blog",
		"avatars",
		"documents",
		"general"
	]).optional(),
	filename: stringType().min(1).max(200),
	contentType: stringType().max(120),
	base64: stringType().min(1),
	alt_text: stringType().max(300).optional()
}).parse(d)).handler(createSsrRpc("b5c6f41a6c5d53c5cc4b17decca1bd5f8949f6cdc0bef15507432625c9b55e69"));
var listUsers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3c7d0b7aca410b3bf69d2cc597f23c145b1f66021b63ed7f7cbacd04c8ac2076"));
var setUserRole = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	user_id: stringType().uuid(),
	role: enumType([
		"super_admin",
		"admin",
		"manager",
		"editor",
		"customer"
	]),
	action: enumType(["grant", "revoke"])
}).parse(d)).handler(createSsrRpc("4a59812f64644f30f68e938fb23252e407f73247548be12fd02b248782e8cfc6"));
var inviteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	email: stringType().email(),
	role: stringType().optional()
}).parse(d)).handler(createSsrRpc("55bd2d5bf97b077881e6c01501747795dae4e386321a8fa6c65b683fc16e92bf"));
var sendPasswordReset = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ email: stringType().email() }).parse(d)).handler(createSsrRpc("1dd3ceaa12fe9e85d72666b796762c8b183de8e393649c4cdfad526e72b14dd8"));
var listAudit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	q: stringType().max(120).optional(),
	entity_type: stringType().max(40).optional()
}).parse(d)).handler(createSsrRpc("f01cf910915b3c3ef9f4441a5a35b5e8df0e1ae8316bfde60851493b62862681"));
var updateOrderExtended = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType([
		"pending",
		"paid",
		"confirmed",
		"processing",
		"packed",
		"shipped",
		"delivered",
		"cancelled",
		"refunded"
	]).optional(),
	admin_notes: stringType().max(4e3).optional(),
	tracking_number: stringType().max(200).optional(),
	shipping_carrier: stringType().max(120).optional(),
	refund_amount_paise: numberType().int().nonnegative().optional()
}).parse(d)).handler(createSsrRpc("dbb2e8415d60f5c8b9cdce509a869624eb0a2ad748646e24a3fc35ac3b284119"));
var adjustStock = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	product_id: stringType().uuid(),
	change: numberType().int(),
	reason: stringType().max(400).optional()
}).parse(d)).handler(createSsrRpc("4a911bb60e691c1c617d7976bc5cbf68603fa7467e41ecddf14f66b938a15a2a"));
var homepageVideoSchema = objectType({
	id: stringType().uuid().optional(),
	title: stringType().min(1).max(200),
	subtitle: stringType().max(300).nullable().optional(),
	badge: stringType().max(100).nullable().optional(),
	video_url: stringType().max(2e3).nullable().optional(),
	thumbnail_url: stringType().max(2e3).nullable().optional(),
	product_slug: stringType().max(200).nullable().optional(),
	link_url: stringType().max(500).nullable().optional(),
	status: enumType([
		"draft",
		"published",
		"archived"
	]).default("published"),
	is_active: booleanType().default(true),
	is_featured: booleanType().default(false),
	placement: stringType().default("all"),
	display_order: numberType().int().default(0)
});
var listHomepageVideos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("e1a65a268a508134c84eabc21b22c2d69f38e81a786480bf2fda50dd68992b78"));
var upsertHomepageVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => homepageVideoSchema.parse(d)).handler(createSsrRpc("0294d84cf7d0b394492dd69e9a10663754ecfccea513d2cfc719eb1089293e30"));
var deleteHomepageVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("de90cd5686e9098a185d870b76bad851807ed28d675333d5fc953d9dbd852621"));
var reorderHomepageVideos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ items: arrayType(objectType({
	id: stringType().uuid(),
	display_order: numberType().int()
})) }).parse(d)).handler(createSsrRpc("4d41ba6d450adb22329b68437e8e06ba5556352ff3bb195c5c7479319895f263"));
//#endregion
export { upsertSetting as A, uploadCategoryImage as C, upsertCoupon as D, upsertCategory as E, upsertHomepageVideo as O, updateOrderExtended as S, uploadProductImage as T, listUsers as _, deleteMedia as a, setUserRole as b, inviteUser as c, listCoupons as d, listCustomers as f, listSettings as g, listPosts as h, deleteHomepageVideo as i, upsertPost as k, listAudit as l, listMedia as m, deleteCategory as n, deletePost as o, listHomepageVideos as p, deleteCoupon as r, getDashboardStats as s, adjustStock as t, listCategories as u, reorderHomepageVideos as v, uploadMedia as w, updateCustomer as x, sendPasswordReset as y };
