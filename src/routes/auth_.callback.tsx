import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    const intended = url.searchParams.get("redirect") || "/";

    const go = () => {
      if (cancelled) return;
      // Navigate to intended route
      // TanStack router replace: true clears the hash naturally from the URL history
      navigate({ to: intended as never, replace: true });
    };

    // Listen for the signed in event.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || session) {
        go();
      }
    });

    // Also check current session just in case it already processed it
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go();
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
