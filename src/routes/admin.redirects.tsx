import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/redirects")({ component: Page });

type Row = { id: string; from_path: string; to_path: string; code: number; active: boolean; hits: number; note: string | null };

function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ from_path: "", to_path: "", code: 301, note: "" });

  async function load() {
    const { data } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Row[]);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!form.from_path.startsWith("/") || !form.to_path) return toast.error("Paths must start with /");
    const { error } = await supabase.from("redirects").insert({ ...form });
    if (error) return toast.error(error.message);
    setForm({ from_path: "", to_path: "", code: 301, note: "" });
    toast.success("Redirect added"); load();
  }
  async function toggle(r: Row) {
    await supabase.from("redirects").update({ active: !r.active }).eq("id", r.id);
    load();
  }
  async function del(r: Row) {
    if (!confirm("Delete?")) return;
    await supabase.from("redirects").delete().eq("id", r.id); load();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-serif text-2xl text-forest-dark">Redirects</h1>
        <p className="text-sm text-muted-foreground">301/302 URL redirects. Handy for broken links, migrations, campaign short links.</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 grid gap-3 md:grid-cols-[1fr_1fr_120px_1fr_auto]">
        <input placeholder="/from-path" value={form.from_path} onChange={(e)=>setForm({...form,from_path:e.target.value})} className="w-full border border-border rounded p-2 text-sm" />
        <input placeholder="/to-path" value={form.to_path} onChange={(e)=>setForm({...form,to_path:e.target.value})} className="w-full border border-border rounded p-2 text-sm" />
        <select value={form.code} onChange={(e)=>setForm({...form,code:Number(e.target.value)})} className="w-full border border-border rounded p-2 text-sm">
          <option value={301}>301</option><option value={302}>302</option><option value={307}>307</option><option value={308}>308</option>
        </select>
        <input placeholder="Note (optional)" value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} className="w-full border border-border rounded p-2 text-sm" />
        <button onClick={add} className="bg-forest-dark text-cream rounded px-4 text-xs font-bold tracking-widest">ADD</button>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3">From</th><th>To</th><th>Code</th><th>Hits</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Loading…</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No redirects yet.</td></tr> :
              rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-mono">{r.from_path}</td>
                  <td className="font-mono">{r.to_path}</td>
                  <td>{r.code}</td>
                  <td>{r.hits}</td>
                  <td><button onClick={()=>toggle(r)} className={`text-xs font-bold ${r.active?"text-emerald-600":"text-muted-foreground"}`}>{r.active?"ON":"OFF"}</button></td>
                  <td className="pr-3 text-right"><button onClick={()=>del(r)} className="text-xs text-red-600 hover:underline">Delete</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
