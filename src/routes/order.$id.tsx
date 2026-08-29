import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, MapPin, Package, Printer, Truck } from "lucide-react";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Order Details | Saurashtra Honey" },
      { name: "description", content: "View and download the invoice for your Saurashtra Honey order." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OrderDetail,
});

type Order = {
  id: string; order_number: string | null; created_at: string; status: string;
  full_name: string | null; email: string | null; phone: string | null;
  subtotal_paise: number; shipping_paise: number; discount_paise: number; total_paise: number;
  payment_method: string; coupon_code: string | null;
  tracking_number: string | null; shipping_carrier: string | null;
  estimated_delivery: string | null; delivered_at: string | null;
  timeline: Array<{ at: string; status: string; note?: string }>;
  items: Array<{ slug: string; name: string; size: string; price: number; qty: number; image?: string }>;
  shipping: { line1: string; line2?: string; city: string; state: string; pincode: string };
};

const ORDER_STEPS = [
  { key: "pending", label: "Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "packed", label: "Packed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const;

function OrderDetail() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth", search: { redirect: `/order/${id}` } as never });
  }, [user, loading, id, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
      if (error) { setErr(error.message); return; }
      if (!data) { setErr("Order not found."); return; }
      setOrder(data as unknown as Order);
    })();
  }, [user, id]);

  if (loading || !user) return <SiteLayout><div className="container-page py-24 text-center text-muted-foreground">Loading…</div></SiteLayout>;
  if (err) return <SiteLayout><div className="container-page py-16 text-center"><p className="text-destructive">{err}</p><Link to="/account" search={{ tab: "orders" } as never} className="mt-4 inline-block text-gold-deep">Back to orders →</Link></div></SiteLayout>;
  if (!order) return <SiteLayout><div className="container-page py-24 text-center text-muted-foreground">Loading order…</div></SiteLayout>;

  const stepIdx = ORDER_STEPS.findIndex((s) => s.key === (order.status === "paid" || order.status === "confirmed" ? "processing" : order.status));
  const cancelled = order.status === "cancelled";

  return (
    <SiteLayout>
      <div className="container-page py-8 max-w-4xl print:py-2">
        <div className="flex justify-between items-start gap-3 flex-wrap print:hidden">
          <div>
            <Link to="/account" search={{ tab: "orders" } as never} className="text-xs text-gold-deep font-bold tracking-widest hover:underline">← ALL ORDERS</Link>
            <h1 className="mt-2 font-serif text-3xl text-forest-dark">Order {order.order_number ?? order.id.slice(0, 8)}</h1>
            <div className="text-xs text-muted-foreground">Placed on {new Date(order.created_at).toLocaleString()}</div>
          </div>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-xs font-bold tracking-widest text-forest-dark hover:bg-cream">
            <Printer className="size-4" /> PRINT INVOICE
          </button>
        </div>

        <div className="hidden print:block mb-6">
          <div className="flex justify-between border-b pb-3">
            <div>
              <div className="font-serif text-2xl text-forest-dark">Saurashtra Honey</div>
              <div className="text-xs text-muted-foreground">Raw, unfiltered honey from Saurashtra • hello@saurastrahoney.com</div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold">INVOICE</div>
              <div>#{order.order_number ?? order.id.slice(0, 8)}</div>
              <div>{new Date(order.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {!cancelled && (
          <div className="mt-6 bg-cream rounded-2xl p-5 print:hidden">
            <div className="text-[10px] font-bold tracking-widest text-forest-dark uppercase mb-4">Status</div>
            <ol className="relative flex justify-between">
              <div className="absolute top-3 left-6 right-6 h-0.5 bg-border" aria-hidden />
              <div className="absolute top-3 left-6 h-0.5 bg-gold-deep transition-all" style={{ width: `calc((100% - 3rem) * ${Math.max(0, stepIdx) / (ORDER_STEPS.length - 1)})` }} aria-hidden />
              {ORDER_STEPS.map((s, i) => {
                const done = i <= stepIdx; const Icon = s.icon;
                return (
                  <li key={s.key} className="relative z-10 flex flex-col items-center text-center w-16">
                    <span className={`size-6 rounded-full flex items-center justify-center ${done ? "bg-gold-deep text-cream" : "bg-white border border-border text-muted-foreground"}`}><Icon className="size-3" /></span>
                    <span className={`mt-2 text-[10px] font-semibold ${done ? "text-forest-dark" : "text-muted-foreground"}`}>{s.label}</span>
                  </li>
                );
              })}
            </ol>
            {order.tracking_number && <p className="mt-4 text-xs text-forest-dark">Tracking: <b>{order.tracking_number}</b>{order.shipping_carrier && ` (${order.shipping_carrier})`}</p>}
            {order.estimated_delivery && !order.delivered_at && <p className="text-xs text-muted-foreground">Estimated delivery: <b className="text-forest-dark">{new Date(order.estimated_delivery).toLocaleDateString()}</b></p>}
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 md:col-span-2">
            <div className="text-[10px] tracking-widest font-bold text-forest-dark uppercase mb-2">Items</div>
            <ul className="divide-y divide-border">
              {order.items.map((it, i) => (
                <li key={i} className="py-3 flex gap-3 items-center">
                  {it.image && <img src={it.image} alt="" className="size-14 rounded-lg object-cover" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-forest-dark">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.size} × {it.qty}</div>
                  </div>
                  <div className="text-sm font-semibold">₹{it.price * it.qty}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{(order.subtotal_paise/100).toFixed(0)}</span></div>
              {order.discount_paise > 0 && <div className="flex justify-between text-gold-deep"><span>Discount {order.coupon_code && `(${order.coupon_code})`}</span><span>−₹{(order.discount_paise/100).toFixed(0)}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span>{order.shipping_paise === 0 ? "Free" : `₹${(order.shipping_paise/100).toFixed(0)}`}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-serif text-xl text-forest-dark"><span>Total</span><span>₹{(order.total_paise/100).toFixed(0)}</span></div>
              <div className="text-xs text-muted-foreground uppercase mt-1">Paid via {order.payment_method}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="text-[10px] tracking-widest font-bold text-forest-dark uppercase mb-2 flex items-center gap-1"><MapPin className="size-3" /> Shipping</div>
              <p className="text-sm">{order.full_name}<br />{order.shipping.line1}{order.shipping.line2 ? `, ${order.shipping.line2}` : ""}<br />{order.shipping.city}, {order.shipping.state} — {order.shipping.pincode}</p>
              <p className="mt-1 text-xs text-muted-foreground">{order.phone}<br />{order.email}</p>
            </div>
            {order.timeline?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4 print:hidden">
                <div className="text-[10px] tracking-widest font-bold text-forest-dark uppercase mb-2">Timeline</div>
                <ul className="text-xs space-y-2">
                  {[...order.timeline].reverse().map((t, i) => (
                    <li key={i}><b className="text-forest-dark uppercase">{t.status}</b><br /><span className="text-muted-foreground">{new Date(t.at).toLocaleString()}{t.note ? ` — ${t.note}` : ""}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
