import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { listHomepageVideos, upsertHomepageVideo, deleteHomepageVideo, reorderHomepageVideos } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, Field, inp, PageHeader, StatusPill, TableWrap, Td, Th } from "@/components/admin/ui";
import { ArrowLeft, ArrowUp, ArrowDown, ImageOff, Pencil, Plus, RefreshCcw, Trash2, Upload, Video, Play, Pause } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";

export const Route = createFileRoute("/admin/stories")({ component: StoriesPage });

type StoryRow = {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  product_slug: string | null;
  link_url: string | null;
  status: string;
  is_active: boolean;
  is_featured?: boolean;
  placement?: string;
  display_order: number;
};

const EMPTY: Partial<StoryRow> = {
  title: "",
  subtitle: "",
  badge: "",
  video_url: "",
  thumbnail_url: "",
  product_slug: "ajwain-honey",
  link_url: "/product/ajwain-honey",
  status: "published",
  is_active: true,
  is_featured: false,
  placement: "all",
  display_order: 1,
};

function StoriesPage() {
  const listFn = useServerFn(listHomepageVideos);
  const delFn = useServerFn(deleteHomepageVideo);
  const reorderFn = useServerFn(reorderHomepageVideos);
  const [rows, setRows] = useState<StoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<StoryRow> | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  async function load() {
    setLoading(true);
    try {
      const r = await listFn({});
      setRows((r.rows as unknown) as StoryRow[]);
      const p = await fetchProducts();
      if (p.length) setAllProducts(p);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function moveRow(index: number, direction: -1 | 1) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= rows.length) return;
    const clone = [...rows];
    const tempOrder = clone[index].display_order;
    clone[index].display_order = clone[targetIdx].display_order;
    clone[targetIdx].display_order = tempOrder;

    // Swap position in array
    const temp = clone[index];
    clone[index] = clone[targetIdx];
    clone[targetIdx] = temp;
    setRows(clone);

    try {
      await reorderFn({
        data: {
          items: clone.map((r, i) => ({ id: r.id, display_order: i + 1 })),
        },
      });
      toast.success("Order updated");
    } catch (e) {
      toast.error((e as Error).message);
      void load();
    }
  }

  if (edit) {
    return (
      <Editor
        initial={edit}
        allProducts={allProducts}
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
        title="Homepage Management → Video / Story Section"
        subtitle={`${rows.length} homepage story/video cards (9:16 vertical aspect ratio)`}
        actions={
          <>
            <BtnGhost onClick={load}>
              <RefreshCcw className="size-3.5" /> REFRESH
            </BtnGhost>
            <BtnPrimary onClick={() => setEdit({ ...EMPTY, display_order: rows.length + 1 })}>
              <Plus className="size-3.5" /> NEW STORY CARD
            </BtnPrimary>
          </>
        }
      />

      <TableWrap>
        <thead>
          <tr>
            {["Order", "Preview", "Title & Subtitle", "Badge", "Product", "Status", "Order Move", ""].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading && (
            <tr>
              <Td className="text-center py-12 text-muted-foreground">Loading homepage videos...</Td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <Td className="text-center py-12 text-muted-foreground">No homepage videos yet. Click "New Story Card" to create one.</Td>
            </tr>
          )}
          {!loading &&
            rows.map((r, idx) => (
              <tr key={r.id} className="hover:bg-cream/40">
                <Td className="text-xs font-mono text-muted-foreground">{r.display_order}</Td>
                <Td>
                  <div className="relative size-14 aspect-[9/16] rounded-lg overflow-hidden bg-cream-deep border border-border grid place-items-center shrink-0">
                    {r.thumbnail_url ? (
                      <img src={r.thumbnail_url} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <ImageOff className="size-5 text-muted-foreground/50" />
                    )}
                    {r.video_url && (
                      <span className="absolute bottom-1 right-1 rounded-full bg-forest-dark/80 text-gold p-1 shadow">
                        <Video className="size-3" />
                      </span>
                    )}
                  </div>
                </Td>
                <Td>
                  <div className="font-serif font-medium text-forest-dark">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.subtitle || "—"}</div>
                </Td>
                <Td>
                  {r.badge ? (
                    <span className="inline-flex rounded-full bg-gold/20 text-forest-dark text-[11px] font-semibold px-2 py-0.5">
                      {r.badge}
                    </span>
                  ) : (
                    "—”"
                  )}
                </Td>
                <Td className="text-xs font-mono">{r.product_slug || r.link_url || "—"}</Td>
                <Td>
                  <div className="flex flex-col gap-1">
                    <StatusPill s={r.status === "published" ? "active" : "disabled"} />
                    <span className="text-[10px] text-muted-foreground">
                      {r.is_active ? "Active on Homepage" : "Disabled"}
                    </span>
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => void moveRow(idx, -1)}
                      className="p-1 rounded hover:bg-cream-deep disabled:opacity-30 text-forest-dark"
                      title="Move up"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === rows.length - 1}
                      onClick={() => void moveRow(idx, 1)}
                      className="p-1 rounded hover:bg-cream-deep disabled:opacity-30 text-forest-dark"
                      title="Move down"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                  </div>
                </Td>
                <Td className="text-right">
                  <button
                    onClick={() => setEdit(r)}
                    className="text-gold-deep hover:underline text-xs font-bold mr-3"
                  >
                    <Pencil className="size-3.5 inline" /> EDIT
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete story card "${r.title}"?`)) return;
                      try {
                        await delFn({ data: { id: r.id } });
                        toast.success("Deleted story card");
                        void load();
                      } catch (e) {
                        toast.error((e as Error).message);
                      }
                    }}
                    className="text-destructive hover:underline text-xs font-bold"
                  >
                    <Trash2 className="size-3.5 inline" /> DELETE
                  </button>
                </Td>
              </tr>
            ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function Editor({
  initial,
  allProducts,
  onCancel,
  onSaved,
}: {
  initial: Partial<StoryRow>;
  allProducts: Product[];
  onCancel: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [f, setF] = useState<Partial<StoryRow>>({ ...initial });
  const [busy, setBusy] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  const videoRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const saveFn = useServerFn(upsertHomepageVideo);

  // Maximum upload size: 200 MB per video (200 * 1024 * 1024 bytes)
  const MAX_VIDEO_BYTES = 209715200;
  const MAX_THUMB_BYTES = 10 * 1024 * 1024;

  async function onUploadVideo(file: File) {
    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a valid video file (MP4, WebM, QuickTime)");
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      toast.error(`Video file exceeds 200 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      return;
    }

    setVideoUploading(true);
    setVideoProgress(5);
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `stories/videos/${Date.now()}_${safeName}`;

      // Upload directly to Supabase Storage media bucket
      const { data, error } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

      setVideoProgress(90);
      if (error) throw new Error(error.message);

      const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
      const url = pubData.publicUrl;

      setF((prev) => ({ ...prev, video_url: url }));
      setVideoProgress(100);
      toast.success("9:16 Video uploaded successfully");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setVideoUploading(false);
    }
  }

  async function onUploadThumbnail(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > MAX_THUMB_BYTES) {
      toast.error("Thumbnail file exceeds 10 MB limit");
      return;
    }

    setThumbUploading(true);
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `stories/thumbnails/${Date.now()}_${safeName}`;

      const { data, error } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

      if (error) throw new Error(error.message);

      const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
      const url = pubData.publicUrl;

      setF((prev) => ({ ...prev, thumbnail_url: url }));
      toast.success("Poster/thumbnail uploaded successfully");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setThumbUploading(false);
    }
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4 hover:underline"
      >
        <ArrowLeft className="size-4" /> BACK TO HOMEPAGE VIDEOS
      </button>

      <Card className="p-6 max-w-4xl">
        <h2 className="font-serif text-2xl text-forest-dark mb-2">
          {f.id ? "Edit Story / Video Card" : "New Story / Video Card"}
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Recommended format: 9:16 vertical (1080 × 1920), maximum 200 MB. Poster-first rendering ensures no video is downloaded until customer interacts.
        </p>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <Field label="Card Title * (e.g. Digestive Ritual)">
            <input
              value={f.title ?? ""}
              onChange={(e) => setF({ ...f, title: e.target.value })}
              className={inp}
              placeholder="Digestive Ritual"
            />
          </Field>
          <Field label="Subtitle / Kicker text (e.g. Ajwain Honey)">
            <input
              value={f.subtitle ?? ""}
              onChange={(e) => setF({ ...f, subtitle: e.target.value })}
              className={inp}
              placeholder="Ajwain Honey"
            />
          </Field>
          <Field label="Badge Label (e.g. Single Flora)">
            <input
              value={f.badge ?? ""}
              onChange={(e) => setF({ ...f, badge: e.target.value })}
              className={inp}
              placeholder="Single Flora"
            />
          </Field>
          <Field label="Linked Product">
            <select
              value={f.product_slug ?? ""}
              onChange={(e) => {
                const slug = e.target.value || null;
                setF({
                  ...f,
                  product_slug: slug,
                  link_url: slug ? `/product/${slug}` : f.link_url,
                });
              }}
              className={inp}
            >
              <option value="">— No product link / custom URL —</option>
              {allProducts.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} ({p.category}) — ₹{p.price}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Custom URL / Product Path">
            <input
              value={f.link_url ?? ""}
              onChange={(e) => setF({ ...f, link_url: e.target.value })}
              className={inp}
              placeholder="/product/ajwain-honey"
            />
          </Field>
          <Field label="Display Order">
            <input
              type="number"
              value={f.display_order ?? 1}
              onChange={(e) => setF({ ...f, display_order: Number(e.target.value) })}
              className={inp}
            />
          </Field>
          <Field label="Status">
            <select
              value={f.status ?? "published"}
              onChange={(e) => setF({ ...f, status: e.target.value })}
              className={inp}
            >
              <option value="published">Published (Public)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Where can it appear? (Placement Context)">
            <select
              value={f.placement ?? "all"}
              onChange={(e) => setF({ ...f, placement: e.target.value })}
              className={inp}
            >
              <option value="all">Everywhere (Homepage, Shop & PDPs)</option>
              <option value="homepage">Homepage Only</option>
              <option value="shop">Shop & Collections Only</option>
              <option value="pdp">Product Detail Pages Only</option>
            </select>
          </Field>
          <div className="flex flex-wrap items-center gap-6 pt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-forest-dark cursor-pointer">
              <input
                type="checkbox"
                checked={!!f.is_active}
                onChange={(e) => setF({ ...f, is_active: e.target.checked })}
                className="size-4"
              />
              Active on Carousel
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-burnt-orange cursor-pointer">
              <input
                type="checkbox"
                checked={!!f.is_featured}
                onChange={(e) => setF({ ...f, is_featured: e.target.checked })}
                className="size-4"
              />
              Mark Featured
            </label>
          </div>
        </div>

        {/* Media Upload and 9:16 Preview Section */}
        <div className="mt-8 pt-6 border-t border-border grid md:grid-cols-2 gap-6">
          {/* Left: Upload controls */}
          <div className="space-y-6">
            {/* Thumbnail Upload */}
            <Field label="1. Poster / Thumbnail Image (Required for Poster-First Lazy Loading)">
              <div className="space-y-2">
                <input
                  ref={thumbRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUploadThumbnail(file);
                    e.target.value = "";
                  }}
                />
                <div className="flex gap-2">
                  <BtnGhost
                    type="button"
                    disabled={thumbUploading}
                    onClick={() => thumbRef.current?.click()}
                  >
                    <Upload className="size-3.5" />
                    {thumbUploading ? "UPLOADING THUMBNAIL..." : f.thumbnail_url ? "REPLACE THUMBNAIL" : "UPLOAD THUMBNAIL"}
                  </BtnGhost>
                  {f.thumbnail_url && (
                    <BtnGhost type="button" onClick={() => setF({ ...f, thumbnail_url: "" })}>
                      <Trash2 className="size-3.5" /> REMOVE
                    </BtnGhost>
                  )}
                </div>
                <input
                  value={f.thumbnail_url ?? ""}
                  onChange={(e) => setF({ ...f, thumbnail_url: e.target.value })}
                  className={inp}
                  placeholder="Or paste image URL (https://...)"
                />
                <p className="text-[11px] text-muted-foreground">
                  JPG, PNG, or WebP. Appears immediately when page loads before customer plays video.
                </p>
              </div>
            </Field>

            {/* 9:16 Video Upload */}
            <Field label="2. 9:16 Vertical Video (MP4 / WebM / QuickTime, Max 200 MB)">
              <div className="space-y-2">
                <input
                  ref={videoRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUploadVideo(file);
                    e.target.value = "";
                  }}
                />
                <div className="flex gap-2">
                  <BtnGhost
                    type="button"
                    disabled={videoUploading}
                    onClick={() => videoRef.current?.click()}
                  >
                    <Video className="size-3.5" />
                    {videoUploading
                      ? `UPLOADING (${videoProgress}%)...`
                      : f.video_url
                        ? "REPLACE VIDEO (MAX 200MB)"
                        : "UPLOAD 9:16 VIDEO (MAX 200MB)"}
                  </BtnGhost>
                  {f.video_url && (
                    <BtnGhost type="button" onClick={() => setF({ ...f, video_url: "" })}>
                      <Trash2 className="size-3.5" /> REMOVE
                    </BtnGhost>
                  )}
                </div>

                {videoUploading && (
                  <div className="w-full bg-cream-deep h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gold-deep h-full transition-all duration-300"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                )}

                <input
                  value={f.video_url ?? ""}
                  onChange={(e) => setF({ ...f, video_url: e.target.value })}
                  className={inp}
                  placeholder="Or paste video URL (https://...)"
                />
                <p className="text-[11px] text-muted-foreground">
                  Vertical 9:16 video (1080 × 1920 recommended). Replaces static image when customer clicks play.
                </p>
              </div>
            </Field>
          </div>

          {/* Right: Live 9:16 Preview Card */}
          <div className="flex flex-col items-center justify-center p-4 bg-cream/50 rounded-xl border border-border">
            <span className="text-xs font-bold tracking-widest text-forest-dark uppercase mb-3">
              9:16 Vertical Storefront Preview
            </span>

            <div className="relative w-48 aspect-[9/16] rounded-2xl overflow-hidden bg-forest-dark shadow-lift border border-border">
              {f.video_url && previewPlaying ? (
                <video
                  ref={previewVideoRef}
                  src={f.video_url}
                  poster={f.thumbnail_url || undefined}
                  playsInline
                  muted
                  loop
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : f.thumbnail_url ? (
                <img
                  src={f.thumbnail_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-cream/50 text-xs p-4 text-center">
                  <Video className="size-8 mb-2 opacity-40" />
                  No Thumbnail/Video Set
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/20 to-transparent pointer-events-none" />

              {f.badge && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="inline-block rounded-full bg-cream/20 backdrop-blur-sm text-cream text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5">
                    {f.badge}
                  </span>
                </div>
              )}

              {f.video_url && (
                <button
                  type="button"
                  onClick={() => setPreviewPlaying(!previewPlaying)}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <span className="grid place-items-center size-10 rounded-full bg-cream/90 text-forest-dark shadow">
                    {previewPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                  </span>
                </button>
              )}

              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10 text-cream z-10">
                {(() => {
                  const p = allProducts.find((item) => item.slug === f.product_slug);
                  if (p) {
                    return (
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15">
                        <img src={p.image} alt={p.name} className="size-8 rounded-lg object-cover bg-cream shrink-0 border border-white/20" />
                        <div className="min-w-0 flex-1">
                          <div className="font-serif text-xs font-bold text-white truncate">{p.name}</div>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-xs font-bold text-white">₹{p.price}</span>
                            {p.mrp && p.mrp > p.price && <span className="text-[10px] text-white/60 line-through">₹{p.mrp}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <>
                      <div className="font-serif text-sm leading-tight">{f.title || "Card Title"}</div>
                      <div className="text-[10px] text-cream/80">{f.subtitle || "Subtitle"}</div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <BtnPrimary
            disabled={busy || videoUploading}
            onClick={async () => {
              if (!f.title?.trim()) {
                toast.error("Title is required");
                return;
              }
              setBusy(true);
              try {
                await saveFn({
                  data: {
                    id: f.id,
                    title: f.title,
                    subtitle: f.subtitle ?? null,
                    badge: f.badge ?? null,
                    video_url: f.video_url || null,
                    thumbnail_url: f.thumbnail_url || null,
                    product_slug: f.product_slug || null,
                    link_url: f.link_url || null,
                    status: (f.status as "draft" | "published" | "archived") || "published",
                    is_active: !!f.is_active,
                    display_order: Number(f.display_order ?? 0),
                    is_featured: false,
                    placement: f.placement || "all",
                  },
                });
                toast.success("Saved story/video card");
                await onSaved();
              } catch (e) {
                toast.error((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "SAVING..." : "SAVE STORY CARD"}
          </BtnPrimary>
          <BtnGhost onClick={onCancel}>CANCEL</BtnGhost>
        </div>
      </Card>
    </div>
  );
}
