import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CartItem = z.object({
  slug: z.string().max(120), name: z.string().max(200),
  qty: z.number().int().min(1).max(999), price: z.number().min(0), size: z.string().max(40).optional(),
});

export const trackAbandonedCart = createServerFn({ method: "POST" })
  .inputValidator((input: { session_id: string; email?: string | null; full_name?: string | null; items: unknown[]; subtotal_paise: number }) => ({
    session_id: String(input.session_id).slice(0, 120),
    email: input.email ? z.string().trim().email().max(255).parse(input.email).toLowerCase() : null,
    full_name: input.full_name ? String(input.full_name).slice(0, 160) : null,
    items: z.array(CartItem).max(50).parse(input.items),
    subtotal_paise: Math.max(0, Math.floor(input.subtotal_paise)),
  }))
  .handler(async ({ data }) => {
    if (!data.items.length) return { ok: true };
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("abandoned_carts").upsert({
      session_id: data.session_id, email: data.email, full_name: data.full_name,
      cart: data.items, subtotal_paise: data.subtotal_paise,
    }, { onConflict: "session_id" });
    return { ok: true };
  });
