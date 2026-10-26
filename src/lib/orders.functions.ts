import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
import { sendWhatsAppOrderAlert } from "./whatsapp.functions";

const itemSchema = z.object({
  slug: z.string().max(120),
  name: z.string().max(200),
  size: z.string().max(40),
  price: z.number().int().nonnegative(),
  qty: z.number().int().positive().max(999),
  image: z.string().max(2000).optional(),
  variantId: z.string().optional(),
  sku: z.string().optional(),
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

async function resolveCoupon(
  supabaseClient: SupabaseClient<Database>,
  code: string | undefined,
  subtotalPaise: number,
) {
  if (!code)
    return {
      discount: 0,
      freeShipping: false,
      id: null as string | null,
      codeText: null as string | null,
    };
  const { data } = await supabaseClient
    .from("coupons")
    .select(
      "id,code,discount_type,discount_value,min_order_paise,max_discount_paise,usage_limit,usage_count,starts_at,expires_at,active",
    )
    .ilike("code", code)
    .maybeSingle();
  if (!data) return { discount: 0, freeShipping: false, id: null, codeText: null };
  const c = data as {
    id: string;
    code: string;
    discount_type: string;
    discount_value: number;
    min_order_paise: number;
    max_discount_paise: number | null;
    usage_limit: number | null;
    usage_count: number;
    starts_at: string | null;
    expires_at: string | null;
    active: boolean;
  };
  const now = Date.now();
  if (!c.active) return { discount: 0, freeShipping: false, id: null, codeText: null };
  if (c.starts_at && new Date(c.starts_at).getTime() > now)
    return { discount: 0, freeShipping: false, id: null, codeText: null };
  if (c.expires_at && new Date(c.expires_at).getTime() < now)
    return { discount: 0, freeShipping: false, id: null, codeText: null };
  if (c.usage_limit != null && c.usage_count >= c.usage_limit)
    return { discount: 0, freeShipping: false, id: null, codeText: null };
  if (subtotalPaise < c.min_order_paise)
    return { discount: 0, freeShipping: false, id: null, codeText: null };
  let discount = 0;
  const freeShipping = c.discount_type === "free_shipping";
  if (c.discount_type === "percent")
    discount = Math.round(subtotalPaise * (c.discount_value / 100));
  else if (c.discount_type === "fixed") discount = c.discount_value * 100;
  if (c.max_discount_paise && discount > c.max_discount_paise) discount = c.max_discount_paise;
  if (discount > subtotalPaise) discount = subtotalPaise;
  return { discount, freeShipping, id: c.id, codeText: c.code };
}

async function razorpayCreateOrder(amountPaise: number, receipt: string) {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
  if (!keyId || !keySecret)
    throw new Error(
      "Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    );
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, payment_capture: 1 }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay error [${res.status}]: ${text}`);
  }
  return (await res.json()) as { id: string; amount: number; currency: string };
}

async function insertOrderRow(
  supabaseClient: SupabaseClient<Database>,
  data: z.infer<typeof createSchema>,
  userId: string | null,
) {
  // SERVER-SIDE ENFORCEMENT: Guest orders are prohibited
  if (!userId) {
    throw new Error(
      "Authentication required. Please sign in or create an account to complete your order.",
    );
  }

  const subtotalPaise = data.items.reduce((s, i) => s + i.price * i.qty, 0) * 100;
  const coupon = await resolveCoupon(supabaseClient, data.coupon_code, subtotalPaise);
  const discountedSubtotal = subtotalPaise - coupon.discount;
  const shippingPaise = coupon.freeShipping || discountedSubtotal >= 79900 ? 0 : 4900;
  const totalPaise = discountedSubtotal + shippingPaise;

  const estDelivery = new Date();
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
    status: (data.payment_method === "cod" ? "processing" : "pending") as "processing" | "pending",
    timeline: [{ at: new Date().toISOString(), status: "created", note: "Order placed" }],
    notes: data.notes ?? null,
  };
  const { data: row, error } = await supabaseClient
    .from("orders")
    .insert(insert as never)
    .select("id, order_number")
    .single();
  if (error) throw new Error(error.message);

  if (coupon.id) {
    await supabaseClient.from("coupon_redemptions").insert({
      coupon_id: coupon.id,
      user_id: userId,
      order_id: row.id,
      discount_paise: coupon.discount,
    } as never);
    const { data: cur } = await supabaseClient
      .from("coupons")
      .select("usage_count")
      .eq("id", coupon.id)
      .single();
    if (cur)
      await supabaseClient
        .from("coupons")
        .update({ usage_count: (cur.usage_count ?? 0) + 1 })
        .eq("id", coupon.id);
  }

  // Customer notification for signed-in users
  await supabaseClient.from("notifications").insert({
    user_id: userId,
    kind: "order",
    title: `Order ${row.order_number ?? ""} placed`,
    body: `Your order for ₹${(totalPaise / 100).toFixed(0)} has been received.`,
    link: `/order/${row.id}`,
    metadata: { order_id: row.id, order_number: row.order_number },
  } as never);

  if (data.payment_method === "razorpay") {
    const rp = await razorpayCreateOrder(totalPaise, `order_${row.id.slice(0, 30)}`);
    await supabaseClient.from("orders").update({ razorpay_order_id: rp.id }).eq("id", row.id);
    return {
      orderId: row.id,
      orderNumber: row.order_number,
      razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID!.trim(),
        orderId: rp.id,
        amount: rp.amount,
        currency: rp.currency,
      },
      totals: { subtotalPaise, shippingPaise, totalPaise, discountPaise: coupon.discount },
    };
  }

  if (data.payment_method === "cod") {
    await sendWhatsAppOrderAlert({
      customerName: data.full_name,
      orderNumber: row.order_number || "N/A",
      phone: data.phone,
      paymentMethod: "cod",
      total: totalPaise,
    });
  }

  return {
    orderId: row.id,
    orderNumber: row.order_number,
    razorpay: null as null,
    totals: { subtotalPaise, shippingPaise, totalPaise, discountPaise: coupon.discount },
  };
}

// Authenticated order creation
export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof createSchema>) => createSchema.parse(d))
  .handler(async ({ data, context }) => insertOrderRow(context.supabase, data, context.userId));

// Disabled guest checkout entry point - strictly rejects all unauthenticated order attempts
export const createGuestOrder = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof createSchema>) => createSchema.parse(d))
  .handler(async () => {
    throw new Error(
      "Guest checkout is completely disabled. Please sign in or create an account to place an order.",
    );
  });

export const verifySchema = z.object({
  order_id: z.string().uuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function verifyAndMarkPaid(
  supabaseClient: SupabaseClient<Database>,
  data: z.infer<typeof verifySchema>,
  callerUserId?: string | null,
) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Razorpay not configured");
  const { createHmac, timingSafeEqual } = await import("node:crypto");
  const expected = createHmac("sha256", secret)
    .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(data.razorpay_signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("Invalid payment signature");

  const { data: existing } = await supabaseClient
    .from("orders")
    .select(
      "user_id, razorpay_order_id, timeline, status, items, full_name, order_number, phone, payment_method, total_paise",
    )
    .eq("id", data.order_id)
    .single();

  if (!existing || existing.razorpay_order_id !== data.razorpay_order_id)
    throw new Error("Order mismatch");

  // Enforce caller authorization
  if (callerUserId !== undefined) {
    if (!callerUserId) throw new Error("Authentication required to verify payment");
    if (existing.user_id && existing.user_id !== callerUserId) {
      throw new Error("Forbidden: Order does not belong to your account.");
    }
  }

  // Idempotency: prevent duplicate processing
  if (existing.status === "paid") {
    return { ok: true, already_paid: true };
  }

  const existingTimeline = Array.isArray(existing.timeline) ? (existing.timeline as unknown[]) : [];
  const newTimeline = [
    ...existingTimeline,
    { at: new Date().toISOString(), status: "paid", note: "Payment received via Razorpay" },
  ];

  const { error } = await supabaseClient
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id: data.razorpay_payment_id,
      timeline: newTimeline as never,
    })
    .eq("id", data.order_id);
  if (error) throw new Error(error.message);

  await sendWhatsAppOrderAlert({
    customerName: existing.full_name || "Customer",
    orderNumber: existing.order_number || "N/A",
    phone: existing.phone || "",
    paymentMethod: existing.payment_method || "razorpay",
    total: existing.total_paise || 0,
  });

  // Inventory Deduction
  if (Array.isArray(existing.items)) {
    const itemsList = existing.items as unknown as Array<{
      slug?: string;
      size?: string;
      qty?: number;
    }>;
    for (const item of itemsList) {
      if (!item.slug || !item.size || !item.qty) continue;

      const { data: pData } = await supabaseClient
        .from("products")
        .select("id")
        .eq("canonical_url", item.slug)
        .maybeSingle();
      if (!pData) continue;

      const { data: vData } = await supabaseClient
        .from("product_variants")
        .select("id, stock_quantity")
        .eq("product_id", pData.id)
        .eq("label", item.size)
        .maybeSingle();

      if (vData) {
        const newStock = Math.max(0, (vData.stock_quantity || 0) - item.qty);
        await supabaseClient
          .from("product_variants")
          .update({ stock_quantity: newStock })
          .eq("id", vData.id);

        await supabaseClient.from("inventory_history").insert({
          product_id: pData.id,
          change: -item.qty,
          reason: "sale",
          reference_id: data.order_id,
        });
      }
    }
  }

  return { ok: true };
}

// Authenticated Razorpay payment verification
export const verifyRazorpay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof verifySchema>) => verifySchema.parse(d))
  .handler(async ({ data, context }) => verifyAndMarkPaid(context.supabase, data, context.userId));

// Disabled guest payment verification
export const verifyRazorpayGuest = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof verifySchema>) => verifySchema.parse(d))
  .handler(async () => {
    throw new Error("Guest checkout is completely disabled. Please sign in to verify payments.");
  });

// ============================================================================
// GUEST ORDER CLAIMING SYSTEM
// ============================================================================

/**
 * Claim eligible historical guest orders whose user_id is NULL matching the
 * verified email address of the authenticated Supabase customer.
 * - Idempotent: repeated calls claim 0 additional orders without error.
 * - Secure: email ownership is cryptographically verified via Supabase Auth.
 * - Preserves: all order IDs, order numbers, line items, status, payments, and shipping.
 */
export const claimGuestOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;
    if (!userId) throw new Error("Unauthorized");

    // Fetch user from Supabase Auth admin API to verify email ownership status
    const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(userId);
    if (userErr || !userData?.user) {
      throw new Error("Could not retrieve customer account details.");
    }

    const user = userData.user;
    if (!user.email) {
      throw new Error("Account has no verified email address.");
    }

    // Require verified email ownership via Supabase Auth
    if (!user.email_confirmed_at) {
      throw new Error("Please verify your email address to claim previous orders.");
    }

    const normalizedEmail = user.email.trim().toLowerCase();

    // Try calling stored procedure if deployed
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc(
        "claim_guest_orders_for_user" as unknown as "is_staff",
        {
          _target_user_id: userId,
          _target_email: normalizedEmail,
          _method: "supabase_auth_verified",
        } as never,
      );

      if (!rpcErr && rpcRes && typeof rpcRes === "object") {
        const res = rpcRes as unknown as {
          success: boolean;
          claimed_count: number;
          claimed_ids: string[];
        };
        return {
          success: true,
          claimedCount: res.claimed_count || 0,
          claimedIds: res.claimed_ids || [],
          email: normalizedEmail,
        };
      }
    } catch {
      // Stored procedure fallback executed below
    }

    // Direct atomic claiming logic using service-role client:
    // Only claim orders where user_id IS NULL and email matches normalizedEmail
    const { data: guestOrders, error: fetchErr } = await supabase
      .from("orders")
      .select("id, order_number, status, timeline, email, user_id")
      .is("user_id", null);

    if (fetchErr) throw new Error(fetchErr.message);

    const matching = (guestOrders || []).filter(
      (o: { user_id: string | null; email: string | null }) =>
        o.user_id === null && (o.email || "").trim().toLowerCase() === normalizedEmail,
    );

    if (matching.length === 0) {
      return { success: true, claimedCount: 0, claimedIds: [], email: normalizedEmail };
    }

    const claimedIds: string[] = [];
    for (const order of matching) {
      const existingTimeline = Array.isArray(order.timeline) ? (order.timeline as unknown[]) : [];
      const newTimeline = [
        ...existingTimeline,
        {
          at: new Date().toISOString(),
          status: order.status,
          note: `Historical guest order claimed by verified account ${normalizedEmail}`,
        },
      ];

      // Atomic update: only updates if user_id is STILL null
      const { error: updErr } = await supabase
        .from("orders")
        .update({
          user_id: userId,
          timeline: newTimeline as never,
        })
        .eq("id", order.id)
        .is("user_id", null);

      if (!updErr) {
        claimedIds.push(order.id);

        // Record in audit_logs
        await supabase.from("audit_logs").insert({
          actor_id: userId,
          action: "order.claimed_from_guest",
          entity_type: "order",
          entity_id: order.id,
          metadata: {
            order_number: order.order_number,
            email: normalizedEmail,
            claimed_at: new Date().toISOString(),
            method: "supabase_auth_verified",
          },
        });

        // Record in order_claims_audit if table is created
        try {
          await supabase.from("order_claims_audit" as unknown as "orders").insert({
            order_id: order.id,
            user_id: userId,
            claimed_email: normalizedEmail,
            claim_method: "supabase_auth_verified",
            metadata: { order_number: order.order_number },
          } as never);
        } catch {
          // Fallback gracefully if migration is pending sync
        }

        // Send customer in-app notification
        await supabase.from("notifications").insert({
          user_id: userId,
          kind: "order",
          title: `Past Order ${order.order_number || ""} Claimed`,
          body: `Your earlier order #${order.order_number || order.id.slice(0, 8)} is now linked to your account.`,
          link: `/order/${order.id}`,
          metadata: { order_id: order.id, order_number: order.order_number },
        } as never);
      }
    }

    return {
      success: true,
      claimedCount: claimedIds.length,
      claimedIds,
      email: normalizedEmail,
    };
  });

/**
 * Request a single-use expiring verification code for claiming guest orders
 * placed under a secondary email address that differs from primary account email.
 */
export const requestSecondaryEmailClaimCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string }) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const normalizedEmail = data.email.trim().toLowerCase();

    // Check if there are any unclaimed orders for this email
    const { data: orders, error: oErr } = await supabase
      .from("orders")
      .select("id, email, user_id")
      .is("user_id", null);

    if (oErr) throw new Error(oErr.message);

    const count = (orders || []).filter(
      (o: { user_id: string | null; email: string | null }) =>
        o.user_id === null && (o.email || "").trim().toLowerCase() === normalizedEmail,
    ).length;

    if (count === 0) {
      return { ok: false, error: "No unclaimed guest orders found with this email address." };
    }

    // Generate secure 6-digit numeric OTP code
    const { randomInt, createHash } = await import("node:crypto");
    const code = String(randomInt(100000, 999999));
    const tokenHash = createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    try {
      await supabase.from("email_claim_verifications" as unknown as "orders").insert({
        user_id: userId,
        email: normalizedEmail,
        token_hash: tokenHash,
        expires_at: expiresAt,
      } as never);
    } catch (e) {
      console.warn("Could not record in email_claim_verifications:", e);
    }

    console.log(`[Guest Order Claim] Verification code for ${normalizedEmail}: ${code}`);

    return {
      ok: true,
      message: `A 6-digit verification code has been generated for ${normalizedEmail}. It expires in 15 minutes.`,
      debugCode: process.env.NODE_ENV !== "production" ? code : undefined,
    };
  });

/**
 * Verify secondary email ownership using the single-use expiring token
 * and claim eligible guest orders.
 */
export const verifySecondaryEmailClaimCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; code: string }) =>
    z.object({ email: z.string().trim().email(), code: z.string().trim().min(6).max(10) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const normalizedEmail = data.email.trim().toLowerCase();
    const { createHash } = await import("node:crypto");
    const tokenHash = createHash("sha256").update(data.code).digest("hex");

    const { data: verifs, error: vErr } = await supabase
      .from("email_claim_verifications" as unknown as "orders")
      .select("*")
      .eq("user_id" as never, userId as never)
      .eq("email" as never, normalizedEmail as never)
      .is("used_at" as never, null)
      .gt("expires_at" as never, new Date().toISOString() as never)
      .order("created_at" as never, { ascending: false })
      .limit(1);

    if (vErr || !verifs || verifs.length === 0) {
      throw new Error("Invalid or expired verification code. Please request a new one.");
    }

    const record = verifs[0] as unknown as { attempts?: number; token_hash: string; id: string };
    if ((record.attempts || 0) >= 5) {
      throw new Error("Too many failed attempts. Please request a new code.");
    }

    if (record.token_hash !== tokenHash) {
      await supabase
        .from("email_claim_verifications" as unknown as "orders")
        .update({ attempts: (record.attempts || 0) + 1 } as never)
        .eq("id" as never, record.id as never);
      throw new Error("Incorrect verification code.");
    }

    // Mark single-use token as used immediately
    await supabase
      .from("email_claim_verifications" as unknown as "orders")
      .update({ used_at: new Date().toISOString() } as never)
      .eq("id" as never, record.id as never);

    // Claim eligible orders
    const { data: guestOrders } = await supabase
      .from("orders")
      .select("id, order_number, status, timeline, email, user_id")
      .is("user_id", null);

    const matching = (guestOrders || []).filter(
      (o: { user_id: string | null; email: string | null }) =>
        o.user_id === null && (o.email || "").trim().toLowerCase() === normalizedEmail,
    );

    const claimedIds: string[] = [];
    for (const order of matching) {
      const existingTimeline = Array.isArray(order.timeline) ? order.timeline : [];
      const newTimeline = [
        ...existingTimeline,
        {
          at: new Date().toISOString(),
          status: order.status,
          note: `Historical guest order claimed via verified secondary email code for ${normalizedEmail}`,
        },
      ];

      const { error: updErr } = await supabase
        .from("orders")
        .update({ user_id: userId, timeline: newTimeline as never })
        .eq("id", order.id)
        .is("user_id", null);

      if (!updErr) {
        claimedIds.push(order.id);
        await supabase.from("audit_logs").insert({
          actor_id: userId,
          action: "order.claimed_from_guest",
          entity_type: "order",
          entity_id: order.id,
          metadata: {
            order_number: order.order_number,
            email: normalizedEmail,
            method: "verified_email_token",
          },
        });

        try {
          await supabase.from("order_claims_audit" as unknown as "orders").insert({
            order_id: order.id,
            user_id: userId,
            claimed_email: normalizedEmail,
            claim_method: "verified_email_token",
            metadata: { order_number: order.order_number },
          } as never);
        } catch {
          // ignore
        }
      }
    }

    return { success: true, claimedCount: claimedIds.length, claimedIds };
  });

/**
 * Fetch order details with strict server-side authorization check.
 */
export const getOrderDetails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!order) return { ok: false, order: null };

    const isOwner = order.user_id === userId;
    let isStaff = false;
    if (!isOwner) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .in("role", ["admin", "super_admin", "manager"])
        .maybeSingle();
      isStaff = !!roleData;
    }

    if (!isOwner && !isStaff) {
      throw new Error("You do not have permission to view this order.");
    }

    return { ok: true, order };
  });
