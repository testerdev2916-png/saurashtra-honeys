import { n as supabase } from "./client-CiOF68Zx.mjs";
import { a as literalType, i as enumType, l as stringType, n as arrayType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders.functions-CLqtcUEG.js
var itemSchema = objectType({
	slug: stringType().max(120),
	name: stringType().max(200),
	size: stringType().max(40),
	price: numberType().int().nonnegative(),
	qty: numberType().int().positive().max(999),
	image: stringType().max(2e3).optional()
});
var shippingSchema = objectType({
	line1: stringType().min(3).max(200),
	line2: stringType().max(200).optional().or(literalType("")),
	city: stringType().min(2).max(100),
	state: stringType().min(2).max(100),
	pincode: stringType().min(4).max(12),
	country: stringType().max(80).optional()
});
var createSchema = objectType({
	full_name: stringType().trim().min(2).max(120),
	email: stringType().trim().email().max(255),
	phone: stringType().trim().min(7).max(20),
	shipping: shippingSchema,
	items: arrayType(itemSchema).min(1).max(50),
	payment_method: enumType(["cod", "razorpay"]),
	notes: stringType().max(1e3).optional(),
	coupon_code: stringType().trim().max(60).optional(),
	gift_note: stringType().trim().max(500).optional()
});
async function resolveCoupon(supabaseClient, code, subtotalPaise) {
	if (!code) return {
		discount: 0,
		freeShipping: false,
		id: null,
		codeText: null
	};
	const { data } = await supabaseClient.from("coupons").select("id,code,discount_type,discount_value,min_order_paise,max_discount_paise,usage_limit,usage_count,starts_at,expires_at,active").ilike("code", code).maybeSingle();
	if (!data) return {
		discount: 0,
		freeShipping: false,
		id: null,
		codeText: null
	};
	const c = data;
	const now = Date.now();
	if (!c.active) return {
		discount: 0,
		freeShipping: false,
		id: null,
		codeText: null
	};
	if (c.starts_at && new Date(c.starts_at).getTime() > now) return {
		discount: 0,
		freeShipping: false,
		id: null,
		codeText: null
	};
	if (c.expires_at && new Date(c.expires_at).getTime() < now) return {
		discount: 0,
		freeShipping: false,
		id: null,
		codeText: null
	};
	if (c.usage_limit != null && c.usage_count >= c.usage_limit) return {
		discount: 0,
		freeShipping: false,
		id: null,
		codeText: null
	};
	if (subtotalPaise < c.min_order_paise) return {
		discount: 0,
		freeShipping: false,
		id: null,
		codeText: null
	};
	let discount = 0;
	const freeShipping = c.discount_type === "free_shipping";
	if (c.discount_type === "percent") discount = Math.round(subtotalPaise * (c.discount_value / 100));
	else if (c.discount_type === "fixed") discount = c.discount_value * 100;
	if (c.max_discount_paise && discount > c.max_discount_paise) discount = c.max_discount_paise;
	if (discount > subtotalPaise) discount = subtotalPaise;
	return {
		discount,
		freeShipping,
		id: c.id,
		codeText: c.code
	};
}
async function razorpayCreateOrder(amountPaise, receipt) {
	const keyId = process.env.RAZORPAY_KEY_ID;
	const keySecret = process.env.RAZORPAY_KEY_SECRET;
	if (!keyId || !keySecret) throw new Error("Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
	const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
	const res = await fetch("https://api.razorpay.com/v1/orders", {
		method: "POST",
		headers: {
			Authorization: `Basic ${auth}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			amount: amountPaise,
			currency: "INR",
			receipt,
			payment_capture: 1
		})
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Razorpay error [${res.status}]: ${text}`);
	}
	return await res.json();
}
async function insertOrderRow(supabaseClient, data, userId) {
	const subtotalPaise = data.items.reduce((s, i) => s + i.price * i.qty, 0) * 100;
	const coupon = await resolveCoupon(supabaseClient, data.coupon_code, subtotalPaise);
	const discountedSubtotal = subtotalPaise - coupon.discount;
	const shippingPaise = coupon.freeShipping || discountedSubtotal >= 79900 ? 0 : 4900;
	const totalPaise = discountedSubtotal + shippingPaise;
	const estDelivery = /* @__PURE__ */ new Date();
	estDelivery.setDate(estDelivery.getDate() + 5);
	const insert = {
		user_id: userId,
		email: data.email,
		phone: data.phone,
		full_name: data.full_name,
		shipping: data.shipping,
		items: data.items,
		subtotal_paise: subtotalPaise,
		shipping_paise: shippingPaise,
		total_paise: totalPaise,
		discount_paise: coupon.discount,
		coupon_code: coupon.codeText,
		gift_note: data.gift_note ?? null,
		estimated_delivery: estDelivery.toISOString().slice(0, 10),
		payment_method: data.payment_method,
		status: data.payment_method === "cod" ? "processing" : "pending",
		timeline: [{
			at: (/* @__PURE__ */ new Date()).toISOString(),
			status: "created",
			note: "Order placed"
		}],
		notes: data.notes ?? null
	};
	const { data: row, error } = await supabaseClient.from("orders").insert(insert).select("id, order_number").single();
	if (error) throw new Error(error.message);
	if (coupon.id) {
		await supabaseClient.from("coupon_redemptions").insert({
			coupon_id: coupon.id,
			user_id: userId,
			order_id: row.id,
			discount_paise: coupon.discount
		});
		const { data: cur } = await supabaseClient.from("coupons").select("usage_count").eq("id", coupon.id).single();
		if (cur) await supabaseClient.from("coupons").update({ usage_count: (cur.usage_count ?? 0) + 1 }).eq("id", coupon.id);
	}
	if (userId) await supabaseClient.from("notifications").insert({
		user_id: userId,
		kind: "order",
		title: `Order ${row.order_number ?? ""} placed`,
		body: `Your order for ₹${(totalPaise / 100).toFixed(0)} has been received.`,
		link: `/order/${row.id}`,
		metadata: {
			order_id: row.id,
			order_number: row.order_number
		}
	});
	if (data.payment_method === "razorpay") {
		const rp = await razorpayCreateOrder(totalPaise, `order_${row.id.slice(0, 30)}`);
		await supabaseClient.from("orders").update({ razorpay_order_id: rp.id }).eq("id", row.id);
		return {
			orderId: row.id,
			orderNumber: row.order_number,
			razorpay: {
				keyId: process.env.RAZORPAY_KEY_ID,
				orderId: rp.id,
				amount: rp.amount,
				currency: rp.currency
			},
			totals: {
				subtotalPaise,
				shippingPaise,
				totalPaise,
				discountPaise: coupon.discount
			}
		};
	}
	return {
		orderId: row.id,
		orderNumber: row.order_number,
		razorpay: null,
		totals: {
			subtotalPaise,
			shippingPaise,
			totalPaise,
			discountPaise: coupon.discount
		}
	};
}
var createOrder_createServerFn_handler = createServerRpc({
	id: "7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3",
	name: "createOrder",
	filename: "src/lib/orders.functions.ts"
}, (opts) => createOrder.__executeServer(opts));
var createOrder = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => createSchema.parse(d)).handler(createOrder_createServerFn_handler, async ({ data, context }) => insertOrderRow(context.supabase, data, context.userId));
var createGuestOrder_createServerFn_handler = createServerRpc({
	id: "ee598dbe3c410e1ffa3e252af029e83311b8c1e958da7a0127463555fe6a5f8a",
	name: "createGuestOrder",
	filename: "src/lib/orders.functions.ts"
}, (opts) => createGuestOrder.__executeServer(opts));
var createGuestOrder = createServerFn({ method: "POST" }).inputValidator((d) => createSchema.parse(d)).handler(createGuestOrder_createServerFn_handler, async ({ data }) => insertOrderRow(supabase, data, null));
var verifySchema = objectType({
	order_id: stringType().uuid(),
	razorpay_order_id: stringType().min(1),
	razorpay_payment_id: stringType().min(1),
	razorpay_signature: stringType().min(1)
});
async function verifyAndMarkPaid(supabaseClient, data, callerUserId) {
	const secret = process.env.RAZORPAY_KEY_SECRET;
	if (!secret) throw new Error("Razorpay not configured");
	const { createHmac, timingSafeEqual } = await import("node:crypto");
	const expected = createHmac("sha256", secret).update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`).digest("hex");
	const a = Buffer.from(expected);
	const b = Buffer.from(data.razorpay_signature);
	if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("Invalid payment signature");
	const { data: existing } = await supabaseClient.from("orders").select("user_id, razorpay_order_id, timeline").eq("id", data.order_id).single();
	if (!existing || existing.razorpay_order_id !== data.razorpay_order_id) throw new Error("Order mismatch");
	if (existing.user_id && existing.user_id !== callerUserId) throw new Error("Forbidden");
	const newTimeline = [...Array.isArray(existing.timeline) ? existing.timeline : [], {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		status: "paid",
		note: "Payment received"
	}];
	const { error } = await supabaseClient.from("orders").update({
		status: "paid",
		razorpay_payment_id: data.razorpay_payment_id,
		timeline: newTimeline
	}).eq("id", data.order_id);
	if (error) throw new Error(error.message);
	return { ok: true };
}
var verifyRazorpay_createServerFn_handler = createServerRpc({
	id: "42e06eefd76cd7fc5258d5e9d07a37e00700eb20e59469c43c736ab5fce8334c",
	name: "verifyRazorpay",
	filename: "src/lib/orders.functions.ts"
}, (opts) => verifyRazorpay.__executeServer(opts));
var verifyRazorpay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => verifySchema.parse(d)).handler(verifyRazorpay_createServerFn_handler, async ({ data, context }) => verifyAndMarkPaid(context.supabase, data, context.userId));
var verifyRazorpayGuest_createServerFn_handler = createServerRpc({
	id: "9de4a5288d4e6418520fe943f8e9ffb932f806ab19c76c34bdb1889243c36148",
	name: "verifyRazorpayGuest",
	filename: "src/lib/orders.functions.ts"
}, (opts) => verifyRazorpayGuest.__executeServer(opts));
var verifyRazorpayGuest = createServerFn({ method: "POST" }).inputValidator((d) => verifySchema.parse(d)).handler(verifyRazorpayGuest_createServerFn_handler, async ({ data }) => verifyAndMarkPaid(supabase, data, null));
//#endregion
export { createGuestOrder_createServerFn_handler, createOrder_createServerFn_handler, verifyRazorpayGuest_createServerFn_handler, verifyRazorpay_createServerFn_handler };
