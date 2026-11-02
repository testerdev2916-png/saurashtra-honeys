import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { consumeOAuthIntent } from "@/lib/oauth-flow";

export const Route = createFileRoute("/auth_/callback")({
  head: () => ({
    meta: [
      { title: "Signing you in… | Saurashtra Honey" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const url = new URL(window.location.href);
    let intended = url.searchParams.get("redirect");

    if (!intended) {
      const intentResult = consumeOAuthIntent(url.searchParams.get("oauth_intent"));
      if (intentResult.ok) {
        intended = intentResult.target;
      }
    }

    intended = intended || "/";

    const go = async (sessionUser?: any) => {
      if (cancelled) return;
      if (sessionUser) {
        try {
          await supabase.from("profiles").upsert({
            id: sessionUser.id,
            email: sessionUser.email,
            full_name:
              sessionUser.user_metadata?.full_name ||
              sessionUser.user_metadata?.name ||
              "Customer",
            avatar_url:
              sessionUser.user_metadata?.avatar_url ||
              sessionUser.user_metadata?.picture ||
              null,
            status: "active",
            updated_at: new Date().toISOString(),
          } as never);
        } catch {
          // ignore profile sync note
        }
      }
      navigate({ to: intended as never, replace: true });
    };

    // Listen for the signed in event.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session) {
        go(session?.user);
      }
    });

    // Also check current session just in case it already processed it
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go(data.session.user);
    });

    // Timeout fallback just in case
    const t = setTimeout(() => {
      if (cancelled) return;
      navigate({ to: "/auth" as never, replace: true });
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(t);
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
