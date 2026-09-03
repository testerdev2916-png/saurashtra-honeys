import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  BtnGhost,
  BtnPrimary,
  Card,
  Field,
  inp,
  PageHeader,
  StatusPill,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import { Layers, ArrowRight, Eye, ArrowLeft, Pencil, Plus, RefreshCcw, Trash2, Upload } from "lucide-react";
import type { CategoryHeroSlide } from "@/components/shop/CategoryHeroSlider";
import { fetchShopCategories, type ShopCategory } from "@/lib/category-catalog";

export const Route = createFileRoute("/admin/category-hero")({ component: CategoryHeroPage });

const EMPTY: Partial<CategoryHeroSlide> = {
  category_slug: "honey",
  title: "",
  subtitle: "",
  image_url: "",
  mobile_image_url: null,
  cta_label: "Shop Now",
  cta_href: "/shop/honey",
  sort_order: 1,
  active: true,
};

function CategoryHeroPage() {
  const [rows, setRows] = useState<CategoryHeroSlide[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<CategoryHeroSlide> | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all-products");

  async function load() {
    setLoading(true);
    try {
      const [cats, { data, error }] = await Promise.all([
        fetchShopCategories(),
        supabase.from("category_hero_slides").select("*").order("sort_order", { ascending: true })
      ]);
      setCategories(cats);
      
      if (filterCategory === "all-products" && cats.length > 0) {
        setFilterCategory(cats[0].slug);
      }
      
      if (error) throw error;
      setRows(data as CategoryHeroSlide[]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => r.category_slug.toLowerCase() === filterCategory.toLowerCase());
  }, [rows, filterCategory]);

  if (edit) {
    return (
      <Editor
        doc={edit}
        onCancel={() => setEdit(null)}
        onSaved={() => {
          setEdit(null);
          void load();
        }}
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Category Hero Sliders"
        subtitle="Manage the 1920×600 hero banners shown on specific category pages."
        actions={
          <>
            <BtnGhost onClick={load} disabled={loading} className="gap-2">
              <RefreshCcw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </BtnGhost>
            <BtnPrimary onClick={() => setEdit({ ...EMPTY, category_slug: filterCategory })} className="gap-2">
              <Plus className="size-4" />
              Add Slide
            </BtnPrimary>
          </>
        }
      />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-border/50">
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setFilterCategory(c.slug)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
              filterCategory === c.slug
                ? "border-brand-orange text-brand-orange bg-brand-orange/5"
                : "border-transparent text-espresso/60 hover:text-espresso hover:bg-espresso/5"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <TableWrap>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border/60 bg-cream/30">
                <Th className="w-16">Order</Th>
                <Th className="w-32">Image</Th>
                <Th>Title / Details</Th>
                <Th className="w-32">Mobile</Th>
                <Th className="w-24">Status</Th>
                <Th className="w-24 text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground align-top">
                    <Layers className="size-10 mx-auto text-muted-foreground/30 mb-3" />
                    No slides found for {filterCategory}.
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr key={r.id} className="hover:bg-cream/30 transition-colors">
                    <Td className="font-mono text-muted-foreground">{r.sort_order}</Td>
                    <Td>
                      {r.image_url ? (
                        <img
                          src={r.image_url}
                          alt={r.title || "Hero"}
                          className="w-24 h-12 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-24 h-12 bg-border/50 rounded flex items-center justify-center text-xs">
                          No Image
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div className="font-medium text-espresso truncate max-w-[200px] lg:max-w-[300px]">
                        {r.title || <span className="text-muted-foreground italic">Untitled</span>}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px] lg:max-w-[300px] mt-0.5">
                        {r.subtitle || "No subtitle"}
                      </div>
                    </Td>
                    <Td>
                      {r.mobile_image_url ? (
                        <StatusPill s="Custom" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Fallback</span>
                      )}
                    </Td>
                    <Td>
                      <StatusPill s={r.active ? "active" : "disabled"} />
                    </Td>
                    <Td className="text-right">
                      <BtnGhost onClick={() => setEdit(r)} className="size-8 p-0" title="Edit">
                        <Pencil className="size-4" />
                      </BtnGhost>
                      <BtnGhost
                        onClick={async () => {
                          if (!confirm("Delete this slide?")) return;
                          setLoading(true);
                          try {
                            const { error } = await supabase.from("category_hero_slides").delete().eq("id", r.id);
                            if (error) throw error;
                            toast.success("Slide deleted");
                            void load();
                          } catch (e) {
                            toast.error((e as Error).message);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="size-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </BtnGhost>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrap>
      </Card>
      
      {filteredRows.length > 0 && filteredRows.length !== 3 && (
        <p className="text-xs text-brand-orange mt-4 flex items-center gap-2">
          <Eye className="size-4" />
          You currently have {filteredRows.length} active slides. The frontend design works best with exactly 3 slides.
        </p>
      )}
    </div>
  );
}

function Editor({ doc, onCancel, onSaved }: { doc: Partial<CategoryHeroSlide>; onCancel: () => void; onSaved: () => void }) {
  const [f, setF] = useState(doc);
  const [saving, setSaving] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  async function handleDesktopUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDesktop(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `categories/hero_${Date.now()}_desktop.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setF({ ...f, image_url: data.publicUrl });
      toast.success("Desktop image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploadingDesktop(false);
    }
  }

  async function handleMobileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMobile(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `categories/hero_${Date.now()}_mobile.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setF({ ...f, mobile_image_url: data.publicUrl });
      toast.success("Mobile image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploadingMobile(false);
    }
  }

  async function save() {
    if (!f.image_url) {
      toast.error("Desktop Image URL is required.");
      return;
    }
    setSaving(true);
    try {
      if (f.id) {
        const payload = {
          ...f,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from("category_hero_slides").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const payload: Omit<CategoryHeroSlide, "id" | "created_at" | "updated_at"> = {
          category_slug: f.category_slug || "honey",
          image_url: f.image_url,
          mobile_image_url: f.mobile_image_url || null,
          title: f.title || null,
          subtitle: f.subtitle || null,
          cta_label: f.cta_label || null,
          cta_href: f.cta_href || null,
          sort_order: f.sort_order || 1,
          active: f.active ?? true,
        };
        const { error } = await supabase.from("category_hero_slides").insert([payload]);
        if (error) throw error;
      }
      toast.success("Slide saved");
      onSaved();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-4 mb-8">
        <BtnGhost onClick={onCancel} className="size-10 p-0 rounded-full">
          <ArrowLeft className="size-5" />
        </BtnGhost>
        <div>
          <h1 className="font-serif text-2xl font-medium text-espresso">
            {doc.id ? "Edit Slide" : "Add Slide"}
          </h1>
          <p className="text-sm text-muted-foreground">Category: {doc.category_slug}</p>
        </div>
        <div className="flex-1" />
        <BtnPrimary onClick={save} disabled={saving} className="min-w-[120px]">
          {saving ? "Saving..." : "Save"}
        </BtnPrimary>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-medium text-espresso border-b pb-2">Desktop Image (Required)</h3>
            <p className="text-xs text-muted-foreground">Recommended: 1920 × 600 px</p>
            {f.image_url ? (
              <div className="relative group rounded-lg overflow-hidden border border-border">
                <img src={f.image_url} alt="Preview" className="w-full aspect-[16/5] object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="cursor-pointer bg-white text-espresso px-4 py-2 rounded shadow text-sm font-medium hover:bg-cream">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={handleDesktopUpload} disabled={uploadingDesktop} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-[16/5] border-2 border-dashed border-border/80 rounded-lg bg-cream/30 hover:bg-cream/60 cursor-pointer transition-colors">
                <Upload className="size-8 text-muted-foreground/50 mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Upload Desktop Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleDesktopUpload} disabled={uploadingDesktop} />
              </label>
            )}
            <Field label="Or provide Image URL">
              <input
                className={inp}
                value={f.image_url || ""}
                onChange={(e) => setF({ ...f, image_url: e.target.value })}
                placeholder="https://..."
              />
            </Field>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-medium text-espresso border-b pb-2">Mobile Image (Optional)</h3>
            <p className="text-xs text-muted-foreground">If omitted, the desktop image will be centered and cropped.</p>
            {f.mobile_image_url ? (
              <div className="relative group rounded-lg overflow-hidden border border-border w-1/2 mx-auto">
                <img src={f.mobile_image_url} alt="Mobile Preview" className="w-full aspect-[4/5] object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <label className="cursor-pointer bg-white text-espresso px-4 py-2 rounded shadow text-sm font-medium hover:bg-cream flex flex-col items-center">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={handleMobileUpload} disabled={uploadingMobile} />
                  </label>
                  <button 
                    onClick={() => setF({ ...f, mobile_image_url: null })}
                    className="ml-2 bg-red-600 text-white p-2 rounded shadow hover:bg-red-700"
                    title="Remove Mobile Image"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-1/2 mx-auto aspect-[4/5] border-2 border-dashed border-border/80 rounded-lg bg-cream/30 hover:bg-cream/60 cursor-pointer transition-colors">
                <Upload className="size-8 text-muted-foreground/50 mb-2" />
                <span className="text-sm font-medium text-muted-foreground text-center px-4">Upload Mobile Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleMobileUpload} disabled={uploadingMobile} />
              </label>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4 flex flex-col">
            <h3 className="font-medium text-espresso border-b pb-2 mb-2">Content & Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <select
                  className={inp}
                  value={f.active ? "true" : "false"}
                  onChange={(e) => setF({ ...f, active: e.target.value === "true" })}
                >
                  <option value="true">Active (Visible)</option>
                  <option value="false">Hidden</option>
                </select>
              </Field>
              <Field label="Sort Order">
                <input
                  type="number"
                  className={inp}
                  value={f.sort_order ?? 1}
                  onChange={(e) => setF({ ...f, sort_order: parseInt(e.target.value) || 0 })}
                />
              </Field>
            </div>

            <Field label="Main Title">
              <input
                className={inp}
                value={f.title || ""}
                onChange={(e) => setF({ ...f, title: e.target.value })}
                placeholder="e.g. Pure & Raw Honey"
              />
            </Field>

            <Field label="Subtitle">
              <textarea
                className={`${inp} min-h-[80px]`}
                value={f.subtitle || ""}
                onChange={(e) => setF({ ...f, subtitle: e.target.value })}
                placeholder="Description text below title..."
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Button Label">
                <input
                  className={inp}
                  value={f.cta_label || ""}
                  onChange={(e) => setF({ ...f, cta_label: e.target.value })}
                  placeholder="e.g. Shop Now"
                />
              </Field>
              <Field label="Button Link">
                <input
                  className={inp}
                  value={f.cta_href || ""}
                  onChange={(e) => setF({ ...f, cta_href: e.target.value })}
                  placeholder="e.g. /shop"
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
