import { n as supabase } from "./client-CiOF68Zx.mjs";
import { l as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-server.functions-CYI8pNV-.js
var listInputSchema = objectType({
	cat: stringType().optional(),
	q: stringType().optional(),
	page: numberType().int().min(1).default(1),
	pageSize: numberType().int().min(1).max(50).default(6)
});
var listPublicPosts_createServerFn_handler = createServerRpc({
	id: "0cfaf7220cff63a51c3ae5ab7da2cc2451720864b3648b5f121249e0a86cc3d8",
	name: "listPublicPosts",
	filename: "src/lib/blog-server.functions.ts"
}, (opts) => listPublicPosts.__executeServer(opts));
var listPublicPosts = createServerFn({ method: "POST" }).inputValidator((d) => listInputSchema.parse(d ?? {})).handler(listPublicPosts_createServerFn_handler, async ({ data }) => {
	const page = data.page || 1;
	const pageSize = data.pageSize || 6;
	const start = (page - 1) * pageSize;
	const end = start + pageSize - 1;
	let query = supabase.from("blog_posts").select("*", { count: "exact" }).eq("status", "published").is("deleted_at", null);
	if (data.cat && data.cat !== "All Posts") {}
	if (data.q && data.q.trim()) {
		const term = data.q.trim().replace(/%/g, "");
		query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,body_markdown.ilike.%${term}%`);
	}
	query = query.order("published_at", {
		ascending: false,
		nullsFirst: false
	}).order("created_at", { ascending: false }).range(start, end);
	const { data: rows, error, count } = await query;
	if (error) {
		if (error.code !== "42501") console.error("listPublicPosts error:", error.message);
		return {
			rows: [],
			total: 0,
			page,
			totalPages: 1
		};
	}
	const total = count ?? (rows ? rows.length : 0);
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	return {
		rows: rows ?? [],
		total,
		page,
		totalPages
	};
});
var getPublicPost_createServerFn_handler = createServerRpc({
	id: "badbaed50db9ee63acd1c07cb0c3ed3673283ade0fe07678aef5c8400b7cd57f",
	name: "getPublicPost",
	filename: "src/lib/blog-server.functions.ts"
}, (opts) => getPublicPost.__executeServer(opts));
var getPublicPost = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ slug: stringType().min(1) }).parse(d)).handler(getPublicPost_createServerFn_handler, async ({ data }) => {
	const { data: post, error } = await supabase.from("blog_posts").select("*").eq("slug", data.slug).eq("status", "published").is("deleted_at", null).maybeSingle();
	if (error || !post) return {
		post: null,
		related: []
	};
	const currentPost = post;
	const { data: relatedRows } = await supabase.from("blog_posts").select("*").eq("status", "published").is("deleted_at", null).neq("slug", currentPost.slug).order("published_at", { ascending: false }).limit(6);
	const allRelated = relatedRows ?? [];
	const sameCat = allRelated.filter((r) => r.category_name && currentPost.category_name && r.category_name.toLowerCase() === currentPost.category_name.toLowerCase());
	const otherCat = allRelated.filter((r) => !(r.category_name && currentPost.category_name && r.category_name.toLowerCase() === currentPost.category_name.toLowerCase()));
	return {
		post: currentPost,
		related: [...sameCat, ...otherCat].slice(0, 3)
	};
});
var getPopularPosts_createServerFn_handler = createServerRpc({
	id: "f33819409bfcb08e2f5262fb20573c50f92b6b267a72858fb2e1cc6bd452a7de",
	name: "getPopularPosts",
	filename: "src/lib/blog-server.functions.ts"
}, (opts) => getPopularPosts.__executeServer(opts));
var getPopularPosts = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ limit: numberType().int().min(1).max(20).default(4) }).parse(d ?? {})).handler(getPopularPosts_createServerFn_handler, async ({ data }) => {
	const limit = data.limit || 4;
	const { data: popularRows } = await supabase.from("blog_posts").select("*").eq("status", "published").is("deleted_at", null).order("published_at", { ascending: false }).limit(limit);
	let rows = popularRows ?? [];
	if (rows.length < limit) {
		const existingIds = rows.map((r) => r.id);
		const { data: fallbackRows } = await supabase.from("blog_posts").select("*").eq("status", "published").is("deleted_at", null).order("published_at", { ascending: false }).limit(limit - rows.length);
		if (fallbackRows) {
			for (const fb of fallbackRows) if (!existingIds.includes(fb.id)) rows.push(fb);
		}
	}
	return { rows: rows.slice(0, limit) };
});
var getFeaturedPost_createServerFn_handler = createServerRpc({
	id: "4523effac57ea3a11fd1e91b0267c2366ff2d10e8b65098e5265810ca51b19ab",
	name: "getFeaturedPost",
	filename: "src/lib/blog-server.functions.ts"
}, (opts) => getFeaturedPost.__executeServer(opts));
var getFeaturedPost = createServerFn({ method: "POST" }).handler(getFeaturedPost_createServerFn_handler, async () => {
	let { data: post } = await supabase.from("blog_posts").select("*").eq("status", "published").is("deleted_at", null).order("published_at", { ascending: false }).limit(1).maybeSingle();
	if (!post) {
		const { data: latest } = await supabase.from("blog_posts").select("*").eq("status", "published").is("deleted_at", null).order("published_at", { ascending: false }).limit(1).maybeSingle();
		post = latest;
	}
	return { post: post ?? null };
});
//#endregion
export { getFeaturedPost_createServerFn_handler, getPopularPosts_createServerFn_handler, getPublicPost_createServerFn_handler, listPublicPosts_createServerFn_handler };
