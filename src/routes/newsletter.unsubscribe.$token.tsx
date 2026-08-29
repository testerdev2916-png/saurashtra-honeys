import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { unsubscribeNewsletter } from "@/lib/newsletter.functions";

export const Route = createFileRoute("/newsletter/unsubscribe/$token")({
  component: Unsub,
  head: () => ({ meta: [{ title: "Unsubscribe — Saurashtra Honey" }, { name: "robots", content: "noindex" }] }),
});

function Unsub() {
  const { token } = Route.useParams();
  const run = useServerFn(unsubscribeNewsletter);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  useEffect(() => { run({ data: { token } }).then(() => setState("ok")).catch(() => setState("err")); }, [token, run]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        {state === "loading" && <p className="text-muted-foreground">Working…</p>}
        {state === "ok" && <>
          <h1 className="font-serif text-2xl text-forest-dark">You're unsubscribed</h1>
          <p className="mt-3 text-sm text-muted-foreground">You will no longer receive marketing emails from us.</p>
          <Link to="/" className="inline-block mt-6 text-gold-deep underline text-sm">Back to home</Link>
        </>}
        {state === "err" && <h1 className="font-serif text-2xl text-forest-dark">Invalid link</h1>}
      </div>
    </div>
  );
}
