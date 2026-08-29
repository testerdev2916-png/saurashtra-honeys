import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Eye, Plus, GitCompare, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { getVariantByLabel, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useCompare } from "@/lib/compare";
import { toast } from "sonner";
import { track, toItem } from "@/lib/analytics";

export function ProductCard({ p, onQuickView }: { p: Product; onQuickView?: (p: Product) => void }) {
  const [size, setSize] = useState(p.sizes[0]);
  const { add } = useCart();
  const wl = useWishlist();
  const cmp = useCompare();
  const saved = wl.has(p.slug);
  const inCompare = cmp.has(p.slug);
  const navigate = useNavigate();

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    const nowSaved = await wl.toggle(p.slug);
    toast.success(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
  }
  function toggleCompare(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    const now = cmp.toggle(p.slug);
    if (now) toast.success(`Added to compare (${cmp.count + 1}/4)`, { action: { label: "View", onClick: () => navigate({ to: "/compare" }) } });
  }

  const activeVariant = getVariantByLabel(p, size);
  const activePrice = activeVariant.price ?? p.price;
  const activeMrp = activeVariant.mrp ?? p.mrp;
  const discount = activeMrp && activeMrp > activePrice ? Math.round(((activeMrp - activePrice) / activeMrp) * 100) : 0;

  return (
    <div className="group bg-white rounded-2xl border border-border/90 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lift md:hover:-translate-y-1.5 h-full">
      <div className="relative block bg-cream aspect-square overflow-hidden shrink-0">
        {p.badge && (
          <span className={`absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10 text-[9px] md:text-[10px] font-bold tracking-wider px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm ${p.badge === "BESTSELLER" ? "bg-espresso text-cream" : "bg-burnt-orange text-white"}`}>
            {p.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 md:hidden z-10 text-[9px] font-bold px-2 py-0.5 rounded-full bg-terracotta text-white shadow-sm" style={{ top: p.badge ? "2rem" : "0.625rem" }}>
            -{discount}%
          </span>
        )}
        <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} onClick={toggleSave}
            className={`size-7 md:size-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm ${saved ? "text-terracotta" : "text-espresso hover:text-burnt-orange"}`}>
            <Heart className={`size-3.5 md:size-4 ${saved ? "fill-current" : ""}`} />
          </button>
          <button aria-label={inCompare ? "Remove from compare" : "Add to compare"} onClick={toggleCompare}
            className={`size-7 md:size-8 rounded-full bg-white/90 backdrop-blur-md items-center justify-center transition-colors hidden md:flex shadow-sm ${inCompare ? "text-burnt-orange" : "text-espresso hover:text-burnt-orange"}`}>
            <GitCompare className="size-3.5 md:size-4" />
          </button>
        </div>
        <Link to="/product/$slug" params={{ slug: p.slug }} onClick={() => track("select_item", { items: [toItem(p, { size })] })} className="block w-full h-full">
          <img key={p.updatedAt || p.image} src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover object-center md:group-hover:scale-108 transition-transform duration-700 ease-out" />
        </Link>
        {onQuickView && (
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(p); }}
            className="hidden md:inline-flex absolute bottom-3 left-1/2 -translate-x-1/2 z-10 items-center gap-1.5 bg-espresso text-cream text-[11px] font-bold tracking-widest px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-burnt-orange hover:text-white shadow-md">
            <Eye className="size-3.5" /> QUICK VIEW
          </button>
        )}
      </div>
      <div className="p-3.5 md:p-5 flex flex-col gap-1.5 md:gap-2.5 flex-1">
        <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-brand-orange">
          {p.flora || p.category}
        </div>
        <h3 className="font-serif text-sm md:text-base font-bold leading-snug text-espresso line-clamp-2 min-h-[2.5rem] md:min-h-[2.75rem]">
          <Link to="/product/$slug" params={{ slug: p.slug }} className="hover:text-brand-orange transition-colors">{p.name}</Link>
        </h3>

        {/* Rating stars & reviews matching reference */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-brand-orange" aria-label="5 out of 5 stars">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} className="size-3.5 fill-brand-orange text-brand-orange" />
            ))}
          </div>
          <span className="font-bold text-muted-foreground text-[11px]">({p.reviews || 180})</span>
        </div>

        <div className="hidden md:flex gap-1.5 flex-wrap mt-0.5">
          {p.sizes.map((s) => (
            <button key={s} onClick={(e) => { e.preventDefault(); setSize(s); }}
              className={`text-xs px-3 py-1.5 min-w-[3rem] mb-3 rounded-full border font-semibold transition-colors ${size === s ? "border-brand-orange text-brand-orange bg-cream" : "border-border text-muted-foreground hover:border-brand-orange"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
          <span className="text-base md:text-lg font-bold text-espresso">₹{activePrice}</span>
          {activeMrp && activeMrp > activePrice && (
            <>
              <span className="text-xs text-muted-foreground line-through">₹{activeMrp}</span>
              <span className="hidden md:inline text-[11px] font-bold text-brand-orange bg-cream-deep px-1.5 py-0.5 rounded">-{discount}%</span>
            </>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            add(p, size, 1, activeVariant);
            track("add_to_cart", { currency: "INR", value: activePrice, items: [toItem(p, { size, qty: 1 })] });
            toast.success(`Added ${p.name} (${size}) to cart`);
          }}
          className="mt-auto w-full border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-bold text-xs uppercase tracking-widest py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs group/btn">
          <ShoppingCart className="size-3.5 group-hover/btn:scale-110 transition-transform" />
          <span>ADD TO CART</span>
        </button>
      </div>
    </div>
  );
}
