import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card, BtnPrimary, BtnGhost } from "@/components/admin/ui";
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import { fetchProducts } from "@/lib/product-catalog";
import { type Product } from "@/lib/products";
import {
  fetchAllHomepageFeaturedProducts,
  createHomepageFeaturedProduct,
  deleteHomepageFeaturedProduct,
  updateHomepageFeaturedProductOrder,
  logAudit,
  type HomepageFeaturedProduct,
} from "@/lib/homepage-cms.functions";

export const Route = createFileRoute("/admin/homepage_/products")({
  component: AdminHomepageProducts,
});

function AdminHomepageProducts() {
  const [selections, setSelections] = useState<HomepageFeaturedProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, sel] = await Promise.all([
        fetchProducts(),
        fetchAllHomepageFeaturedProducts(),
      ]);
      setAllProducts(prods);
      setSelections(sel);
    } catch (e) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async () => {
    if (!selectedSlug) return toast.error("Please select a product");
    if (selections.some((s) => s.product_slug === selectedSlug)) {
      return toast.error("Product already added to homepage");
    }
    try {
      await createHomepageFeaturedProduct({
        product_slug: selectedSlug,
        enabled: true,
        sort_order: selections.length + 1,
      });
      toast.success("Product added to homepage");
      await logAudit({
        data: {
          action: "homepage.product_added",
          entity_type: "homepage_featured_products",
          metadata: { product_slug: selectedSlug },
        },
      });
      setShowAdd(false);
      setSelectedSlug("");
      loadData();
    } catch (e) {
      toast.error("Failed to add product");
    }
  };

  const handleRemove = async (id: string, slug: string) => {
    if (!confirm("Remove this product from the homepage?")) return;
    try {
      await deleteHomepageFeaturedProduct(id);
      toast.success("Removed from homepage");
      await logAudit({
        data: {
          action: "homepage.product_removed",
          entity_type: "homepage_featured_products",
          entity_id: id,
          metadata: { product_slug: slug },
        },
      });
      loadData();
    } catch (e) {
      toast.error("Failed to remove product");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === selections.length - 1)
    )
      return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newItems = [...selections];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const updates = newItems.map((s, idx) => ({
      id: s.id,
      sort_order: idx + 1,
    }));

    setSelections(newItems.map((s, idx) => ({ ...s, sort_order: idx + 1 })));

    try {
      await updateHomepageFeaturedProductOrder(updates);
      toast.success("Order saved");
    } catch (e) {
      toast.error("Failed to save order");
      loadData();
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <PageHeader
        title="Featured Products"
        subtitle="Manage the products displayed in the 'Best Sellers' section on the homepage."
        actions={
          <Link
            to="/admin/homepage"
            className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep"
          >
            <ArrowLeft className="size-4" />
            Back to Homepage CMS
          </Link>
        }
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-xl font-bold text-forest-dark">Selected Products</h2>
        <BtnPrimary onClick={() => setShowAdd(!showAdd)}>
          <Plus className="size-4" /> Add Product
        </BtnPrimary>
      </div>

      {showAdd && (
        <Card className="p-4 mb-6 bg-cream/40 border-gold-deep/30">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
            >
              <option value="">Select a product to add...</option>
              {allProducts.map((p) => (
                <option key={p.slug} value={p.slug} disabled={selections.some(s => s.product_slug === p.slug)}>
                  {p.name} {selections.some(s => s.product_slug === p.slug) ? "(Already added)" : ""}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <BtnPrimary onClick={handleAdd}>Add to Homepage</BtnPrimary>
              <BtnGhost onClick={() => setShowAdd(false)}>Cancel</BtnGhost>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {selections.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-white border border-border rounded-2xl">
            No products added yet.
          </div>
        ) : (
          selections.map((sel, index) => {
            const prod = allProducts.find((p) => p.slug === sel.product_slug);
            return (
              <Card key={sel.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {prod?.image ? (
                    <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded bg-cream" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-cream border border-border" />
                  )}
                  <div>
                    <h3 className="font-bold text-forest-dark">{prod?.name || sel.product_slug}</h3>
                    <p className="text-xs text-muted-foreground">/{sel.product_slug} • ₹{prod?.price || "---"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
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
                      disabled={index === selections.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-2 hover:bg-cream/60 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="size-4 text-forest-dark" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(sel.id, sel.product_slug)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    title="Remove from Homepage"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
