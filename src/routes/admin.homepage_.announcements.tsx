import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card, BtnPrimary, BtnGhost, Field, inp } from "@/components/admin/ui";
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Edit, Save, X } from "lucide-react";
import {
  fetchAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  updateAnnouncementOrder,
  logAudit,
  type AnnouncementItem,
} from "@/lib/homepage-cms.functions";

export const Route = createFileRoute("/admin/homepage_/announcements")({
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ text: "", link: "", icon: "", open_in_new_tab: false });

  const loadData = async () => {
    setLoading(true);
    try {
      setItems(await fetchAllAnnouncements());
    } catch (e) {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({ text: "", link: "", icon: "", open_in_new_tab: false });
    setShowAdd(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return toast.error("Text is required");

    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        toast.success("Announcement updated");
      } else {
        await createAnnouncement({
          ...formData,
          enabled: true,
          sort_order: items.length + 1,
        });
        toast.success("Announcement added");
      }
      await logAudit({
        data: {
          action: editingId ? "homepage.announcement_updated" : "homepage.announcement_added",
          entity_type: "announcement_items",
          entity_id: editingId || "new",
        },
      });
      resetForm();
      loadData();
    } catch (err) {
      toast.error("Failed to save announcement");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      toast.success("Announcement deleted");
      loadData();
    } catch (e) {
      toast.error("Failed to delete announcement");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === items.length - 1)) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    const updates = newItems.map((s, idx) => ({ id: s.id, sort_order: idx + 1 }));
    setItems(newItems.map((s, idx) => ({ ...s, sort_order: idx + 1 })));
    try {
      await updateAnnouncementOrder(updates);
      toast.success("Order saved");
    } catch (e) {
      toast.error("Failed to save order");
      loadData();
    }
  };

  if (loading) return <div className="py-24 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      <PageHeader
        title="Announcement Bar"
        subtitle="Manage the sliding messages at the very top of the website."
        actions={
          <Link to="/admin/homepage" className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep">
            <ArrowLeft className="size-4" /> Back to Homepage CMS
          </Link>
        }
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-dark">Active Announcements</h2>
        {!showAdd && !editingId && (
          <BtnPrimary onClick={() => setShowAdd(true)}><Plus className="size-4" /> Add Announcement</BtnPrimary>
        )}
      </div>

      {(showAdd || editingId) && (
        <Card className="p-5 mb-6 bg-cream/40 border-gold-deep/30">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Announcement Text *">
                <input required value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} className={inp} placeholder="e.g. Free Delivery on orders above ₹400" />
              </Field>
              <Field label="Icon (Emoji or text)">
                <input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={inp} placeholder="e.g. 🚚 or 🍯" />
              </Field>
              <Field label="Link URL (Optional)">
                <input value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className={inp} placeholder="e.g. /shop" />
              </Field>
              <Field label="Open in new tab?">
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input type="checkbox" checked={formData.open_in_new_tab} onChange={(e) => setFormData({ ...formData, open_in_new_tab: e.target.checked })} />
                  <span className="text-sm">Yes, open in new tab</span>
                </label>
              </Field>
            </div>
            <div className="flex gap-2 pt-2">
              <BtnPrimary type="submit"><Save className="size-4" /> Save</BtnPrimary>
              <BtnGhost type="button" onClick={resetForm}><X className="size-4" /> Cancel</BtnGhost>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-white border border-border rounded-2xl">No announcements configured.</div>
        ) : (
          items.map((item, index) => (
            <Card key={item.id} className={`p-4 flex items-center justify-between ${editingId === item.id ? "border-gold-deep" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cream border border-border flex items-center justify-center text-lg">{item.icon || "•"}</div>
                <div>
                  <h3 className="font-bold text-forest-dark">{item.text}</h3>
                  {item.link && <p className="text-xs text-muted-foreground">Link: {item.link}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white mr-2">
                  <button disabled={index === 0} onClick={() => handleMove(index, "up")} className="p-2 hover:bg-cream/60 disabled:opacity-30 border-r border-border"><ArrowUp className="size-4" /></button>
                  <button disabled={index === items.length - 1} onClick={() => handleMove(index, "down")} className="p-2 hover:bg-cream/60 disabled:opacity-30"><ArrowDown className="size-4" /></button>
                </div>
                <button onClick={() => { setEditingId(item.id); setFormData({ text: item.text, link: item.link || "", icon: item.icon || "", open_in_new_tab: item.open_in_new_tab }); setShowAdd(false); }} className="p-2 text-forest-dark hover:bg-cream rounded"><Edit className="size-4" /></button>
                <button onClick={() => handleRemove(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="size-4" /></button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
