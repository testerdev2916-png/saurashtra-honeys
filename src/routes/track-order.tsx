import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { trackOrderFn } from "@/lib/coupons.functions";
import { Package, MapPin, Truck, CheckCircle2, Clock, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Saurashtra Honey" },
      { name: "description", content: "Track your Saurashtra Honey order status, shipping timeline and estimated delivery." },
      { property: "og:title", content: "Track Your Order — Saurashtra Honey" },
      { property: "og:description", content: "Check the status and delivery timeline of your Saurashtra Honey order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackOrder,
});

type TrackedOrder = {
  order_number: string; status: string; created_at: string;
  estimated_delivery: string | null; delivered_at: string | null;
  tracking_number: string | null; shipping_carrier: string | null;
  timeline: Array<{ at: string; status: string; note?: string }>;
  total_paise: number; items: Array<{ name: string; size: string; qty: number }>;
  shipping: { line1: string; line2?: string; city: string; state: string; pincode: string };
};

const STATUS_STEPS = [
  { key: "pending", label: "Order placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const;

function stepIndex(status: string) {
  const order = ["pending","paid","confirmed","processing","packed","shipped","delivered"];
  const s = status === "paid" || status === "confirmed" ? "processing" : status;
  const idx = STATUS_STEPS.findIndex((x) => x.key === s);
  return idx < 0 ? Math.max(0, order.indexOf(status)) : idx;
}

function TrackOrder() {
  const track = useServerFn(trackOrderFn);
  const [form, setForm] = useState({ order_number: "", email: "" });
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!form.order_number.trim() || !form.email.trim()) { toast.error("Enter both order number and email"); return; }
    setBusy(true); setNotFound(false); setOrder(null);
    try {
      const r = await track({ data: form });
      if (!r.ok) { setNotFound(true); return; }
      setOrder(r.order as unknown as TrackedOrder);
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  }

  const cancelled = order?.status === "cancelled";
  const curStep = order ? stepIndex(order.status) : -1;

  return (
    <SiteLayout>
      <div className="container-page py-12 max-w-3xl">
        <SectionEyebrow>Order Tracking</SectionEyebrow>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl font-bold text-espresso">Where is my order?</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your order number and the email you used at checkout.</p>

        <form onSubmit={lookup} className="mt-7 bg-white border border-border/80 rounded-2xl p-5 md:p-6 grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end shadow-soft">
          <label className="text-xs">
            <div className="text-espresso font-bold mb-1.5">Order number</div>
            <input value={form.order_number} onChange={(e) => setForm({ ...form, order_number: e.target.value.trim() })}
              placeholder="SH-240702-A1B2C3" className="w-full border border-border/80 rounded-xl px-4 py-3 text-sm bg-cream/20 focus:outline-none focus:border-burnt-orange transition-colors" />
          </label>
          <label className="text-xs">
            <div className="text-espresso font-bold mb-1.5">Email</div>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" className="w-full border border-border/80 rounded-xl px-4 py-3 text-sm bg-cream/20 focus:outline-none focus:border-burnt-orange transition-colors" />
          </label>
          <button disabled={busy} className="bg-burnt-orange text-white rounded-xl px-6 py-3.5 text-xs font-bold tracking-widest hover:bg-terracotta disabled:opacity-60 inline-flex items-center gap-2 justify-center shadow-md transition-all">
            <Search className="size-4" /> {busy ? "…" : "TRACK"}
          </button>
        </form>

        {notFound && (
          <div className="mt-6 bg-destructive/10 border border-destructive/30 rounded-2xl p-5 text-sm text-destructive">
            We couldn't find that order. Double-check the order number and email — or <a href="mailto:hello@saurastrahoney.com" className="underline font-semibold">write to us</a>.
          </div>
        )}

        {order && (
          <div className="mt-8 space-y-6">
            <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-soft">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="text-[10px] tracking-widest font-bold text-burnt-orange uppercase">Order number</div>
                  <div className="font-serif text-xl font-bold text-espresso mt-0.5">{order.order_number}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] tracking-widest font-bold text-burnt-orange uppercase">Total</div>
                  <div className="font-serif text-xl font-bold text-espresso mt-0.5">₹{(order.total_paise/100).toFixed(0)}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground pt-3 border-t border-border/60">
                <span>Placed: {new Date(order.created_at).toLocaleDateString()}</span>
                {order.estimated_delivery && <span>Est. delivery: <b className="text-espresso font-semibold">{new Date(order.estimated_delivery).toLocaleDateString()}</b></span>}
                {order.delivered_at && <span>Delivered: <b className="text-espresso font-semibold">{new Date(order.delivered_at).toLocaleDateString()}</b></span>}
                {order.tracking_number && <span>Tracking: <b className="text-espresso font-semibold">{order.tracking_number}</b> {order.shipping_carrier && `(${order.shipping_carrier})`}</span>}
              </div>
            </div>

            {cancelled ? (
              <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5 text-sm text-destructive font-medium">This order has been cancelled.</div>
            ) : (
              <div className="bg-cream-deep/50 border border-border/80 rounded-2xl p-6 shadow-xs">
                <div className="text-[10px] tracking-widest font-bold text-espresso uppercase mb-4">Delivery Status</div>
                <ol className="relative flex justify-between">
                  <div className="absolute top-3 left-6 right-6 h-0.5 bg-border/80" aria-hidden />
                  <div className="absolute top-3 left-6 h-0.5 bg-burnt-orange transition-all" style={{ width: `calc((100% - 3rem) * ${Math.max(0, curStep) / (STATUS_STEPS.length - 1)})` }} aria-hidden />
                  {STATUS_STEPS.map((s, i) => {
                    const done = i <= curStep;
                    const Icon = s.icon;
                    return (
                      <li key={s.key} className="relative z-10 flex flex-col items-center text-center w-16">
                        <span className={`size-7 rounded-full flex items-center justify-center shadow-xs transition-colors ${done ? "bg-burnt-orange text-white" : "bg-white border border-border/80 text-muted-foreground"}`}><Icon className="size-3.5" /></span>
                        <span className={`mt-2 text-[11px] font-bold ${done ? "text-espresso" : "text-muted-foreground"}`}>{s.label}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {order.timeline?.length > 0 && (
              <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-soft">
                <div className="text-[10px] tracking-widest font-bold text-burnt-orange uppercase mb-4">Timeline</div>
                <ul className="space-y-3 text-xs">
                  {[...order.timeline].reverse().map((t, i) => (
                    <li key={i} className="flex gap-3.5 items-start">
                      <span className="size-2.5 rounded-full bg-burnt-orange mt-1 shrink-0" />
                      <div>
                        <div className="font-bold text-espresso uppercase tracking-wider">{t.status}</div>
                        <div className="text-muted-foreground mt-0.5">{new Date(t.at).toLocaleString()}{t.note ? ` — ${t.note}` : ""}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white border border-border/80 rounded-2xl p-6 grid md:grid-cols-2 gap-6 shadow-soft">
              <div>
                <div className="text-[10px] tracking-widest font-bold text-burnt-orange uppercase mb-3 flex items-center gap-1.5"><Package className="size-3.5" /> Items</div>
                <ul className="text-sm space-y-1.5 font-medium text-espresso">
                  {order.items.map((it, i) => <li key={i}>{it.name} — <span className="text-muted-foreground font-normal">{it.size} × {it.qty}</span></li>)}
                </ul>
              </div>
              <div>
                <div className="text-[10px] tracking-widest font-bold text-burnt-orange uppercase mb-3 flex items-center gap-1.5"><MapPin className="size-3.5" /> Shipping to</div>
                <p className="text-sm font-medium text-espresso leading-relaxed">{order.shipping.line1}{order.shipping.line2 ? `, ${order.shipping.line2}` : ""}<br />{order.shipping.city}, {order.shipping.state} — {order.shipping.pincode}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
