import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { safeRedirectPath, getURL, createOAuthIntent } from "@/lib/oauth-flow";
import { useAuth } from "@/lib/auth";
import { requestMobileSignupOtp, verifyMobileSignupOtp } from "@/lib/auth-otp.functions";
import { toast } from "sonner";
import { z } from "zod";
import { Phone, Mail, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Create Account | Saurashtra Honey" },
      {
        name: "description",
        content: "Sign in to track orders, manage addresses and your wishlist.",
      },
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
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [busy, setBusy] = useState(false);

  // Phone OTP States
  const reqMobileOtpFn = useServerFn(requestMobileSignupOtp);
  const verMobileOtpFn = useServerFn(verifyMobileSignupOtp);
  const [phoneForm, setPhoneForm] = useState({ phone: "", otp: "", full_name: "" });
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const t = setInterval(() => setPhoneCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [phoneCooldown]);

  async function onSendPhoneOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!phoneForm.phone.trim()) {
      toast.error("Please enter your mobile phone number");
      return;
    }
    setBusy(true);
    try {
      const res = await reqMobileOtpFn({
        data: { phone: phoneForm.phone.trim(), purpose: mode === "signup" ? "signup" : "login" },
      });
      toast.success(`Verification code sent to ${res.phone}`);
      setPhoneOtpSent(true);
      setPhoneCooldown(res.cooldownSeconds || 60);
    } catch (err) {
      toast.error((err as Error).message || "Could not send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function onVerifyPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!phoneForm.otp.trim() || phoneForm.otp.trim().length < 4) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }
    setBusy(true);
    try {
      await verMobileOtpFn({
        data: {
          phone: phoneForm.phone.trim(),
          otp: phoneForm.otp.trim(),
          full_name: phoneForm.full_name.trim() || undefined,
          purpose: mode === "signup" ? "signup" : "login",
        },
      });
      toast.success("Mobile number verified successfully!");
      const intended = safeRedirectPath(
        new URLSearchParams(window.location.search).get("redirect") || "/account",
      );
      navigate({ to: intended as never });
    } catch (err) {
      toast.error((err as Error).message || "Invalid OTP code");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!loading && user) {
      const redirect = safeRedirectPath(
        new URLSearchParams(window.location.search).get("redirect"),
      );
      navigate({ to: redirect as never });
    }
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const p = signupSchema.safeParse(form);
        if (!p.success) {
          toast.error(p.error.issues[0].message);
          return;
        }
        const searchParams = new URLSearchParams(window.location.search);
        const intended = safeRedirectPath(searchParams.get("redirect") || "/account");
        const callbackUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(intended)}`;
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: p.data.email,
          password: p.data.password,
          options: {
            data: { full_name: p.data.full_name },
            emailRedirectTo: callbackUrl,
          },
        });
        if (error) throw error;
        if (signUpData.session) {
          toast.success("Account created and signed in!");
          navigate({ to: intended as never });
        } else {
          toast.success("Account created", {
            description: "Check your inbox to verify your email, then sign in.",
          });
          setMode("signin");
        }
      } else {
        const p = signinSchema.safeParse(form);
        if (!p.success) {
          toast.error(p.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: p.data.email,
          password: p.data.password,
        });
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

      // Store intent securely in session storage to avoid Supabase exact-match whitelist rejections
      createOAuthIntent(intended);

      // Get an environment-aware, perfectly clean callback URL with no query params
      const callbackUrl = `${getURL()}auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Redirecting to Google...");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Google sign-in is temporarily unavailable.");
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
          {mode === "signin"
            ? "Track orders, manage addresses and wishlist."
            : "Create an account to place orders and save your favorites."}
        </p>

        <button
          type="button"
          onClick={onGoogle}
          disabled={busy}
          className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-border rounded-lg py-3 text-sm font-semibold text-forest-dark hover:bg-cream disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        {/* Auth Method Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-cream/70 border border-border rounded-xl mt-4 mb-5 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setPhoneOtpSent(false);
            }}
            className={`py-2 rounded-lg transition-all ${
              authMethod === "phone"
                ? "bg-white text-forest-dark shadow-xs"
                : "text-muted-foreground hover:text-forest-dark"
            }`}
          >
            📱 Mobile OTP
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod("email")}
            className={`py-2 rounded-lg transition-all ${
              authMethod === "email"
                ? "bg-white text-forest-dark shadow-xs"
                : "text-muted-foreground hover:text-forest-dark"
            }`}
          >
            ✉️ Email & Password
          </button>
        </div>

        {authMethod === "phone" ? (
          <form onSubmit={phoneOtpSent ? onVerifyPhoneOtp : onSendPhoneOtp} className="space-y-3">
            {!phoneOtpSent ? (
              <>
                {mode === "signup" && (
                  <input
                    required
                    placeholder="Full name *"
                    value={phoneForm.full_name}
                    onChange={(e) => setPhoneForm({ ...phoneForm, full_name: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
                  />
                )}
                <div className="relative">
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="Mobile number (e.g. +91 9876543210)"
                    value={phoneForm.phone}
                    onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60 transition-colors"
                >
                  {busy ? "SENDING OTP…" : "SEND VERIFICATION CODE"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-cream/90 border border-burnt-orange/30 rounded-xl p-3 text-xs text-forest-dark flex items-center justify-between">
                  <span>
                    Code sent to <b>{phoneForm.phone}</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneOtpSent(false);
                      setPhoneForm((f) => ({ ...f, otp: "" }));
                    }}
                    className="text-gold-deep font-bold hover:underline"
                  >
                    Change
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-forest-dark mb-1">
                    ENTER 6-DIGIT OTP
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={phoneForm.otp}
                    onChange={(e) =>
                      setPhoneForm({
                        ...phoneForm,
                        otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                      })
                    }
                    className="w-full text-center tracking-[0.5em] text-xl font-mono py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-gold-deep"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy || phoneForm.otp.length < 4}
                  className="w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60 transition-colors"
                >
                  {busy ? "VERIFYING…" : mode === "signup" ? "VERIFY & CREATE ACCOUNT" : "VERIFY & SIGN IN"}
                </button>
                <div className="text-center pt-1">
                  <button
                    type="button"
                    disabled={phoneCooldown > 0 || busy}
                    onClick={() => onSendPhoneOtp()}
                    className="text-xs text-gold-deep font-semibold hover:underline disabled:opacity-50"
                  >
                    {phoneCooldown > 0 ? `Resend OTP in ${phoneCooldown}s` : "Resend OTP Code"}
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                required
                placeholder="Full name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
            />
            <button
              disabled={busy}
              className="w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60"
            >
              {busy ? "PLEASE WAIT…" : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button
            className="text-xs text-muted-foreground hover:text-gold-deep"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "New here? Create an account →"
              : "Already have an account? Sign in →"}
          </button>
          {mode === "signin" && (
            <Link to="/forgot-password" className="text-xs text-gold-deep hover:underline">
              Forgot password?
            </Link>
          )}
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground">
          By continuing you agree to our terms.{" "}
          <Link to="/contact" className="text-gold-deep hover:underline">
            Contact support
          </Link>{" "}
          for help.
        </p>
      </div>
    </SiteLayout>
  );
}
