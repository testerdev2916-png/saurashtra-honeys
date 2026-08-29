import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listCoupons, upsertCoupon, deleteCoupon } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, Field, inp, PageHeader, StatusPill, TableWrap, Td, Th, paise } from "@/components/admin/ui";
import { ArrowLeft, Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/coupons")({ component: CouponsPage });

type Coupon = { id: string; code: string; description: string | null; discount_type: "percent"|"fixed"|"free_shipping"; discount_value: number; min_order_paise: number; max_discount_paise: number | null; usage_limit: number | null; usage_count: number; per_user_limit: number | null; starts_at: string | null; expires_at: string | null; active: boolean };
const EMPTY: Partial<Coupon> = { code: "", description: "", discount_type: "percent", discount_value: 10, min_order_paise: 0, active: true };

function CouponsPage() {
  const list = useServerFn(listCoupons); const del = useServerFn(deleteCoupon);
  const [rows, setRows] = useState<Coupon[]>([]); const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<Coupon> | null>(null);
  async function load() { setLoading(true); try { const r = await list({}); setRows(r.rows as Coupon[]); } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);
  if (edit) return <Editor initial={edit} onCancel={() => setEdit(null)} onSaved={async () => { setEdit(null); await load(); }} />;
  return (
    <div>
      <PageHeader title="Coupons" subtitle={`${rows.length} codes`} actions={
        <>
          <BtnGhost onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnGhost>
          <BtnPrimary onClick={() => setEdit(EMPTY)}><Plus className="size-3.5" /> NEW COUPON</BtnPrimary>
        </>
      } />
      <TableWrap>
        <thead><tr>{["Code","Type","Value","Min. Order","Uses","Expires","Status",""].map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
        <tbody className="divide-y divide-border">
          {loading && <tr><Td className="text-center py-12 text-muted-foreground">Loading…</Td></tr>}
          {!loading && rows.length === 0 && <tr><Td className="text-center py-12 text-muted-foreground">No coupons.</Td></tr>}
          {!loading && rows.map((r) => (
            <tr key={r.id} className="hover:bg-cream/40">
              <Td className="font-mono text-xs font-bold">{r.code}</Td>
              <Td className="text-xs uppercase">{r.discount_type.replace("_"," ")}</Td>
              <Td className="text-xs">{r.discount_type === "percent" ? `${r.discount_value}%` : r.discount_type === "fixed" ? paise(r.discount_value * 100) : "—"}</Td>
              <Td className="text-xs">{r.min_order_paise ? paise(r.min_order_paise) : "—"}</Td>
              <Td className="text-xs">{r.usage_count}{r.usage_limit ? `/${r.usage_limit}` : ""}</Td>
              <Td className="text-xs">{r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "—"}</Td>
              <Td><StatusPill s={r.active ? "active" : "disabled"} /></Td>
              <Td className="text-right">
                <button onClick={() => setEdit(r)} className="text-gold-deep hover:underline text-xs font-bold mr-3"><Pencil className="size-3.5 inline" /> EDIT</button>
                <button onClick={async () => { if (!confirm("Delete?")) return; try { await del({ data: { id: r.id } }); toast.success("Deleted"); void load(); } catch (e) { toast.error((e as Error).message); } }} className="text-destructive hover:underline text-xs font-bold"><Trash2 className="size-3.5 inline" /></button>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function Editor({ initial, onCancel, onSaved }: { initial: Partial<Coupon>; onCancel: () => void; onSaved: () => Promise<void> | void }) {
  const [f, setF] = useState<Partial<Coupon>>({ ...initial });
  const [busy, setBusy] = useState(false);
  const save = useServerFn(upsertCoupon);
  return (
    <div>
      <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4"><ArrowLeft className="size-4" /> BACK</button>
      <Card className="p-6 max-w-3xl">
        <h2 className="font-serif text-2xl text-forest-dark mb-4">{f.id ? "Edit coupon" : "New coupon"}</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <Field label="Code *"><input value={f.code ?? ""} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} className={inp} /></Field>
          <Field label="Discount type">
            <select value={f.discount_type ?? "percent"} onChange={(e) => setF({ ...f, discount_type: e.target.value as never })} className={inp}>
              <option value="percent">Percent</option><option value="fixed">Fixed (₹)</option><option value="free_shipping">Free shipping</option>
            </select>
          </Field>
          <Field label={f.discount_type === "percent" ? "Percent %" : "Amount ₹"}><input type="number" value={f.discount_value ?? 0} onChange={(e) => setF({ ...f, discount_value: Number(e.target.value) })} className={inp} /></Field>
          <Field label="Min order (₹)"><input type="number" value={(f.min_order_paise ?? 0) / 100} onChange={(e) => setF({ ...f, min_order_paise: Number(e.target.value) * 100 })} className={inp} /></Field>
          <Field label="Max discount cap (₹)"><input type="number" value={(f.max_discount_paise ?? 0) / 100 || ""} onChange={(e) => setF({ ...f, max_discount_paise: e.target.value ? Number(e.target.value) * 100 : null })} className={inp} /></Field>
          <Field label="Usage limit (total)"><input type="number" value={f.usage_limit ?? ""} onChange={(e) => setF({ ...f, usage_limit: e.target.value ? Number(e.target.value) : null })} className={inp} /></Field>
          <Field label="Per-user limit"><input type="number" value={f.per_user_limit ?? ""} onChange={(e) => setF({ ...f, per_user_limit: e.target.value ? Number(e.target.value) : null })} className={inp} /></Field>
          <Field label="Starts at"><input type="datetime-local" value={f.starts_at ? f.starts_at.slice(0,16) : ""} onChange={(e) => setF({ ...f, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className={inp} /></Field>
          <Field label="Expires at"><input type="datetime-local" value={f.expires_at ? f.expires_at.slice(0,16) : ""} onChange={(e) => setF({ ...f, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className={inp} /></Field>
          <div className="md:col-span-2"><Field label="Description"><textarea rows={2} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} className={inp} /></Field></div>
          <label className="flex items-center gap-2 text-xs md:col-span-2"><input type="checkbox" checked={!!f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Active</label>
        </div>
        <div className="mt-6 flex gap-3">
          <BtnPrimary disabled={busy} onClick={async () => {
            setBusy(true);
            try {
              await save({ data: {
                id: f.id, code: f.code!, description: f.description ?? null,
                discount_type: (f.discount_type ?? "percent"), discount_value: Number(f.discount_value ?? 0),
                min_order_paise: Number(f.min_order_paise ?? 0),
                max_discount_paise: f.max_discount_paise ?? null,
                usage_limit: f.usage_limit ?? null, per_user_limit: f.per_user_limit ?? null,
                starts_at: f.starts_at ?? null, expires_at: f.expires_at ?? null, active: !!f.active,
              }});
              toast.success("Saved"); await onSaved();
            } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
          }}>{busy ? "SAVING…" : "SAVE"}</BtnPrimary>
          <BtnGhost onClick={onCancel}>CANCEL</BtnGhost>
        </div>
      </Card>
    </div>
  );
}
