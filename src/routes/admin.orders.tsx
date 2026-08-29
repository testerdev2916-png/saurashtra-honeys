import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listOrders } from "@/lib/admin.functions";
import { updateOrderExtended } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, csvDownload, Field, inp, PageHeader, StatusPill, TableWrap, Td, Th, paise } from "@/components/admin/ui";
import { ArrowLeft, Download, Printer, RefreshCcw, Search } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({ component: OrdersPage });

type Order = {
  id: string; order_number: string | null; created_at: string; email: string; phone: string; full_name: string;
  shipping: { line1: string; line2?: string; city: string; state: string; pincode: string };
  items: { name: string; size: string; qty: number; price: number }[];
  subtotal_paise: number; shipping_paise: number; total_paise: number;
  payment_method: string; status: string;
  razorpay_order_id: string | null; razorpay_payment_id: string | null;
  admin_notes: string | null; tracking_number: string | null; shipping_carrier: string | null;
  timeline?: { at: string; status: string; note?: string | null }[];
};

const STATUSES = ["all","pending","paid","confirmed","processing","packed","shipped","delivered","cancelled","refunded"] as const;

function OrdersPage() {
  const list = useServerFn(listOrders);
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [q, setQ] = useState(""); const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [current, setCurrent] = useState<Order | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await list({ data: { status, q, from: from || undefined, to: to ? new Date(to + "T23:59:59").toISOString() : undefined } });
      setRows(res.rows as unknown as Order[]);
    } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  if (current) return <OrderDetail order={current} onClose={() => { setCurrent(null); void load(); }} />;

  const cols = ["order_number","created_at","full_name","email","phone","status","payment_method","total_paise"];

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${rows.length} orders`} actions={
        <>
          <BtnGhost onClick={() => csvDownload(rows as unknown as Record<string, unknown>[], cols, `orders-${new Date().toISOString().slice(0,10)}.csv`)}><Download className="size-3.5" /> CSV</BtnGhost>
          <BtnPrimary onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnPrimary>
        </>
      } />
      <Card className="p-4 mb-4 flex flex-wrap gap-2 items-center">
        <select value={status} onChange={(e) => setStatus(e.target.value as never)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white">
          {STATUSES.map((s) => <option key={s} value={s}>Status: {s}</option>)}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white" />
        <span className="text-xs text-muted-foreground">to</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white" />
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") load(); }} placeholder="Search name, email, phone, order id…" className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep" />
        </div>
        <BtnPrimary onClick={load}>APPLY</BtnPrimary>
      </Card>

      <TableWrap>
        <thead><tr>{["Order","Date","Customer","Payment","Status","Total",""].map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
        <tbody className="divide-y divide-border">
          {loading && <tr><Td className="text-center py-12 text-muted-foreground">Loading…</Td></tr>}
          {!loading && rows.length === 0 && <tr><Td className="text-center py-12 text-muted-foreground">No orders.</Td></tr>}
          {!loading && rows.map((r) => (
            <tr key={r.id} className="hover:bg-cream/40">
              <Td className="font-mono text-xs">{r.order_number ?? `#${r.id.slice(0,8)}`}</Td>
              <Td className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</Td>
              <Td><div className="font-medium text-forest-dark">{r.full_name}</div><div className="text-xs text-muted-foreground">{r.email}</div></Td>
              <Td className="text-xs uppercase">{r.payment_method}</Td>
              <Td><StatusPill s={r.status} /></Td>
              <Td className="font-semibold">{paise(r.total_paise)}</Td>
              <Td className="text-right"><button onClick={() => setCurrent(r)} className="text-xs font-bold text-gold-deep hover:underline">OPEN →</button></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  const upd = useServerFn(updateOrderExtended);
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.admin_notes ?? "");
  const [tn, setTn] = useState(order.tracking_number ?? "");
  const [carrier, setCarrier] = useState(order.shipping_carrier ?? "");
  const [refund, setRefund] = useState<string>("");

  async function save() {
    try {
      await upd({ data: {
        id: order.id, status: status as never, admin_notes: notes, tracking_number: tn || undefined,
        shipping_carrier: carrier || undefined,
        refund_amount_paise: refund ? Number(refund) * 100 : undefined,
      } });
      toast.success("Saved"); onClose();
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <div>
      <button onClick={onClose} className="inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4"><ArrowLeft className="size-4" /> BACK</button>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start gap-3 flex-wrap">
            <div>
              <div className="text-xs font-bold tracking-widest text-gold-deep">ORDER</div>
              <h2 className="mt-1 font-serif text-2xl text-forest-dark">{order.order_number ?? `#${order.id.slice(0, 8)}`}</h2>
              <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</div>
            </div>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 text-xs font-semibold hover:border-gold-deep"><Printer className="size-3.5" /> PRINT INVOICE</button>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-6 text-sm">
            <div><div className="text-xs text-muted-foreground">Customer</div>
              <div className="font-medium text-forest-dark">{order.full_name}</div><div>{order.email}</div><div>{order.phone}</div></div>
            <div><div className="text-xs text-muted-foreground">Shipping</div>
              <div>{order.shipping.line1}{order.shipping.line2 ? `, ${order.shipping.line2}` : ""}</div>
              <div>{order.shipping.city}, {order.shipping.state} — {order.shipping.pincode}</div></div>
          </div>
          <div className="mt-6">
            <div className="text-xs text-muted-foreground mb-2">Items</div>
            <table className="w-full text-sm"><tbody className="divide-y divide-border">
              {order.items.map((i, idx) => (
                <tr key={idx}><td className="py-2">{i.name} <span className="text-xs text-muted-foreground">({i.size})</span></td><td className="py-2 text-right">× {i.qty}</td><td className="py-2 text-right font-medium">₹{i.price * i.qty}</td></tr>
              ))}
            </tbody></table>
          </div>
          <div className="mt-4 text-sm space-y-1 max-w-xs ml-auto">
            <div className="flex justify-between"><span>Subtotal</span><span>{paise(order.subtotal_paise)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{paise(order.shipping_paise)}</span></div>
            <div className="flex justify-between font-serif text-lg pt-2 border-t border-border"><span>Total</span><span>{paise(order.total_paise)}</span></div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Payment: <span className="uppercase font-semibold">{order.payment_method}</span>
            {order.razorpay_payment_id && <> • Razorpay: <span className="font-mono">{order.razorpay_payment_id}</span></>}
          </div>
          {order.timeline && order.timeline.length > 0 && (
            <div className="mt-6"><div className="text-xs text-muted-foreground mb-2">Timeline</div>
              <ul className="space-y-1 text-xs">
                {order.timeline.map((t, i) => <li key={i}><span className="font-mono">{new Date(t.at).toLocaleString()}</span> — <StatusPill s={t.status} /> {t.note && <span className="text-muted-foreground">— {t.note}</span>}</li>)}
              </ul></div>
          )}
        </Card>
        <aside className="bg-cream rounded-2xl p-6 h-fit">
          <h3 className="font-serif text-xl text-forest-dark">Manage</h3>
          <Field label="Status" className="mt-4">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inp}>
              {STATUSES.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Shipping carrier" className="mt-3"><input value={carrier} onChange={(e) => setCarrier(e.target.value)} className={inp} placeholder="Delhivery / BlueDart / …" /></Field>
          <Field label="Tracking number" className="mt-3"><input value={tn} onChange={(e) => setTn(e.target.value)} className={inp} /></Field>
          <Field label="Refund amount (₹)" className="mt-3"><input type="number" value={refund} onChange={(e) => setRefund(e.target.value)} className={inp} /></Field>
          <Field label="Admin notes" className="mt-3"><textarea rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} className={inp} /></Field>
          <BtnPrimary onClick={save} className="mt-4 w-full justify-center">SAVE</BtnPrimary>
        </aside>
      </div>
    </div>
  );
}
