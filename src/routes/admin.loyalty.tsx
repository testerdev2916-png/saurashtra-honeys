import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/loyalty")({ component: Page });

type Row = { user_id: string; points_balance: number; lifetime_points: number; email?: string | null; full_name?: string | null };

function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    (async () => {
      const { data: accs } = await supabase.from("loyalty_accounts").select("*").order("lifetime_points", { ascending: false }).limit(200);
      const ids = (accs ?? []).map((a) => a.user_id);
      const { data: profs } = ids.length
        ? await supabase.from("profiles").select("id, email, full_name").in("id", ids)
        : { data: [] as { id: string; email: string; full_name: string }[] };
      const pmap = new Map((profs ?? []).map((p) => [p.id, p]));
      setRows((accs ?? []).map((a) => ({ ...a, email: pmap.get(a.user_id)?.email, full_name: pmap.get(a.user_id)?.full_name })));
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-forest-dark">Loyalty & Rewards</h1>
        <p className="text-sm text-muted-foreground">Top customers by lifetime points.</p>
      </div>
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3">Customer</th><th>Email</th><th className="text-right">Balance</th><th className="text-right pr-3">Lifetime</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No loyalty activity yet.</td></tr> :
              rows.map((r) => (
                <tr key={r.user_id} className="border-t border-border">
                  <td className="p-3">{r.full_name ?? "—"}</td>
                  <td className="text-muted-foreground">{r.email ?? "—"}</td>
                  <td className="text-right font-semibold text-forest-dark">{r.points_balance}</td>
                  <td className="text-right pr-3 text-muted-foreground">{r.lifetime_points}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
