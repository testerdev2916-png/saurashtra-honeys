import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchHomepageSections,
  updateSectionOrder,
  toggleSectionVisibility,
  updateSectionSettings,
  logAudit,
  type HomepageSection,
} from "@/lib/homepage-cms.functions";
import { Card, PageHeader, StatusPill, BtnPrimary, BtnGhost, Field, inp } from "@/components/admin/ui";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit,
  ExternalLink,
  Sparkles,
  X,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/admin/homepage")({ component: HomepageManagement });

// ─── Per-section content field definitions ────────────────────────────────────
type FieldDef =
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; placeholder?: string }
  | { type: "stats"; key: "stats"; label: string };

const SECTION_CONFIG: Record<
  string,
  {
    title: string;
    desc: string;
    link?: string;
    fields?: FieldDef[];
  }
> = {
  hero: {
    title: "Hero Slider",
    desc: "Main top banner slider on the homepage.",
    link: "/admin/hero",
  },
  trust_strip: {
    title: "Benefits / Trust Strip",
    desc: "100% Pure Honey, Lab Tested, Farm Sourced trust badges.",
    link: "/admin/homepage/trust",
  },
  shop_by_category: {
    title: "Shop By Category / Explore Our World",
    desc: "The category carousel and introductory heading.",
    link: "/admin/homepage/categories",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow text", placeholder: "DISCOVER" },
      { type: "text", key: "heading", label: "Heading", placeholder: "Explore Our World" },
      { type: "textarea", key: "description", label: "Description" },
      { type: "text", key: "cta_text", label: "CTA Button Text", placeholder: "VIEW ALL CATEGORIES" },
      { type: "text", key: "cta_url", label: "CTA URL", placeholder: "/shop" },
    ],
  },
  featured_products: {
    title: "Featured Products / Best Sellers",
    desc: "Curated list of top products displayed on the homepage.",
    link: "/admin/homepage/products",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow text", placeholder: "CURATED FOR YOU" },
      { type: "text", key: "heading", label: "Heading", placeholder: "Our Finest Picks" },
      { type: "textarea", key: "description", label: "Description" },
      { type: "text", key: "cta_text", label: "CTA Button Text", placeholder: "VIEW ALL PRODUCTS" },
      { type: "text", key: "cta_url", label: "CTA URL", placeholder: "/shop" },
    ],
  },
  shoppable_videos: {
    title: "Shoppable Video / Story Section",
    desc: "9:16 vertical video reels from the hive.",
    link: "/admin/stories",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow text", placeholder: "FROM THE HIVE" },
      { type: "text", key: "heading", label: "Heading", placeholder: "Stories from the Hive" },
      { type: "textarea", key: "description", label: "Description" },
    ],
  },
  why_choose: {
    title: "Our Heritage / Why Choose Us",
    desc: "Our story and purity guarantee section.",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow text", placeholder: "OUR HERITAGE" },
      { type: "text", key: "heading", label: "Heading", placeholder: "Where Purity Begins" },
      { type: "textarea", key: "description", label: "Description" },
      { type: "text", key: "cta_text", label: "CTA Button Text", placeholder: "KNOW MORE ABOUT US" },
      { type: "text", key: "cta_url", label: "CTA URL", placeholder: "/our-story" },
    ],
  },
  farm_banner: {
    title: "Farm / Beekeeping Banner",
    desc: "Full width decorative farm image section.",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow text", placeholder: "BEEKEEPING" },
      { type: "text", key: "heading", label: "Heading", placeholder: "The Art of Beekeeping" },
      { type: "textarea", key: "description", label: "Description" },
      { type: "text", key: "cta_text", label: "CTA Button Text", placeholder: "LEARN ABOUT OUR FARMS" },
      { type: "text", key: "cta_url", label: "CTA URL", placeholder: "/bee-farming" },
    ],
  },
  stats_strip: {
    title: "Statistics Strip",
    desc: "Key metrics like Happy Customers, Lab Tested Batches.",
    fields: [{ type: "stats", key: "stats", label: "Statistics" }],
  },
  testimonials: {
    title: "Testimonials / Customer Reviews",
    desc: "Customer reviews featured on the homepage.",
    link: "/admin/reviews",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow text", placeholder: "TRUSTED BY MANY" },
      { type: "text", key: "heading", label: "Heading", placeholder: "Loved Across India" },
      { type: "textarea", key: "description", label: "Description" },
    ],
  },
  journal: {
    title: "Journal / Blog Preview",
    desc: "Latest blog articles and honey guides.",
    link: "/admin/blog",
    fields: [
      { type: "text", key: "eyebrow", label: "Eyebrow text", placeholder: "JOIN OUR JOURNEY" },
      { type: "text", key: "heading", label: "Heading", placeholder: "Follow Our Hive" },
      { type: "textarea", key: "description", label: "Description" },
      { type: "text", key: "cta_text", label: "CTA Button Text", placeholder: "READ OUR STORIES" },
      { type: "text", key: "cta_url", label: "CTA URL", placeholder: "/blog" },
    ],
  },
};

// ─── Stats sub-editor ─────────────────────────────────────────────────────────
function StatsEditor({
  value,
  onChange,
}: {
  value: { value: string; label: string }[];
  onChange: (v: { value: string; label: string }[]) => void;
}) {
  const items = value.length > 0 ? value : [{ value: "", label: "" }];
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            value={item.value}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...next[idx], value: e.target.value };
              onChange(next);
            }}
            className={`${inp} w-28`}
            placeholder="15+ Years"
          />
          <input
            value={item.label}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...next[idx], label: e.target.value };
              onChange(next);
            }}
            className={inp}
            placeholder="Beekeeping Experience"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
            className="p-1.5 text-destructive hover:bg-destructive/10 rounded shrink-0"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { value: "", label: "" }])}
        className="flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:underline mt-1"
      >
        <Plus className="size-3.5" /> Add stat
      </button>
    </div>
  );
}

// ─── Inline settings panel ────────────────────────────────────────────────────
function SectionSettingsPanel({
  sec,
  fields,
  onClose,
  onSaved,
}: {
  sec: HomepageSection;
  fields: FieldDef[];
  onClose: () => void;
  onSaved: (id: string, settings: Record<string, any>) => void;
}) {
  const [form, setForm] = useState<Record<string, any>>({ ...sec.settings });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSectionSettings(sec.id, form);
      await logAudit({
        data: {
          action: "homepage.section_settings_updated",
          entity_type: "homepage_section",
          entity_id: sec.id,
          metadata: { section_key: sec.section_key },
        },
      });
      toast.success("Settings saved");
      onSaved(sec.id, form);
      onClose();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="mt-4 pt-4 border-t border-border/60 space-y-3"
    >
      <h4 className="text-xs font-bold text-forest-dark tracking-wider uppercase">
        Section Content Settings
      </h4>
      <div className="grid md:grid-cols-2 gap-3">
        {fields.map((f) => {
          if (f.type === "stats") {
            return (
              <div key="stats" className="md:col-span-2">
                <label className="block text-xs font-semibold text-forest-dark mb-1">
                  {f.label}
                </label>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Edit the value + label pairs. Leave empty to use defaults.
                </p>
                <StatsEditor
                  value={form.stats ?? []}
                  onChange={(v) => setForm({ ...form, stats: v })}
                />
              </div>
            );
          }
          if (f.type === "textarea") {
            return (
              <div key={f.key} className="md:col-span-2">
                <Field label={f.label}>
                  <textarea
                    rows={2}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className={`${inp} resize-none`}
                    placeholder={f.placeholder}
                  />
                </Field>
              </div>
            );
          }
          return (
            <Field key={f.key} label={f.label}>
              <input
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className={inp}
                placeholder={f.placeholder}
              />
            </Field>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Leave any field empty to use the default content.
      </p>
      <div className="flex gap-2">
        <BtnPrimary type="submit" disabled={saving}>
          <Save className="size-3.5" />
          {saving ? "Saving…" : "Save Settings"}
        </BtnPrimary>
        <BtnGhost type="button" onClick={onClose}>
          <X className="size-3.5" /> Cancel
        </BtnGhost>
      </div>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function HomepageManagement() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchHomepageSections();
      setSections(data);
    } catch (e) {
      toast.error("Failed to load homepage sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (id: string, current: boolean, key: string) => {
    try {
      await toggleSectionVisibility(id, !current);
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, enabled: !current } : s))
      );
      toast.success(`Section ${!current ? "enabled" : "hidden"} successfully`);
      await logAudit({
        data: {
          action: "homepage.section_toggled",
          entity_type: "homepage_section",
          entity_id: id,
          metadata: { section_key: key, enabled: !current },
        },
      });
    } catch (e) {
      toast.error("Failed to update visibility");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    )
      return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const updates = newSections.map((s, idx) => ({
      id: s.id,
      sort_order: idx + 1,
    }));

    setSections(newSections.map((s, idx) => ({ ...s, sort_order: idx + 1 })));

    try {
      await updateSectionOrder(updates);
      toast.success("Section order saved");
      await logAudit({
        data: {
          action: "homepage.sections_reordered",
          entity_type: "homepage_section",
          metadata: { order: updates },
        },
      });
    } catch (e) {
      toast.error("Failed to save order");
      loadData();
    }
  };

  const handleSettingsSaved = (id: string, settings: Record<string, any>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, settings } : s))
    );
  };

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Loading Homepage CMS…</div>;
  }

  return (
    <div>
      <PageHeader
        title="Homepage Management"
        subtitle="Manage visibility, order, and content of all Homepage sections."
      />

      <div className="grid gap-4 mt-6">
        {/* Static Card for Announcements */}
        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all border-brand-orange/30">
          <div className="flex items-start gap-4">
            <div className="bg-cream p-2.5 rounded-lg border border-border mt-1">
              <Sparkles className="size-5 text-brand-orange" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-forest-dark">Announcement Bar</h3>
                <StatusPill s="active" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Manage the sliding messages at the very top of the website.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Link
              to="/admin/homepage/announcements"
              className="inline-flex items-center gap-1.5 bg-forest-dark text-cream rounded-lg px-4 py-2 text-xs font-bold tracking-widest hover:bg-forest transition-colors"
            >
              <span>MANAGE</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </Card>

        {sections.map((sec, index) => {
          const meta = SECTION_CONFIG[sec.section_key] || {
            title: sec.section_key.toUpperCase(),
            desc: "Custom homepage section.",
          };
          const isEditing = editingId === sec.id;
          const hasFields = meta.fields && meta.fields.length > 0;

          return (
            <Card
              key={sec.id}
              className={`p-5 transition-all ${!sec.enabled ? "opacity-60 bg-cream/40" : ""} ${isEditing ? "ring-2 ring-gold-deep/40" : ""}`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-cream p-2.5 rounded-lg border border-border mt-1">
                    <Sparkles className="size-5 text-gold-deep" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-lg font-bold text-forest-dark">
                        {meta.title}
                      </h3>
                      <StatusPill s={sec.enabled ? "active" : "disabled"} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{meta.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                  {/* Reorder */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-2 hover:bg-cream/60 disabled:opacity-30 border-r border-border transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="size-4 text-forest-dark" />
                    </button>
                    <button
                      disabled={index === sections.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-2 hover:bg-cream/60 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="size-4 text-forest-dark" />
                    </button>
                  </div>

                  {/* Show/Hide */}
                  <button
                    onClick={() => handleToggle(sec.id, sec.enabled, sec.section_key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      sec.enabled
                        ? "border-border text-forest-dark hover:bg-cream/60"
                        : "border-gold-deep text-gold-deep hover:bg-gold/10"
                    }`}
                  >
                    {sec.enabled ? (
                      <><EyeOff className="size-3.5" /> Hide</>
                    ) : (
                      <><Eye className="size-3.5" /> Show</>
                    )}
                  </button>

                  {/* Settings Editor toggle */}
                  {hasFields && (
                    <button
                      onClick={() => setEditingId(isEditing ? null : sec.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        isEditing
                          ? "border-gold-deep bg-gold/10 text-gold-deep"
                          : "border-border text-forest-dark hover:bg-cream/60"
                      }`}
                      title="Edit section content"
                    >
                      <Edit className="size-3.5" />
                      {isEditing ? "Close" : "Edit Content"}
                    </button>
                  )}

                  {/* External manage link */}
                  {meta.link && (
                    <Link
                      to={meta.link}
                      className="inline-flex items-center gap-1.5 bg-forest-dark text-cream rounded-lg px-4 py-2 text-xs font-bold tracking-widest hover:bg-forest transition-colors"
                    >
                      <span>MANAGE</span>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Inline settings editor */}
              {isEditing && meta.fields && (
                <SectionSettingsPanel
                  sec={sec}
                  fields={meta.fields}
                  onClose={() => setEditingId(null)}
                  onSaved={handleSettingsSaved}
                />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
