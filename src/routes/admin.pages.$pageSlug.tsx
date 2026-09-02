import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, PageHeader, StatusPill, BtnPrimary, BtnGhost, Field, inp, ImageUpload } from "@/components/admin/ui";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { fetchPageSections, updatePageSectionSettings, togglePageSectionVisibility, type PageSection } from "@/lib/page-cms.functions";

export const Route = createFileRoute("/admin/pages/$pageSlug")({
  component: PageEditor,
});

type FieldDef =
  | { type: "text"; key: string; label: string; placeholder?: string }
  | { type: "textarea"; key: string; label: string; placeholder?: string }
  | { type: "image"; key: string; label: string; bucket?: string; folder?: string };

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
        title: "Hero Banner",
        description: "The top banner image and text.",
        fields: [
          { type: "text", key: "heading", label: "Heading" },
          { type: "textarea", key: "description", label: "Description" },
          { type: "image", key: "desktop_image", label: "Desktop Image", folder: "pages/our-story" },
          { type: "image", key: "mobile_image", label: "Mobile Image", folder: "pages/our-story" },
        ]
      },
      "founder": {
        title: "Founder Message",
        description: "The message from the founder.",
        fields: [
          { type: "text", key: "name", label: "Founder Name" },
          { type: "textarea", key: "message", label: "Message Body" },
          { type: "image", key: "photo", label: "Founder Photo", folder: "pages/our-story" },
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
                          {field.type === "text" && (
                            <input
                              className={inp}
                              placeholder={field.placeholder}
                              value={formData[field.key] || ""}
                              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            />
                          )}
                          {field.type === "textarea" && (
                            <textarea
                              className={inp}
                              rows={4}
                              placeholder={field.placeholder}
                              value={formData[field.key] || ""}
                              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            />
                          )}
                          {field.type === "image" && (
                            <div className="p-4 rounded-xl border border-border/60 bg-white">
                              <ImageUpload 
                                bucket={field.bucket || "media"}
                                folder={field.folder || "pages/generic"}
                                value={formData[field.key]}
                                onChange={(url) => setFormData({ ...formData, [field.key]: url })}
                              />
                            </div>
                          )}
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
