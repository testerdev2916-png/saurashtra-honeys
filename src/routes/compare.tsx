import { createFileRoute, Link } from "@tanstack/react-router";
import { useCompare } from "@/lib/compare";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import { useCart } from "@/lib/cart";
import { useEffect, useMemo, useState } from "react";
import { Check, GitCompare, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Honey Products — Saurashtra Honey" },
      { name: "description", content: "Compare our raw honey varieties side-by-side — price, flora, benefits and pack sizes." },
      { property: "og:title", content: "Compare Products — Saurashtra Honey" },
      { property: "og:description", content: "Compare honey side-by-side to pick the right jar for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { slugs, remove, clear, count } = useCompare();
  const { add } = useCart();
  const [all, setAll] = useState<Product[]>([]);
  useEffect(() => { void fetchProducts().then((r) => { if (r.length) setAll(r); }); }, []);

  const selected = useMemo(() => slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as Product[], [slugs, all]);
  const allBenefits = useMemo(() => Array.from(new Set(selected.flatMap((p) => p.benefits ?? []))), [selected]);

  if (count === 0) {
    return (
      <SiteLayout>
        <div className="container-page py-20 text-center max-w-lg mx-auto">
          <div className="mx-auto size-20 rounded-full bg-cream-deep border border-border/80 flex items-center justify-center text-burnt-orange mb-5 shadow-xs"><GitCompare className="size-8" /></div>
          <h1 className="font-serif text-3xl font-bold text-espresso">Nothing to compare yet</h1>
          <p className="mt-2.5 text-sm md:text-base text-muted-foreground leading-relaxed">Tap the compare icon on any honey jar or comb in the catalog to see them side-by-side (up to 4 at a time).</p>
          <Link to="/shop" className="mt-7 inline-flex items-center gap-2 bg-espresso text-cream rounded-full px-6 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all shadow-sm">BROWSE HONEY COLLECTION</Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-page py-10">
        <div className="flex flex-wrap justify-between items-end gap-3 mb-8 border-b border-border/80 pb-6">
          <div>
            <SectionEyebrow>Side-by-Side Comparison</SectionEyebrow>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-bold text-espresso">Compare {count} harvest{count > 1 ? "s" : ""}</h1>
          </div>
          <button onClick={clear} className="text-xs font-bold tracking-widest text-burnt-orange hover:underline uppercase">CLEAR ALL</button>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 pb-8">
          <table className="min-w-full border-separate border-spacing-0 bg-white rounded-2xl border border-border/80 shadow-soft overflow-hidden">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-cream/90 backdrop-blur text-left text-[11px] tracking-widest font-bold text-espresso uppercase p-5 min-w-[160px] border-b border-border/80">Harvest Attribute</th>
                {selected.map((p) => (
                  <th key={p.slug} className="text-left align-top p-5 min-w-[220px] border-b border-border/80 bg-white">
                    <div className="relative bg-cream-deep/50 border border-border/80 rounded-2xl p-4 shadow-xs group">
                      <button aria-label="Remove" onClick={() => remove(p.slug)} className="absolute top-3 right-3 size-7 rounded-full bg-white text-muted-foreground hover:text-terracotta flex items-center justify-center shadow-xs transition-colors"><X className="size-3.5" /></button>
                      <Link to="/product/$slug" params={{ slug: p.slug }} className="block overflow-hidden rounded-xl bg-cream-deep aspect-square">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </Link>
                      <Link to="/product/$slug" params={{ slug: p.slug }} className="block mt-3 font-serif text-base font-bold text-espresso leading-snug hover:text-burnt-orange transition-colors">{p.name}</Link>
                      <div className="mt-1 text-xs text-muted-foreground font-medium line-clamp-1">{p.tagline}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <Row label="Price & Value">
                {selected.map((p) => <td key={p.slug} className="p-5 font-serif text-xl font-bold text-espresso border-t border-border/60">₹{p.price}{p.priceMax && ` – ₹${p.priceMax}`}</td>)}
              </Row>
              <Row label="Category">
                {selected.map((p) => <td key={p.slug} className="p-5 border-t border-border/60 font-semibold text-espresso">{p.category}</td>)}
              </Row>
              <Row label="Floral Source">
                {selected.map((p) => <td key={p.slug} className="p-5 border-t border-border/60 text-espresso font-medium">{p.flora ?? "Saurashtra Wildflower"}</td>)}
              </Row>
              <Row label="Tasting Notes">
                {selected.map((p) => <td key={p.slug} className="p-5 border-t border-border/60 text-muted-foreground italic">{p.flora === "Ajwain" ? "Warm, herbal & aromatic" : p.flora === "Tulsi" ? "Soothing, holy basil notes" : "Earthy, rich wildflower nectar"}</td>)}
              </Row>
              <Row label="Best For">
                {selected.map((p) => <td key={p.slug} className="p-5 border-t border-border/60 text-muted-foreground">{p.flora === "Ajwain" ? "Digestive health & tea" : p.flora === "Tulsi" ? "Immunity & respiratory care" : "Daily sweetener & toast"}</td>)}
              </Row>
              <Row label="Purity Assurance">
                {selected.map((p) => <td key={p.slug} className="p-5 border-t border-border/60 font-medium text-botanical">100% Unheated, Raw & Lab Verified</td>)}
              </Row>
              <Row label="Customer Rating">
                {selected.map((p) => <td key={p.slug} className="p-5 border-t border-border/60 font-bold text-espresso">{p.rating} ★ <span className="text-xs font-normal text-muted-foreground">({p.reviews} verified)</span></td>)}
              </Row>
              <Row label="Available Pack Sizes">
                {selected.map((p) => <td key={p.slug} className="p-5 border-t border-border/60 font-medium text-espresso">{p.sizes.join(", ")}</td>)}
              </Row>
              {allBenefits.map((b) => (
                <Row key={b} label={b}>
                  {selected.map((p) => (
                    <td key={p.slug} className="p-5 border-t border-border/60 text-center">
                      {p.benefits?.includes(b) ? <Check className="size-5 text-burnt-orange mx-auto" /> : <span className="text-muted-foreground/40">—</span>}
                    </td>
                  ))}
                </Row>
              ))}
              <tr>
                <th className="sticky left-0 z-10 bg-cream/90 backdrop-blur text-left text-[11px] tracking-widest font-bold text-espresso uppercase p-5 border-t border-border/80">Direct Purchase</th>
                {selected.map((p) => (
                  <td key={p.slug} className="p-5 border-t border-border/80 bg-cream/20">
                    <button onClick={() => { add(p); toast.success(`Added ${p.name}`); }} className="w-full inline-flex items-center justify-center gap-2 bg-espresso text-cream rounded-xl px-4 py-3 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all shadow-sm">
                      <ShoppingCart className="size-4" /> ADD TO CART
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SiteLayout>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th className="sticky left-0 z-10 bg-cream/90 backdrop-blur text-left text-xs font-bold text-espresso p-5 border-t border-border/60 align-top">{label}</th>
      {children}
    </tr>
  );
}
