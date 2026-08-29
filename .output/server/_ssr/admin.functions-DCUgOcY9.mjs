import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DCUgOcY9.js
async function assertAdmin(supabase, userId) {
	const { data, error } = await supabase.rpc("has_role", {
		_user_id: userId,
		_role: "admin"
	});
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Forbidden: admin role required");
}
var claimAdmin_createServerFn_handler = createServerRpc({
	id: "420039d888d6f92ecb02d2e25a67a5644d3a2ad34e92c5fcd0204779278c07c3",
	name: "claimAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => claimAdmin.__executeServer(opts));
var claimAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(claimAdmin_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.rpc("claim_admin_if_none");
	if (error) throw new Error(error.message);
	return { claimed: !!data };
});
var listSchema = objectType({
	form_type: stringType().optional(),
	q: stringType().optional(),
	status: stringType().optional(),
	from: stringType().optional(),
	to: stringType().optional()
});
var listSubmissions_createServerFn_handler = createServerRpc({
	id: "49238202c15f88de4491aa5f73217eeb7e434a69e1077a396c9d5d222f186eeb",
	name: "listSubmissions",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listSubmissions.__executeServer(opts));
var listSubmissions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => listSchema.parse(d)).handler(listSubmissions_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	let q = context.supabase.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(1e3);
	if (data.form_type && data.form_type !== "all") q = q.eq("form_type", data.form_type);
	if (data.status && data.status !== "all") q = q.eq("status", data.status);
	if (data.from) q = q.gte("created_at", data.from);
	if (data.to) q = q.lte("created_at", data.to);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	const term = (data.q ?? "").trim().toLowerCase();
	return { rows: term ? (rows ?? []).filter((r) => [
		r.name,
		r.email,
		r.phone,
		r.company,
		r.city,
		r.subject,
		r.message,
		r.product_interest,
		r.quantity
	].filter(Boolean).join(" ").toLowerCase().includes(term)) : rows ?? [] };
});
var getSubmission_createServerFn_handler = createServerRpc({
	id: "dcb2553e413e70f4eb4c9f440a2da5b1461d5f638bc7b193aa6fb2bc2e5b3cbd",
	name: "getSubmission",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getSubmission.__executeServer(opts));
var getSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(getSubmission_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const { data: row, error } = await context.supabase.from("form_submissions").select("*").eq("id", data.id).single();
	if (error) throw new Error(error.message);
	return { row };
});
var updateSubmission_createServerFn_handler = createServerRpc({
	id: "3126ec8be8c0adbc963c1c3ed3f7de2748634b474f3710552268770859c691d4",
	name: "updateSubmission",
	filename: "src/lib/admin.functions.ts"
}, (opts) => updateSubmission.__executeServer(opts));
var updateSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: stringType().max(40).optional(),
	admin_notes: stringType().max(4e3).optional()
}).parse(d)).handler(updateSubmission_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const patch = {};
	if (data.status !== void 0) patch.status = data.status;
	if (data.admin_notes !== void 0) patch.admin_notes = data.admin_notes;
	const { error } = await context.supabase.from("form_submissions").update(patch).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listOrders_createServerFn_handler = createServerRpc({
	id: "417c9a43e3b2c8a52369c51aeba4e0a3cfd0fcc464e265d473e113f9511a245b",
	name: "listOrders",
	filename: "src/lib/admin.functions.ts"
}, (opts) => listOrders.__executeServer(opts));
var listOrders = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(listOrders_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	let q = context.supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(1e3);
	if (data.status && data.status !== "all") q = q.eq("status", data.status);
	if (data.from) q = q.gte("created_at", data.from);
	if (data.to) q = q.lte("created_at", data.to);
	const { data: rows, error } = await q;
	if (error) throw new Error(error.message);
	const term = (data.q ?? "").trim().toLowerCase();
	return { rows: term ? (rows ?? []).filter((r) => [
		r.email,
		r.phone,
		r.full_name,
		r.razorpay_order_id,
		r.id
	].filter(Boolean).join(" ").toLowerCase().includes(term)) : rows ?? [] };
});
var updateOrder_createServerFn_handler = createServerRpc({
	id: "fcf97b38ffe3f8999f4795b9252aa918a4ac5e567faed6d92c78b19efe212dc9",
	name: "updateOrder",
	filename: "src/lib/admin.functions.ts"
}, (opts) => updateOrder.__executeServer(opts));
var updateOrder = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	id: stringType().uuid(),
	status: stringType().max(40).optional(),
	admin_notes: stringType().max(4e3).optional()
}).parse(d)).handler(updateOrder_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context.supabase, context.userId);
	const patch = {};
	if (data.status !== void 0) patch.status = data.status;
	if (data.admin_notes !== void 0) patch.admin_notes = data.admin_notes;
	const { error } = await context.supabase.from("orders").update(patch).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { claimAdmin_createServerFn_handler, getSubmission_createServerFn_handler, listOrders_createServerFn_handler, listSubmissions_createServerFn_handler, updateOrder_createServerFn_handler, updateSubmission_createServerFn_handler };
