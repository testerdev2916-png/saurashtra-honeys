import { createFileRoute } from "@tanstack/react-router";

// Public endpoint that receives form-submission notifications and (once an email
// domain is configured) forwards a summary to the owner via Lovable's email API.
// Row insert already happened client-side under the public RLS insert policy;
// this endpoint is best-effort notification only.

const OWNER_EMAIL = "saurashtra.honey@gmail.com";

export const Route = createFileRoute("/api/public/submissions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = await request.json().catch(() => ({}));
          const apiKey = process.env.LOVABLE_API_KEY;
          const senderDomain = process.env.LOVABLE_EMAIL_SENDER_DOMAIN;
          if (!apiKey || !senderDomain) {
            return Response.json({ ok: true, emailed: false, reason: "email_domain_not_configured" });
          }
          const lines = Object.entries(payload)
            .filter(([, v]) => v !== undefined && v !== null && v !== "")
            .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${k}</td><td style="padding:4px 0">${typeof v === "object" ? JSON.stringify(v) : String(v)}</td></tr>`)
            .join("");
          const subject = `New ${payload.form_type ?? "form"} submission — Saurashtra Honey`;
          const html = `<div style="font-family:Arial,sans-serif;color:#1b3a2b"><h2 style="font-family:Georgia,serif">New submission</h2><table>${lines}</table></div>`;
          const res = await fetch("https://api.lovable.app/v1/emails/send", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: `Saurashtra Honey <notify@${senderDomain}>`,
              to: OWNER_EMAIL,
              subject,
              html,
            }),
          });
          return Response.json({ ok: true, emailed: res.ok });
        } catch {
          return Response.json({ ok: true, emailed: false });
        }
      },
    },
  },
});
