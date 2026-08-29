import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listCustomers, updateCustomer } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, csvDownload, Field, inp, PageHeader, StatusPill, TableWrap, Td, Th, paise } from "@/components/admin/ui";
import { ArrowLeft, Download, RefreshCcw, Search } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({ component: CustomersPage });

type Cust = { id: string; full_name: string | null; email: string | null; phone: string | null; status: "active"|"disabled"; admin_notes: string | null; created_at: string; orders_count: number; spent_paise: number };

function CustomersPage() {
  const list = useServerFn(listCustomers);
  const [rows, setRows] = useState<Cust[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState<Cust | null>(null);

  async function load() {
    setLoading(true);
    try { const r = await list({ data: { q } }); setRows(r.rows as Cust[]); }
    catch (e) { toast.error((e as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  if (current) return <Detail cust={current} onClose={() => { setCurrent(null); void load(); }} />;
  const cols = ["full_name","email","phone","status","orders_count","spent_paise","created_at"];

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${rows.length} customers`} actions={
        <>
          <BtnGhost onClick={() => csvDownload(rows as unknown as Record<string, unknown>[], cols, `customers-${new Date().toISOString().slice(0,10)}.csv`)}><Download className="size-3.5" /> CSV</BtnGhost>
          <BtnPrimary onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnPrimary>
        </>
      } />
      <Card className="p-4 mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") load(); }} placeholder="Search name, email, phone…" className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep" />
        </div>
        <BtnPrimary onClick={load}>APPLY</BtnPrimary>
      </Card>
      <TableWrap>
        <thead><tr>{["Name","Contact","Status","Orders","Lifetime","Joined",""].map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
        <tbody className="divide-y divide-border">
          {loading && <tr><Td className="text-center py-12 text-muted-foreground">Loading…</Td></tr>}
          {!loading && rows.length === 0 && <tr><Td className="text-center py-12 text-muted-foreground">No customers.</Td></tr>}
          {!loading && rows.map((r) => (
            <tr key={r.id} className="hover:bg-cream/40">
              <Td className="font-medium text-forest-dark">{r.full_name ?? "—"}</Td>
              <Td className="text-xs">{r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}</Td>
              <Td><StatusPill s={r.status} /></Td>
              <Td className="text-xs">{r.orders_count}</Td>
              <Td className="font-semibold">{paise(r.spent_paise)}</Td>
              <Td className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</Td>
              <Td className="text-right"><button onClick={() => setCurrent(r)} className="text-xs font-bold text-gold-deep hover:underline">OPEN →</button></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function Detail({ cust, onClose }: { cust: Cust; onClose: () => void }) {
  const upd = useServerFn(updateCustomer);
  const [status, setStatus] = useState<Cust["status"]>(cust.status);
  const [notes, setNotes] = useState(cust.admin_notes ?? "");
  return (
    <div>
      <button onClick={onClose} className="inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4"><ArrowLeft className="size-4" /> BACK</button>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-6">
          <div className="text-xs font-bold tracking-widest text-gold-deep">CUSTOMER</div>
          <h2 className="mt-1 font-serif text-2xl text-forest-dark">{cust.full_name ?? cust.email ?? "—"}</h2>
          <div className="text-xs text-muted-foreground">{cust.email} • {cust.phone}</div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6 text-sm">
            <div><div className="text-xs text-muted-foreground">Orders</div><div className="font-serif text-xl">{cust.orders_count}</div></div>
            <div><div className="text-xs text-muted-foreground">Lifetime spend</div><div className="font-serif text-xl">{paise(cust.spent_paise)}</div></div>
            <div><div className="text-xs text-muted-foreground">Joined</div><div className="font-serif text-xl">{new Date(cust.created_at).toLocaleDateString()}</div></div>
          </div>
        </Card>
        <aside className="bg-cream rounded-2xl p-6 h-fit">
          <h3 className="font-serif text-xl text-forest-dark">Manage</h3>
          <Field label="Account status" className="mt-4"><select value={status} onChange={(e) => setStatus(e.target.value as never)} className={inp}><option value="active">Active</option><option value="disabled">Disabled</option></select></Field>
          <Field label="Admin notes" className="mt-3"><textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} className={inp} /></Field>
          <BtnPrimary onClick={async () => { try { await upd({ data: { id: cust.id, status, admin_notes: notes } }); toast.success("Saved"); onClose(); } catch (e) { toast.error((e as Error).message); } }} className="mt-4 w-full justify-center">SAVE</BtnPrimary>
        </aside>
      </div>
    </div>
  );
}
