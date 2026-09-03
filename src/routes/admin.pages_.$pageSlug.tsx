import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, PageHeader, StatusPill, BtnPrimary, BtnGhost, Field, inp, ImageUpload } from "@/components/admin/ui";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { fetchPageSections, updatePageSectionSettings, togglePageSectionVisibility, type PageSection } from "@/lib/page-cms.functions";

export const Route = createFileRoute("/admin/pages_/$pageSlug")({
  component: PageEditor,
});

type FieldDef =
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; placeholder?: string }
  | { type: "image"; key: string; label: string; bucket?: string; folder?: string }
  | { type: "video"; key: string; label: string; bucket?: string; folder?: string }
  | { type: "boolean"; key: string; label: string; }
  | { type: "list"; key: string; label: string; itemFields: FieldDef[] };

type SectionConfig = {
  title: string;
  description: string;
  fields: FieldDef[];
};

// Configuration of all sections for all generic pages
const PAGE_CONFIGS: Record<string, { title: string; sections: Record<string, SectionConfig> }> = {
  "our-story": {
    title: "Our Story",
    sections: {
      "hero": {
        title: "Hero Section",
        description: "The large cinematic hero at the top.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Supporting Text" },
          { type: "text", key: "cta_text", label: "CTA Text" },
          { type: "image", key: "desktop_image", label: "Desktop Image", folder: "pages/our-story" },
          { type: "image", key: "mobile_image", label: "Mobile Image", folder: "pages/our-story" },
        ]
      },
      "where_it_began": {
        title: "Where It Began",
        description: "The origin story section.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Story Paragraphs (use multiple lines for breaks)" },
          { type: "image", key: "image", label: "Side Image", folder: "pages/our-story" },
        ]
      },
      "saurashtra_land": {
        title: "Saurashtra — The Land",
        description: "Full-width landscape section.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Supporting Text" },
          { type: "image", key: "bg_image", label: "Background Image", folder: "pages/our-story" },
        ]
      },
      "heart_of_everything": {
        title: "The Heart of Everything",
        description: "Bees section with 4 feature points.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "image", key: "image", label: "Side Image", folder: "pages/our-story" },
          { type: "text", key: "feature1_title", label: "Feature 1 Title" },
          { type: "textarea", key: "feature1_desc", label: "Feature 1 Description" },
          { type: "text", key: "feature2_title", label: "Feature 2 Title" },
          { type: "textarea", key: "feature2_desc", label: "Feature 2 Description" },
          { type: "text", key: "feature3_title", label: "Feature 3 Title" },
          { type: "textarea", key: "feature3_desc", label: "Feature 3 Description" },
          { type: "text", key: "feature4_title", label: "Feature 4 Title" },
          { type: "textarea", key: "feature4_desc", label: "Feature 4 Description" },
        ]
      },
      "hive_to_jar": {
        title: "From Hive to Jar",
        description: "9-step premium storytelling timeline.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Intro Description" },
          { type: "text", key: "closing_eyebrow", label: "Closing Eyebrow" },
          { type: "text", key: "closing_heading", label: "Closing Heading" },
          { type: "textarea", key: "closing_description", label: "Closing Description" },
          { type: "text", key: "closing_cta_text", label: "Closing CTA Text" },
          { 
            type: "list", 
            key: "steps", 
            label: "Process Steps",
            itemFields: [
              { type: "text", key: "number", label: "Step Number (e.g. 01)" },
              { type: "text", key: "category", label: "Category (e.g. THE BEGINNING)" },
              { type: "text", key: "title", label: "Title" },
              { type: "textarea", key: "description", label: "Description" },
              { type: "video", key: "video", label: "Video (MP4/WebM)", folder: "pages/our-story/process" },
              { type: "image", key: "poster", label: "Poster Image", folder: "pages/our-story/process" },
              { type: "boolean", key: "active", label: "Active?" },
            ]
          }
        ]
      },
      "our_promise": {
        title: "Our Promise",
        description: "Raw, Honest, Responsible statements.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "promise1_title", label: "Promise 1 Title" },
          { type: "textarea", key: "promise1_desc", label: "Promise 1 Description" },
          { type: "text", key: "promise2_title", label: "Promise 2 Title" },
          { type: "textarea", key: "promise2_desc", label: "Promise 2 Description" },
          { type: "text", key: "promise3_title", label: "Promise 3 Title" },
          { type: "textarea", key: "promise3_desc", label: "Promise 3 Description" },
        ]
      },
      "responsible_beekeeping": {
        title: "Responsible Beekeeping",
        description: "Editorial split section with 4 cards.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "image", label: "Side Image", folder: "pages/our-story" },
          { type: "text", key: "feature1_title", label: "Feature 1 Title" },
          { type: "textarea", key: "feature1_desc", label: "Feature 1 Description" },
          { type: "text", key: "feature2_title", label: "Feature 2 Title" },
          { type: "textarea", key: "feature2_desc", label: "Feature 2 Description" },
          { type: "text", key: "feature3_title", label: "Feature 3 Title" },
          { type: "textarea", key: "feature3_desc", label: "Feature 3 Description" },
          { type: "text", key: "feature4_title", label: "Feature 4 Title" },
          { type: "textarea", key: "feature4_desc", label: "Feature 4 Description" },
        ]
      },
      "the_people": {
        title: "The People Behind the Honey",
        description: "Founder/family story.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "image", label: "Main Image", folder: "pages/our-story" },
          { type: "text", key: "signature_text", label: "Signature Text" },
        ]
      },
      "life_around_hives": {
        title: "Life Around the Hives",
        description: "Masonry gallery.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "image", key: "gallery_img_1", label: "Gallery Image 1 (Large)", folder: "pages/our-story" },
          { type: "image", key: "gallery_img_2", label: "Gallery Image 2 (Small)", folder: "pages/our-story" },
          { type: "image", key: "gallery_img_3", label: "Gallery Image 3 (Small)", folder: "pages/our-story" },
          { type: "image", key: "gallery_img_4", label: "Gallery Image 4 (Horizontal)", folder: "pages/our-story" },
          { type: "image", key: "gallery_img_5", label: "Gallery Image 5 (Horizontal)", folder: "pages/our-story" },
          { type: "image", key: "gallery_img_6", label: "Gallery Image 6 (Horizontal)", folder: "pages/our-story" },
        ]
      },
      "final_cta": {
        title: "Final CTA",
        description: "Bottom call to action.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "cta_text", label: "CTA Button Text" },
          { type: "text", key: "cta_link", label: "CTA Button Link (e.g. /shop)" },
        ]
      }
    }
  },
  "contact": {
    title: "Contact Us",
    sections: {
      "info": {
        title: "Contact Information",
        description: "Phone numbers, emails, and physical address.",
        fields: [
          { type: "text", key: "email", label: "Support Email" },
          { type: "text", key: "phone", label: "Phone Number" },
          { type: "textarea", key: "address", label: "Physical Address" },
        ]
      }
    }
  },
  "bee-farming": {
    title: "Bee Farming",
    sections: {
      "intro": {
        title: "Introduction",
        description: "Introductory text and image.",
        fields: [
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "image", label: "Main Image", folder: "pages/bee-farming" },
        ]
      }
    }
  },
  "bulk-orders": {
    title: "Bulk Orders",
    sections: {
      "intro": {
        title: "Introduction Section",
        description: "The main introductory text and image.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "image", label: "Main Image", folder: "pages/b2b" },
        ]
      }
    }
  },
  "corporate-gifting": {
    title: "Corporate Gifting",
    sections: {
      "intro": {
        title: "Introduction Section",
        description: "The main introductory text and image.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "image", label: "Main Image", folder: "pages/b2b" },
        ]
      }
    }
  },
  "private-label": {
    title: "Private Label",
    sections: {
      "intro": {
        title: "Introduction Section",
        description: "The main introductory text and image.",
        fields: [
          { type: "text", key: "eyebrow", label: "Eyebrow Text" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "image", label: "Main Image", folder: "pages/b2b" },
        ]
      }
    }
  },
  "become-a-partner": {
    title: "Become a Partner",
    sections: {
      "hero": {
        title: "Hero Banner",
        description: "Top section of the partnership page.",
        fields: [
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "desktop_image", label: "Desktop Image", folder: "pages/b2b" },
          { type: "image", key: "mobile_image", label: "Mobile Image", folder: "pages/b2b" },
        ]
      }
    }
  }
};

function renderField(field: FieldDef, value: any, onChange: (val: any) => void) {
  if (field.type === "text") {
    return (
      <input
        className={inp}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea
        className={inp}
        rows={4}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "image") {
    return (
      <div className="p-4 rounded-xl border border-border/60 bg-white">
        <ImageUpload 
          bucket={field.bucket || "media"}
          folder={field.folder || "pages/generic"}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
  if (field.type === "video") {
    return (
      <div className="p-4 rounded-xl border border-border/60 bg-white">
        <ImageUpload 
          bucket={field.bucket || "media"}
          folder={field.folder || "pages/generic"}
          value={value}
          onChange={onChange}
          mediaType="video"
        />
      </div>
    );
  }
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 mt-2 cursor-pointer">
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded border-border text-forest focus:ring-forest-dark"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-sm text-forest-dark">Yes, enable this</span>
      </label>
    );
  }
  if (field.type === "list") {
    const list = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-4">
        {list.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-border bg-muted/10 relative group">
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => {
                if (idx > 0) {
                  const n = [...list];
                  [n[idx-1], n[idx]] = [n[idx], n[idx-1]];
                  onChange(n);
                }
              }} className="p-1 bg-white border border-border rounded hover:bg-muted text-xs">↑</button>
              <button type="button" onClick={() => {
                if (idx < list.length - 1) {
                  const n = [...list];
                  [n[idx+1], n[idx]] = [n[idx], n[idx+1]];
                  onChange(n);
                }
              }} className="p-1 bg-white border border-border rounded hover:bg-muted text-xs">↓</button>
              <button type="button" onClick={() => {
                if (confirm("Remove item?")) {
                  const n = [...list];
                  n.splice(idx, 1);
                  onChange(n);
                }
              }} className="p-1 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 text-xs">✕</button>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Item {idx + 1}</div>
              {field.itemFields.map((iF) => (
                <Field key={iF.key} label={iF.label}>
                  {renderField(iF, item[iF.key], (v) => {
                    const n = [...list];
                    n[idx] = { ...n[idx], [iF.key]: v };
                    onChange(n);
                  })}
                </Field>
              ))}
            </div>
          </div>
        ))}
        <BtnGhost type="button" onClick={() => {
          onChange([...list, {}]);
        }}>
          + Add Item
        </BtnGhost>
      </div>
    );
  }
  return null;
}

function PageEditor() {
  const { pageSlug } = Route.useParams();
  const config = PAGE_CONFIGS[pageSlug];
  
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchPageSections(pageSlug);
      setSections(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load page content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (config) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [pageSlug, config]);

  if (!config) {
    return <div className="p-12 text-center text-muted-foreground">Page configuration not found.</div>;
  }

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  const handleEdit = (sectionKey: string) => {
    const existing = sections.find((s) => s.section_key === sectionKey);
    setFormData(existing?.settings || {});
    setEditingKey(sectionKey);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKey) return;
    setSaving(true);
    try {
      await updatePageSectionSettings(pageSlug, editingKey, formData);
      toast.success("Settings saved");
      setEditingKey(null);
      loadData();
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (sectionKey: string, currentEnabled: boolean) => {
    try {
      await togglePageSectionVisibility(pageSlug, sectionKey, !currentEnabled);
      toast.success(currentEnabled ? "Section hidden" : "Section visible");
      setSections((prev) =>
        prev.map((s) => (s.section_key === sectionKey ? { ...s, enabled: !currentEnabled } : s))
      );
    } catch (e) {
      toast.error("Failed to toggle visibility");
    }
  };

  return (
    <div>
      <PageHeader 
        title={`Editing: ${config.title}`}
        subtitle="Manage the content for this specific page."
        actions={
          <Link to="/admin/pages" className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep">
            <ArrowLeft className="size-4" /> Back to Pages
          </Link>
        }
      />

      <div className="space-y-6 max-w-4xl">
        {Object.entries(config.sections).map(([sKey, sConf]) => {
          const dbData = sections.find((s) => s.section_key === sKey);
          const isEnabled = dbData ? dbData.enabled : true;

          return (
            <Card key={sKey} className="overflow-hidden bg-white">
              <div className="p-5 border-b border-border bg-cream/30 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-forest-dark flex items-center gap-2">
                    {sConf.title}
                    <StatusPill status={isEnabled ? "published" : "draft"} />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{sConf.description}</p>
                </div>
                <div className="flex gap-2">
                  <BtnGhost onClick={() => handleToggle(sKey, isEnabled)}>
                    {isEnabled ? "Hide" : "Show"}
                  </BtnGhost>
                  <BtnPrimary onClick={() => handleEdit(sKey)}>
                    Edit Settings
                  </BtnPrimary>
                </div>
              </div>

              {editingKey === sKey && (
                <div className="p-6 bg-cream/10 border-b border-gold-deep/20">
                  <form onSubmit={handleSave} className="space-y-5">
                    {sConf.fields.map((field) => (
                      <div key={field.key}>
                        <Field label={field.label}>
                          {renderField(field, formData[field.key], (val) => setFormData({ ...formData, [field.key]: val }))}
                        </Field>
                      </div>
                    ))}

                    <div className="flex gap-3 pt-4 border-t border-border">
                      <BtnPrimary type="submit" disabled={saving}>
                        {saving ? "Saving..." : <><Save className="size-4" /> Save Changes</>}
                      </BtnPrimary>
                      <BtnGhost type="button" onClick={() => setEditingKey(null)} disabled={saving}>
                        Cancel
                      </BtnGhost>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
