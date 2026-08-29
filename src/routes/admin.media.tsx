import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { listMedia, deleteMedia, uploadMedia } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, Field, inp, PageHeader } from "@/components/admin/ui";
import { Copy, RefreshCcw, Search, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/media")({ component: MediaPage });

const BUCKETS = ["product-images", "media"] as const;

// Suggested folders inside the `media` bucket. Purely a UI convenience for
// organizing uploads (logos/hero/banners/blog/avatars/documents/general) —
// the bucket itself stays a single Supabase Storage bucket.
const MEDIA_FOLDERS = ["logos", "hero", "banners", "blog", "avatars", "documents", "general"] as const;
type Row = { id: string; bucket: string; path: string; filename: string; mime_type: string | null; size_bytes: number | null; created_at: string; url: string | null; alt_text: string | null };

function MediaPage() {
  const list = useServerFn(listMedia); const del = useServerFn(deleteMedia); const up = useServerFn(uploadMedia);
  const [bucket, setBucket] = useState<typeof BUCKETS[number] | "">("");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadBucket, setUploadBucket] = useState<typeof BUCKETS[number]>("product-images");
  const [uploadFolder, setUploadFolder] = useState<typeof MEDIA_FOLDERS[number]>("general");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try { const r = await list({ data: { bucket: bucket || undefined, q: q || undefined } }); setRows(r.rows as Row[]); }
    catch (e) { toast.error((e as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [bucket]);

  async function onFile(f: File) {
    if (f.size > 20 * 1024 * 1024) return toast.error("File too large (max 20MB)");
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = String(reader.result).split(",")[1];
      try {
        await up({ data: { bucket: uploadBucket, folder: uploadBucket === "media" ? uploadFolder : undefined, filename: f.name, contentType: f.type || "application/octet-stream", base64: b64 } });
        toast.success("Uploaded"); void load();
      } catch (e) { toast.error((e as Error).message); }
    };
    reader.readAsDataURL(f);
  }

  return (
    <div>
      <PageHeader title="Media Library" subtitle={`${rows.length} files`} actions={
        <>
          <select value={uploadBucket} onChange={(e) => setUploadBucket(e.target.value as never)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white">
            {BUCKETS.map((b) => <option key={b} value={b}>Upload → {b}</option>)}
          </select>
          {uploadBucket === "media" && (
            <select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value as never)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white">
              {MEDIA_FOLDERS.map((f) => <option key={f} value={f}>media/{f}/</option>)}
            </select>
          )}
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); e.target.value = ""; }} />
          <BtnPrimary onClick={() => fileRef.current?.click()}><Upload className="size-3.5" /> UPLOAD</BtnPrimary>
          <BtnGhost onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnGhost>
        </>
      } />
      <Card className="p-4 mb-4 flex flex-wrap items-center gap-2">
        <select value={bucket} onChange={(e) => setBucket(e.target.value as never)} className="w-full border border-border rounded-lg px-3 py-2 text-xs bg-white">
          <option value="">All buckets</option>
          {BUCKETS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") load(); }} placeholder="Search filename…" className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep" />
        </div>
        <BtnPrimary onClick={load}>APPLY</BtnPrimary>
      </Card>
      {loading ? <div className="py-12 text-center text-muted-foreground">Loading…</div> : rows.length === 0 ? <div className="py-12 text-center text-muted-foreground">No files.</div> : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {rows.map((r) => (
            <Card key={r.id} className="p-2">
              <div className="aspect-square bg-cream rounded-lg overflow-hidden flex items-center justify-center">
                {r.url && r.mime_type?.startsWith("image/") ? <img src={r.url} alt={r.alt_text ?? r.filename} className="w-full h-full object-cover" />
                  : <div className="text-xs text-muted-foreground p-2 text-center break-all">{r.filename}</div>}
              </div>
              <div className="p-2 text-xs">
                <div className="font-mono truncate" title={r.filename}>{r.filename}</div>
                <div className="text-muted-foreground text-[10px] mt-0.5">{r.bucket} • {r.size_bytes ? `${Math.round(r.size_bytes/1024)}KB` : ""}</div>
                <div className="flex justify-between mt-2 gap-1">
                  <button onClick={() => { if (r.url) { void navigator.clipboard.writeText(r.url); toast.success("URL copied"); } }} className="flex-1 text-[10px] font-bold bg-cream hover:bg-cream/60 rounded py-1"><Copy className="size-3 inline" /> URL</button>
                  <button onClick={async () => { if (!confirm("Delete?")) return; try { await del({ data: { id: r.id } }); toast.success("Deleted"); void load(); } catch (e) { toast.error((e as Error).message); } }} className="text-destructive text-[10px] font-bold px-2 py-1"><Trash2 className="size-3 inline" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
