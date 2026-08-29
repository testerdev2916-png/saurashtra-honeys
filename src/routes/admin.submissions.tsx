import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { listSubmissions, updateSubmission, getSubmission } from "@/lib/admin.functions";
import { BtnGhost, BtnPrimary, Card, csvDownload, Field, inp, PageHeader, StatusPill, TableWrap, Td, Th } from "@/components/admin/ui";
import { ArrowLeft, Download, RefreshCcw, Search } from "lucide-react";

export const Route = createFileRoute("/admin/submissions")({ component: SubmissionsPage });

type Sub = { id: string; form_type: string; name: string | null; email: string | null; phone: string | null; company: string | null; city: string | null; subject: string | null; message: string | null; quantity: string | null; product_interest: string | null; meta: Record<string, unknown> | null; created_at: string; status: string; admin_notes: string | null };

const TYPES = ["all","bulk_order","partner","contact","newsletter"] as const;
const STATUSES = ["all","new","in_progress","completed","archived"] as const;

function SubmissionsPage() {
  const list = useServerFn(listSubmissions);
  const [rows, setRows] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [q, setQ] = useState(""); const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [current, setCurrent] = useState<Sub | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await list({ data: { form_type: type, status, q, from: from || undefined, to: to ? new Date(to + "T23:59:59").toISOString() : undefined } });
      setRows(r.rows as Sub[]);
    } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);
  const counts = useMemo(() => { const c: Record<string, number> = { all: rows.length }; for (const r of rows) c[r.form_type] = (c[r.form_type] ?? 0) + 1; return c; }, [rows]);
  const cols = ["created_at","form_type","status","name","email","phone","city","subject","message"];

  if (current) return <Detail row={current} onClose={() => { setCurrent(null); void load(); }} />;

  return (
    <div>
      <PageHeader title="Form Submissions" subtitle={`${rows.length} entries`} actions={
        <>
          <BtnGhost onClick={() => csvDownload(rows as unknown as Record<string, unknown>[], cols, `submissions-${new Date().toISOString().slice(0,10)}.csv`)}><Download className="size-3.5" /> CSV</BtnGhost>
          <BtnPrimary onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnPrimary>
        </>
      } />
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${type === t ? "bg-forest-dark text-cream" : "bg-white text-forest-dark border border-border hover:border-gold-deep"}`}>
              {t.replace("_"," ")} <span className="opacity-70 ml-1">({counts[t] ?? 0})</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={status} onChange={(e) => setStatus(e.target.value as never)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white">
            {STATUSES.map((s) => <option key={s} value={s}>Status: {s}</option>)}
          </select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white" />
          <span className="text-xs text-muted-foreground">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white" />
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") load(); }} placeholder="Search…" className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep" />
          </div>
          <BtnPrimary onClick={load}>APPLY</BtnPrimary>
        </div>
      </Card>
      <TableWrap>
        <thead><tr>{["Date","Type","Status","Name","Contact","Details",""].map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
        <tbody className="divide-y divide-border">
          {loading && <tr><Td className="text-center py-12 text-muted-foreground">Loading…</Td></tr>}
          {!loading && rows.length === 0 && <tr><Td className="text-center py-12 text-muted-foreground">No submissions.</Td></tr>}
          {!loading && rows.map((r) => (
            <tr key={r.id} className="hover:bg-cream/40">
              <Td className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</Td>
              <Td><span className="text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-1">{r.form_type.replace("_"," ")}</span></Td>
              <Td><StatusPill s={r.status} /></Td>
              <Td className="font-medium text-forest-dark">{r.name ?? "—"}{r.company && <div className="text-xs text-muted-foreground">{r.company}</div>}</Td>
              <Td className="text-xs">{r.email && <div>{r.email}</div>}{r.phone && <div>{r.phone}</div>}</Td>
              <Td className="text-xs max-w-sm truncate">{r.subject || r.product_interest || r.message?.slice(0,60) || "—"}</Td>
              <Td className="text-right"><button onClick={() => setCurrent(r)} className="text-xs font-bold text-gold-deep hover:underline">OPEN →</button></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function Detail({ row, onClose }: { row: Sub; onClose: () => void }) {
  const upd = useServerFn(updateSubmission);
  const get = useServerFn(getSubmission);
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState(row.admin_notes ?? "");
  const [full, setFull] = useState<Sub>(row);
  useEffect(() => { get({ data: { id: row.id } }).then((r) => setFull(r.row as Sub)).catch(() => {}); }, [row.id, get]);
  async function save() {
    try { await upd({ data: { id: row.id, status, admin_notes: notes } }); toast.success("Saved"); onClose(); }
    catch (e) { toast.error((e as Error).message); }
  }
  return (
    <div>
      <button onClick={onClose} className="inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4"><ArrowLeft className="size-4" /> BACK</button>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="p-6">
          <div className="text-xs font-bold tracking-widest text-gold-deep">{full.form_type.replace("_"," ").toUpperCase()}</div>
          <h2 className="mt-1 font-serif text-2xl text-forest-dark">{full.name || full.email || "Submission"}</h2>
          <div className="text-xs text-muted-foreground">{new Date(full.created_at).toLocaleString()}</div>
          <dl className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[["Name",full.name],["Email",full.email],["Phone",full.phone],["Company",full.company],["City",full.city],["Subject",full.subject],["Product",full.product_interest],["Quantity",full.quantity]].map(([k,v]) => v ? <div key={k as string}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium text-forest-dark">{v}</dd></div> : null)}
          </dl>
          {full.message && <div className="mt-6"><div className="text-xs text-muted-foreground">Message</div><p className="mt-1 text-sm whitespace-pre-wrap">{full.message}</p></div>}
          {full.meta && Object.keys(full.meta).length > 0 && <pre className="mt-4 text-xs bg-cream rounded p-3 overflow-auto">{JSON.stringify(full.meta,null,2)}</pre>}
        </Card>
        <aside className="bg-cream rounded-2xl p-6 h-fit">
          <h3 className="font-serif text-xl text-forest-dark">Manage</h3>
          <Field label="Status" className="mt-4"><select value={status} onChange={(e) => setStatus(e.target.value)} className={inp}>{STATUSES.filter((s) => s !== "all").map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
          <Field label="Admin notes" className="mt-3"><textarea rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} className={inp} /></Field>
          <BtnPrimary onClick={save} className="mt-4 w-full justify-center">SAVE</BtnPrimary>
          <div className="mt-4 grid gap-2 text-xs">
            {full.email && <a href={`mailto:${full.email}`} className="text-gold-deep hover:underline">✉ {full.email}</a>}
            {full.phone && <a href={`tel:${full.phone}`} className="text-gold-deep hover:underline">📞 {full.phone}</a>}
            {full.phone && <a href={`https://wa.me/${full.phone.replace(/[^0-9]/g,"")}`} className="text-gold-deep hover:underline">💬 WhatsApp</a>}
          </div>
        </aside>
      </div>
    </div>
  );
}
