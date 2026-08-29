import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const updateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { data: unknown }) => input)
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!role) throw new Error("Forbidden");
        const { error } = await context.supabase
      .from("app_settings")
      .upsert({ id: 1, data: data.data as never, updated_by: context.userId, updated_at: new Date().toISOString() });
    if (error) throw error;
    await context.supabase.rpc("log_audit", { _action: "settings.update", _entity_type: "app_settings", _entity_id: "1", _metadata: {} });
    return { ok: true };
  });
