import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { safeRedirectPath } from "@/lib/oauth-flow";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Create Account | Saurashtra Honey" },
      { name: "description", content: "Sign in to track orders, manage addresses and your wishlist." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  full_name: z.string().trim().min(2, "Enter your name").max(120),
});
const signinSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1),
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const redirect = safeRedirectPath(new URLSearchParams(window.location.search).get("redirect"));
      navigate({ to: redirect as never });
    }
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const p = signupSchema.safeParse(form);
        if (!p.success) { toast.error(p.error.issues[0].message); return; }
        const { error } = await supabase.auth.signUp({
          email: p.data.email,
          password: p.data.password,
          options: {
            data: { full_name: p.data.full_name },
            emailRedirectTo: `${window.location.origin}/account`,
          },
        });
        if (error) throw error;
        toast.success("Account created", { description: "Check your inbox to verify your email, then sign in." });
        setMode("signin");
      } else {
        const p = signinSchema.safeParse(form);
        if (!p.success) { toast.error(p.error.issues[0].message); return; }
        const { error } = await supabase.auth.signInWithPassword({ email: p.data.email, password: p.data.password });
        if (error) throw error;
        toast.success("Signed in");
      }
    } catch (e) {
      toast.error((e as Error).message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  /*async function onGoogle() {
    setBusy(true);
    try {
      const origin = window.location.origin;
      const intended = safeRedirectPath(new URLSearchParams(window.location.search).get("redirect"));
      const intent = createOAuthIntent(intended);
      const callbackUrl = buildOAuthCallbackUrl(origin, intent.id);
      oauthDebug("google_start", {
        target: intended,
        callbackPath: new URL(callbackUrl).pathname,
        brokerPath: "/~oauth/initiate",
        localOrigin: isLocalOAuthOrigin(origin),
      });

      if (isLocalOAuthOrigin(origin)) {
        clearOAuthIntent(intent.id);
        oauthDebug("google_blocked_localhost", { reason: "managed_oauth_broker_unavailable_on_localhost" });
        toast.error("Google sign-in is available in Lovable Preview or the published site. Localhost cannot reach the managed OAuth broker.");
        return;
      }
      const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
       redirectTo: `${window.location.origin}/auth`,
      },
      }); 
     //const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: callbackUrl,
      //});
      if (result.error) {
        clearOAuthIntent(intent.id);
        oauthDebug("google_error", { message: result.error.message });
        toast.error("Google sign-in is temporarily unavailable. Please try again or continue with email.");
        return;
      }
      oauthDebug("google_started", { redirected: result.redirected === true });
      if (!result.redirected) clearOAuthIntent(intent.id);
    } catch (e) {
      oauthDebug("google_exception", { message: e instanceof Error ? e.message : "unknown" });
      toast.error("Google sign-in is temporarily unavailable. Please try again or continue with email.");
    } finally {
      setBusy(false);
    }
  }*/
  async function onGoogle() {
  setBusy(true);

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const intended = searchParams.get("redirect") || "/";
    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
    callbackUrl.searchParams.set("redirect", intended);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      throw error;
    }

    toast.success("Redirecting to Google...");
  } catch (e) {
    toast.error(
      e instanceof Error
        ? e.message
        : "Google sign-in is temporarily unavailable."
    );
  } finally {
    setBusy(false);
  }
}

  return (
    <SiteLayout>
      <div className="container-page py-16 max-w-md">
        <SectionEyebrow>{mode === "signin" ? "Welcome back" : "Create account"}</SectionEyebrow>
        <h1 className="mt-2 font-serif text-4xl text-forest-dark">
          {mode === "signin" ? "Sign in" : "Join Saurashtra Honey"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Track orders, manage addresses and wishlist." : "Create an account to place orders and save your favorites."}
        </p>

        <button
          type="button"
          onClick={onGoogle}
          disabled={busy}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-border rounded-lg py-3 text-sm font-semibold text-forest-dark hover:bg-cream disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>


        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "signup" && (
            <input required placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep" />
          )}
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep" />
          <button disabled={busy} className="w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60">
            {busy ? "PLEASE WAIT…" : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button className="text-xs text-muted-foreground hover:text-gold-deep" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "New here? Create an account →" : "Already have an account? Sign in →"}
          </button>
          {mode === "signin" && (
            <Link to="/forgot-password" className="text-xs text-gold-deep hover:underline">Forgot password?</Link>
          )}
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground">
          By continuing you agree to our terms. <Link to="/contact" className="text-gold-deep hover:underline">Contact support</Link> for help.
        </p>
      </div>
    </SiteLayout>
  );
}
