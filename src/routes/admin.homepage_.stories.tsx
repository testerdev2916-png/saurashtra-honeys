import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card, BtnPrimary, BtnGhost, Field, inp } from "@/components/admin/ui";
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Edit, Save, X, Image as ImageIcon, Video, FileText } from "lucide-react";
import {
  fetchAllHomepageCustomerStories,
  createHomepageCustomerStory,
  updateHomepageCustomerStory,
  deleteHomepageCustomerStory,
  updateHomepageCustomerStoryOrder,
  logAudit,
  type HomepageCustomerStory,
} from "@/lib/homepage-cms.functions";

export const Route = createFileRoute("/admin/homepage_/stories")({
  component: AdminCustomerStories,
});

function AdminCustomerStories() {
  const [items, setItems] = useState<HomepageCustomerStory[]>([]);
  const [status, setStatus] = useState<"loading" | "empty" | "error" | "success">("loading");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState<{name: string, slug: string}[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<HomepageCustomerStory>>({
    type: "photo",
    customer_name: "",
    customer_city: "",
    customer_state: "",
    review_text: "",
    rating: 5,
    poster_image: "",
    customer_photo: "",
    product_name: "",
    product_slug: "",
    published: true,
  });

  const loadData = async () => {
    setStatus("loading");
    try {
      const data = await fetchAllHomepageCustomerStories();
      setItems(data);
      setStatus(data.length === 0 ? "empty" : "success");
    } catch (e) {
      console.error(e);
      setStatus("error");
      toast.error("Failed to load customer stories");
    }
  };

  const loadProducts = async () => {
    try {
      // Inline fetch for simplicity, or we could import supabase
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.from("products").select("name, slug").eq("status", "published");
      if (data) setProducts(data);
    } catch (e) {
      console.error("Failed to load products", e);
    }
  };

  useEffect(() => {
    loadData();
    loadProducts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "poster") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "video" && !file.type.startsWith("video/")) return toast.error("Please select a valid video file.");
    if (type === "poster" && !file.type.startsWith("image/")) return toast.error("Please select a valid image file.");

    setUploading(true);
    toast.loading(`Uploading ${type}...`);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const path = type === "video" ? `stories/videos/${filename}` : `stories/thumbnails/${filename}`;
      
      const { data, error } = await supabase.storage.from("media").upload(path, file);
      
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(path);
      
      if (type === "video") {
        setFormData(prev => ({ ...prev, media_url: publicUrlData.publicUrl }));
      } else {
        setFormData(prev => ({ ...prev, poster_image: publicUrlData.publicUrl }));
      }
      
      toast.dismiss();
      toast.success(`${type} uploaded successfully`);
    } catch (err: any) {
      toast.dismiss();
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: "photo",
      customer_name: "",
      customer_city: "",
      customer_state: "",
      review_text: "",
      rating: 5,
      poster_image: "",
      customer_photo: "",
      product_name: "",
      product_slug: "",
      published: true,
    });
    setShowAdd(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name?.trim()) return toast.error("Customer name is required");

    try {
      if (editingId) {
        await updateHomepageCustomerStory(editingId, formData);
        toast.success("Story updated");
      } else {
        await createHomepageCustomerStory({
          ...formData,
          type: "photo",
          customer_name: formData.customer_name || "",
          rating: formData.rating || 5,
          verified: formData.verified || false,
          published: formData.published ?? true,
          sort_order: items.length + 1,
        } as Omit<HomepageCustomerStory, "id">);
        toast.success("Story added");
      }
      await logAudit({
        data: {
          action: editingId ? "homepage.customer_story_updated" : "homepage.customer_story_added",
          entity_type: "homepage_customer_stories",
          entity_id: editingId || "new",
        },
      });
      resetForm();
      loadData();
    } catch (err) {
      toast.error("Failed to save story");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    try {
      await deleteHomepageCustomerStory(id);
      toast.success("Story deleted");
      loadData();
    } catch (e) {
      toast.error("Failed to delete story");
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
      await updateHomepageCustomerStoryOrder(updates);
      toast.success("Order saved");
    } catch (e) {
      toast.error("Failed to save order");
      loadData();
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await updateHomepageCustomerStory(id, { published: !current });
      toast.success(current ? "Story unpublished" : "Story published");
      setItems(items.map((i) => (i.id === id ? { ...i, published: !current } : i)));
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  if (status === "loading") return <div className="py-24 text-center text-muted-foreground">Loading...</div>;
  if (status === "error") return (
    <div className="py-24 text-center">
      <div className="text-red-500 mb-4 font-semibold">Unable to load video testimonials.</div>
      <BtnPrimary onClick={loadData}>Retry</BtnPrimary>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Customer Testimonials"
        subtitle="Manage the 'Real People. Real Honey.' photo carousel on the homepage."
        actions={
          <Link to="/admin/homepage" className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep">
            <ArrowLeft className="size-4" /> Back to Homepage CMS
          </Link>
        }
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-dark">Customer Testimonials</h2>
        {!showAdd && !editingId && (
          <BtnPrimary onClick={() => setShowAdd(true)}><Plus className="size-4" /> Add Story</BtnPrimary>
        )}
      </div>

      {(showAdd || editingId) && (
        <Card className="p-5 mb-6 bg-cream/40 border-gold-deep/30">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-md p-3 text-sm text-brand-orange flex items-center gap-2">
                  <ImageIcon className="size-4 shrink-0" />
                  <span><strong>Important:</strong> Upload a vertical/portrait customer photo. (Recommended aspect ratio 4:5).</span>
                </div>
              </div>

              <Field label="Rating">
                <input type="number" min="1" max="5" required value={formData.rating || 5} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} className={inp} />
              </Field>
              <Field label="Customer Name *">
                <input required value={formData.customer_name || ""} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} className={inp} placeholder="e.g. Karan Mehta" />
              </Field>
              <Field label="Customer Location (City/State)">
                <div className="flex gap-2">
                  <input value={formData.customer_city || ""} onChange={(e) => setFormData({ ...formData, customer_city: e.target.value })} className={inp} placeholder="City" />
                  <input value={formData.customer_state || ""} onChange={(e) => setFormData({ ...formData, customer_state: e.target.value })} className={inp} placeholder="State" />
                </div>
              </Field>
              
              <Field label="Customer Photo *">
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFileUpload(e, "poster")} className="text-sm" disabled={uploading} />
                  {formData.poster_image && <div className="text-xs text-green-600 truncate">Uploaded: {formData.poster_image}</div>}
                </div>
              </Field>

              <Field label="Associated Product">
                <select 
                  className={inp} 
                  value={formData.product_slug || ""} 
                  onChange={(e) => {
                    const selected = products.find(p => p.slug === e.target.value);
                    setFormData({ 
                      ...formData, 
                      product_slug: e.target.value,
                      product_name: selected?.name || ""
                    });
                  }}
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="Review Quote / Caption">
                  <textarea rows={3} value={formData.review_text || ""} onChange={(e) => setFormData({ ...formData, review_text: e.target.value })} className={inp} placeholder="Review content..." />
                </Field>
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 rounded border-border" />
                <label htmlFor="published" className="text-sm font-medium">Published (Visible on site)</label>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <BtnPrimary type="submit"><Save className="size-4" /> Save Story</BtnPrimary>
              <BtnGhost type="button" onClick={resetForm}><X className="size-4" /> Cancel</BtnGhost>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {status === "empty" ? (
          <div className="p-8 text-center text-muted-foreground bg-white border border-border rounded-2xl">No customer testimonials configured.</div>
        ) : (
          items.map((item, index) => {
            return (
              <Card key={item.id} className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${editingId === item.id ? "border-gold-deep" : ""} ${!item.published ? "opacity-60 grayscale-[30%]" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-cream border border-border flex items-center justify-center text-brand-orange overflow-hidden">
                    {item.poster_image ? (
                      <img src={item.poster_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="size-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-dark flex items-center gap-2">
                      {item.customer_name} 
                      {!item.published && <span className="text-[10px] uppercase tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Draft</span>}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                      {item.review_text || "Customer Photo"}
                    </p>
                    <div className="text-[11px] text-muted-foreground mt-1 flex gap-2">
                      {item.customer_city && <span>📍 {item.customer_city}, {item.customer_state}</span>}
                      {item.product_name && <span>🍯 {item.product_name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white mr-2">
                    <button disabled={index === 0} onClick={() => handleMove(index, "up")} className="p-2 hover:bg-cream/60 disabled:opacity-30 border-r border-border"><ArrowUp className="size-4" /></button>
                    <button disabled={index === items.length - 1} onClick={() => handleMove(index, "down")} className="p-2 hover:bg-cream/60 disabled:opacity-30"><ArrowDown className="size-4" /></button>
                  </div>
                  <button onClick={() => handleTogglePublish(item.id, item.published)} className="p-2 text-forest-dark hover:bg-cream rounded" title="Toggle Publish">
                    {item.published ? <X className="size-4" /> : <Save className="size-4" />}
                  </button>
                  <button onClick={() => { setEditingId(item.id); setFormData(item); setShowAdd(false); }} className="p-2 text-forest-dark hover:bg-cream rounded"><Edit className="size-4" /></button>
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
