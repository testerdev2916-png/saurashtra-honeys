import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listAdminReviews, moderateReview, deleteReview } from "@/lib/admin-catalog.functions";
import { BtnGhost, Card, PageHeader } from "@/components/admin/ui";
import { Check, RefreshCcw, Trash2, X, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/reviews")({ component: ReviewsPage });

type Review = { id: string; product_slug: string; author_name: string | null; rating: number; title: string | null; body: string | null; media_urls: string[] | null; status: string; created_at: string; featured_on_homepage?: boolean };
const STATUSES = ["all","pending","approved","rejected"] as const;

function ReviewsPage() {
  const list = useServerFn(listAdminReviews); const moderate = useServerFn(moderateReview); const del = useServerFn(deleteReview);
  const [rows, setRows] = useState<Review[]>([]); const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("pending");
  async function load() { setLoading(true); try { const r = await list({ data: { status } }); setRows(r.rows as unknown as Review[]); } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [status]);

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      const { error } = await (supabase.from("reviews") as any)
        .update({ featured_on_homepage: !current })
        .eq("id", id);
      if (error) throw error;
      setRows((prev) => prev.map((r) => r.id === id ? { ...r, featured_on_homepage: !current } : r));
      toast.success(current ? "Removed from homepage testimonials" : "Featured on homepage testimonials");
    } catch (e) {
      toast.error("Failed to update featured status");
    }
  };
  return (
    <div>
      <PageHeader title="Reviews" subtitle="Moderate customer feedback" actions={<BtnGhost onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnGhost>} />
      <Card className="p-4 mb-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${status === s ? "bg-forest-dark text-cream" : "bg-white text-forest-dark border border-border hover:border-gold-deep"}`}>{s}</button>
        ))}
      </Card>
      <div className="grid gap-3">
        {loading && <div className="text-center py-12 text-muted-foreground">Loading…</div>}
        {!loading && rows.length === 0 && <div className="text-center py-12 text-muted-foreground">No reviews.</div>}
        {!loading && rows.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-0.5">{r.product_slug}</span>
                  <span className={`text-[10px] font-bold tracking-wider uppercase rounded px-2 py-0.5 ${r.status === "approved" ? "bg-forest text-cream" : r.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-cream text-forest-dark border border-border"}`}>{r.status}</span>
                  <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div className="font-medium text-forest-dark">{r.author_name ?? "Anonymous"} — <span className="text-gold-deep">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></div>
                {r.title && <div className="mt-1 font-serif text-lg text-forest-dark">{r.title}</div>}
                {r.body && <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{r.body}</p>}
                {r.media_urls && r.media_urls.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {r.media_urls.map((u, i) => <a key={i} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" className="size-16 rounded-lg object-cover border border-border" /></a>)}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {r.status !== "approved" && <button onClick={async () => { try { await moderate({ data: { id: r.id, status: "approved" } }); toast.success("Approved"); void load(); } catch (e) { toast.error((e as Error).message); } }} className="inline-flex items-center gap-1 bg-forest text-cream rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest hover:bg-forest-dark"><Check className="size-3.5" /> APPROVE</button>}
                {r.status !== "rejected" && <button onClick={async () => { try { await moderate({ data: { id: r.id, status: "rejected" } }); toast.success("Rejected"); void load(); } catch (e) { toast.error((e as Error).message); } }} className="inline-flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest hover:border-destructive hover:text-destructive"><X className="size-3.5" /> REJECT</button>}
                {r.status === "approved" && (
                  <button
                    onClick={() => toggleFeatured(r.id, !!r.featured_on_homepage)}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest transition-colors ${
                      r.featured_on_homepage
                        ? "bg-gold/20 text-gold-deep border border-gold-deep hover:bg-gold/30"
                        : "border border-border hover:border-gold-deep hover:text-gold-deep"
                    }`}
                    title={r.featured_on_homepage ? "Remove from homepage testimonials" : "Feature on homepage testimonials"}
                  >
                    <Star className={`size-3.5 ${r.featured_on_homepage ? "fill-gold-deep" : ""}`} />
                    {r.featured_on_homepage ? "FEATURED" : "FEATURE"}
                  </button>
                )}
                <button onClick={async () => { if (!confirm("Delete?")) return; try { await del({ data: { id: r.id } }); toast.success("Deleted"); void load(); } catch (e) { toast.error((e as Error).message); } }} className="inline-flex items-center gap-1 text-destructive text-[11px] font-bold tracking-widest hover:underline"><Trash2 className="size-3.5" /> DELETE</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
