import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
import { getBlockedEntities } from "./security/fake-order-detector";

async function assertAdmin(supabaseClient: any, userId: string) {
  const { data, error } = await supabaseClient.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error || !data) {
    throw new Error("Forbidden: Administrator privileges required.");
  }
}

// ============================================================================
// 1. SECURITY DASHBOARD OVERVIEW
// ============================================================================
export const getSecurityOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    let totalCustomers = 0;
    let verifiedCustomers = 0;
    let totalOrders = 0;
    let codOrders = 0;
    let codVerifiedOrders = 0;
    let blockedCount = 0;
    let recentEvents: Array<{
      id: string;
      event_type: string;
      severity: string;
      actor_id: string | null;
      phone: string | null;
      email: string | null;
      created_at: string;
      metadata: Record<string, unknown>;
    }> = [];

    try {
      // 1. Profiles verification stats
      const { data: profs, count: profCount } = await supabase
        .from("profiles")
        .select("id, phone, phone_verified", { count: "exact" });

      if (profs) {
        totalCustomers = profCount || profs.length;
        verifiedCustomers = (profs as unknown as Array<{ phone_verified?: boolean }>).filter(
          (p) => p.phone_verified,
        ).length;
      }

      // 2. Orders stats
      const { data: ords } = await supabase
        .from("orders")
        .select("id, payment_method, phone_verified, verification_method, status")
        .is("deleted_at", null)
        .limit(1000);

      if (ords) {
        totalOrders = ords.length;
        const codList = ords.filter((o) => o.payment_method === "cod");
        codOrders = codList.length;
        codVerifiedOrders = codList.filter(
          (o) => (o as unknown as { phone_verified?: boolean }).phone_verified,
        ).length;
      }

      // 3. Blocked entities
      const blocked = await getBlockedEntities(supabase);
      blockedCount = blocked.emails.size + blocked.domains.size + blocked.phones.size;

      // 4. Recent security events
      const { data: evts } = await supabase
        .from("security_audit_events" as unknown as "orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (evts && Array.isArray(evts)) {
        recentEvents = evts as unknown as typeof recentEvents;
      }
    } catch (err) {
      console.warn("[Admin Security] Overview partial warning:", err);
    }

    return {
      totalCustomers,
      verifiedCustomers,
      unverifiedCustomers: Math.max(0, totalCustomers - verifiedCustomers),
      totalOrders,
      codOrders,
      codVerifiedOrders,
      codUnverifiedOrders: Math.max(0, codOrders - codVerifiedOrders),
      blockedEntitiesCount: blockedCount,
      recentEvents,
    };
  });

// ============================================================================
// 2. LIST BLOCKED ENTITIES (EMAILS, DOMAINS, PHONES)
// ============================================================================
export const listBlockedEntities = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    try {
      const { data, error } = await supabase
        .from("security_blocked_entities" as unknown as "orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { rows: data || [] };
    } catch {
      // Return hardcoded defaults if DB table pending
      const blocked = await getBlockedEntities(supabase);
      const rows = [
        ...Array.from(blocked.domains).map((d) => ({
          id: `domain_${d}`,
          type: "domain",
          value: d,
          reason: "Reserved test or disposable email domain",
          created_at: new Date().toISOString(),
        })),
        ...Array.from(blocked.emails).map((e) => ({
          id: `email_${e}`,
          type: "email",
          value: e,
          reason: "Blocked customer email",
          created_at: new Date().toISOString(),
        })),
      ];
      return { rows };
    }
  });

// ============================================================================
// 3. ADD BLOCKED ENTITY
// ============================================================================
const addBlockedSchema = z.object({
  type: z.enum(["email", "domain", "phone"]),
  value: z.string().trim().min(3).max(120),
  reason: z.string().trim().max(255).optional(),
});

export const addBlockedEntity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof addBlockedSchema>) => addBlockedSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    let cleanValue = data.value.toLowerCase();
    if (data.type === "domain") {
      cleanValue = cleanValue.replace(/^@/, "").trim();
    } else if (data.type === "phone") {
      cleanValue = cleanValue.replace(/\s+/g, "");
    }

    const { error } = await supabase
      .from("security_blocked_entities" as unknown as "orders")
      .insert({
        type: data.type,
        value: cleanValue,
        reason: data.reason || "Blocked by administrator",
        created_by: context.userId,
      } as never);

    if (error) {
      if (error.code === "23505") {
        throw new Error(`This ${data.type} is already on the blocked list.`);
      }
      throw new Error(error.message);
    }

    // Refresh memory cache
    await getBlockedEntities(supabase, true);

    return { ok: true, value: cleanValue };
  });

// ============================================================================
// 4. REMOVE BLOCKED ENTITY
// ============================================================================
export const removeBlockedEntity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { error } = await supabase
      .from("security_blocked_entities" as unknown as "orders")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    // Refresh memory cache
    await getBlockedEntities(supabase, true);

    return { ok: true };
  });

// ============================================================================
// 5. LIST SECURITY AUDIT EVENTS
// ============================================================================
export const listSecurityAuditEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data, error } = await supabase
      .from("security_audit_events" as unknown as "orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return { rows: data || [] };
  });
