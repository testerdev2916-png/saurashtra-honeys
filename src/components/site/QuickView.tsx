import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getVariantByLabel, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Link } from "@tanstack/react-router";
import { Leaf, ShoppingCart, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add } = useCart();
  const [size, setSize] = useState<string>(product?.sizes[0] ?? "");
  const [qty, setQty] = useState(1);

  // reset when product changes
  if (product && !product.sizes.includes(size)) setSize(product.sizes[0]);

  const activeVariant = product ? getVariantByLabel(product, size) : undefined;
  const activePrice = activeVariant?.price ?? product?.price ?? 0;
  const activeMrp = activeVariant?.mrp ?? product?.mrp;

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background gap-0 [&>button.absolute]:hidden">
        {product && (
          <div className="grid md:grid-cols-2">
            <div className="bg-cream aspect-square relative">
              {product.badge && (
                <span className="absolute top-3 left-3 z-10 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-forest-dark text-cream">
                  {product.badge}
                </span>
              )}
              <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col relative">
              <button onClick={onClose} className="absolute top-3 right-3 size-8 rounded-full bg-cream flex items-center justify-center hover:bg-gold/30" aria-label="Close">
                <X className="size-4" />
              </button>
              <div className="text-[10px] font-bold tracking-widest text-gold-deep">{product.category.toUpperCase()}</div>
              <h2 className="mt-1 font-serif text-3xl text-forest-dark">{product.name}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <div className="flex text-gold">{[...Array(5)].map((_, i) => <Star key={i} className={`size-3 ${i < Math.round(product.rating) ? "fill-gold" : ""}`} />)}</div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews})</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-serif text-forest-dark">₹{activePrice}</span>
                {activeMrp && <span className="text-xs text-muted-foreground line-through">₹{activeMrp}</span>}
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{product.description}</p>
              <ul className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
                {product.benefits.slice(0, 4).map((b) => (
                  <li key={b} className="flex items-start gap-1.5"><Leaf className="size-3 text-gold-deep mt-0.5 shrink-0" /> {b}</li>
                ))}
              </ul>
              <div className="mt-4">
                <div className="text-xs font-semibold text-forest-dark">Size</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`text-xs px-3 py-1.5 rounded border ${size === s ? "border-gold-deep text-gold-deep bg-cream" : "border-border text-muted-foreground"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="inline-flex items-center border border-border rounded-lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5">−</button>
                  <span className="px-3 text-sm">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5">+</button>
                </div>
                <button
                  onClick={() => { if (product) add(product, size, qty, activeVariant); toast.success(`Added ${product?.name} (${size}) to cart`); onClose(); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-forest-dark text-cream rounded-lg py-2.5 text-xs font-bold tracking-widest hover:bg-forest">
                  ADD TO CART <ShoppingCart className="size-3.5" />
                </button>
              </div>
              <Link to="/product/$slug" params={{ slug: product.slug }} onClick={onClose} className="mt-3 text-center text-xs font-bold tracking-widest text-gold-deep border-b border-gold-deep self-start">
                VIEW FULL DETAILS
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
