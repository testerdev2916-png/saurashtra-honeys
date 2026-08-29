import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const itemSchema = z.object({
  slug: z.string().max(120),
  name: z.string().max(200),
  size: z.string().max(40),
  price: z.number().int().nonnegative(),
  qty: z.number().int().positive().max(999),
  image: z.string().max(2000).optional(),
});
const shippingSchema = z.object({
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().min(4).max(12),
  country: z.string().max(80).optional(),
});
const createSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  shipping: shippingSchema,
  items: z.array(itemSchema).min(1).max(50),
  payment_method: z.enum(["cod", "razorpay"]),
  notes: z.string().max(1000).optional(),
  coupon_code: z.string().trim().max(60).optional(),
  gift_note: z.string().trim().max(500).optional(),
});

async function resolveCoupon(supabaseClient: any, code: string | undefined, subtotalPaise: number) {
  if (!code) return { discount: 0, freeShipping: false, id: null as string | null, codeText: null as string | null };
    const { data } = await supabaseClient
    .from("coupons")
    .select("id,code,discount_type,discount_value,min_order_paise,max_discount_paise,usage_limit,usage_count,starts_at,expires_at,active")
    .ilike("code", code)
    .maybeSingle();
  if (!data) return { discount: 0, freeShipping: false, id: null, codeText: null };
  const c = data as {
    id: string; code: string; discount_type: string; discount_value: number;
    min_order_paise: number; max_discount_paise: number | null;
    usage_limit: number | null; usage_count: number; starts_at: string | null; expires_at: string | null; active: boolean;
  };
  const now = Date.now();
  if (!c.active) return { discount: 0, freeShipping: false, id: null, codeText: null };
  if (c.starts_at && new Date(c.starts_at).getTime() > now) return { discount: 0, freeShipping: false, id: null, codeText: null };
  if (c.expires_at && new Date(c.expires_at).getTime() < now) return { discount: 0, freeShipping: false, id: null, codeText: null };
  if (c.usage_limit != null && c.usage_count >= c.usage_limit) return { discount: 0, freeShipping: false, id: null, codeText: null };
  if (subtotalPaise < c.min_order_paise) return { discount: 0, freeShipping: false, id: null, codeText: null };
  let discount = 0;
  const freeShipping = c.discount_type === "free_shipping";
  if (c.discount_type === "percent") discount = Math.round(subtotalPaise * (c.discount_value / 100));
  else if (c.discount_type === "fixed") discount = c.discount_value * 100;
  if (c.max_discount_paise && discount > c.max_discount_paise) discount = c.max_discount_paise;
  if (discount > subtotalPaise) discount = subtotalPaise;
  return { discount, freeShipping, id: c.id, codeText: c.code };
}

async function razorpayCreateOrder(amountPaise: number, receipt: string) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, payment_capture: 1 }),
  });
  if (!res.ok) { const text = await res.text(); throw new Error(`Razorpay error [${res.status}]: ${text}`); }
  return (await res.json()) as { id: string; amount: number; currency: string };
}

async function insertOrderRow(supabaseClient: any, data: z.infer<typeof createSchema>, userId: string | null) {
  const subtotalPaise = data.items.reduce((s, i) => s + i.price * i.qty, 0) * 100;
  const coupon = await resolveCoupon(supabaseClient, data.coupon_code, subtotalPaise);
  const discountedSubtotal = subtotalPaise - coupon.discount;
  const shippingPaise = coupon.freeShipping || discountedSubtotal >= 79900 ? 0 : 4900;
  const totalPaise = discountedSubtotal + shippingPaise;

  const estDelivery = new Date(); estDelivery.setDate(estDelivery.getDate() + 5);

    const insert = {
    user_id: userId,
    email: data.email, phone: data.phone, full_name: data.full_name,
    shipping: data.shipping, items: data.items,
    subtotal_paise: subtotalPaise,
    shipping_paise: shippingPaise,
    total_paise: totalPaise,
    discount_paise: coupon.discount,
    coupon_code: coupon.codeText,
    gift_note: data.gift_note ?? null,
    estimated_delivery: estDelivery.toISOString().slice(0, 10),
    payment_method: data.payment_method,
    status: (data.payment_method === "cod" ? "processing" : "pending") as "processing" | "pending",
    timeline: [{ at: new Date().toISOString(), status: "created", note: "Order placed" }],
    notes: data.notes ?? null,
  };
  const { data: row, error } = await supabaseClient.from("orders").insert(insert as never).select("id, order_number").single();
  if (error) throw new Error(error.message);

  if (coupon.id) {
    await supabaseClient.from("coupon_redemptions").insert({ coupon_id: coupon.id, user_id: userId, order_id: row.id, discount_paise: coupon.discount } as never);
    const { data: cur } = await supabaseClient.from("coupons").select("usage_count").eq("id", coupon.id).single();
    if (cur) await supabaseClient.from("coupons").update({ usage_count: (cur.usage_count ?? 0) + 1 }).eq("id", coupon.id);
  }

  // Customer notification for signed-in users
  if (userId) {
    await supabaseClient.from("notifications").insert({
      user_id: userId, kind: "order",
      title: `Order ${row.order_number ?? ""} placed`,
      body: `Your order for ₹${(totalPaise/100).toFixed(0)} has been received.`,
      link: `/order/${row.id}`,
      metadata: { order_id: row.id, order_number: row.order_number },
    } as never);
  }

  if (data.payment_method === "razorpay") {
    const rp = await razorpayCreateOrder(totalPaise, `order_${row.id.slice(0, 30)}`);
    await supabaseClient.from("orders").update({ razorpay_order_id: rp.id }).eq("id", row.id);
    return { orderId: row.id, orderNumber: row.order_number, razorpay: { keyId: process.env.RAZORPAY_KEY_ID!, orderId: rp.id, amount: rp.amount, currency: rp.currency }, totals: { subtotalPaise, shippingPaise, totalPaise, discountPaise: coupon.discount } };
  }
  return { orderId: row.id, orderNumber: row.order_number, razorpay: null as null, totals: { subtotalPaise, shippingPaise, totalPaise, discountPaise: coupon.discount } };
}

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof createSchema>) => createSchema.parse(d))
  .handler(async ({ data, context }) => insertOrderRow(context.supabase, data, context.userId));

export const createGuestOrder = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof createSchema>) => createSchema.parse(d))
  .handler(async ({ data }) => insertOrderRow(supabase, data, null));

const verifySchema = z.object({
  order_id: z.string().uuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

async function verifyAndMarkPaid(supabaseClient: any, data: z.infer<typeof verifySchema>, callerUserId: string | null) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Razorpay not configured");
  const { createHmac, timingSafeEqual } = await import("node:crypto");
  const expected = createHmac("sha256", secret).update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`).digest("hex");
  const a = Buffer.from(expected); const b = Buffer.from(data.razorpay_signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("Invalid payment signature");

    const { data: existing } = await supabaseClient.from("orders").select("user_id, razorpay_order_id, timeline").eq("id", data.order_id).single();
  if (!existing || existing.razorpay_order_id !== data.razorpay_order_id) throw new Error("Order mismatch");
  if (existing.user_id && existing.user_id !== callerUserId) throw new Error("Forbidden");

  const existingTimeline = Array.isArray(existing.timeline) ? (existing.timeline as unknown[]) : [];
  const newTimeline = [...existingTimeline, { at: new Date().toISOString(), status: "paid", note: "Payment received" }];
  const { error } = await supabaseClient.from("orders").update({
    status: "paid", razorpay_payment_id: data.razorpay_payment_id, timeline: newTimeline as never,
  }).eq("id", data.order_id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export const verifyRazorpay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof verifySchema>) => verifySchema.parse(d))
  .handler(async ({ data, context }) => verifyAndMarkPaid(context.supabase, data, context.userId));

export const verifyRazorpayGuest = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof verifySchema>) => verifySchema.parse(d))
  .handler(async ({ data }) => verifyAndMarkPaid(supabase, data, null));
