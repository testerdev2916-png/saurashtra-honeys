import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255).transform((s) => s.toLowerCase());

function token() { return crypto.randomUUID().replace(/-/g, "") + Math.random().toString(36).slice(2, 10); }

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; source?: string }) =>
    ({ email: emailSchema.parse(input.email), source: (input.source ?? "footer").slice(0, 60) }))
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const confirm = token(), unsub = token();
    const { data: existing } = await supabase
      .from("newsletter_subscribers").select("id, confirmed_at, unsubscribed_at, confirm_token, unsubscribe_token")
      .eq("email", data.email).maybeSingle();
    if (existing?.confirmed_at && !existing.unsubscribed_at) {
      return { ok: true, already: true };
    }
    if (existing) {
      await supabase.from("newsletter_subscribers").update({
        source: data.source, confirm_token: existing.confirm_token ?? confirm,
        unsubscribe_token: existing.unsubscribe_token ?? unsub, unsubscribed_at: null,
      }).eq("id", existing.id);
    } else {
      await supabase.from("newsletter_subscribers").insert({
        email: data.email, source: data.source, confirm_token: confirm, unsubscribe_token: unsub,
      });
    }
    return { ok: true, already: false };
  });

export const confirmNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => ({ token: String(input.token).slice(0, 128) }))
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: row } = await supabase.from("newsletter_subscribers")
      .select("id, confirmed_at").eq("confirm_token", data.token).maybeSingle();
    if (!row) throw new Error("Invalid or expired link");
    if (!row.confirmed_at) {
      await supabase.from("newsletter_subscribers")
        .update({ confirmed_at: new Date().toISOString() }).eq("id", row.id);
    }
    return { ok: true };
  });

export const unsubscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => ({ token: String(input.token).slice(0, 128) }))
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("unsubscribe_token", data.token);
    if (error) throw error;
    return { ok: true };
  });
