import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { listAdminSlides, upsertSlide, deleteSlide } from "@/lib/admin-catalog.functions";
import { IMAGE_KEYS, resolveImage, FALLBACK_IMAGE } from "@/lib/product-images";
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
import {
  ArrowLeft,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Upload,
  Eye,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/admin/hero")({ component: HeroPage });

type Slide = {
  id: string;
  page: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  image_key: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  cta_label: string | null;
  cta_href: string;
  sort_order: number;
  active: boolean;
};

const EMPTY: Partial<Slide> = {
  page: "home",
  eyebrow: "",
  title: "",
  subtitle: "",
  image_key: "hero-honey",
  image_url: null,
  mobile_image_url: null,
  cta_label: "Shop Now",
  cta_href: "/shop",
  sort_order: 1,
  active: true,
};

const PAGE_OPTIONS = [
  { value: "home", label: "Home Page (1920×700)" },
  { value: "shop", label: "Shop (1920×600)" },
  { value: "our-story", label: "Our Story (1920×600)" },
  { value: "bee-farming", label: "Bee Farming (1920×600)" },
  { value: "blog", label: "Journal (1920×600)" },
  { value: "bulk-orders", label: "Bulk & Gifting (1920×600)" },
  { value: "contact", label: "Contact (1920×600)" },
];

function HeroPage() {
  const list = useServerFn(listAdminSlides);
  const del = useServerFn(deleteSlide);
  const [rows, setRows] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<Slide> | null>(null);
  const [filterPage, setFilterPage] = useState<string>("all");

  async function load() {
    setLoading(true);
    try {
      const r = await list({});
      setRows(r.rows as unknown as Slide[]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line
  }, []);

  const filteredRows = useMemo(() => {
    if (filterPage === "all") return rows;
    return rows.filter((r) => r.page.toLowerCase() === filterPage.toLowerCase());
  }, [rows, filterPage]);

  if (edit) {
    return (
      <Editor
        initial={edit}
        onCancel={() => setEdit(null)}
        onSaved={async () => {
          setEdit(null);
          await load();
        }}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Banner / Hero Slider Management"
        subtitle={`${rows.length} total hero slides across website pages`}
        actions={
          <>
            <BtnGhost onClick={load}>
              <RefreshCcw className="size-3.5" /> REFRESH
            </BtnGhost>
            <BtnPrimary onClick={() => setEdit(EMPTY)}>
              <Plus className="size-3.5" /> NEW SLIDE
            </BtnPrimary>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-bold text-forest-dark">Filter Page:</span>
        <button
          onClick={() => setFilterPage("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            filterPage === "all"
              ? "bg-forest-dark text-cream"
              : "bg-cream text-forest-dark border border-border"
          }`}
        >
          All ({rows.length})
        </button>
        {PAGE_OPTIONS.map((opt) => {
          const count = rows.filter((r) => r.page.toLowerCase() === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setFilterPage(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filterPage === opt.value
                  ? "bg-forest-dark text-cream"
                  : "bg-cream text-forest-dark border border-border"
              }`}
            >
              {opt.value.toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

      <TableWrap>
        <thead>
          <tr>
            {["Page", "Sort", "Title & Preview", "Target", "Status", ""].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                Loading slides…
              </td>
            </tr>
          )}
          {!loading && filteredRows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                No slides found for this view. Click "NEW SLIDE" to add custom banners.
              </td>
            </tr>
          )}
          {!loading &&
            filteredRows.map((r) => {
              const previewImg = resolveImage(
                r.image_key,
                r.image_url,
                FALLBACK_IMAGE
              );
              return (
                <tr key={r.id} className="hover:bg-cream/40">
                  <Td className="text-xs font-bold uppercase text-brand-orange">
                    {r.page}
                  </Td>
                  <Td className="text-xs text-muted-foreground font-mono">
                    {r.sort_order}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg overflow-hidden border border-border bg-cream shrink-0">
                        <img
                          src={previewImg}
                          alt="Slide preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm font-semibold text-forest-dark truncate max-w-[200px]">
                        {r.title || "(No Title)"}
                      </div>
                    </div>
                  </Td>
                  <Td className="text-xs">
                    <span className="font-mono">{r.cta_href}</span>
                  </Td>
                  <Td>
                    <StatusPill s={r.active ? "live" : "disabled"} />
                  </Td>
                  <Td className="text-right whitespace-nowrap">
                    <button
                      onClick={() => setEdit(r)}
                      className="text-brand-orange hover:underline text-xs font-bold mr-3"
                    >
                      <Pencil className="size-3.5 inline" /> EDIT
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this hero slide?")) return;
                        try {
                          await del({ data: { id: r.id } });
                          toast.success("Deleted slide");
                          void load();
                        } catch (e) {
                          toast.error((e as Error).message);
                        }
                      }}
                      className="text-destructive hover:underline text-xs font-bold"
                    >
                      <Trash2 className="size-3.5 inline" />
                    </button>
                  </Td>
                </tr>
              );
            })}
        </tbody>
      </TableWrap>
    </div>
  );
}

function Editor({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Partial<Slide>;
  onCancel: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [f, setF] = useState<Partial<Slide>>({ ...initial });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const save = useServerFn(upsertSlide);

  // Image uploading temporarily removed as requested by user.

  const previewImage = resolveImage(f.image_key, f.image_url, FALLBACK_IMAGE);
  const previewMobileImage = f.mobile_image_url || previewImage;
  const isHome = (f.page || "home").toLowerCase() === "home";

  return (
    <div>
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4"
      >
        <ArrowLeft className="size-4" /> BACK TO SLIDES
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7">
          <Card className="p-6">
            <h2 className="font-serif text-2xl text-forest-dark mb-4">
              {f.id ? "Edit Hero Slide" : "New Hero Slide"}
            </h2>

            {/* Recommended Dimensions Box */}
            <div className="text-xs text-forest-dark bg-cream/70 border border-brand-orange/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 font-bold text-brand-orange mb-1">
                <Sparkles className="size-4" />
                <span>Recommended Artwork Dimensions:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 mt-1 text-espresso/90">
                <li>
                  <strong>For Desktop Banners:</strong> Recommended size →{" "}
                  <span className="font-mono font-bold">1920 × 700 px</span> (Home) or <span className="font-mono font-bold">1920 × 600 px</span> (Inner pages).
                </li>
                <li>
                  <strong>For Mobile Banners:</strong> Recommended size →{" "}
                  <span className="font-mono font-bold">1080 × 1080 px</span> (Square 1:1 Aspect Ratio).
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-espresso/70 italic font-medium">
                Warning: The container will enforce these aspect ratios. If an uploaded image has a different ratio, it will be automatically center-cropped.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <Field label="Target Page *">
                <select
                  value={f.page ?? "home"}
                  onChange={(e) => setF({ ...f, page: e.target.value })}
                  disabled={!!f.id}
                  className={`${inp} ${f.id ? "opacity-50 cursor-not-allowed bg-cream/50" : ""}`}
                >
                  {PAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Slide Title (Admin & SEO) *">
                <input
                  value={f.title ?? ""}
                  onChange={(e) => setF({ ...f, title: e.target.value })}
                  placeholder="e.g. Summer Sale Banner"
                  className={inp}
                />
              </Field>

              <div className="md:col-span-2 pt-2 border-t border-border">
                <p className="text-xs font-bold text-forest-dark mb-3 uppercase tracking-wider">Text Overlay (Optional)</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Eyebrow Text (Small Label)">
                    <input
                      value={f.eyebrow ?? ""}
                      onChange={(e) => setF({ ...f, eyebrow: e.target.value })}
                      placeholder="e.g. NEW COLLECTION"
                      className={inp}
                    />
                  </Field>

                  <Field label="Description / Subtitle">
                    <input
                      value={f.subtitle ?? ""}
                      onChange={(e) => setF({ ...f, subtitle: e.target.value })}
                      placeholder="Short supporting sentence..."
                      className={inp}
                    />
                  </Field>
                </div>
              </div>

              <Field label="Sort Order">
                <input
                  type="number"
                  value={f.sort_order ?? 0}
                  onChange={(e) =>
                    setF({ ...f, sort_order: Number(e.target.value) })
                  }
                  className={inp}
                />
              </Field>

              {/* Desktop Image URL */}
              <div className="md:col-span-2 pt-2 border-t border-border">
                <Field label="Desktop Banner Image URL * (Required)">
                  <input
                    type="url"
                    value={f.image_url ?? ""}
                    onChange={(e) => setF({ ...f, image_url: e.target.value, image_key: null })}
                    placeholder="https://..."
                    className={inp}
                  />
                </Field>
              </div>
              
              {/* Mobile Image URL */}
              <div className="md:col-span-2 pt-2 border-t border-border">
                <Field label="Mobile Banner Image URL (Optional, falls back to desktop)">
                  <input
                    type="url"
                    value={f.mobile_image_url ?? ""}
                    onChange={(e) => setF({ ...f, mobile_image_url: e.target.value })}
                    placeholder="https://..."
                    className={inp}
                  />
                </Field>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-border">
                <p className="text-xs font-bold text-forest-dark mb-3 uppercase tracking-wider">Call To Action (Optional)</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="CTA Button Text">
                    <input
                      value={f.cta_label ?? ""}
                      onChange={(e) => setF({ ...f, cta_label: e.target.value })}
                      placeholder="e.g. Shop Now"
                      className={inp}
                    />
                  </Field>

                  <Field label="CTA Target URL">
                    <input
                      value={f.cta_href ?? "/shop"}
                      onChange={(e) => setF({ ...f, cta_href: e.target.value })}
                      placeholder="/shop"
                      className={inp}
                    />
                  </Field>
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <label className="inline-flex items-center gap-2 text-sm font-bold text-forest-dark cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!f.active}
                    onChange={(e) => setF({ ...f, active: e.target.checked })}
                    className="size-4 rounded border-border text-brand-orange"
                  />
                  <span>Active (Display this banner in the slider)</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <BtnPrimary
                disabled={busy || uploading}
                onClick={async () => {
                  if (!f.title) {
                    toast.error("Please provide a Slide Title.");
                    return;
                  }
                  if (!f.image_url || !/^https?:\/\//i.test(f.image_url)) {
                    toast.error("Please provide a valid HTTPS URL for the desktop banner image");
                    return;
                  }
                  if (f.mobile_image_url && !/^https?:\/\//i.test(f.mobile_image_url)) {
                    toast.error("Please provide a valid HTTPS URL for the mobile banner image");
                    return;
                  }
                  
                  setBusy(true);
                  try {
                    // Diagnostic Auth Check Before Save
                    const { data: { session } } = await supabase.auth.getSession();
                    console.log('Hero Slide Auth Debug', {
                      hasSession: !!session,
                      userId: session?.user?.id,
                      email: session?.user?.email,
                      accessTokenExists: !!session?.access_token
                    });

                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    console.log('Hero Slide Current User', {
                      userId: user?.id,
                      email: user?.email,
                      error: userError
                    });

                    if (!session || !user) {
                      toast.error("Admin authentication error: No active session. Please sign in again.");
                      window.location.href = "/auth?redirect=/admin/hero";
                      return;
                    }

                    await save({
                      data: {
                        id: f.id,
                        page: f.page || "home",
                        eyebrow: f.eyebrow || null,
                        title: f.title,
                        subtitle: f.subtitle || null,
                        image_key: f.image_key || null,
                        image_url: f.image_url || null,
                        mobile_image_url: f.mobile_image_url || null,
                        cta_label: f.cta_label || null,
                        cta_href: f.cta_href || "/shop",
                        sort_order: Number(f.sort_order ?? 0),
                        active: !!f.active,
                      } as never,
                    });
                    toast.success("Hero slide saved successfully");
                    await onSaved();
                  } catch (e) {
                    toast.error((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "SAVING SLIDE…" : "SAVE SLIDE"}
              </BtnPrimary>
              <BtnGhost onClick={onCancel}>CANCEL</BtnGhost>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Interactive Slide Preview */}
        <div className="lg:col-span-5">
          <Card className="p-5 sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-forest-dark uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="size-4 text-brand-orange" /> LIVE BANNER PREVIEW
              </span>
              <span className="text-[11px] font-mono font-bold text-muted-foreground bg-cream px-2 py-0.5 rounded border border-border">
                {isHome ? "1920 × 700 px (Home)" : "1920 × 600 px (Inner)"}
              </span>
            </div>

            <div className="space-y-6">
              {/* Desktop Preview */}
              <div>
                <div className="text-[11px] font-bold text-forest-dark uppercase tracking-wider mb-2">Desktop View</div>
                <div
                  className={`relative rounded-2xl overflow-hidden shadow-lg border border-border bg-espresso w-full ${
                    isHome ? "aspect-[1920/700]" : "aspect-[1920/600]"
                  }`}
                >
                  <img
                    src={previewImage}
                    alt="Desktop Preview"
                    className="w-full h-full object-cover"
                  />
                  {(f.eyebrow || f.subtitle || f.cta_label) && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none">
                      {f.eyebrow && <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-brand-orange mb-3 drop-shadow-md">{f.eyebrow}</div>}
                      <h2 className="font-serif text-2xl font-bold text-cream mb-3 drop-shadow-lg leading-tight">{f.title || "Banner Title"}</h2>
                      {f.subtitle && <p className="text-[11px] text-cream/90 mb-4 max-w-[80%] leading-relaxed drop-shadow-md">{f.subtitle}</p>}
                      {f.cta_label && (
                        <div className="inline-flex items-center gap-1.5 bg-brand-orange text-white rounded-full px-4 py-2 font-bold text-[9px] uppercase tracking-widest shadow-md">
                          {f.cta_label}
                          <ArrowRight className="size-3" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Preview */}
              <div>
                <div className="text-[11px] font-bold text-forest-dark uppercase tracking-wider mb-2">Mobile View</div>
                <div
                  className="relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-espresso/20 bg-espresso mx-auto"
                  style={{ width: "240px", aspectRatio: "1080/1080" }}
                >
                  <img
                    src={previewMobileImage}
                    alt="Mobile Preview"
                    className="w-full h-full object-cover"
                  />
                  {(f.eyebrow || f.subtitle || f.cta_label) && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none">
                      {f.eyebrow && <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-brand-orange mb-2 drop-shadow-md">{f.eyebrow}</div>}
                      <h2 className="font-serif text-[20px] font-bold text-cream mb-2 drop-shadow-lg leading-tight">{f.title || "Banner Title"}</h2>
                      {f.subtitle && <p className="text-[10px] text-cream/90 mb-3 max-w-[90%] leading-relaxed drop-shadow-md">{f.subtitle}</p>}
                      {f.cta_label && (
                        <div className="inline-flex items-center gap-1.5 bg-brand-orange text-white rounded-full px-4 py-2.5 font-bold text-[9px] uppercase tracking-widest shadow-md">
                          {f.cta_label}
                          <ArrowRight className="size-3" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              Images will scale responsively on actual devices.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
