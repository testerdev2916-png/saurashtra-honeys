import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { confirmNewsletter } from "@/lib/newsletter.functions";

export const Route = createFileRoute("/newsletter/confirm/$token")({
  component: Confirm,
  head: () => ({ meta: [{ title: "Confirm subscription — Saurashtra Honey" }, { name: "robots", content: "noindex" }] }),
});

function Confirm() {
  const { token } = Route.useParams();
  const confirm = useServerFn(confirmNewsletter);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  useEffect(() => {
    confirm({ data: { token } }).then(() => setState("ok")).catch(() => setState("err"));
  }, [token, confirm]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        {state === "loading" && <p className="text-muted-foreground">Confirming…</p>}
        {state === "ok" && (<>
          <h1 className="font-serif text-3xl text-forest-dark">You're in 🍯</h1>
          <p className="mt-3 text-sm text-muted-foreground">Thanks for confirming. Sweet updates on their way.</p>
          <Link to="/shop" className="inline-block mt-6 bg-forest-dark text-cream px-5 py-3 rounded-lg text-xs tracking-widest font-bold">SHOP NOW</Link>
        </>)}
        {state === "err" && <>
          <h1 className="font-serif text-2xl text-forest-dark">Invalid or expired link</h1>
          <p className="mt-3 text-sm text-muted-foreground">Try subscribing again from the footer.</p>
        </>}
      </div>
    </div>
  );
}
