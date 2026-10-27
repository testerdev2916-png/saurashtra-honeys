import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  getVariantByLabel,
  getVariantPackaging,
  resolveActiveImage,
  formatSizeDisplay,
  cleanProductName,
  normalizeSizeKey,
  type Product,
} from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Link } from "@tanstack/react-router";
import { Leaf, ShoppingCart, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add } = useCart();
  const [size, setSize] = useState<string>(
    product?.variants?.find((v) => v.isDefault)?.label || product?.sizes[0] || "",
  );
  const [qty, setQty] = useState(1);

  // reset when product changes
  if (product && !product.sizes.includes(size)) {
    const nextSize =
      product.variants?.find((v) => v.isDefault)?.label || product.sizes[0] || "";
    setSize(nextSize);
  }

  const activeVariant = product ? getVariantByLabel(product, size) : undefined;
  const activePrice = activeVariant?.price ?? product?.price ?? 0;
  const activeMrp = activeVariant?.mrp ?? product?.mrp;
  const activePackaging = activeVariant?.packaging || getVariantPackaging(activeVariant || size);
  const discount =
    activeMrp && activeMrp > activePrice
      ? Math.round(((activeMrp - activePrice) / activeMrp) * 100)
      : 0;
  const isOutOfStock =
    activeVariant?.inStock === false ||
    (activeVariant?.stock !== undefined && activeVariant.stock <= 0);

  const activeImage = product ? resolveActiveImage(product, activeVariant) : "";
  const displayName = product ? cleanProductName(product.name) : "";

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
              <img
                key={activeImage}
                loading="lazy"
                src={activeImage}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 size-8 rounded-full bg-cream flex items-center justify-center hover:bg-gold/30"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
              <div className="text-[10px] font-bold tracking-widest text-gold-deep">
                {product.category.toUpperCase()}
              </div>
              <h2 className="mt-1 font-serif text-3xl text-forest-dark">{displayName}</h2>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3 ${i < Math.round(product.rating) ? "fill-gold" : ""}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews})</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl font-serif text-forest-dark">₹{activePrice}</span>
                {activeMrp && activeMrp > activePrice && (
                  <>
                    <span className="text-xs text-muted-foreground line-through">₹{activeMrp}</span>
                    <span className="text-[11px] font-bold text-brand-orange bg-[#FEF3C7] px-2 py-0.5 rounded-full shadow-xs">
                      -{discount}% OFF
                    </span>
                  </>
                )}
                {activePackaging && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream border border-border text-espresso/80">
                    {activePackaging}
                  </span>
                )}
                {isOutOfStock && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full ml-auto">
                    Out of stock
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                {product.description}
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
                {product.benefits.slice(0, 4).map((b) => (
                  <li key={b} className="flex items-start gap-1.5">
                    <Leaf className="size-3 text-gold-deep mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <div className="text-xs font-semibold text-forest-dark mb-1.5">Select Pack Size</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const v = getVariantByLabel(product, s);
                    const vPackaging = v?.packaging || getVariantPackaging(s);
                    const isSelected = size === s || normalizeSizeKey(size) === normalizeSizeKey(s);
                    const variantOos =
                      v?.inStock === false || (v?.stock !== undefined && v.stock <= 0);

                    return (
                      <button
                        key={s}
                        disabled={variantOos}
                        onClick={() => setSize(s)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "border-brand-orange text-brand-orange bg-[#FEF3C7] ring-1 ring-brand-orange/40 font-bold shadow-xs"
                            : variantOos
                              ? "border-border/40 text-muted-foreground/40 bg-gray-50 line-through cursor-not-allowed"
                              : "border-border text-espresso/85 bg-white hover:border-brand-orange hover:text-brand-orange hover:bg-cream/40"
                        }`}
                      >
                        <span>{formatSizeDisplay(s)}</span>
                        {vPackaging && (
                          <span className={`text-[10px] ${isSelected ? "text-brand-orange/80" : "text-muted-foreground/70"}`}>
                            • {vPackaging}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="inline-flex items-center border border-border rounded-lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5">
                    −
                  </button>
                  <span className="px-3 text-sm">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5">
                    +
                  </button>
                </div>
                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    if (isOutOfStock) return;
                    if (product) add(product, size, qty, activeVariant);
                    toast.success(`Added ${displayName} (${formatSizeDisplay(size)}) to cart`);
                    onClose();
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold tracking-widest ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-forest-dark text-cream hover:bg-forest"
                  }`}
                >
                  <span>{isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}</span>{" "}
                  <ShoppingCart className="size-3.5" />
                </button>
              </div>
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                search={activeVariant?.id ? { variant: activeVariant.id } : undefined}
                onClick={onClose}
                className="mt-3 text-center text-xs font-bold tracking-widest text-gold-deep border-b border-gold-deep self-start hover:text-brand-orange hover:border-brand-orange transition-colors"
              >
                VIEW FULL DETAILS
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
