import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listAdminProducts } from "@/lib/admin-catalog.functions";
import { adjustStock } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, PageHeader, StatusPill, TableWrap, Td, Th } from "@/components/admin/ui";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/admin/inventory")({ component: InventoryPage });

type P = { id: string; slug: string; name: string; stock_quantity: number; in_stock: boolean; low_stock_limit: number; sku: string | null };

function InventoryPage() {
  const list = useServerFn(listAdminProducts);
  const adj = useServerFn(adjustStock);
  const [rows, setRows] = useState<P[]>([]); const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all"|"low"|"oos">("all");

  async function load() { setLoading(true); try { const r = await list({}); setRows(r.rows as unknown as P[]); } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  async function change(id: string, delta: number) {
    const reason = delta > 0 ? "incoming stock" : "manual adjustment";
    try { const r = await adj({ data: { product_id: id, change: delta, reason } }); toast.success(`Stock ${r.before} → ${r.after}`); void load(); }
    catch (e) { toast.error((e as Error).message); }
  }

  const filtered = rows.filter((r) => filter === "all" ? true : filter === "low" ? r.stock_quantity <= r.low_stock_limit : r.stock_quantity === 0);

  return (
    <div>
      <PageHeader title="Inventory" subtitle={`${rows.length} products • ${rows.filter((r) => r.stock_quantity <= r.low_stock_limit).length} need attention`} actions={<BtnGhost onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnGhost>} />
      <Card className="p-4 mb-4 flex flex-wrap gap-2">
        {(["all","low","oos"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${filter === f ? "bg-forest-dark text-cream" : "bg-white text-forest-dark border border-border hover:border-gold-deep"}`}>
            {f === "all" ? "All" : f === "low" ? "Low stock" : "Out of stock"}
          </button>
        ))}
      </Card>
      <TableWrap>
        <thead><tr>{["SKU","Product","Stock","Threshold","Status","Adjust"].map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
        <tbody className="divide-y divide-border">
          {loading && <tr><Td className="text-center py-12 text-muted-foreground">Loading…</Td></tr>}
          {!loading && filtered.length === 0 && <tr><Td className="text-center py-12 text-muted-foreground">No products match.</Td></tr>}
          {!loading && filtered.map((r) => {
            const low = r.stock_quantity <= r.low_stock_limit;
            return (
              <tr key={r.id} className="hover:bg-cream/40">
                <Td className="text-xs font-mono">{r.sku ?? "—"}</Td>
                <Td className="font-medium text-forest-dark">{r.name}<div className="text-xs text-muted-foreground font-mono">{r.slug}</div></Td>
                <Td className={`text-lg font-serif ${low ? "text-destructive" : "text-forest-dark"}`}>{r.stock_quantity}</Td>
                <Td className="text-xs text-muted-foreground">≤ {r.low_stock_limit}</Td>
                <Td>{r.stock_quantity === 0 ? <StatusPill s="disabled" /> : low ? <span className="text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-1"><AlertTriangle className="size-3 inline" /> Low</span> : <StatusPill s="active" />}</Td>
                <Td>
                  <div className="flex gap-1">
                    {[-10,-1,+1,+10,+100].map((n) => (
                      <button key={n} onClick={() => change(r.id, n)} className={`text-[11px] font-bold rounded px-2 py-1 ${n > 0 ? "bg-forest text-cream hover:bg-forest-dark" : "border border-border hover:border-destructive hover:text-destructive"}`}>{n > 0 ? `+${n}` : n}</button>
                    ))}
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableWrap>
    </div>
  );
}
