import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password | Saurashtra Honey" },
      { name: "description", content: "Request a secure link to reset your Saurashtra Honey account password." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Check your inbox for the reset link.");
    } catch (e) {
      toast.error((e as Error).message || "Could not send reset email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <div className="container-page py-16 max-w-md">
        <SectionEyebrow>Password reset</SectionEyebrow>
        <h1 className="mt-2 font-serif text-4xl text-forest-dark">Forgot password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your email and we'll send you a secure link to set a new one.</p>
        {sent ? (
          <div className="mt-6 bg-cream border border-gold/40 rounded-xl p-4 text-sm text-forest-dark">
            If an account exists for <b>{email}</b>, a reset link is on its way. It expires in 1 hour.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep" />
            <button disabled={busy} className="w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60">
              {busy ? "SENDING…" : "SEND RESET LINK"}
            </button>
          </form>
        )}
        <div className="mt-6 text-xs">
          <Link to="/auth" className="text-gold-deep hover:underline">← Back to sign in</Link>
        </div>
      </div>
    </SiteLayout>
  );
}
