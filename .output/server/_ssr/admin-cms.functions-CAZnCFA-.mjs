import { i as enumType, l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType, u as unknownType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-cms.functions-CAZnCFA-.js
async function assertStaff(supabase, userId) {
	const { data, error } = await supabase.rpc("is_staff", { _user_id: userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden: staff role required");
}
async function assertPerm(supabase, userId, key) {
	const { data, error } = await supabase.rpc("has_permission", {
		_user_id: userId,
		_permission_key: key
	});
	if (error) throw new Error(error.message);
	if (!data) throw new Error(`Forbidden: missing permission ${key}`);
}
async function audit(supabase, actor, action, entity_type, entity_id, metadata = {}) {
	await supabase.from("audit_logs").insert({
		actor_id: actor,
		action,
		entity_type,
		entity_id,
		metadata
	});
}
var getDashboardStats_createServerFn_handler = createServerRpc({
	id: "e24fa16b5983950541d9be7d188f36c3894c4f9209234f1d2ace2f5bf84e21a4",
	name: "getDashboardStats",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => getDashboardStats.__executeServer(opts));
var getDashboardStats = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getDashboardStats_createServerFn_handler, async ({ context }) => {
	await assertStaff(context.supabase, context.userId);
	const { data, error } = await context.supabase.rpc("admin_dashboard_stats");
	if (error) throw new Error(error.message);
	return { stats: data };
});
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
async function seedDefaultCategoriesIfEmpty(supabase) {
	try {
		await supabase.from("categories").upsert([
			{
				slug: "all-products",
				name: "All Products",
				sort_order: 1,
				active: true
			},
			{
				slug: "honey",
				name: "Honey",
				sort_order: 2,
				active: true
			},
			{
				slug: "beeswax",
				name: "Beeswax",
				sort_order: 3,
				active: true
			},
			{
				slug: "bee-pollen",
				name: "Bee Pollen",
				sort_order: 4,
				active: true
			},
			{
				slug: "beeswax-candle",
				name: "Beeswax Candles",
				sort_order: 5,
				active: true
			},
			{
				slug: "beauty-products",
				name: "Beauty Products",
				sort_order: 6,
				active: true
			}
		], {
			onConflict: "slug",
			ignoreDuplicates: true
		});
		await supabase.from("products").update({ category: "Beauty Products" }).in("name", ["Soft Skin Gel", "Royal Honey Glow Serum"]);
		await supabase.from("categories").delete().in("name", [
			"Virtual Categories",
			"New Category",
			"Virtual Collections"
		]);
	} catch (e) {
		console.error("Failed to seed categories:", e);
	}
}
var listCategories_createServerFn_handler = createServerRpc({
	id: "edc87e3ec4ecf40eced8d36b0fe24b8937ebf618ae7f49dfb31ae8cfabd7829e",
	name: "listCategories",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listCategories_createServerFn_handler, async ({ context }) => {
	await assertStaff(context.supabase, context.userId);
	await seedDefaultCategoriesIfEmpty(context.supabase);
	const { data, error } = await context.supabase.from("categories").select("*").order("sort_order", { ascending: true });
	if (error) {
		console.error("[listCategories Error]:", error);
		throw new Error(error.message);
	}
	const DISALLOWED_SLUGS = [
		"body-care",
		"hair-care",
		"lip-care",
		"skin-care",
		"wood-leather-care",
		"single-flora"
	];
	return { rows: (data ?? []).filter((r) => !DISALLOWED_SLUGS.includes(String(r.slug).toLowerCase().trim())) };
});
var upsertCategory_createServerFn_handler = createServerRpc({
	id: "b2b121b427a5979ad31ae21dfbb891b925a303169501fe8ab4698dd28b5dc481",
	name: "upsertCategory",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => upsertCategory.__executeServer(opts));
var upsertCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => catSchema.parse(d)).handler(upsertCategory_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "categories.manage");
	const { id, ...rest } = data;
	const cleanSlug = data.slug.toLowerCase().trim().replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "");
	if (!id) {
		const { data: existing } = await context.supabase.from("categories").select("id").eq("slug", cleanSlug).maybeSingle();
		if (existing) throw new Error(`A category with slug "${cleanSlug}" already exists.`);
	} else {
		const { data: existing } = await context.supabase.from("categories").select("id").eq("slug", cleanSlug).neq("id", id).maybeSingle();
		if (existing) throw new Error(`Another category with slug "${cleanSlug}" already exists.`);
	}
	let oldName = null;
	if (id) {
		const { data: oldCat } = await context.supabase.from("categories").select("name").eq("id", id).maybeSingle();
		if (oldCat) oldName = oldCat.name;
	}
	const payload = {
		...rest,
		slug: cleanSlug
	};
	const { error } = await (id ? context.supabase.from("categories").update(payload).eq("id", id) : context.supabase.from("categories").insert(payload));
	if (error) throw new Error(error.message);
	if (id && oldName && oldName.trim() !== data.name.trim()) await context.supabase.from("products").update({ category: data.name.trim() }).ilike("category", oldName.trim());
	await audit(context.supabase, context.userId, id ? "category.update" : "category.create", "category", id, { slug: cleanSlug });
	return { ok: true };
});
var deleteCategory_createServerFn_handler = createServerRpc({
	id: "3f2908342d69a2e00515b4e1fd791c6deb765f174db96a95608588120141b874",
	name: "deleteCategory",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => deleteCategory.__executeServer(opts));
var deleteCategory = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteCategory_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "categories.manage");
	const { data: cat } = await context.supabase.from("categories").select("name, slug").eq("id", data.id).maybeSingle();
	if (cat) {
		const { data: assigned, error: prodErr } = await context.supabase.from("products").select("id").ilike("category", cat.name.trim()).limit(1);
		if (!prodErr && assigned && assigned.length > 0) throw new Error(`Cannot delete "${cat.name}": Products are currently assigned to this category. Reassign or remove those products before deleting.`);
	}
	const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, "category.delete", "category", data.id);
	return { ok: true };
});
var uploadCategoryImage_createServerFn_handler = createServerRpc({
	id: "9640687067aeca3aa933cb654ded992daca3be85a74ca7caf0d3773500ecb0f2",
	name: "uploadCategoryImage",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => uploadCategoryImage.__executeServer(opts));
var uploadCategoryImage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	filename: stringType().min(1).max(200),
	contentType: stringType().max(120),
	base64: stringType().min(1)
}).parse(d)).handler(uploadCategoryImage_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "categories.manage");
	if (!data.contentType.startsWith("image/")) throw new Error("Only image files are allowed");
	const safe = data.filename.replace(/[^\w.-]+/g, "_");
	const path = `categories/${Date.now()}_${safe}`;
	const buf = Buffer.from(data.base64, "base64");
	if (buf.byteLength > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
	const up = await context.supabase.storage.from("media").upload(path, buf, {
		contentType: data.contentType,
		upsert: false
	});
	if (up.error) throw new Error(up.error.message);
	await context.supabase.from("media_library").insert({
		bucket: "media",
		path,
		filename: data.filename,
		mime_type: data.contentType,
		size_bytes: buf.byteLength,
		uploaded_by: context.userId
	});
	const { data: pub } = context.supabase.storage.from("media").getPublicUrl(path);
	await audit(context.supabase, context.userId, "category.image_upload", "category", void 0, { filename: data.filename });
	return { url: pub?.publicUrl ?? null };
});
var uploadProductImage_createServerFn_handler = createServerRpc({
	id: "f51589917ca7a2ceb41f7b9b8894af50f7b39f0e256fc5d9fecd10dccfb2e0cf",
	name: "uploadProductImage",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => uploadProductImage.__executeServer(opts));
var uploadProductImage = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	filename: stringType().min(1).max(200),
	contentType: stringType().max(120),
	base64: stringType().min(1)
}).parse(d)).handler(uploadProductImage_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "products.manage");
	if (!data.contentType.startsWith("image/")) throw new Error("Only image files are allowed");
	const safe = data.filename.replace(/[^\w.-]+/g, "_");
	const path = `products/${Date.now()}_${safe}`;
	const buf = Buffer.from(data.base64, "base64");
	if (buf.byteLength > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
	const up = await context.supabase.storage.from("media").upload(path, buf, {
		contentType: data.contentType,
		upsert: false
	});
	if (up.error) throw new Error(up.error.message);
	await context.supabase.from("media_library").insert({
		bucket: "media",
		path,
		filename: data.filename,
		mime_type: data.contentType,
		size_bytes: buf.byteLength,
		uploaded_by: context.userId
	});
	const { data: pub } = context.supabase.storage.from("media").getPublicUrl(path);
	await audit(context.supabase, context.userId, "product.image_upload", "product", void 0, { filename: data.filename });
	return { url: pub?.publicUrl ?? null };
});
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
var listCoupons_createServerFn_handler = createServerRpc({
	id: "7b0ceb64348705be4a3068ea6d54b7956aa1dff38526696ced6ac31f8795ff2b",
	name: "listCoupons",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listCoupons.__executeServer(opts));
var listCoupons = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listCoupons_createServerFn_handler, async ({ context }) => {
	await assertStaff(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("coupons").select("*").order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return { rows: data ?? [] };
});
var upsertCoupon_createServerFn_handler = createServerRpc({
	id: "c8c568e348e700f0083fa535ee4b2f1aa44153c625bb32e9a5aa2b98ae2ed40e",
	name: "upsertCoupon",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => upsertCoupon.__executeServer(opts));
var upsertCoupon = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => couponSchema.parse(d)).handler(upsertCoupon_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "coupons.manage");
	const { id, ...rest } = data;
	const payload = {
		...rest,
		created_by: context.userId
	};
	const { error } = await (id ? context.supabase.from("coupons").update(rest).eq("id", id) : context.supabase.from("coupons").insert(payload));
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, id ? "coupon.update" : "coupon.create", "coupon", id, { code: data.code });
	return { ok: true };
});
var deleteCoupon_createServerFn_handler = createServerRpc({
	id: "f91e483003604dee204ffd29bb1f2728ab6a399990cb7e81aad0740fc0fc9d25",
	name: "deleteCoupon",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => deleteCoupon.__executeServer(opts));
var deleteCoupon = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteCoupon_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "coupons.manage");
	const { error } = await context.supabase.from("coupons").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, "coupon.delete", "coupon", data.id);
	return { ok: true };
});
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
var listPosts_createServerFn_handler = createServerRpc({
	id: "88c320ec17d01527aadfa1a1631af8d989c903564080eb1235677ed041a0622e",
	name: "listPosts",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listPosts.__executeServer(opts));
var listPosts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listPosts_createServerFn_handler, async ({ context }) => {
	await assertStaff(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("blog_posts").select("*").is("deleted_at", null).order("updated_at", { ascending: false });
	if (error) throw new Error(error.message);
	return { rows: data ?? [] };
});
var upsertPost_createServerFn_handler = createServerRpc({
	id: "3fef4b91b7f84627d5838079f4e2fa55ef367231d21d7d48723dc8352b683ced",
	name: "upsertPost",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => upsertPost.__executeServer(opts));
var upsertPost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => postSchema.parse(d)).handler(upsertPost_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "blog.manage");
	const { id, ...rest } = data;
	const payload = {
		...rest,
		author_id: context.userId
	};
	const { error } = await (id ? context.supabase.from("blog_posts").update(rest).eq("id", id) : context.supabase.from("blog_posts").insert(payload));
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, id ? "post.update" : "post.create", "post", id, {
		slug: data.slug,
		status: data.status
	});
	return { ok: true };
});
var deletePost_createServerFn_handler = createServerRpc({
	id: "8b027075e576321fb1f744c1f976eedc638c68f06d68ac326f2723a813546670",
	name: "deletePost",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => deletePost.__executeServer(opts));
var deletePost = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deletePost_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "blog.manage");
	const { error } = await context.supabase.from("blog_posts").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, "post.delete", "post", data.id);
	return { ok: true };
});
var listCustomers_createServerFn_handler = createServerRpc({
	id: "47ea3b511292f6e971f05571a0be6515c1a0a1c1cca8215d00a7201eee448c8a",
	name: "listCustomers",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listCustomers.__executeServer(opts));
var listCustomers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ q: stringType().max(200).optional() }).parse(d)).handler(listCustomers_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context.supabase, context.userId);
	let q = context.supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
	if (data.q) q = q.or(`full_name.ilike.%${data.q}%,email.ilike.%${data.q}%,phone.ilike.%${data.q}%`);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	const ids = (rows ?? []).map((r) => r.id);
	let counts = {};
	if (ids.length) {
		const { data: orders } = await context.supabase.from("orders").select("user_id,total_paise,status").in("user_id", ids).is("deleted_at", null);
		counts = (orders ?? []).reduce((acc, o) => {
			if (!o.user_id) return acc;
			const k = o.user_id;
			if (!acc[k]) acc[k] = {
				orders: 0,
				spent: 0
			};
			acc[k].orders++;
			if ([
				"paid",
				"processing",
				"packed",
				"shipped",
				"delivered",
				"confirmed"
			].includes(o.status)) acc[k].spent += o.total_paise;
			return acc;
		}, {});
	}
	return { rows: (rows ?? []).map((r) => ({
		...r,
		orders_count: counts[r.id]?.orders ?? 0,
		spent_paise: counts[r.id]?.spent ?? 0
	})) };
});
var updateCustomer_createServerFn_handler = createServerRpc({
	id: "85cfaf87342d6d2cd9a2e69511a89212f97380246712fd1d74e044422058585c",
	name: "updateCustomer",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => updateCustomer.__executeServer(opts));
var updateCustomer = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: enumType(["active", "disabled"]).optional(),
	admin_notes: stringType().max(4e3).optional()
}).parse(d)).handler(updateCustomer_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context.supabase, context.userId);
	const patch = {};
	if (data.status !== void 0) patch.status = data.status;
	if (data.admin_notes !== void 0) patch.admin_notes = data.admin_notes;
	const { error } = await context.supabase.from("profiles").update(patch).eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, "customer.update", "customer", data.id, patch);
	return { ok: true };
});
var listSettings_createServerFn_handler = createServerRpc({
	id: "2e43593af824a327896c0824a082d426e924c93ccea4ee992612c55bf1993184",
	name: "listSettings",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listSettings.__executeServer(opts));
var listSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listSettings_createServerFn_handler, async ({ context }) => {
	await assertStaff(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("site_settings").select("*").order("key");
	if (error) throw new Error(error.message);
	return { rows: data ?? [] };
});
var upsertSetting_createServerFn_handler = createServerRpc({
	id: "8e48ff5c9a50cfa5966ec5649ebaf3b924920ad80259b82f60be8e3e6e559101",
	name: "upsertSetting",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => upsertSetting.__executeServer(opts));
var upsertSetting = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	key: stringType().min(1).max(80),
	value: unknownType(),
	is_public: booleanType().optional()
}).parse(d)).handler(upsertSetting_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "settings.manage");
	const payload = {
		key: data.key,
		value: data.value,
		is_public: data.is_public ?? true,
		updated_by: context.userId
	};
	const { error } = await context.supabase.from("site_settings").upsert(payload);
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, "setting.update", "setting", data.key);
	return { ok: true };
});
var listMedia_createServerFn_handler = createServerRpc({
	id: "65daf30c874a3fd0d44fcbebae9ba36a090b605b90a2ba8afd3c76a5afc50a93",
	name: "listMedia",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listMedia.__executeServer(opts));
var listMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	bucket: stringType().max(60).optional(),
	q: stringType().max(200).optional()
}).parse(d)).handler(listMedia_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context.supabase, context.userId);
	let q = context.supabase.from("media_library").select("*").order("created_at", { ascending: false }).limit(500);
	if (data.bucket) q = q.eq("bucket", data.bucket);
	if (data.q) q = q.ilike("filename", `%${data.q}%`);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	return { rows: await Promise.all((rows ?? []).map(async (r) => {
		const { data: pub } = context.supabase.storage.from(r.bucket).getPublicUrl(r.path);
		return {
			...r,
			url: pub?.publicUrl ?? null
		};
	})) };
});
var deleteMedia_createServerFn_handler = createServerRpc({
	id: "f9680c8716d1f23c60f7e58ed680ac443f90d589fe37c44bff5806bad1c2b6fd",
	name: "deleteMedia",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => deleteMedia.__executeServer(opts));
var deleteMedia = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteMedia_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "media.manage");
	const { data: row, error: e0 } = await context.supabase.from("media_library").select("bucket,path").eq("id", data.id).single();
	if (e0) throw new Error(e0.message);
	await context.supabase.storage.from(row.bucket).remove([row.path]);
	const { error } = await context.supabase.from("media_library").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, "media.delete", "media", data.id);
	return { ok: true };
});
var uploadMedia_createServerFn_handler = createServerRpc({
	id: "b5c6f41a6c5d53c5cc4b17decca1bd5f8949f6cdc0bef15507432625c9b55e69",
	name: "uploadMedia",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => uploadMedia.__executeServer(opts));
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
}).parse(d)).handler(uploadMedia_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "media.manage");
	const safe = data.filename.replace(/[^\w.-]+/g, "_");
	const path = `${data.bucket === "media" && data.folder ? `${data.folder}/` : ""}${Date.now()}_${safe}`;
	const buf = Buffer.from(data.base64, "base64");
	if (buf.byteLength > 20 * 1024 * 1024) throw new Error("File too large (max 20MB)");
	const up = await context.supabase.storage.from(data.bucket).upload(path, buf, {
		contentType: data.contentType,
		upsert: false
	});
	if (up.error) throw new Error(up.error.message);
	const { data: row, error } = await context.supabase.from("media_library").insert({
		bucket: data.bucket,
		path,
		filename: data.filename,
		mime_type: data.contentType,
		size_bytes: buf.byteLength,
		alt_text: data.alt_text ?? null,
		uploaded_by: context.userId
	}).select("id,bucket,path").single();
	if (error) throw new Error(error.message);
	const { data: pub } = context.supabase.storage.from(data.bucket).getPublicUrl(path);
	await audit(context.supabase, context.userId, "media.upload", "media", row.id, {
		filename: data.filename,
		bucket: data.bucket
	});
	return {
		id: row.id,
		url: pub?.publicUrl ?? null,
		path
	};
});
var listUsers_createServerFn_handler = createServerRpc({
	id: "3c7d0b7aca410b3bf69d2cc597f23c145b1f66021b63ed7f7cbacd04c8ac2076",
	name: "listUsers",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listUsers.__executeServer(opts));
var listUsers = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listUsers_createServerFn_handler, async ({ context }) => {
	await assertPerm(context.supabase, context.userId, "users.manage");
	const { data: roles } = await context.supabase.from("user_roles").select("user_id,role");
	const { data: users, error } = await context.supabase.auth.admin.listUsers({
		page: 1,
		perPage: 200
	});
	if (error) throw new Error(error.message);
	const byId = {};
	(roles ?? []).forEach((r) => {
		(byId[r.user_id] ||= []).push(r.role);
	});
	return { rows: users.users.map((u) => ({
		id: u.id,
		email: u.email,
		created_at: u.created_at,
		last_sign_in_at: u.last_sign_in_at,
		roles: byId[u.id] ?? []
	})) };
});
var setUserRole_createServerFn_handler = createServerRpc({
	id: "4a59812f64644f30f68e938fb23252e407f73247548be12fd02b248782e8cfc6",
	name: "setUserRole",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => setUserRole.__executeServer(opts));
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
}).parse(d)).handler(setUserRole_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "users.manage");
	if (data.action === "grant") {
		const { error } = await context.supabase.from("user_roles").insert({
			user_id: data.user_id,
			role: data.role
		});
		if (error && !String(error.message).includes("duplicate")) throw new Error(error.message);
	} else {
		const { error } = await context.supabase.from("user_roles").delete().eq("user_id", data.user_id).eq("role", data.role);
		if (error) throw new Error(error.message);
	}
	await audit(context.supabase, context.userId, `role.${data.action}`, "user", data.user_id, { role: data.role });
	return { ok: true };
});
var inviteUser_createServerFn_handler = createServerRpc({
	id: "55bd2d5bf97b077881e6c01501747795dae4e386321a8fa6c65b683fc16e92bf",
	name: "inviteUser",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => inviteUser.__executeServer(opts));
var inviteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	email: stringType().email(),
	role: stringType().optional()
}).parse(d)).handler(inviteUser_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "users.manage");
	const { data: inv, error } = await context.supabase.auth.admin.inviteUserByEmail(data.email);
	if (error) throw new Error(error.message);
	if (data.role && inv.user) await context.supabase.from("user_roles").insert({
		user_id: inv.user.id,
		role: data.role
	});
	await audit(context.supabase, context.userId, "user.invite", "user", inv.user?.id, {
		email: data.email,
		role: data.role
	});
	return { ok: true };
});
var sendPasswordReset_createServerFn_handler = createServerRpc({
	id: "1dd3ceaa12fe9e85d72666b796762c8b183de8e393649c4cdfad526e72b14dd8",
	name: "sendPasswordReset",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => sendPasswordReset.__executeServer(opts));
var sendPasswordReset = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ email: stringType().email() }).parse(d)).handler(sendPasswordReset_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "users.manage");
	const { error } = await context.supabase.auth.admin.generateLink({
		type: "recovery",
		email: data.email
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listAudit_createServerFn_handler = createServerRpc({
	id: "f01cf910915b3c3ef9f4441a5a35b5e8df0e1ae8316bfde60851493b62862681",
	name: "listAudit",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listAudit.__executeServer(opts));
var listAudit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	q: stringType().max(120).optional(),
	entity_type: stringType().max(40).optional()
}).parse(d)).handler(listAudit_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "audit.read");
	let q = context.supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500);
	if (data.entity_type) q = q.eq("entity_type", data.entity_type);
	if (data.q) q = q.ilike("action", `%${data.q}%`);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	return { rows: rows ?? [] };
});
var updateOrderExtended_createServerFn_handler = createServerRpc({
	id: "dbb2e8415d60f5c8b9cdce509a869624eb0a2ad748646e24a3fc35ac3b284119",
	name: "updateOrderExtended",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => updateOrderExtended.__executeServer(opts));
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
}).parse(d)).handler(updateOrderExtended_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "orders.manage");
	const patch = {};
	[
		"status",
		"admin_notes",
		"tracking_number",
		"shipping_carrier",
		"refund_amount_paise"
	].forEach((k) => {
		if (data[k] !== void 0) patch[k] = data[k];
	});
	if (data.status === "refunded") patch.refunded_at = (/* @__PURE__ */ new Date()).toISOString();
	const { data: cur } = await context.supabase.from("orders").select("timeline").eq("id", data.id).single();
	const timeline = Array.isArray(cur?.timeline) ? cur.timeline : [];
	if (data.status) timeline.push({
		at: (/* @__PURE__ */ new Date()).toISOString(),
		by: context.userId,
		status: data.status,
		note: data.admin_notes
	});
	patch.timeline = timeline;
	const { error } = await context.supabase.from("orders").update(patch).eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, "order.update", "order", data.id, patch);
	return { ok: true };
});
var adjustStock_createServerFn_handler = createServerRpc({
	id: "4a911bb60e691c1c617d7976bc5cbf68603fa7467e41ecddf14f66b938a15a2a",
	name: "adjustStock",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => adjustStock.__executeServer(opts));
var adjustStock = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	product_id: stringType().uuid(),
	change: numberType().int(),
	reason: stringType().max(400).optional()
}).parse(d)).handler(adjustStock_createServerFn_handler, async ({ data, context }) => {
	await assertPerm(context.supabase, context.userId, "products.manage");
	const { data: p, error: e0 } = await context.supabase.from("products").select("stock_quantity").eq("id", data.product_id).single();
	if (e0) throw new Error(e0.message);
	const before = p.stock_quantity;
	const after = Math.max(0, before + data.change);
	const { error } = await context.supabase.from("products").update({
		stock_quantity: after,
		in_stock: after > 0
	}).eq("id", data.product_id);
	if (error) throw new Error(error.message);
	await context.supabase.from("inventory_history").insert({
		product_id: data.product_id,
		change: data.change,
		before,
		after,
		reason: data.reason ?? "adjustment",
		actor_id: context.userId
	});
	await audit(context.supabase, context.userId, "inventory.adjust", "product", data.product_id, { change: data.change });
	return {
		ok: true,
		before,
		after
	};
});
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
var listHomepageVideos_createServerFn_handler = createServerRpc({
	id: "e1a65a268a508134c84eabc21b22c2d69f38e81a786480bf2fda50dd68992b78",
	name: "listHomepageVideos",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => listHomepageVideos.__executeServer(opts));
var listHomepageVideos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(listHomepageVideos_createServerFn_handler, async ({ context }) => {
	await assertStaff(context.supabase, context.userId);
	const { data, error } = await context.supabase.from("homepage_videos").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: true });
	if (error) throw new Error(error.message);
	return { rows: data ?? [] };
});
var upsertHomepageVideo_createServerFn_handler = createServerRpc({
	id: "0294d84cf7d0b394492dd69e9a10663754ecfccea513d2cfc719eb1089293e30",
	name: "upsertHomepageVideo",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => upsertHomepageVideo.__executeServer(opts));
var upsertHomepageVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => homepageVideoSchema.parse(d)).handler(upsertHomepageVideo_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context.supabase, context.userId);
	const { id, ...rest } = data;
	const { error } = await (id ? context.supabase.from("homepage_videos").update(rest).eq("id", id) : context.supabase.from("homepage_videos").insert(rest));
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, id ? "homepage_video.update" : "homepage_video.create", "homepage_video", id, { title: data.title });
	return { ok: true };
});
var deleteHomepageVideo_createServerFn_handler = createServerRpc({
	id: "de90cd5686e9098a185d870b76bad851807ed28d675333d5fc953d9dbd852621",
	name: "deleteHomepageVideo",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => deleteHomepageVideo.__executeServer(opts));
var deleteHomepageVideo = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(deleteHomepageVideo_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context.supabase, context.userId);
	const { error } = await context.supabase.from("homepage_videos").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	await audit(context.supabase, context.userId, "homepage_video.delete", "homepage_video", data.id);
	return { ok: true };
});
var reorderHomepageVideos_createServerFn_handler = createServerRpc({
	id: "4d41ba6d450adb22329b68437e8e06ba5556352ff3bb195c5c7479319895f263",
	name: "reorderHomepageVideos",
	filename: "src/lib/admin-cms.functions.ts"
}, (opts) => reorderHomepageVideos.__executeServer(opts));
var reorderHomepageVideos = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ items: arrayType(objectType({
	id: stringType().uuid(),
	display_order: numberType().int()
})) }).parse(d)).handler(reorderHomepageVideos_createServerFn_handler, async ({ data, context }) => {
	await assertStaff(context.supabase, context.userId);
	for (const item of data.items) {
		const { error } = await context.supabase.from("homepage_videos").update({ display_order: item.display_order }).eq("id", item.id);
		if (error) throw new Error(error.message);
	}
	await audit(context.supabase, context.userId, "homepage_video.reorder", "homepage_video", void 0, { count: data.items.length });
	return { ok: true };
});
//#endregion
export { adjustStock_createServerFn_handler, deleteCategory_createServerFn_handler, deleteCoupon_createServerFn_handler, deleteHomepageVideo_createServerFn_handler, deleteMedia_createServerFn_handler, deletePost_createServerFn_handler, getDashboardStats_createServerFn_handler, inviteUser_createServerFn_handler, listAudit_createServerFn_handler, listCategories_createServerFn_handler, listCoupons_createServerFn_handler, listCustomers_createServerFn_handler, listHomepageVideos_createServerFn_handler, listMedia_createServerFn_handler, listPosts_createServerFn_handler, listSettings_createServerFn_handler, listUsers_createServerFn_handler, reorderHomepageVideos_createServerFn_handler, sendPasswordReset_createServerFn_handler, setUserRole_createServerFn_handler, updateCustomer_createServerFn_handler, updateOrderExtended_createServerFn_handler, uploadCategoryImage_createServerFn_handler, uploadMedia_createServerFn_handler, uploadProductImage_createServerFn_handler, upsertCategory_createServerFn_handler, upsertCoupon_createServerFn_handler, upsertHomepageVideo_createServerFn_handler, upsertPost_createServerFn_handler, upsertSetting_createServerFn_handler };
