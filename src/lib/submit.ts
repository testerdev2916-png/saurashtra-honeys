import { supabase } from "@/integrations/supabase/client";

export type FormType = "bulk_order" | "contact" | "partner" | "newsletter";

export type SubmissionPayload = {
  form_type: FormType;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  city?: string;
  subject?: string;
  message?: string;
  quantity?: string;
  product_interest?: string;
  meta?: Record<string, unknown>;
};

export async function submitForm(p: SubmissionPayload) {
  const row = { ...p, meta: (p.meta ?? {}) as never };
  const { error } = await supabase.from("form_submissions").insert(row);
  if (error) throw error;
  // Fire-and-forget notification (email once domain is configured)
  fetch("/api/public/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
    keepalive: true,
  }).catch(() => {});
  return { ok: true as const };
}
