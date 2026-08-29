import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { getVariantByLabel, getProductGallery, getProductAdditionalImages } from "@/lib/products";
import type { Product } from "@/lib/products";
import { fetchProduct, fetchProducts } from "@/lib/product-catalog";
import {
  Star, ShoppingCart, ChevronRight, Leaf, Beaker, Droplets, Flower2, Sparkles,
  ShieldCheck, Truck, PackageCheck, ChevronLeft, ChevronUp, MessageCircle, Heart, GitCompare,
  Share2, ZoomIn, Copy, ChevronDown, Plus, Check,
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { PremiumMobileCarousel } from "@/components/site/PremiumMobileCarousel";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useCompare } from "@/lib/compare";
import { pushRecent } from "@/lib/recently-viewed";
import { toast } from "sonner";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { StructuredData, breadcrumbLd, productLd } from "@/components/site/StructuredData";
import { getCategorySlug } from "@/lib/collection-helpers";
import { ShoppableVideoCarousel } from "@/components/site/ShoppableVideoCarousel";
import honeyProcessImg from "@/assets/honey-process-infographic.png";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const dbP = await fetchProduct(params.slug);
    const p = dbP;
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Saurashtra Honey` },
          { name: "description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.product.name} — Saurashtra Honey` },
          { property: "og:description", content: loaderData.product.tagline },
          { property: "og:type", content: "product" },
          { property: "og:image", content: loaderData.product.image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-product py-24 text-center">
        <h1 className="font-serif text-4xl lg:text-5xl text-forest-dark">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-gold-deep border-b border-gold-deep">Back to shop</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <div className="container-product py-24 text-center">
        <h1 className="font-serif text-4xl lg:text-5xl text-forest-dark">Something went wrong</h1>
        <button onClick={reset} className="mt-4 text-gold-deep border-b border-gold-deep">Try again</button>
      </div>
    </SiteLayout>
  ),
  component: ProductPage,
});

const FAQS = [
  { q: "Is this raw honey?", a: "Yes — never heated above hive temperature, never filtered past what's needed to remove wax. All natural enzymes are preserved." },
  { q: "Will it crystallise?", a: "Natural crystallisation is a sign of purity. Warm the jar gently in a bowl of warm water — never microwave — to bring it back to liquid." },
  { q: "How long does it last?", a: "Stored in a cool, dry place, raw honey stays good for 2+ years. It never really expires — just enjoy it at its best." },
  { q: "Is it safe for children?", a: "Yes for children above 1 year. Never give any honey to infants under 12 months." },
  { q: "How do I know it's pure?", a: "Every batch has an independent lab report for moisture, HMF, sucrose and pollen count. You can request the report from customer care." },
  { q: "Shipping and returns?", a: "Free shipping over ₹799. Ships in 24–48 hrs. Easy replacement within 7 days if any jar arrives damaged." },
];

function ProductPage() {
  const { product: p } = Route.useLoaderData() as { product: Product };
  const [size, setSize] = useState(p.sizes[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"Description"|"Benefits"|"How to Use"|"Ingredients"|"Lab Report">("Description");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const { add, setOpen } = useCart();
  const wl = useWishlist();
  const cmp = useCompare();
  const navigate = useNavigate();

  useEffect(() => { void fetchProducts().then((r) => { if (r.length) setAllProducts(r); }); }, []);

  useEffect(() => {
    pushRecent(p.slug);
    import("@/lib/analytics").then(({ track, toItem }) => {
      track("view_item", { currency: "INR", value: p.price, items: [toItem(p, { size })] });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.slug]);

  const gallery = useMemo(() => {
    const base = getProductGallery(p) || [];
    const add = getProductAdditionalImages(p) || [];
    return [...base, ...add].filter((u) => u && u.trim().length > 0);
  }, [p]);

  const related = allProducts.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 4);
  const fbt = allProducts.filter((x) => x.slug !== p.slug).slice(0, 3);

  const activeVariant = useMemo(() => getVariantByLabel(p, size), [p, size]);
  const activePrice = activeVariant.price ?? p.price;
  const activeMrp = activeVariant.mrp ?? p.mrp;
  const stock = activeVariant.stock ?? (p as unknown as { stock_quantity?: number }).stock_quantity ?? 100;
  const inStock = activeVariant.inStock !== false && ((p as unknown as { in_stock?: boolean }).in_stock ?? true);
  const lowStock = inStock && stock <= 10;

  const handleAdd = () => {
    if (!inStock) { toast.error("Out of stock"); return; }
    add(p, size, qty, activeVariant);
    import("@/lib/analytics").then(({ track, toItem }) =>
      track("add_to_cart", { currency: "INR", value: activePrice * qty, items: [toItem(p, { size, qty })] })
    );
    toast.success(`Added ${p.name} (${size}) to cart`);
  };
  const handleBuy = () => {
    if (!inStock) { toast.error("Out of stock"); return; }
    add(p, size, qty, activeVariant);
    import("@/lib/analytics").then(({ track, toItem }) => {
      track("begin_checkout", { currency: "INR", value: activePrice * qty, items: [toItem(p, { size, qty })] });
    });
    setOpen(false); navigate({ to: "/checkout" });
  };
  const toggleWish = async () => {
    const saved = await wl.toggle(p.slug);
    toast.success(saved ? "Saved to wishlist" : "Removed from wishlist");
  };
  const toggleCompare = () => {
    const now = cmp.toggle(p.slug);
    if (now) toast.success("Added to compare");
  };
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: p.name, text: p.tagline, url }); return; } catch {/* cancelled */}
    }
    try { await navigator.clipboard.writeText(url); toast.success("Link copied"); }
    catch { toast.error("Couldn't copy"); }
  };

  const waMsg = encodeURIComponent(`Hi! I'd like to know more about ${p.name} (${size}) — ${typeof window !== "undefined" ? window.location.href : ""}`);
  const deliveryDate = useMemo(() => {
    const d = new Date(); d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }, []);
  const totalPrice = activePrice * qty;

  return (
    <SiteLayout>
      <div className="container-product py-4 md:py-6 text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
        <Link to="/" className="hover:text-gold-deep">Home</Link> <ChevronRight className="size-3" />
        <Link to="/shop" className="hover:text-gold-deep">Shop</Link> <ChevronRight className="size-3" />
        <Link to="/collections/$slug" params={{ slug: getCategorySlug(p.category) }} className="hover:text-gold-deep">{p.category}</Link> <ChevronRight className="size-3" />
        <span className="text-forest-dark truncate">{p.name}</span>
      </div>

      {/* MAIN */}
      <section className="container-product grid lg:grid-cols-[minmax(520px,680px)_minmax(450px,1fr)] gap-6 lg:gap-10 pb-8">
        {/* Desktop Gallery */}
        <div className="hidden md:grid grid-cols-[90px_1fr] gap-3.5 items-start">
          <div className="relative flex flex-col items-center">
            {gallery.length > 5 && (
              <button
                aria-label="Scroll Up"
                onClick={() => {
                  const el = document.getElementById("desktop-thumbs-rail");
                  if (el) el.scrollBy({ top: -110, behavior: "smooth" });
                }}
                className="w-full py-1 mb-1 text-espresso/60 hover:text-burnt-orange flex items-center justify-center transition-colors"
              >
                <ChevronUp className="size-4" />
              </button>
            )}
            <div
              id="desktop-thumbs-rail"
              className="flex flex-col gap-2.5 overflow-y-auto max-h-[600px] w-full pr-1 scrollbar-thin scrollbar-thumb-border"
            >
              {gallery.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIdx(i)}
                  className={`bg-cream-deep/60 rounded-xl overflow-hidden aspect-square w-full border transition-all shrink-0 ${
                    i === heroIdx
                      ? "border-2 border-burnt-orange shadow-sm scale-95"
                      : "border-border/80 hover:border-burnt-orange/50"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${p.name} view ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-contain bg-white object-center aspect-square"
                  />
                </button>
              ))}
            </div>
            {gallery.length > 5 && (
              <button
                aria-label="Scroll Down"
                onClick={() => {
                  const el = document.getElementById("desktop-thumbs-rail");
                  if (el) el.scrollBy({ top: 110, behavior: "smooth" });
                }}
                className="w-full py-1 mt-1 text-espresso/60 hover:text-burnt-orange flex items-center justify-center transition-colors"
              >
                <ChevronDown className="size-4" />
              </button>
            )}
          </div>

          <div className="bg-cream-deep/40 border border-border/80 rounded-3xl overflow-hidden relative group shadow-soft aspect-square w-full">
            <span className="absolute top-4 right-4 z-10 size-24 rounded-full bg-white/95 backdrop-blur-md border border-burnt-orange/40 flex flex-col items-center justify-center text-[9px] font-bold text-espresso tracking-widest text-center leading-tight shadow-sm">
              RAW &<br /><span className="text-burnt-orange">UNFILTERED</span><br /><Leaf className="size-3.5 text-burnt-orange mx-auto mt-1" />
            </span>
            <button
              aria-label="Zoom"
              onClick={() => setZoom(true)}
              className="absolute bottom-4 right-4 z-10 size-10 bg-white/95 rounded-full flex items-center justify-center text-espresso hover:bg-white shadow-md transition-transform hover:scale-110"
            >
              <ZoomIn className="size-4 text-burnt-orange" />
            </button>
            <img
              src={gallery[heroIdx] || gallery[0]}
              alt={p.name}
              className="w-full h-full object-contain aspect-square cursor-zoom-in transition-transform duration-500"
              onClick={() => setZoom(true)}
            />
          </div>
        </div>

        {/* Mobile Swipe Gallery */}
        <MobileProductGallery images={gallery} name={p.name} />

        <div>
          {p.badge && <div className="text-xs font-bold tracking-widest text-burnt-orange uppercase mb-1.5">{p.badge}</div>}
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-espresso leading-tight">{p.name}</h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground font-normal leading-relaxed">{p.tagline}</p>
          <div className="mt-3.5 flex items-center gap-2 text-sm flex-wrap">
            <div className="flex text-burnt-orange">{[...Array(5)].map((_, i) => <Star key={i} className={`size-4 ${i < Math.round(p.rating) ? "fill-burnt-orange text-burnt-orange" : "text-border"}`} />)}</div>
            <span className="font-bold text-espresso">{p.rating}</span>
            <a href="#reviews" className="text-muted-foreground hover:text-burnt-orange underline underline-offset-2 font-medium">({p.reviews} verified reviews)</a>
          </div>
          <div className="mt-5 flex items-center gap-2.5 flex-wrap">
            <span className="text-xl md:text-2xl font-semibold text-espresso">₹{activePrice}</span>
            {activeMrp && activeMrp > activePrice && (
              <><span className="text-base text-muted-foreground line-through">₹{activeMrp}</span>
                <span className="text-xs font-bold text-terracotta bg-cream-deep px-2 py-0.5 rounded-full shadow-xs">-{Math.round(((activeMrp - activePrice)/activeMrp)*100)}% OFF</span></>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes & free shipping on orders over ₹999</p>

          {/* Stock + delivery */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 text-botanical font-bold"><Check className="size-4" /> In Stock & Ready to Harvest{lowStock && <span className="text-terracotta font-semibold">— only {stock} jars left</span>}</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-terracotta font-bold">Temporarily Out of Stock</span>
            )}
            <span className="inline-flex items-center gap-1.5 text-espresso"><Truck className="size-4 text-burnt-orange" /> Estimated Delivery by <b className="font-bold">{deliveryDate}</b></span>
          </div>

          <div className="mt-6 h-px bg-border/80" />
          <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed">{p.description}</p>

          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-widest text-espresso">Select Pack Size</div>
            <div className="mt-2.5 flex gap-2.5 flex-wrap">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`px-5 py-2.5 rounded-full text-sm border font-semibold transition-all ${size === s ? "border-burnt-orange text-burnt-orange bg-cream shadow-xs" : "border-border text-muted-foreground hover:border-burnt-orange"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-espresso">Quantity</div>
              <div className="mt-2.5 inline-flex items-center border border-border rounded-xl bg-white shadow-xs">
                <button aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))} className="px-3.5 py-2.5 text-espresso hover:text-burnt-orange font-bold text-base">−</button>
                <span className="px-4 text-sm font-bold">{qty}</span>
                <button aria-label="Increase" onClick={() => setQty(qty + 1)} className="px-3.5 py-2.5 text-espresso hover:text-burnt-orange font-bold text-base">+</button>
              </div>
            </div>
            <div className="ml-auto text-right self-end pb-1.5">
              <div className="text-xl md:text-2xl font-semibold text-espresso">₹{totalPrice}</div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 hidden md:grid">
            <button onClick={handleAdd} className="btn-primary py-4 text-[13px] rounded-2xl tracking-widest disabled:opacity-50 font-bold" disabled={!inStock}>
              ADD TO CART <ShoppingCart className="size-4" />
            </button>
            <button onClick={handleBuy} className="btn-accent py-4 text-[13px] rounded-2xl tracking-widest disabled:opacity-50 font-bold" disabled={!inStock}>BUY NOW</button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            <button onClick={toggleWish} className={`inline-flex items-center justify-center gap-1.5 border rounded-xl py-2.5 text-[11px] font-bold tracking-widest transition-colors shadow-xs ${wl.has(p.slug) ? "border-terracotta text-terracotta bg-cream" : "border-border text-espresso hover:border-burnt-orange"}`}>
              <Heart className={`size-3.5 ${wl.has(p.slug) ? "fill-current" : ""}`} /> {wl.has(p.slug) ? "SAVED" : "WISHLIST"}
            </button>
            <button onClick={toggleCompare} className={`inline-flex items-center justify-center gap-1.5 border rounded-xl py-2.5 text-[11px] font-bold tracking-widest transition-colors shadow-xs ${cmp.has(p.slug) ? "border-burnt-orange text-burnt-orange bg-cream" : "border-border text-espresso hover:border-burnt-orange"}`}>
              <GitCompare className="size-3.5" /> {cmp.has(p.slug) ? "IN COMPARE" : "COMPARE"}
            </button>
            <button onClick={share} className="inline-flex items-center justify-center gap-1.5 border border-border text-espresso rounded-xl py-2.5 text-[11px] font-bold tracking-widest hover:border-burnt-orange shadow-xs">
              <Share2 className="size-3.5" /> SHARE
            </button>
          </div>
          <a href={`https://wa.me/?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-semibold text-espresso/80 hover:text-burnt-orange transition-colors">
            <MessageCircle className="size-4 text-botanical" /> Ask about this harvest on WhatsApp
          </a>
        </div>
      </section>

      {/* D2C QUALITY & TRUST STRIP */}
      <section className="container-product pb-10">
        <div className="bg-cream-deep/70 border border-border/80 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-soft">
          {[
            [Leaf, "100% Pure & Raw", "Unheated and unfiltered floral honey."],
            [Beaker, "Lab Tested Purity", "Every batch certified for zero adulteration."],
            [Sparkles, "Direct From Apiary", "Harvested ethically from wildflower farms."],
            [Flower2, "Single Floral Note", "Capturing authentic regional terroir."],
          ].map(([I, t, s]) => {
            const Icon = I as typeof Leaf;
            return (
              <div key={t as string} className="flex items-start gap-3.5">
                <Icon className="size-5 text-burnt-orange shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-espresso">{t as string}</div>
                  <div className="text-muted-foreground mt-0.5">{s as string}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STRUCTURED EDUCATIONAL TABS */}
      <section className="container-product pb-12">
        <div className="bg-white border border-border/80 rounded-2xl p-6 md:p-8 shadow-soft">
          <div className="flex flex-wrap gap-6 md:gap-8 border-b border-border/80 overflow-x-auto">
            {(["Story / Description", "What Makes It Special", "Floral Source & Notes", "Storage & Usage", "Purity & Lab Test"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t as never)}
                className={`pb-3.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${tab === (t as never) ? "text-burnt-orange border-b-2 border-burnt-orange" : "text-muted-foreground hover:text-espresso"}`}>{t}</button>
            ))}
          </div>
          <div className="mt-7">
            {tab === "Description" || (tab as string) === "Story / Description" ? (
              <>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Our {p.name} is collected by bees from the nectar of {p.flora ?? "wild"} blossoms grown across the rich floral regions of Saurashtra. It is raw, unheated and unfiltered—preserving every natural enzyme, antioxidant, and subtle aroma present in the hive.</p>
                <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-sm font-medium text-espresso">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2.5"><span className="size-5 rounded-full bg-cream-deep text-burnt-orange flex items-center justify-center text-xs font-bold">✓</span> {b}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {tab === "Benefits" || (tab as string) === "What Makes It Special" ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-espresso">
                {p.benefits.map((b) => <li key={b} className="flex items-start gap-3"><Leaf className="size-4 text-burnt-orange mt-0.5 shrink-0" /> <span>{b}</span></li>)}
                <li className="flex items-start gap-3"><Leaf className="size-4 text-burnt-orange mt-0.5 shrink-0" /> <span>Rich in natural antimicrobial properties & enzymes</span></li>
                <li className="flex items-start gap-3"><Leaf className="size-4 text-burnt-orange mt-0.5 shrink-0" /> <span>Never heated above natural hive temperature</span></li>
              </ul>
            ) : null}
            {tab === "How to Use" || (tab as string) === "Storage & Usage" ? (
              <ol className="space-y-4 text-sm font-medium text-espresso">
                {["Take 1–2 teaspoons each morning on an empty stomach for daily vitality.", "Stir into warm (never boiling) water, herbal infusions, or lemon water.", "Drizzle over yogurt, artisanal cheese, fruit bowls, or freshly baked sourdough.", "Store in a cool, dry place away from direct sunlight; natural crystallization is a sign of pure raw honey."].map((s, i) => <li key={i} className="flex gap-3.5 items-start"><span className="size-6 rounded-full bg-espresso text-cream text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span><span className="leading-relaxed">{s}</span></li>)}
              </ol>
            ) : null}
            {tab === "Ingredients" || (tab as string) === "Floral Source & Notes" ? (
              <div className="space-y-3">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">100% Pure, Raw & Unfiltered Honey harvested primarily from {p.flora ?? "Wildflower"} blossoms in Saurashtra. No sugar syrups, artificial flavorings, or preservatives.</p>
                <div className="p-4 rounded-xl bg-cream-deep/60 border border-border/80 text-xs font-medium text-espresso">
                  <span className="font-bold text-burnt-orange">Tasting Note:</span> Distinct floral sweetness with an authentic earthy, soothing finish characteristic of raw Indian apiaries.
                </div>
              </div>
            ) : null}
            {tab === "Lab Report" || (tab as string) === "Purity & Lab Test" ? (
              <div className="space-y-4">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">Every batch of Saurashtra Honey undergoes independent NABL-accredited laboratory testing for moisture content, HMF levels, C4 sugar adulteration, and pollen verification.</p>
                <div className="flex items-center justify-between p-4 rounded-xl bg-cream border border-border/80 text-sm">
                  <div>
                    <div className="font-bold text-espresso">Verified Batch Code: SH24-{p.slug.slice(0, 3).toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground">Tested for zero inverted sugar & 100% floral purity</div>
                  </div>
                  <a href="#" className="text-xs font-bold tracking-widest text-burnt-orange hover:underline uppercase">Download PDF Report →</a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>


      {/* Frequently bought together */}
      {fbt.length > 0 && (
        <section className="container-product pb-12">
          <h2 className="font-serif text-2xl font-bold text-espresso mb-4">Frequently Bought Together</h2>
          <div className="bg-cream-deep/50 border border-border/80 rounded-2xl p-5 md:p-7 grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center shadow-soft">
            <div className="flex items-center gap-3 md:gap-5 overflow-x-auto pb-2 md:pb-0">
              {[p, ...fbt].map((x, i) => (
                <div key={x.slug} className="flex items-center gap-3 md:gap-4 shrink-0">
                  <div className="w-24 md:w-28 shrink-0">
                    <img src={x.image} alt={x.name} className="w-full aspect-square rounded-xl object-cover bg-white shadow-xs border border-border/80" />
                    <div className="mt-1.5 font-serif text-xs md:text-sm font-bold text-espresso leading-tight line-clamp-2">{x.name}</div>
                    <div className="text-[11px] md:text-xs text-muted-foreground font-semibold mt-0.5">₹{x.price}</div>
                  </div>
                  {i < fbt.length && <Plus className="size-5 text-burnt-orange shrink-0" />}
                </div>
              ))}
            </div>
            <div className="md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-border/60">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Bundle Price</div>
              <div className="font-serif text-2xl md:text-3xl font-bold text-espresso">₹{[p, ...fbt].reduce((s, x) => s + x.price, 0)}</div>
              <button onClick={() => { [p, ...fbt].forEach((x) => add(x)); toast.success("Bundle added to cart"); }}
                className="mt-3 w-full md:w-auto bg-espresso text-cream rounded-xl px-6 py-3 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-colors shadow-sm">ADD BUNDLE TO CART</button>
            </div>
          </div>
        </section>
      )}

      {/* Honey Process Infographic */}
      <section 
        className="pb-14 relative" 
        style={{ 
          width: '100vw', 
          maxWidth: 'none',
          marginLeft: 'calc(50% - 50vw)', 
          marginRight: 'calc(50% - 50vw)',
          paddingLeft: '0',
          paddingRight: '0'
        }}
      >
        <img 
          src={honeyProcessImg} 
          alt="From Hive to Home, Pure Honey for You - Honey extraction process" 
          style={{ width: '100%', display: 'block', height: 'auto' }}
          className="w-full h-auto block object-contain" 
          loading="lazy" 
        />
      </section>

      {/* FAQ Accordion */}
      <section className="container-product pb-14">
        <h2 className="font-serif text-2xl font-bold text-espresso mb-5">Frequently Asked Questions</h2>
        <div className="bg-white border border-border/80 rounded-2xl divide-y divide-border/60 shadow-soft overflow-hidden">
          {FAQS.map((f, i) => (
            <div key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center text-left p-5 md:p-6 hover:bg-cream/40 transition-colors" aria-expanded={openFaq === i}>
                <span className="font-bold text-espresso text-sm md:text-base">{f.q}</span>
                <ChevronDown className={`size-4 text-burnt-orange transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <ReviewsSection productSlug={p.slug} productName={p.name} />

      {/* RELATED / YOU MAY ALSO LIKE */}
      {related.length > 0 && (
        <section className="container-product pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-espresso">You May Also Like</h2>
            <Link to="/shop" className="text-xs font-bold tracking-widest text-burnt-orange hover:underline uppercase">VIEW ALL HARVESTS →</Link>
          </div>
          <div className="block md:hidden mt-2">
            <PremiumMobileCarousel
              items={related}
              slideClassName="flex-[0_0_86vw] min-w-0"
              renderItem={(r) => <ProductCard key={r.slug} p={r} />}
            />
          </div>
          <div className="hidden md:grid md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((r) => <ProductCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}

      {/* STORIES FROM THE HIVE */}
      <ShoppableVideoCarousel
        eyebrow="FROM THE APIARIES"
        title="Stories from the Hive"
        subtitle="Watch how our floral raw honey is ethically harvested in the wild"
        placementContext="pdp"
        currentSlug={p.slug}
        category={p.category}
      />

      <StructuredData data={productLd({ name: p.name, description: p.description, image: p.image, slug: p.slug, price: p.price, rating: p.rating, reviews: p.reviews })} />
      <StructuredData data={breadcrumbLd([{ name: "Home", url: "/" }, { name: "Shop", url: "/shop" }, { name: p.category, url: `/shop?category=${encodeURIComponent(p.category)}` }, { name: p.name, url: `/product/${p.slug}` }])} />
      <StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />

      {/* PROMISE STRIP */}
      <section className="container-product pb-24">
        <div className="bg-espresso text-cream rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-soft border border-white/10">
          {[[PackageCheck, "100% Secure Payments", "256-bit encrypted transactions"], [Truck, "Fast & Safe Delivery", "Insured doorstep delivery"], [PackageCheck, "Artisanal Packing", "Recyclable glass & eco cushioning"], [ShieldCheck, "Purity Assurance", "Guaranteed unheated floral raw honey"]].map(([I, t, s]) => {
            const Icon = I as typeof PackageCheck;
            return (
              <div key={t as string} className="flex items-start gap-3.5">
                <Icon className="size-6 text-burnt-orange shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-cream tracking-wide">{t as string}</div>
                  <div className="text-cream/75 mt-0.5 leading-relaxed">{s as string}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky mobile purchase bar */}
      <div className="md:hidden fixed inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.15)]" style={{ bottom: "calc(56px + env(safe-area-inset-bottom))" }}>
        <div className="flex items-center gap-2 p-3">
          <div className="pl-1 pr-2 min-w-0">
            <div className="text-[10px] text-muted-foreground truncate font-bold uppercase tracking-wider">{size}</div>
            <div className="text-base font-serif font-bold text-espresso">₹{totalPrice}</div>
          </div>
          <button onClick={handleAdd} disabled={!inStock} className="btn-primary flex-1 py-3 text-xs tracking-widest disabled:opacity-50">ADD TO CART</button>
          <button onClick={handleBuy} disabled={!inStock} className="btn-accent flex-1 py-3 text-xs tracking-widest disabled:opacity-50">BUY NOW</button>
        </div>
      </div>
      <div className="md:hidden h-[160px]" aria-hidden />

      {/* Zoom modal */}
      {zoom && (
        <div className="fixed inset-0 z-[100] bg-forest-dark/95 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <button aria-label="Close zoom" className="absolute top-4 right-4 size-10 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20">✕</button>
          <div className="max-w-5xl w-full grid md:grid-cols-[80px_1fr] gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="hidden md:flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
              {gallery.map((src, i) => (
                <button key={i} onClick={() => setHeroIdx(i)} className={`bg-cream/10 rounded-lg overflow-hidden aspect-square border ${i === heroIdx ? "border-gold" : "border-transparent"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <img src={gallery[heroIdx]} alt={p.name} className="w-full h-auto max-h-[85vh] object-contain" />
          </div>
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 md:hidden">
            <button aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setHeroIdx((heroIdx - 1 + gallery.length) % gallery.length); }} className="size-10 rounded-full bg-white/10 text-cream flex items-center justify-center"><ChevronLeft className="size-4" /></button>
            <button aria-label="Next image" onClick={(e) => { e.stopPropagation(); setHeroIdx((heroIdx + 1) % gallery.length); }} className="size-10 rounded-full bg-white/10 text-cream flex items-center justify-center"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      )}
      {/* STICKY MOBILE BUY BOX */}
      <div className="md:hidden fixed bottom-[72px] left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[#2B2118]/10 p-3 shadow-[0_-8px_30px_rgba(43,33,24,0.08)] flex gap-3">
        <button onClick={handleAdd} disabled={!inStock} className="flex-1 bg-white border border-[#2B2118] text-[#2B2118] font-bold text-[12px] uppercase tracking-widest py-3.5 rounded-[16px] shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
          <span>Add</span>
          <ShoppingCart className="size-4" />
        </button>
        <button onClick={handleBuy} disabled={!inStock} className="flex-[1.5] bg-[#D97706] text-white font-bold text-[12px] uppercase tracking-widest py-3.5 rounded-[16px] shadow-sm active:scale-95 transition-transform">
          Buy Now
        </button>
      </div>
    </SiteLayout>
  );
}

// Mobile Gallery Component using Embla
function MobileProductGallery({ images, name }: { images: string[]; name: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <div className="md:hidden w-full min-w-0 mb-4 relative">
      <div className="overflow-hidden rounded-[28px] border border-[#2B2118]/10 bg-[#F8F5EF] shadow-sm relative" ref={emblaRef}>
        <div className="flex touch-pan-y cursor-grab active:cursor-grabbing">
          {images.map((src, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0 aspect-square relative">
              <img src={src} alt={`${name} view ${idx + 1}`} loading="lazy" className="w-full max-w-full h-full object-contain bg-white object-center pointer-events-none" />
            </div>
          ))}
        </div>
        <span className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-espresso/80 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-widest shadow-sm">
          {selectedIndex + 1} / {images.length}
        </span>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === selectedIndex ? "w-6 h-1.5 bg-[#D97706]" : "w-1.5 h-1.5 bg-[#D97706]/30"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto overflow-y-hidden w-full min-w-0 py-3 px-1 no-scrollbar mt-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`size-16 rounded-xl overflow-hidden aspect-square shrink-0 border transition-all ${
                idx === selectedIndex
                  ? "border-2 border-burnt-orange shadow-sm scale-95"
                  : "border-border/80 opacity-75"
              }`}
            >
              <img src={src} alt={`${name} thumb ${idx + 1}`} className="w-full h-full object-contain bg-white" />
            </button>
          ))}
        </div>
      )}
      <span className="absolute top-4 right-8 z-10 size-16 rounded-full bg-white/95 backdrop-blur-md border border-[#D97706]/40 flex flex-col items-center justify-center text-[8px] font-bold text-[#2B2118] tracking-widest text-center leading-[1.1] shadow-sm">
        RAW &<br /><span className="text-[#D97706]">UNFILTERED</span><br /><Leaf className="size-3 text-[#D97706] mx-auto mt-0.5" />
      </span>
    </div>
  );
}



/* Prevent unused-var lint for Copy which was imported for future use */
void Copy;
