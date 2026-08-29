import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { listCategories, upsertCategory, deleteCategory, uploadCategoryImage } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, Field, inp, PageHeader, StatusPill, TableWrap, Td, Th } from "@/components/admin/ui";
import { ArrowLeft, ImageOff, Pencil, Plus, RefreshCcw, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesPage });

type Cat = { id: string; slug: string; name: string; description: string | null; image_url: string | null; parent_id: string | null; sort_order: number; active: boolean; seo_title: string | null; seo_description: string | null };
const EMPTY: Partial<Cat> = { slug: "", name: "", description: "", image_url: "", parent_id: null, sort_order: 0, active: true, seo_title: "", seo_description: "" };

function CategoriesPage() {
  const list = useServerFn(listCategories); const save = useServerFn(upsertCategory); const del = useServerFn(deleteCategory);
  const [rows, setRows] = useState<Cat[]>([]); const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<Cat> | null>(null);
  async function load() { setLoading(true); try { const r = await list({}); setRows(r.rows as Cat[]); } catch (e) { toast.error((e as Error).message); } finally { setLoading(false); } }
  useEffect(() => { void load(); /* eslint-disable-next-line */ }, []);

  if (edit) return <Editor initial={edit} parents={rows} onCancel={() => setEdit(null)} onSaved={async () => { setEdit(null); await load(); }} />;

  const virtualRows = rows.filter((r) => r.slug === "all-products");
  const productRows = rows.filter((r) => r.slug !== "all-products");

  const renderTable = (data: Cat[], emptyText: string) => (
    <TableWrap>
      <thead><tr>{["Sort","Image","Slug","Name","Parent","Status",""].map((h) => <Th key={h}>{h}</Th>)}</tr></thead>
      <tbody className="divide-y divide-border">
        {loading && <tr><Td className="text-center py-12 text-muted-foreground">Loading…</Td></tr>}
        {!loading && data.length === 0 && <tr><Td className="text-center py-12 text-muted-foreground">{emptyText}</Td></tr>}
        {!loading && data.map((r) => (
          <tr key={r.id} className="hover:bg-cream/40">
            <Td className="text-xs text-muted-foreground">{r.sort_order}</Td>
            <Td>
              <div className="size-11 rounded-lg overflow-hidden bg-cream border border-border grid place-items-center shrink-0">
                {r.image_url ? <img src={r.image_url} alt={r.name} className="w-full h-full object-cover" loading="lazy" /> : <ImageOff className="size-4 text-muted-foreground/50" />}
              </div>
            </Td>
            <Td className="text-xs font-mono">{r.slug}</Td>
            <Td className="font-medium text-forest-dark">{r.name}</Td>
            <Td className="text-xs">{rows.find((x) => x.id === r.parent_id)?.name ?? "—"}</Td>
            <Td><StatusPill s={r.active ? "active" : "disabled"} /></Td>
            <Td className="text-right">
              <button onClick={() => setEdit(r)} className="text-gold-deep hover:underline text-xs font-bold mr-3"><Pencil className="size-3.5 inline" /> EDIT</button>
              {r.slug !== "all-products" && (
                <button onClick={async () => { if (!confirm("Delete?")) return; try { await del({ data: { id: r.id } }); toast.success("Deleted"); void load(); } catch (e) { toast.error((e as Error).message); } }} className="text-destructive hover:underline text-xs font-bold"><Trash2 className="size-3.5 inline" /></button>
              )}
            </Td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );

  return (
    <div>
      <PageHeader title="Categories" subtitle={`${rows.length} categories`} actions={
        <>
          <BtnGhost onClick={load}><RefreshCcw className="size-3.5" /> REFRESH</BtnGhost>
          <BtnPrimary onClick={() => setEdit(EMPTY)}><Plus className="size-3.5" /> NEW CATEGORY</BtnPrimary>
        </>
      } />
      
      <div className="mb-12">
        <h3 className="font-serif text-xl text-forest-dark mb-4">Virtual Collections</h3>
        <p className="text-sm text-muted-foreground mb-4">Special collections that span across multiple product types.</p>
        {renderTable(virtualRows, "No virtual collections.")}
      </div>

      <div>
        <h3 className="font-serif text-xl text-forest-dark mb-4">Product Categories</h3>
        <p className="text-sm text-muted-foreground mb-4">Database categories used to tag and filter actual products.</p>
        {renderTable(productRows, "No product categories yet.")}
      </div>
    </div>
  );
}

function Editor({ initial, parents, onCancel, onSaved }: { initial: Partial<Cat>; parents: Cat[]; onCancel: () => void; onSaved: () => Promise<void> | void }) {
  const [f, setF] = useState<Partial<Cat>>({ ...initial });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const save = useServerFn(upsertCategory);
  const upload = useServerFn(uploadCategoryImage);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 10 * 1024 * 1024) return toast.error("Image too large (max 10MB)");
    setUploading(true);
    try {
      const b64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });
      const { url } = await upload({ data: { filename: file.name, contentType: file.type, base64: b64 } });
      if (url) { setF((prev) => ({ ...prev, image_url: url })); toast.success("Image uploaded"); }
    } catch (e) { toast.error((e as Error).message); } finally { setUploading(false); }
  }

  return (
    <div>
      <button onClick={onCancel} className="inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4"><ArrowLeft className="size-4" /> BACK</button>
      <Card className="p-6 max-w-3xl">
        <h2 className="font-serif text-2xl text-forest-dark mb-4">{f.id ? "Edit category" : "New category"}</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <Field label="Slug *"><input value={f.slug ?? ""} onChange={(e) => setF({ ...f, slug: e.target.value })} className={inp} /></Field>
          <Field label="Name *"><input value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp} /></Field>
          <Field label="Parent">
            <select value={f.parent_id ?? ""} onChange={(e) => setF({ ...f, parent_id: e.target.value || null })} className={inp}>
              <option value="">— top-level —</option>
              {parents.filter((p) => p.id !== f.id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Sort order"><input type="number" value={f.sort_order ?? 0} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} className={inp} /></Field>
          <div className="md:col-span-2">
            <Field label="Category image">
              <div className="flex items-start gap-4">
                <div className="size-24 rounded-xl overflow-hidden bg-cream border border-border grid place-items-center shrink-0">
                  {f.image_url ? <img src={f.image_url} alt={f.name || "Category preview"} className="w-full h-full object-cover" /> : <ImageOff className="size-6 text-muted-foreground/50" />}
                </div>
                <div className="flex-1 space-y-2">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void onFile(file); e.target.value = ""; }} />
                  <div className="flex gap-2">
                    <BtnGhost type="button" disabled={uploading} onClick={() => fileRef.current?.click()}><Upload className="size-3.5" /> {uploading ? "UPLOADING…" : f.image_url ? "REPLACE IMAGE" : "UPLOAD IMAGE"}</BtnGhost>
                    {f.image_url && <BtnGhost type="button" onClick={() => setF({ ...f, image_url: "" })}><Trash2 className="size-3.5" /> REMOVE</BtnGhost>}
                  </div>
                  <input value={f.image_url ?? ""} onChange={(e) => setF({ ...f, image_url: e.target.value })} className={inp} placeholder="Or paste an image URL…" />
                  <p className="text-[11px] text-muted-foreground">This image appears on the storefront's "Shop by Category" section. JPG/PNG/WebP, ideally a square or 4:5 crop, under 10MB.</p>
                </div>
              </div>
            </Field>
          </div>
          <div className="md:col-span-2"><Field label="Description"><textarea rows={3} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} className={inp} /></Field></div>
          <Field label="SEO title"><input value={f.seo_title ?? ""} onChange={(e) => setF({ ...f, seo_title: e.target.value })} className={inp} /></Field>
          <Field label="SEO description"><input value={f.seo_description ?? ""} onChange={(e) => setF({ ...f, seo_description: e.target.value })} className={inp} /></Field>
          <label className="flex items-center gap-2 text-xs md:col-span-2"><input type="checkbox" checked={!!f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} /> Active</label>
        </div>
        <div className="mt-6 flex gap-3">
          <BtnPrimary disabled={busy} onClick={async () => {
            setBusy(true);
            try {
              await save({ data: {
                id: f.id, slug: f.slug!, name: f.name!, description: f.description ?? null, image_url: f.image_url || null,
                parent_id: f.parent_id ?? null, sort_order: Number(f.sort_order ?? 0), active: !!f.active,
                seo_title: f.seo_title || null, seo_description: f.seo_description || null,
              }});
              toast.success("Saved"); await onSaved();
            } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
          }}>{busy ? "SAVING…" : "SAVE"}</BtnPrimary>
          <BtnGhost onClick={onCancel}>CANCEL</BtnGhost>
        </div>
      </Card>
    </div>
  );
}
