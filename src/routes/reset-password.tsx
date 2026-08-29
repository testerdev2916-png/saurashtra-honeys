import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | Saurashtra Honey" },
      { name: "description", content: "Choose a new password for your Saurashtra Honey account." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  // Supabase parses the recovery hash and fires PASSWORD_RECOVERY.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // If the link was already consumed on this tab, session may already exist.
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/account" });
    } catch (e) {
      toast.error((e as Error).message || "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout>
      <div className="container-page py-16 max-w-md">
        <SectionEyebrow>New password</SectionEyebrow>
        <h1 className="mt-2 font-serif text-4xl text-forest-dark">Set a new password</h1>
        {!ready ? (
          <p className="mt-4 text-sm text-muted-foreground">Open this page from the reset link in your email. If the link expired, <Link to="/forgot-password" className="text-gold-deep hover:underline">request a new one</Link>.</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input required type="password" placeholder="New password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep" />
            <input required type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep" />
            <button disabled={busy} className="w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60">
              {busy ? "UPDATING…" : "UPDATE PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}
