import { useEffect, useRef, useState, useMemo } from "react";
import { Star, ImagePlus, Loader2, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

type ReviewMedia = { path: string; type: "image" | "video"; url?: string };
type ReviewRow = {
  id: string;
  user_id: string;
  product_slug: string;
  rating: number;
  title: string | null;
  body: string | null;
  media: ReviewMedia[] | null;
  author_name: string | null;
  verified_purchase: boolean;
  created_at: string;
};

const MAX_FILES = 5;
const MAX_SIZE = 25 * 1024 * 1024;
const PAGE_SIZE = 5;
const LOAD_TIMEOUT_MS = 12_000;

type SortKey = "newest" | "helpful";

async function signMedia(items: ReviewMedia[]): Promise<ReviewMedia[]> {
  if (!items?.length) return [];
  const paths = items.map((m) => m.path).filter(Boolean);
  if (!paths.length) return items;
  const { data } = await supabase.storage.from("review-media").createSignedUrls(paths, 60 * 60 * 24 * 7);
  const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return items.map((m) => ({ ...m, url: map.get(m.path) ?? m.url }));
}

// Deterministic "helpfulness" ranking without a votes column: prioritise reviews
// with media + longer body + higher rating. Ties broken by recency.
function helpfulScore(r: ReviewRow): number {
  const bodyLen = (r.body ?? "").length;
  const mediaCount = (r.media ?? []).length;
  return mediaCount * 50 + Math.min(bodyLen, 400) / 4 + r.rating * 5;
}

export function ReviewsSection({ productSlug, productName }: { productSlug?: string; productName?: string } = {}) {
  const { user } = useAuth();
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);

    let timedOut = false;
    const timeout = new Promise<{ error: Error }>((resolve) => {
      setTimeout(() => {
        timedOut = true;
        resolve({ error: new Error("Reviews took too long to load. Please retry.") });
      }, LOAD_TIMEOUT_MS);
    });

    try {
      let query = supabase
        .from("reviews")
        .select("id,user_id,product_slug,rating,title,body,media,author_name,verified_purchase,created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(200);
      if (productSlug) {
        query = query.eq("product_slug", productSlug);
      }
      const result = await Promise.race([query, timeout]);
      if (timedOut) { setLoadError("Reviews took too long to load. Please retry."); setRows([]); return; }
      const { data, error } = result as Awaited<typeof query>;
      if (error) { setLoadError(error.message); setRows([]); return; }
      const list = (data ?? []) as unknown as ReviewRow[];
      const signed = await Promise.all(
        list.map(async (r) => ({ ...r, media: await signMedia((r.media ?? []) as ReviewMedia[]) }))
      );
      setRows(signed);
      setPage(1);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load reviews");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [productSlug]);

  const sorted = useMemo(() => {
    const copy = [...rows];
    if (sort === "helpful") copy.sort((a, b) => helpfulScore(b) - helpfulScore(a) || +new Date(b.created_at) - +new Date(a.created_at));
    else copy.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    return copy;
  }, [rows, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const avg = rows.length ? rows.reduce((s, r) => s + r.rating, 0) / rows.length : 0;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: rows.filter((r) => r.rating === n).length }));

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    const valid = list.filter((f) => {
      if (f.size > MAX_SIZE) { toast.error(`${f.name} exceeds 25MB`); return false; }
      if (!/^(image|video)\//.test(f.type)) { toast.error(`${f.name} is not an image or video`); return false; }
      return true;
    });
    setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async () => {
    if (!user) return;
    if (rating < 1) { toast.error("Please choose a rating"); return; }
    if (!body.trim()) { toast.error("Please write a short review"); return; }
    setSubmitting(true);

    const uploaded: string[] = []; // paths to roll back on any failure
    try {
      setUploadProgress({ done: 0, total: files.length });
      const media: ReviewMedia[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const ext = (f.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
        const path = `${user.id}/${productSlug || "general"}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("review-media").upload(path, f, {
          cacheControl: "3600", upsert: false, contentType: f.type,
        });
        if (upErr) throw new Error(`Failed to upload ${f.name}: ${upErr.message}`);
        uploaded.push(path);
        media.push({ path, type: f.type.startsWith("video/") ? "video" : "image" });
        setUploadProgress({ done: i + 1, total: files.length });
      }

      const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      const { error } = await supabase.from("reviews").upsert({
        user_id: user.id,
        product_slug: productSlug || "general",
        rating,
        title: title.trim() || null,
        body: body.trim(),
        media: media as unknown as never,
        author_name: prof?.full_name ?? (user.email?.split("@")[0] ?? "Customer"),
      }, { onConflict: "user_id,product_slug" });
      if (error) throw new Error(error.message);

      toast.success("Thanks for your review!");
      setTitle(""); setBody(""); setFiles([]); setRating(5);
      void load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to submit review";
      toast.error(msg);
      // Roll back any files uploaded during this failed attempt so nothing is orphaned.
      if (uploaded.length) {
        await supabase.storage.from("review-media").remove(uploaded).catch(() => { /* best effort */ });
      }
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const removeMine = async (id: string, media: ReviewMedia[] | null) => {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    if (media?.length) {
      await supabase.storage.from("review-media").remove(media.map((m) => m.path)).catch(() => {});
    }
    toast.success("Review removed");
    void load();
  };

  return (
    <section className="container-page pb-14" id="reviews">
      <div className="bg-cream rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-forest-dark">Customer Reviews</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {productName ? `Real feedback on ${productName}` : "Real feedback from our verified customers"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-serif text-forest-dark">{avg.toFixed(1)}</div>
            <div>
              <div className="flex text-gold">{[...Array(5)].map((_, i) => (
                <Star key={i} className={`size-4 ${i < Math.round(avg) ? "fill-gold" : ""}`} />
              ))}</div>
              <div className="text-xs text-muted-foreground mt-1">{rows.length} review{rows.length === 1 ? "" : "s"}</div>
            </div>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="mt-5 grid gap-1 max-w-md">
            {dist.map(({ n, c }) => {
              const pct = rows.length ? (c / rows.length) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-2 text-xs">
                  <span className="w-6 text-forest-dark">{n}★</span>
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-gold-deep" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{c}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Form */}
        {productSlug && (
          <div className="mt-8 border-t border-border pt-6">
            {!user ? (
              <div className="text-sm text-muted-foreground">
                <Link to="/auth" className="text-gold-deep font-semibold border-b border-gold-deep">Sign in</Link> to write a review.
              </div>
            ) : (
              <div className="space-y-3 max-w-2xl">
                <div className="text-sm font-semibold text-forest-dark">Write a review</div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}>
                      <Star className={`size-6 ${(hover || rating) >= n ? "fill-gold text-gold" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your experience with this product" rows={4} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                <div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={onFiles} className="hidden" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 text-xs font-semibold text-forest-dark border border-border rounded-lg px-3 py-2 hover:bg-background">
                    <ImagePlus className="size-4" /> Add photos / videos ({files.length}/{MAX_FILES})
                  </button>
                  {files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <span key={i} className="text-xs bg-background border border-border rounded px-2 py-1 flex items-center gap-1">
                          {f.name.slice(0, 24)}
                          <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3" /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button disabled={submitting} onClick={submit} className="bg-forest-dark text-cream rounded-lg py-2.5 px-5 text-sm font-bold tracking-widest hover:bg-forest inline-flex items-center gap-2 disabled:opacity-60">
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {submitting && uploadProgress ? `UPLOADING ${uploadProgress.done}/${uploadProgress.total}` : "SUBMIT REVIEW"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* List controls */}
        {rows.length > 0 && (
          <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
            </div>
            <div className="inline-flex items-center gap-1 text-xs bg-background border border-border rounded-lg p-1">
              {(["newest", "helpful"] as SortKey[]).map((k) => (
                <button key={k} onClick={() => { setSort(k); setPage(1); }} className={`px-3 py-1.5 rounded-md capitalize ${sort === k ? "bg-forest-dark text-cream font-semibold" : "text-forest-dark hover:bg-cream"}`}>
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* List */}
        <div className="mt-4 space-y-6">
          {loading && (
            <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Loading reviews…
            </div>
          )}
          {!loading && loadError && (
            <div className="text-sm text-destructive flex items-center gap-3">
              <span>{loadError}</span>
              <button onClick={() => void load()} className="inline-flex items-center gap-1 text-forest-dark border border-border rounded px-2 py-1 hover:bg-background">
                <RefreshCw className="size-3" /> Retry
              </button>
            </div>
          )}
          {!loading && !loadError && rows.length === 0 && (
            <div className="text-sm text-muted-foreground">No reviews yet — be the first to share your experience.</div>
          )}
          {!loading && !loadError && pageRows.map((r) => (
            <article key={r.id} className="border-t border-border pt-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex text-gold">{[...Array(5)].map((_, i) => (
                    <Star key={i} className={`size-4 ${i < r.rating ? "fill-gold" : ""}`} />
                  ))}</div>
                  <div className="text-sm font-semibold text-forest-dark mt-1">{r.title || "Verified feedback"}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.author_name ?? "Customer"} · {new Date(r.created_at).toLocaleDateString()}
                    {r.verified_purchase && <span className="ml-2 text-gold-deep">✓ Verified purchase</span>}
                  </div>
                </div>
                {user?.id === r.user_id && (
                  <button onClick={() => removeMine(r.id, r.media)} className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"><Trash2 className="size-3" /> Delete</button>
                )}
              </div>
              {r.body && <p className="mt-3 text-sm text-forest-dark/90 whitespace-pre-wrap">{r.body}</p>}
              {r.media && r.media.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.media.map((m, i) => m.type === "video" ? (
                    <video key={i} src={m.url} controls className="w-28 h-28 object-cover rounded-lg border border-border" />
                  ) : (
                    <a key={i} href={m.url} target="_blank" rel="noreferrer">
                      <img loading="lazy" src={m.url} alt="review" className="w-20 h-20 object-cover rounded-lg border border-border" />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Pagination */}
        {!loading && !loadError && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1 text-sm">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="size-9 rounded-lg border border-border disabled:opacity-40 hover:bg-background">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`size-9 rounded-lg border border-border ${n === page ? "bg-forest-dark text-cream" : "hover:bg-background"}`}>{n}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="size-9 rounded-lg border border-border disabled:opacity-40 hover:bg-background">›</button>
          </div>
        )}
      </div>
    </section>
  );
}
