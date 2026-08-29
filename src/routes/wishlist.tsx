import { createFileRoute, Link } from "@tanstack/react-router";
import { useWishlist } from "@/lib/wishlist";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import { useCart } from "@/lib/cart";
import { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — Saurashtra Honey" },
      { name: "description", content: "View and manage your saved raw honey varieties, gift sets, and single-flora reserves." },
      { property: "og:title", content: "My Wishlist — Saurashtra Honey" },
      { property: "og:description", content: "Your saved honeys from Saurashtra Honey Bee Farm." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const wl = useWishlist();
  const { add } = useCart();
  const [all, setAll] = useState<Product[]>([]);

  useEffect(() => {
    void fetchProducts().then((r) => {
      if (r.length) setAll(r);
    });
  }, []);

  const items = useMemo(() => {
    return all.filter((p) => wl.has(p.slug));
  }, [all, wl.slugs, wl]);

  const handleAddToCart = (p: Product) => {
    add(p);
    toast.success(`Added ${p.name} to cart`);
  };

  const handleClearAll = async () => {
    if (confirm("Clear all items from your wishlist?")) {
      await wl.clear();
      toast.success("Wishlist cleared");
    }
  };

  return (
    <SiteLayout>
      <div className="container-page py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6 mb-8 sm:mb-10">
          <div>
            <SectionEyebrow>Favorites</SectionEyebrow>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso tracking-tight">
              Saved for Later <span className="text-burnt-orange font-normal text-2xl sm:text-3xl">({items.length})</span>
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors self-start md:self-auto py-2 px-4 rounded-xl border border-border/60 hover:border-destructive/30 hover:bg-destructive/5"
            >
              <Trash2 className="size-4" /> CLEAR ALL
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-cream-deep/40 border border-border/70 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto my-6 shadow-xs">
            <div className="mx-auto size-20 rounded-full bg-cream border border-border/80 flex items-center justify-center text-burnt-orange mb-6 shadow-xs">
              <Heart className="size-8" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">Your Wishlist is Empty</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
              Save your favorite raw forest honeys, gift sets, and single-flora reserves to keep track of what you love and order anytime.
            </p>
            <div className="mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 bg-espresso text-cream px-7 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-burnt-orange transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {items.map((p) => {
              const discount = p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
              return (
                <div
                  key={p.slug}
                  className="group bg-white rounded-2xl border border-border/90 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lift md:hover:-translate-y-1"
                >
                  <div className="relative block bg-cream aspect-square overflow-hidden shrink-0">
                    {p.badge && (
                      <span className="absolute top-3 left-3 z-10 text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm bg-espresso text-cream">
                        {p.badge}
                      </span>
                    )}
                    {discount > 0 && (
                      <span
                        className="absolute top-3 left-3 z-10 text-[9px] font-bold px-2 py-0.5 rounded-full bg-terracotta text-white shadow-sm"
                        style={{ top: p.badge ? "2.25rem" : "0.75rem" }}
                      >
                        -{discount}%
                      </span>
                    )}
                    <button
                      aria-label="Remove from wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        void wl.remove(p.slug);
                        toast.success(`Removed ${p.name}`);
                      }}
                      className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-terracotta hover:text-destructive transition-colors shadow-sm"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="block w-full h-full">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center md:group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {p.flora && (
                      <div className="text-[10px] font-bold tracking-widest uppercase text-burnt-orange mb-1">
                        {p.flora}
                      </div>
                    )}
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="font-serif text-base sm:text-lg font-bold text-espresso group-hover:text-burnt-orange transition-colors line-clamp-2 leading-snug"
                    >
                      {p.name}
                    </Link>
                    {p.tagline && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.tagline}</div>
                    )}

                    <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-border/50">
                      <div>
                        <div className="font-serif text-lg font-bold text-espresso leading-none">
                          ₹{p.price.toLocaleString("en-IN")}
                        </div>
                        {p.mrp && p.mrp > p.price && (
                          <div className="text-xs text-muted-foreground line-through mt-0.5">
                            ₹{p.mrp.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        className="inline-flex items-center gap-1.5 bg-espresso text-cream hover:bg-burnt-orange hover:text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all shadow-xs shrink-0"
                      >
                        <ShoppingBag className="size-3.5" />
                        <span>ADD</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
