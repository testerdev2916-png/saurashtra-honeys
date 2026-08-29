import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listAudit } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, PageHeader, TableWrap, Td, Th } from "@/components/admin/ui";
import { RefreshCcw, Search } from "lucide-react";

export const Route = createFileRoute("/admin/audit")({ component: AuditPage });

type Row = { id: string; actor_id: string | null; action: string; entity_type: string | null; entity_id: string | null; metadata: Record<string, unknown> | null; created_at: string };

function AuditPage() {
  const list = useServerFn(listAudit);
  const [rows, setRows] = useState<Row[]>([]); const [loading, setLoading] = useState(false);
  const [q, setQ] = useState(""); const [entity, setEntity] = useState("");
  async function load() { setLoading(true); try { const r = await list({ data: { q: q || undefined, entity_type: entity || undefined } }); setRows(r.rows as Row[]); } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle={`${rows.length} events`} actions={<BtnGhost onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnGhost>} />
      <Card className="p-4 mb-4 flex flex-wrap gap-2 items-center">
        <input value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="Entity (product/order/…)" className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white" />
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") load(); }} placeholder="Search action…" className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep" />
        </div>
        <BtnPrimary onClick={load}>APPLY</BtnPrimary>
      </Card>
      <TableWrap>
        <thead><tr>{["Time","Action","Entity","Entity ID","Actor","Metadata"].map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
        <tbody className="divide-y divide-border">
          {loading && <tr><Td className="text-center py-12 text-muted-foreground">Loading…</Td></tr>}
          {!loading && rows.length === 0 && <tr><Td className="text-center py-12 text-muted-foreground">No events.</Td></tr>}
          {!loading && rows.map((r) => (
            <tr key={r.id} className="hover:bg-cream/40">
              <Td className="text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</Td>
              <Td className="text-xs font-mono">{r.action}</Td>
              <Td className="text-xs">{r.entity_type ?? "—"}</Td>
              <Td className="text-xs font-mono text-muted-foreground">{r.entity_id ? r.entity_id.slice(0,8) : "—"}</Td>
              <Td className="text-xs font-mono text-muted-foreground">{r.actor_id ? r.actor_id.slice(0,8) : "—"}</Td>
              <Td className="text-xs text-muted-foreground max-w-md truncate">{r.metadata ? JSON.stringify(r.metadata) : "—"}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
