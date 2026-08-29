import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_admin_if_none");
    if (error) throw new Error(error.message);
    return { claimed: !!data };
  });

const listSchema = z.object({
  form_type: z.string().optional(),
  q: z.string().optional(),
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const listSubmissions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof listSchema>) => listSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
        let q = context.supabase.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(1000);
    if (data.form_type && data.form_type !== "all") q = q.eq("form_type", data.form_type);
    if (data.status && data.status !== "all") q = q.eq("status", data.status);
    if (data.from) q = q.gte("created_at", data.from);
    if (data.to) q = q.lte("created_at", data.to);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const term = (data.q ?? "").trim().toLowerCase();
    const filtered = term
      ? (rows ?? []).filter((r) =>
          [r.name, r.email, r.phone, r.company, r.city, r.subject, r.message, r.product_interest, r.quantity]
            .filter(Boolean).join(" ").toLowerCase().includes(term))
      : rows ?? [];
    return { rows: filtered };
  });

export const getSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
        const { data: row, error } = await context.supabase.from("form_submissions").select("*").eq("id", data.id).single();
    if (error) throw new Error(error.message);
    return { row };
  });

export const updateSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status?: string; admin_notes?: string }) =>
    z.object({ id: z.string().uuid(), status: z.string().max(40).optional(), admin_notes: z.string().max(4000).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
        const patch: { status?: string; admin_notes?: string } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.admin_notes !== undefined) patch.admin_notes = data.admin_notes;
    const { error } = await context.supabase.from("form_submissions").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { status?: string; q?: string; from?: string; to?: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
        let q = context.supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(1000);
    if (data.status && data.status !== "all") q = q.eq("status", data.status as never);
    if (data.from) q = q.gte("created_at", data.from);
    if (data.to) q = q.lte("created_at", data.to);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    const term = (data.q ?? "").trim().toLowerCase();
    const filtered = term
      ? (rows ?? []).filter((r) =>
          [r.email, r.phone, r.full_name, r.razorpay_order_id, r.id].filter(Boolean).join(" ").toLowerCase().includes(term))
      : rows ?? [];
    return { rows: filtered };
  });

export const updateOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status?: string; admin_notes?: string }) =>
    z.object({ id: z.string().uuid(), status: z.string().max(40).optional(), admin_notes: z.string().max(4000).optional() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
        const patch: { status?: string; admin_notes?: string } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.admin_notes !== undefined) patch.admin_notes = data.admin_notes;
    const { error } = await context.supabase.from("orders").update(patch as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
