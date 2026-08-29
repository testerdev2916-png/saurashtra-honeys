import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/newsletter")({ component: Page });

type Sub = { id: string; email: string; source: string | null; confirmed_at: string | null; unsubscribed_at: string | null; created_at: string; tags: string[] };

function Page() {
  const [rows, setRows] = useState<Sub[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(500);
      setRows((data ?? []) as Sub[]);
    })();
  }, []);

  const filtered = rows.filter((r) => !q || r.email.toLowerCase().includes(q.toLowerCase()));
  const confirmed = rows.filter((r) => r.confirmed_at && !r.unsubscribed_at).length;
  const pending = rows.filter((r) => !r.confirmed_at && !r.unsubscribed_at).length;
  const unsub = rows.filter((r) => r.unsubscribed_at).length;

  function exportCsv() {
    const csv = ["email,source,confirmed_at,unsubscribed_at,created_at,tags",
      ...filtered.map((r) => [r.email, r.source ?? "", r.confirmed_at ?? "", r.unsubscribed_at ?? "", r.created_at, (r.tags ?? []).join("|")].map((c)=>`"${String(c).replace(/"/g,'""')}"`).join(","))
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "newsletter.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-forest-dark">Newsletter Subscribers</h1>
          <p className="text-sm text-muted-foreground">Double opt-in email list.</p>
        </div>
        <button onClick={exportCsv} className="bg-forest-dark text-cream rounded px-4 py-2 text-xs font-bold tracking-widest">EXPORT CSV</button>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Kpi label="Total" value={rows.length} />
        <Kpi label="Confirmed" value={confirmed} />
        <Kpi label="Pending" value={pending} />
        <Kpi label="Unsubscribed" value={unsub} />
      </div>
      <input placeholder="Search email…" value={q} onChange={(e)=>setQ(e.target.value)} className="w-full border border-border rounded p-2 text-sm w-full max-w-sm" />
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3">Email</th><th>Source</th><th>Status</th><th>Added</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3">{r.email}</td>
                <td className="text-muted-foreground">{r.source ?? "—"}</td>
                <td>{r.unsubscribed_at ? <span className="text-red-600">Unsubscribed</span> : r.confirmed_at ? <span className="text-emerald-600">Confirmed</span> : <span className="text-amber-600">Pending</span>}</td>
                <td className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return <div className="bg-white border border-border rounded-xl p-4"><div className="text-xs uppercase text-muted-foreground">{label}</div><div className="mt-1 text-2xl font-semibold text-forest-dark">{value}</div></div>;
}
