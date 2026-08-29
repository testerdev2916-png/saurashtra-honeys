import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card, BtnPrimary, BtnGhost, Field, inp } from "@/components/admin/ui";
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Edit, Save, X } from "lucide-react";
import {
  fetchAllHomepageTrustItems,
  createHomepageTrustItem,
  updateHomepageTrustItem,
  deleteHomepageTrustItem,
  updateHomepageTrustItemOrder,
  logAudit,
  type HomepageTrustItem,
} from "@/lib/homepage-cms.functions";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/admin/homepage_/trust")({
  component: AdminTrustItems,
});

function AdminTrustItems() {
  const [items, setItems] = useState<HomepageTrustItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ title: "", description: "", icon: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      setItems(await fetchAllHomepageTrustItems());
    } catch (e) {
      toast.error("Failed to load trust items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", description: "", icon: "" });
    setShowAdd(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required");

    try {
      if (editingId) {
        await updateHomepageTrustItem(editingId, formData);
        toast.success("Trust item updated");
      } else {
        await createHomepageTrustItem({
          ...formData,
          enabled: true,
          sort_order: items.length + 1,
        });
        toast.success("Trust item added");
      }
      await logAudit({
        data: {
          action: editingId ? "homepage.trust_item_updated" : "homepage.trust_item_added",
          entity_type: "homepage_trust_items",
          entity_id: editingId || "new",
        },
      });
      resetForm();
      loadData();
    } catch (err) {
      toast.error("Failed to save trust item");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Delete this trust item?")) return;
    try {
      await deleteHomepageTrustItem(id);
      toast.success("Trust item deleted");
      loadData();
    } catch (e) {
      toast.error("Failed to delete trust item");
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
      await updateHomepageTrustItemOrder(updates);
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
        title="Trust Strip"
        subtitle="Manage the trust badges (e.g. 100% Pure Honey, Lab Tested) displayed on the homepage."
        actions={
          <Link to="/admin/homepage" className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep">
            <ArrowLeft className="size-4" /> Back to Homepage CMS
          </Link>
        }
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-dark">Active Badges</h2>
        {!showAdd && !editingId && (
          <BtnPrimary onClick={() => setShowAdd(true)}><Plus className="size-4" /> Add Badge</BtnPrimary>
        )}
      </div>

      {(showAdd || editingId) && (
        <Card className="p-5 mb-6 bg-cream/40 border-gold-deep/30">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Title *">
                <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inp} placeholder="e.g. 100% Pure Honey" />
              </Field>
              <Field label="Icon Name (Lucide icon name)">
                <input value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className={inp} placeholder="e.g. ShieldCheck" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description">
                  <input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inp} placeholder="e.g. Sustainably sourced" />
                </Field>
              </div>
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
          <div className="p-8 text-center text-muted-foreground bg-white border border-border rounded-2xl">No badges configured.</div>
        ) : (
          items.map((item, index) => {
            const IconComponent = item.icon && (Icons as any)[item.icon] ? (Icons as any)[item.icon] : Icons.Check;
            return (
              <Card key={item.id} className={`p-4 flex items-center justify-between ${editingId === item.id ? "border-gold-deep" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cream border border-border flex items-center justify-center text-brand-orange">
                    <IconComponent className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-dark">{item.title}</h3>
                    {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white mr-2">
                    <button disabled={index === 0} onClick={() => handleMove(index, "up")} className="p-2 hover:bg-cream/60 disabled:opacity-30 border-r border-border"><ArrowUp className="size-4" /></button>
                    <button disabled={index === items.length - 1} onClick={() => handleMove(index, "down")} className="p-2 hover:bg-cream/60 disabled:opacity-30"><ArrowDown className="size-4" /></button>
                  </div>
                  <button onClick={() => { setEditingId(item.id); setFormData({ title: item.title, description: item.description || "", icon: item.icon || "" }); setShowAdd(false); }} className="p-2 text-forest-dark hover:bg-cream rounded"><Edit className="size-4" /></button>
                  <button onClick={() => handleRemove(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="size-4" /></button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
