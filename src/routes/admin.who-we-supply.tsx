import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  listAdminSupplyServices,
  upsertSupplyService,
  deleteSupplyService,
  type SupplyServiceRow,
} from "@/lib/supply-services-catalog";
import { IMAGE_KEYS, resolveImage } from "@/lib/product-images";
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
  Store,
  Factory,
  Gift,
  Users2,
  Building2,
  Briefcase,
  Award,
  Package,
  Truck,
  ShieldCheck,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/who-we-supply")({ component: WhoWeSupplyPage });

const AVAILABLE_ICONS = [
  "Store",
  "Factory",
  "Gift",
  "Users2",
  "Building2",
  "Briefcase",
  "Award",
  "Package",
  "Truck",
  "ShieldCheck",
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Store,
  Factory,
  Gift,
  Users2,
  Building2,
  Briefcase,
  Award,
  Package,
  Truck,
  ShieldCheck,
};

const EMPTY: Partial<SupplyServiceRow> = {
  title: "",
  short_description: "",
  image_key: "prod-multiflora",
  image_url: null,
  icon_name: "Store",
  detail_title: "",
  subtitle: "",
  full_description: "",
  key_points: [
    "Bulk honey sourcing",
    "Multiple packaging options",
    "Consistent quality and supply",
  ],
  cta_text: "Enquire Now",
  cta_message: "Hello Saurashtra Honey, I’m interested in your supply services.",
  is_active: true,
  sort_order: 1,
};

function WhoWeSupplyPage() {
  const listFn = useServerFn(listAdminSupplyServices);
  const delFn = useServerFn(deleteSupplyService);
  const [rows, setRows] = useState<SupplyServiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<SupplyServiceRow> | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await listFn({});
      setRows(r.rows);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        title="Who We Supply"
        subtitle={`${rows.length} supply cards displayed on the Bulk Orders page`}
        actions={
          <>
            <BtnGhost onClick={load}>
              <RefreshCcw className="size-3.5" /> REFRESH
            </BtnGhost>
            <BtnPrimary onClick={() => setEdit(EMPTY)}>
              <Plus className="size-3.5" /> NEW CARD
            </BtnPrimary>
          </>
        }
      />
      <TableWrap>
        <thead>
          <tr>
            {["Sort", "Icon", "Card Title", "Short Description", "WhatsApp CTA", "Status", ""].map(
              (h) => (
                <Th key={h}>{h}</Th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading && (
            <tr>
              <Td className="text-center py-12 text-muted-foreground" aria-colspan={7}>
                Loading…
              </Td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <Td className="text-center py-12 text-muted-foreground" aria-colspan={7}>
                No supply service cards found.
              </Td>
            </tr>
          )}
          {!loading &&
            rows.map((r) => {
              const IconComponent = ICON_MAP[r.icon_name] || Store;
              return (
                <tr key={r.id || r.title} className="hover:bg-cream/40">
                  <Td className="text-xs text-muted-foreground font-semibold">{r.sort_order}</Td>
                  <Td>
                    <div className="size-8 rounded-full bg-cream-deep flex items-center justify-center text-burnt-orange shadow-sm">
                      <IconComponent className="size-4" />
                    </div>
                  </Td>
                  <Td className="font-medium text-forest-dark">
                    <div className="flex items-center gap-2">
                      <img
                        src={resolveImage(r.image_key, r.image_url)}
                        alt={r.title}
                        className="size-8 rounded object-cover border border-border"
                      />
                      <span>{r.title}</span>
                    </div>
                  </Td>
                  <Td className="text-xs text-muted-foreground max-w-xs truncate">
                    {r.short_description}
                  </Td>
                  <Td className="text-xs">
                    <div className="font-semibold">{r.cta_text}</div>
                    <div className="text-[11px] text-muted-foreground max-w-xs truncate">
                      {r.cta_message}
                    </div>
                  </Td>
                  <Td>
                    <StatusPill s={r.is_active ? "live" : "disabled"} />
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
                        if (!confirm(`Delete card "${r.title}"?`)) return;
                        try {
                          if (r.id) {
                            await delFn({ data: { id: r.id } });
                          }
                          toast.success("Deleted");
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
  initial: Partial<SupplyServiceRow>;
  onCancel: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [f, setF] = useState<Partial<SupplyServiceRow>>({
    ...initial,
    key_points: initial.key_points || [],
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const saveFn = useServerFn(upsertSupplyService);

  async function onUploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^\w.-]+/g, "_");
      const path = `who-we-supply/${Date.now()}_${safeName}`;
      const { data, error } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });
      if (error) throw new Error(error.message);
      const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
      setF((prev) => ({ ...prev, image_url: pubData.publicUrl, image_key: null }));
      toast.success("Image uploaded successfully");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function updatePoint(index: number, val: string) {
    const list = [...(f.key_points || [])];
    list[index] = val;
    setF({ ...f, key_points: list });
  }

  function addPoint() {
    const list = [...(f.key_points || []), ""];
    setF({ ...f, key_points: list });
  }

  function removePoint(index: number) {
    const list = (f.key_points || []).filter((_, i) => i !== index);
    setF({ ...f, key_points: list });
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4"
      >
        <ArrowLeft className="size-4" /> BACK
      </button>
      <Card className="p-6 max-w-4xl">
        <h2 className="font-serif text-2xl text-forest-dark mb-4">
          {f.id ? "Edit Supply Service Card" : "New Supply Service Card"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <Field label="Card Title *">
            <input
              value={f.title ?? ""}
              onChange={(e) => setF({ ...f, title: e.target.value })}
              placeholder="e.g. Retail Chains"
              className={inp}
            />
          </Field>
          <Field label="Sort Order">
            <input
              type="number"
              value={f.sort_order ?? 0}
              onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })}
              className={inp}
            />
          </Field>
          <Field label="Short Description *">
            <input
              value={f.short_description ?? ""}
              onChange={(e) => setF({ ...f, short_description: e.target.value })}
              placeholder="e.g. Grocery, organic and speciality stores"
              className={inp}
            />
          </Field>
          <Field label="Card Icon">
            <select
              value={f.icon_name ?? "Store"}
              onChange={(e) => setF({ ...f, icon_name: e.target.value })}
              className={inp}
            >
              {AVAILABLE_ICONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Image Key (Preset)">
            <select
              value={f.image_key ?? ""}
              onChange={(e) => setF({ ...f, image_key: e.target.value || null })}
              className={inp}
            >
              <option value="">— use custom URL / upload —</option>
              {IMAGE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Image URL">
            <div className="flex gap-2">
              <input
                value={f.image_url ?? ""}
                onChange={(e) => setF({ ...f, image_url: e.target.value || null })}
                className={inp}
                placeholder="https://…"
              />
              <label className="mt-1 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-cream-deep border border-border rounded-lg text-xs font-bold text-espresso hover:bg-gold-deep hover:text-white transition-colors shrink-0">
                <Upload className="size-3.5" />
                {uploading ? "UPLOADING…" : "UPLOAD"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUploadImage(file);
                  }}
                />
              </label>
            </div>
          </Field>

          <Field label="Detail Modal Title *">
            <input
              value={f.detail_title ?? ""}
              onChange={(e) => setF({ ...f, detail_title: e.target.value })}
              placeholder="e.g. Retail Chains"
              className={inp}
            />
          </Field>
          <Field label="Detail Subtitle *">
            <input
              value={f.subtitle ?? ""}
              onChange={(e) => setF({ ...f, subtitle: e.target.value })}
              placeholder="e.g. Premium Natural Honey for Modern Retail"
              className={inp}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Full Description *">
              <textarea
                rows={3}
                value={f.full_description ?? ""}
                onChange={(e) => setF({ ...f, full_description: e.target.value })}
                placeholder="Full description displayed inside the detail modal"
                className={inp}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-forest-dark">Key Points / Features</span>
              <button
                type="button"
                onClick={addPoint}
                className="inline-flex items-center gap-1 text-xs font-bold text-gold-deep hover:underline"
              >
                <PlusCircle className="size-3.5" /> ADD POINT
              </button>
            </div>
            <div className="space-y-2">
              {(f.key_points || []).map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={point}
                    onChange={(e) => updatePoint(idx, e.target.value)}
                    placeholder={`Feature point #${idx + 1}`}
                    className={`${inp} mt-0`}
                  />
                  <button
                    type="button"
                    onClick={() => removePoint(idx)}
                    className="text-destructive hover:text-red-700 p-1"
                    title="Remove point"
                  >
                    <XCircle className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Field label="CTA Button Text *">
            <input
              value={f.cta_text ?? ""}
              onChange={(e) => setF({ ...f, cta_text: e.target.value })}
              placeholder="e.g. Enquire for Retail Supply"
              className={inp}
            />
          </Field>
          <Field label="CTA WhatsApp Enquiry Message *">
            <input
              value={f.cta_message ?? ""}
              onChange={(e) => setF({ ...f, cta_message: e.target.value })}
              placeholder="e.g. Hello Saurashtra Honey, I’m interested in Retail Supply..."
              className={inp}
            />
          </Field>

          <label className="flex items-center gap-2 text-xs md:col-span-2 mt-2">
            <input
              type="checkbox"
              checked={!!f.is_active}
              onChange={(e) => setF({ ...f, is_active: e.target.checked })}
            />{" "}
            Active (Display on website)
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <BtnPrimary
            disabled={busy || uploading}
            onClick={async () => {
              if (!f.title || !f.short_description || !f.detail_title || !f.cta_text) {
                toast.error("Please fill out all required fields");
                return;
              }
              setBusy(true);
              try {
                await saveFn({
                  data: {
                    id: f.id,
                    title: f.title,
                    short_description: f.short_description,
                    image_key: f.image_key || null,
                    image_url: f.image_url || null,
                    icon_name: f.icon_name || "Store",
                    detail_title: f.detail_title,
                    subtitle: f.subtitle || "",
                    full_description: f.full_description || "",
                    key_points: (f.key_points || []).filter((p) => p.trim() !== ""),
                    cta_text: f.cta_text,
                    cta_message: f.cta_message || "",
                    is_active: !!f.is_active,
                    sort_order: Number(f.sort_order ?? 0),
                  } as never,
                });
                toast.success("Supply Service Card saved successfully!");
                await onSaved();
              } catch (e) {
                toast.error((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "SAVING…" : "SAVE CARD"}
          </BtnPrimary>
          <BtnGhost onClick={onCancel}>CANCEL</BtnGhost>
        </div>
      </Card>
    </div>
  );
}
