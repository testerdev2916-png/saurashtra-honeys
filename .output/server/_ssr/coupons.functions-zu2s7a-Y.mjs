import { n as supabase } from "./client-CiOF68Zx.mjs";
import { l as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coupons.functions-zu2s7a-Y.js
var validateSchema = objectType({
	code: stringType().trim().min(1).max(60),
	subtotal_paise: numberType().int().nonnegative()
});
async function validateCoupon(supabase, code, subtotal_paise) {
	const { data, error } = await supabase.from("coupons").select("id,code,discount_type,discount_value,min_order_paise,max_discount_paise,usage_limit,usage_count,starts_at,expires_at,active,description").ilike("code", code).maybeSingle();
	if (error || !data) return {
		ok: false,
		error: "Invalid coupon code"
	};
	const c = data;
	const now = Date.now();
	if (!c.active) return {
		ok: false,
		error: "Coupon is not active"
	};
	if (c.starts_at && new Date(c.starts_at).getTime() > now) return {
		ok: false,
		error: "Coupon hasn't started yet"
	};
	if (c.expires_at && new Date(c.expires_at).getTime() < now) return {
		ok: false,
		error: "Coupon has expired"
	};
	if (c.usage_limit != null && c.usage_count >= c.usage_limit) return {
		ok: false,
		error: "Coupon has reached its usage limit"
	};
	if (subtotal_paise < c.min_order_paise) return {
		ok: false,
		error: `Add ₹${((c.min_order_paise - subtotal_paise) / 100).toFixed(0)} more to use this coupon`
	};
	let discount = 0;
	const free = c.discount_type === "free_shipping";
	if (c.discount_type === "percent") discount = Math.round(subtotal_paise * (c.discount_value / 100));
	else if (c.discount_type === "fixed") discount = c.discount_value * 100;
	if (c.max_discount_paise && discount > c.max_discount_paise) discount = c.max_discount_paise;
	if (discount > subtotal_paise) discount = subtotal_paise;
	return {
		ok: true,
		code: c.code,
		discount_type: c.discount_type,
		discount_value: c.discount_value,
		discount_paise: discount,
		free_shipping: free,
		description: c.description
	};
}
var validateCouponFn_createServerFn_handler = createServerRpc({
	id: "ea0b867a828e5a8f9e2137d2911fd4b1e50406954ad62b300b05b5dadcbe9320",
	name: "validateCouponFn",
	filename: "src/lib/coupons.functions.ts"
}, (opts) => validateCouponFn.__executeServer(opts));
var validateCouponFn = createServerFn({ method: "POST" }).inputValidator((d) => validateSchema.parse(d)).handler(validateCouponFn_createServerFn_handler, async ({ data }) => validateCoupon(supabase, data.code, data.subtotal_paise));
var trackSchema = objectType({
	order_number: stringType().trim().min(3).max(60),
	email: stringType().trim().email().max(255)
});
var trackOrderFn_createServerFn_handler = createServerRpc({
	id: "0d1301948603582bdc9de858dac3f75272bb8c54a1a8a274f68c24aaa9ba7564",
	name: "trackOrderFn",
	filename: "src/lib/coupons.functions.ts"
}, (opts) => trackOrderFn.__executeServer(opts));
var trackOrderFn = createServerFn({ method: "POST" }).inputValidator((d) => trackSchema.parse(d)).handler(trackOrderFn_createServerFn_handler, async ({ data }) => {
	const { data: rows, error } = await supabase.rpc("track_order", {
		_order_number: data.order_number.trim(),
		_email: data.email.trim()
	});
	if (error) throw new Error(error.message);
	const row = rows?.[0];
	if (!row) return {
		ok: false,
		order: null
	};
	return {
		ok: true,
		order: JSON.parse(JSON.stringify(row))
	};
});
//#endregion
export { trackOrderFn_createServerFn_handler, validateCouponFn_createServerFn_handler };
