import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const validateSchema = z.object({
  code: z.string().trim().min(1).max(60),
  subtotal_paise: z.number().int().nonnegative(),
});

type ValidResult = {
  ok: true;
  code: string;
  discount_type: "percent" | "fixed" | "free_shipping";
  discount_value: number;
  discount_paise: number;      // amount to subtract from subtotal
  free_shipping: boolean;
  description: string | null;
};
type InvalidResult = { ok: false; error: string };

async function validateCoupon(supabase: any, code: string, subtotal_paise: number): Promise<ValidResult | InvalidResult> {
    const { data, error } = await supabase
    .from("coupons")
    .select("id,code,discount_type,discount_value,min_order_paise,max_discount_paise,usage_limit,usage_count,starts_at,expires_at,active,description")
    .ilike("code", code)
    .maybeSingle();
  if (error || !data) return { ok: false, error: "Invalid coupon code" };
  const c = data as {
    id: string; code: string; discount_type: string; discount_value: number;
    min_order_paise: number; max_discount_paise: number | null; usage_limit: number | null;
    usage_count: number; starts_at: string | null; expires_at: string | null; active: boolean; description: string | null;
  };
  const now = Date.now();
  if (!c.active) return { ok: false, error: "Coupon is not active" };
  if (c.starts_at && new Date(c.starts_at).getTime() > now) return { ok: false, error: "Coupon hasn't started yet" };
  if (c.expires_at && new Date(c.expires_at).getTime() < now) return { ok: false, error: "Coupon has expired" };
  if (c.usage_limit != null && c.usage_count >= c.usage_limit) return { ok: false, error: "Coupon has reached its usage limit" };
  if (subtotal_paise < c.min_order_paise) {
    return { ok: false, error: `Add ₹${((c.min_order_paise - subtotal_paise) / 100).toFixed(0)} more to use this coupon` };
  }
  let discount = 0;
  const free = c.discount_type === "free_shipping";
  if (c.discount_type === "percent") discount = Math.round(subtotal_paise * (c.discount_value / 100));
  else if (c.discount_type === "fixed") discount = c.discount_value * 100;
  if (c.max_discount_paise && discount > c.max_discount_paise) discount = c.max_discount_paise;
  if (discount > subtotal_paise) discount = subtotal_paise;
  return {
    ok: true, code: c.code,
    discount_type: c.discount_type as ValidResult["discount_type"],
    discount_value: c.discount_value, discount_paise: discount,
    free_shipping: free, description: c.description,
  };
}

export const validateCouponFn = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof validateSchema>) => validateSchema.parse(d))
  .handler(async ({ data }) => validateCoupon(supabase, data.code, data.subtotal_paise));

// Public order tracking — anon RPC to look up by order number + email.
const trackSchema = z.object({
  order_number: z.string().trim().min(3).max(60),
  email: z.string().trim().email().max(255),
});
export const trackOrderFn = createServerFn({ method: "POST" })
  .inputValidator((d: z.infer<typeof trackSchema>) => trackSchema.parse(d))
  .handler(async ({ data }) => {
        const { data: rows, error } = await supabase.rpc("track_order", { _order_number: data.order_number.trim(), _email: data.email.trim() });
    if (error) throw new Error(error.message);
    const row = (rows as unknown as Array<Record<string, unknown>> | null)?.[0];
    if (!row) return { ok: false, order: null };
    // JSON-safe passthrough
    return { ok: true, order: JSON.parse(JSON.stringify(row)) as Record<string, string | number | boolean | null | object> };
  });
