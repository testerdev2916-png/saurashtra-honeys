import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { uploadToImageKit } from "@/lib/imagekit-upload";
import {
  listCategoryHeroSlides,
  upsertCategoryHeroSlide,
  deleteCategoryHeroSlide,
} from "@/lib/admin-catalog.functions";
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
import {
  Layers,
  ExternalLink,
  Eye,
  ArrowLeft,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import type { CategoryHeroSlide } from "@/components/shop/CategoryHeroSlider";
import { fetchShopCategories, type ShopCategory } from "@/lib/category-catalog";

const searchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/admin/category-hero")({
  validateSearch: (s) => searchSchema.parse(s),
  component: CategoryHeroPage,
});

const EMPTY: Partial<CategoryHeroSlide> = {
  category_slug: "honey",
  title: "",
  subtitle: "",
  image_url: "",
  mobile_image_url: null,
  cta_label: "",
  cta_href: "",
  sort_order: 1,
  active: true,
};

function CategoryHeroPage() {
  const search = Route.useSearch();
  const listFn = useServerFn(listCategoryHeroSlides);
  const delFn = useServerFn(deleteCategoryHeroSlide);

  const [rows, setRows] = useState<CategoryHeroSlide[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<CategoryHeroSlide> | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>(search.category || "honey");

  async function load() {
    setLoading(true);
    try {
      const [cats, slidesRes] = await Promise.all([fetchShopCategories(), listFn()]);
      setCategories(cats);
      setRows((slidesRes?.rows as CategoryHeroSlide[]) || []);

      if (search.category) {
        setFilterCategory(search.category);
      } else if (!filterCategory || filterCategory === "all-products") {
        const honeyCat = cats.find((c) => c.slug === "honey");
        if (honeyCat) {
          setFilterCategory("honey");
        } else if (cats.length > 0) {
          setFilterCategory(cats[0].slug);
        }
      }
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

  const activeCategory = useMemo(() => {
    return (
      categories.find((c) => c.slug.toLowerCase() === filterCategory.toLowerCase()) || {
        slug: filterCategory,
        name: filterCategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      }
    );
  }, [categories, filterCategory]);

  if (edit) {
    return (
      <Editor
        doc={edit}
        categories={categories}
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
        title="Category Banners (1920×600)"
        subtitle="Manage the 1920×600 hero banners shown at the top of category pages (e.g. /shop/honey)."
        actions={
          <>
            <a
              href={`/shop/${filterCategory}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-white text-espresso hover:bg-cream transition-colors shadow-sm"
              title="Open category storefront page in new tab"
            >
              <ExternalLink className="size-3.5 text-brand-orange" />
              Preview /shop/{filterCategory}
            </a>
            <BtnGhost onClick={load} disabled={loading} className="gap-2">
              <RefreshCcw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </BtnGhost>
            <BtnPrimary
              onClick={() => setEdit({ ...EMPTY, category_slug: filterCategory })}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Banner Slide
            </BtnPrimary>
          </>
        }
      />

      {/* Category selector tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-border/50">
        {categories.map((c) => {
          const count = rows.filter(
            (r) => r.category_slug.toLowerCase() === c.slug.toLowerCase(),
          ).length;
          const isSelected = filterCategory.toLowerCase() === c.slug.toLowerCase();
          return (
            <button
              key={c.slug}
              onClick={() => setFilterCategory(c.slug)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? "border-brand-orange text-brand-orange bg-brand-orange/5 font-semibold"
                  : "border-transparent text-espresso/60 hover:text-espresso hover:bg-espresso/5"
              }`}
            >
              <span>{c.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  count > 0
                    ? isSelected
                      ? "bg-brand-orange text-white"
                      : "bg-brand-orange/20 text-brand-orange"
                    : "bg-border/60 text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Banner summary info */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-cream/40 border border-border/60 text-xs">
        <div className="flex items-center gap-2 text-espresso">
          <ImageIcon className="size-4 text-brand-orange" />
          <span>
            Category: <strong className="font-semibold">{activeCategory.name}</strong> (
            <code>/shop/{filterCategory}</code>)
          </span>
        </div>
        <div className="text-muted-foreground">
          Recommended Size: <strong className="text-forest-dark font-medium">1920 × 600 px</strong>{" "}
          (Aspect ratio 16:5)
        </div>
      </div>

      <Card className="overflow-hidden">
        <TableWrap>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-border/60 bg-cream/30">
                <Th className="w-16">Order</Th>
                <Th className="w-36">Banner Preview (1920×600)</Th>
                <Th>Title / Details</Th>
                <Th className="w-32">Mobile Crop</Th>
                <Th className="w-24">Status</Th>
                <Th className="w-24 text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground align-top">
                    <ImageIcon className="size-12 mx-auto text-muted-foreground/30 mb-3" />
                    <div className="text-base font-medium text-espresso mb-1">
                      No banner found for {activeCategory.name}
                    </div>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                      Upload a 1920×600 image to display a full-width hero banner on /shop/
                      {filterCategory}.
                    </p>
                    <BtnPrimary
                      onClick={() => setEdit({ ...EMPTY, category_slug: filterCategory })}
                      className="gap-2 inline-flex"
                    >
                      <Plus className="size-3.5" /> Upload 1920×600 Banner
                    </BtnPrimary>
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr key={r.id} className="hover:bg-cream/30 transition-colors">
                    <Td className="font-mono text-muted-foreground">{r.sort_order}</Td>
                    <Td>
                      {r.image_url ? (
                        <div className="w-32 aspect-[16/5] rounded overflow-hidden shadow-sm border border-border bg-muted">
                          <img
                            src={r.image_url}
                            alt={r.title || "Category Hero Banner"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 aspect-[16/5] bg-border/50 rounded flex items-center justify-center text-xs">
                          No Image
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div className="font-medium text-espresso truncate max-w-[200px] lg:max-w-[300px]">
                        {r.title || (
                          <span className="text-muted-foreground italic">
                            Graphic Only (No Overlay Text)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px] lg:max-w-[300px] mt-0.5">
                        {r.subtitle || (r.cta_href ? `Links to: ${r.cta_href}` : "No link")}
                      </div>
                    </Td>
                    <Td>
                      {r.mobile_image_url ? (
                        <StatusPill s="Custom" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Auto-crop</span>
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
                          if (!confirm("Delete this banner slide?")) return;
                          setLoading(true);
                          try {
                            await delFn({ data: { id: r.id } });
                            toast.success("Banner slide deleted");
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

      {filteredRows.length > 0 && (
        <div className="mt-4 p-4 rounded-xl border border-brand-orange/30 bg-brand-orange/5 text-xs text-espresso flex items-start gap-2.5">
          <Eye className="size-4 text-brand-orange shrink-0 mt-0.5" />
          <div>
            <strong>Active Banners:</strong> {filteredRows.length} slide
            {filteredRows.length > 1 ? "s" : ""}.
            {filteredRows.length === 1
              ? " Displays as a clean static 1920×600 banner."
              : " Displays as an auto-playing carousel slider."}
            <a
              href={`/shop/${filterCategory}`}
              target="_blank"
              rel="noreferrer"
              className="ml-2 font-bold text-brand-orange underline inline-flex items-center gap-1"
            >
              View on /shop/{filterCategory} <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Editor({
  doc,
  categories,
  onCancel,
  onSaved,
}: {
  doc: Partial<CategoryHeroSlide>;
  categories: ShopCategory[];
  onCancel: () => void;
  onSaved: () => void;
}) {
  const saveFn = useServerFn(upsertCategoryHeroSlide);
  const [f, setF] = useState(doc);
  const [saving, setSaving] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  async function handleDesktopUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDesktop(true);
    try {
      const url = await uploadToImageKit(file, "categories");
      setF((prev) => ({ ...prev, image_url: url }));
      toast.success("Desktop 1920×600 banner uploaded");
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
      const url = await uploadToImageKit(file, "categories");
      setF((prev) => ({ ...prev, mobile_image_url: url }));
      toast.success("Mobile banner uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploadingMobile(false);
    }
  }

  async function save() {
    if (!f.image_url) {
      toast.error("Desktop banner image (1920×600) is required.");
      return;
    }
    setSaving(true);
    try {
      await saveFn({
        data: {
          id: f.id,
          category_slug: f.category_slug || "honey",
          image_url: f.image_url,
          mobile_image_url: f.mobile_image_url || null,
          title: f.title?.trim() || null,
          subtitle: f.subtitle?.trim() || null,
          cta_label: f.cta_label?.trim() || null,
          cta_href: f.cta_href?.trim() || null,
          sort_order: f.sort_order || 1,
          active: f.active ?? true,
        },
      });
      toast.success("Category banner saved successfully");
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
            {doc.id ? "Edit Category Banner" : "Add Category Banner"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Category: <code>{f.category_slug}</code>
          </p>
        </div>
        <div className="flex-1" />
        <BtnPrimary onClick={save} disabled={saving} className="min-w-[120px]">
          {saving ? "Saving..." : "Save Banner"}
        </BtnPrimary>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Column */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="border-b pb-2 flex items-center justify-between">
              <h3 className="font-medium text-espresso flex items-center gap-2">
                <ImageIcon className="size-4 text-brand-orange" /> Desktop Banner Image (Required)
              </h3>
              <span className="text-[11px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
                1920 × 600 px
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Optimal resolution: <strong>1920 × 600 px</strong> (exact 16:5 ratio). Formats: JPG,
              PNG, WebP.
            </p>
            {f.image_url ? (
              <div className="relative group rounded-lg overflow-hidden border border-border bg-muted">
                <img
                  src={f.image_url}
                  alt="Banner Preview"
                  className="w-full aspect-[16/5] object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <label className="cursor-pointer bg-white text-espresso px-4 py-2 rounded shadow text-sm font-medium hover:bg-cream">
                    {uploadingDesktop ? "Uploading…" : "Replace Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleDesktopUpload}
                      disabled={uploadingDesktop}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setF((prev) => ({ ...prev, image_url: "" }))}
                    className="bg-red-600 text-white px-3 py-2 rounded shadow text-sm hover:bg-red-700"
                    title="Remove Image"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-[16/5] border-2 border-dashed border-border/80 rounded-lg bg-cream/30 hover:bg-cream/60 cursor-pointer transition-colors p-4 text-center">
                <Upload className="size-8 text-brand-orange mb-2" />
                <span className="text-sm font-semibold text-espresso">Upload 1920×600 Banner</span>
                <span className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WebP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDesktopUpload}
                  disabled={uploadingDesktop}
                />
              </label>
            )}
            <Field label="Or paste Image URL directly">
              <input
                className={inp}
                value={f.image_url || ""}
                onChange={(e) => setF({ ...f, image_url: e.target.value })}
                placeholder="https://ik.imagekit.io/..."
              />
            </Field>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="border-b pb-2 flex items-center justify-between">
              <h3 className="font-medium text-espresso">Mobile Crop Image (Optional)</h3>
              <span className="text-[11px] text-muted-foreground">e.g. 800 × 800 or 4:5</span>
            </div>
            <p className="text-xs text-muted-foreground">
              If omitted, the desktop 1920×600 image will be automatically centered and scaled for
              mobile screens.
            </p>
            {f.mobile_image_url ? (
              <div className="relative group rounded-lg overflow-hidden border border-border w-1/2 mx-auto">
                <img
                  src={f.mobile_image_url}
                  alt="Mobile Preview"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <label className="cursor-pointer bg-white text-espresso px-3 py-1.5 rounded shadow text-xs font-medium hover:bg-cream">
                    {uploadingMobile ? "Uploading…" : "Replace"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMobileUpload}
                      disabled={uploadingMobile}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setF({ ...f, mobile_image_url: null })}
                    className="bg-red-600 text-white px-2.5 py-1.5 rounded shadow text-xs hover:bg-red-700"
                    title="Remove Mobile Image"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-[21/9] border-2 border-dashed border-border/80 rounded-lg bg-cream/30 hover:bg-cream/60 cursor-pointer transition-colors p-3 text-center">
                <Upload className="size-6 text-muted-foreground/60 mb-1" />
                <span className="text-xs font-medium text-espresso">
                  Upload Mobile Banner (Optional)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMobileUpload}
                  disabled={uploadingMobile}
                />
              </label>
            )}
          </Card>
        </div>

        {/* Settings & Text Column */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 flex flex-col">
            <h3 className="font-medium text-espresso border-b pb-2 mb-2">Category & Visibility</h3>

            <Field label="Target Category">
              <select
                className={inp}
                value={f.category_slug || "honey"}
                onChange={(e) => setF({ ...f, category_slug: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} (/shop/{c.slug})
                  </option>
                ))}
              </select>
            </Field>

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
                  onChange={(e) => setF({ ...f, sort_order: parseInt(e.target.value) || 1 })}
                />
              </Field>
            </div>
          </Card>

          <Card className="p-6 space-y-4 flex flex-col">
            <div className="border-b pb-2 flex items-center justify-between">
              <h3 className="font-medium text-espresso">Text & Overlay (Optional)</h3>
              <span className="text-[11px] text-muted-foreground">Optional</span>
            </div>

            <p className="text-xs text-muted-foreground">
              If your 1920×600 banner already has text designed into it, leave these fields empty.
            </p>

            <Field label="Main Heading Text">
              <input
                className={inp}
                value={f.title || ""}
                onChange={(e) => setF({ ...f, title: e.target.value })}
                placeholder="e.g. 100% Pure Saurashtra Honey (leave blank if inside image)"
              />
            </Field>

            <Field label="Subtitle / Tagline">
              <textarea
                className={`${inp} min-h-[70px]`}
                value={f.subtitle || ""}
                onChange={(e) => setF({ ...f, subtitle: e.target.value })}
                placeholder="Description text displayed below heading (optional)"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Button Text (CTA)">
                <input
                  className={inp}
                  value={f.cta_label || ""}
                  onChange={(e) => setF({ ...f, cta_label: e.target.value })}
                  placeholder="e.g. Explore Raw Honey"
                />
              </Field>
              <Field label="Banner Link (URL)">
                <input
                  className={inp}
                  value={f.cta_href || ""}
                  onChange={(e) => setF({ ...f, cta_href: e.target.value })}
                  placeholder="e.g. /shop/honey or /product/slug"
                />
              </Field>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tip: If you provide a Link without Button Text, the entire 1920×600 banner becomes
              clickable!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
