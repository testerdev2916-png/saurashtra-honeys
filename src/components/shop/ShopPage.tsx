import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { CategoryThumbnailNav } from "@/components/shop/CategoryThumbnailNav";
import { PremiumMobileCarousel } from "@/components/site/PremiumMobileCarousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { DesktopFilterSheet, MobileFilterDrawer, defaultFilters, type FilterState } from "@/components/shop/ShopFilters";
import {
  Search,
  X,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { QuickView } from "@/components/site/QuickView";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import {
  fetchShopCategories,
  DEFAULT_SHOP_CATEGORIES,
  type ShopCategory,
} from "@/lib/category-catalog";
import { track, toItem } from "@/lib/analytics";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { IllustratedBrandSection } from "@/components/site/IllustratedBrandSection";

// Assets for Shop Hero and Discover By Shop collections
import heroProductsImg from "@/assets/hero-products.jpg";
import heroHoneyImg from "@/assets/hero-honey.jpg";
import prodMultifloraImg from "@/assets/prod-multiflora.jpg";
import prodHoneycombImg from "@/assets/prod-honeycomb.jpg";
import giftpackFallback from "@/assets/prod-giftpack.jpg";
import prodGiftpackImg from "@/assets/prod-giftpack.jpg";
import honeycombBeesImg from "@/assets/honeycomb-bees.jpg";
import prodLiquidImg from "@/assets/prod-liquid.jpg";
import beeFlowerImg from "@/assets/bee-flower.jpg";
import honeyDrizzleImg from "@/assets/honey-drizzle.jpg";
import familyHoneyImg from "@/assets/family-honey.jpg";

export function ShopPage({ 
  overrideCategorySlug, 
  initialCategories = DEFAULT_SHOP_CATEGORIES, 
  initialProducts = [] 
}: { 
  overrideCategorySlug?: string;
  initialCategories?: ShopCategory[];
  initialProducts?: Product[];
}) {
  // Temporary development diagnostic
  console.table(
    initialCategories.map(c => ({
      slug: c.slug,
      name: c.name,
      image_url: c.image_url,
      image: (c as any).image,
      updated_at: c.updated_at
    }))
  );

  const search = useSearch({ strict: false }) as Record<string, any>;
  const navigate = useNavigate();

  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start", 
      duration: 60,
      skipSnaps: false,
      breakpoints: { '(min-width: 768px)': { active: false } }
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  // Normalize products synchronously based on passed initialProducts
  const normalizedInitialProducts = useMemo(() => {
    const mergedMap = new Map<string, Product>();
    
    // Add database products
    if (initialProducts && initialProducts.length > 0) {
      initialProducts.forEach((p) => {
        mergedMap.set(p.slug, p);
      });
    }

    // Normalize categories to ensure exactly one of the 6 categories
    const validCategories = ["Honey", "Beeswax", "Bee Pollen", "Beeswax Candles", "Beeswax Products", "Beauty Products"];
    
    return Array.from(mergedMap.values()).map((p) => {
      let finalCat = p.category;
      
      // Fix legacy categories
      if (finalCat === "Beeswax Candle") finalCat = "Beeswax Candles";
      if (p.name.includes("Gift Pack")) finalCat = "Honey";

      // Fallback if somehow totally invalid
      if (!validCategories.includes(finalCat)) {
         if (p.name.includes("Honey")) finalCat = "Honey";
         else finalCat = "Honey"; // safe fallback
      }
      
      return { ...p, category: finalCat };
    });
  }, [initialProducts]);

  const [products, setProducts] = useState<Product[]>(normalizedInitialProducts);
  const [categories, setCategories] = useState<ShopCategory[]>(initialCategories);
  const [quick, setQuick] = useState<Product | null>(null);

  // Active state
  const initialCat = overrideCategorySlug || "All Products";
  const [cat, setCat] = useState<string>(initialCat);
  const [q, setQ] = useState<string>(search.q || "");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "newest" | "rating">(
    search.sort || "popular",
  );
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const applyFilters = () => {
    // Note: Filters state is updated via Sheet/Drawer. 
    // In a real app we would refetch or filter the products list here.
  };

  // Sync state if props change (unlikely in TanStack Start unless navigation occurs, but good practice)
  useEffect(() => {
    setProducts(normalizedInitialProducts);
  }, [normalizedInitialProducts]);
  
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Sync state with URL params
  useEffect(() => {
    if (overrideCategorySlug) {
      setCat(overrideCategorySlug);
    } else {
      setCat("All Products");
    }
    if (search.q !== undefined) setQ(search.q || "");
    if (search.sort !== undefined) setSort(search.sort || "popular");
  }, [overrideCategorySlug, search.q, search.sort]);

  const updateUrlWithoutScrolling = useCallback(
    (newSort: typeof sort, newQ: string) => {
      navigate({
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          sort: newSort !== "popular" ? newSort : undefined,
          q: newQ.trim() || undefined,
        }),
        replace: true,
      } as any);
    },
    [navigate],
  );

  const handleSelectCategory = (newCatName: string) => {
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const isAll = slug === "all-products" || slug === "all" || !slug;
    
    navigate({
      to: isAll ? "/shop" : `/shop/${slug}`,
      search: (prev: any) => ({ ...prev }),
    });

    setTimeout(() => {
      const el = document.getElementById("products-grid");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 40);
  };

  const handleSortChange = (newSort: typeof sort) => {
    setSort(newSort);
    updateUrlWithoutScrolling(newSort, q);
  };

  // Filtered and sorted products array
  const filtered = useMemo(() => {
    let list = [...products];

    // Category filter
    let activeCat = overrideCategorySlug || cat;
    if (activeCat !== "All Products" && activeCat !== "All" && activeCat !== "all" && activeCat !== "all-products") {
      const catLower = activeCat.toLowerCase().trim();
      
      // Match either the category slug or name
      const matchedCatDef = categories.find(c => c.slug.toLowerCase() === catLower || c.name.toLowerCase() === catLower)
        || DEFAULT_SHOP_CATEGORIES.find(c => c.slug.toLowerCase() === catLower || c.name.toLowerCase() === catLower);

      if (matchedCatDef) {
        list = list.filter((p) => {
          const pCat = p.category ? p.category.toLowerCase().trim() : "";
          return pCat === matchedCatDef.slug.toLowerCase() || pCat === matchedCatDef.name.toLowerCase();
        });
      } else {
        // Fallback exact match on product category string if definition isn't found
        list = list.filter((p) => {
          const pCat = p.category ? p.category.toLowerCase().trim() : "";
          return pCat === catLower;
        });
      }
    }

    // Search query filter
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter((p) =>
        [
          p.name,
          p.tagline,
          p.description,
          p.flora ?? "",
          p.category,
          ...(p.benefits ?? []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }

    // Sort
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
        break;
      case "newest":
        list.sort((a, b) => (b.badge === "NEW" ? 1 : 0) - (a.badge === "NEW" ? 1 : 0));
        break;
      default:
        list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }
    return list;
  }, [cat, q, sort, products]);

  const [visibleCount, setVisibleCount] = useState(12);

  // Analytics tracking
  useEffect(() => {
    track("view_item_list", {
      item_list_name: cat,
      items: filtered.slice(0, 20).map((p) => toItem(p)),
    });
  }, [cat, filtered]);

  // 5 Discover By Shop photographic cards matching reference image
  const shopCollections = [
    {
      title: "Pure Honey",
      img: prodMultifloraImg,
      filterName: "Single Flora",
    },
    {
      title: "Bee Essentials",
      img: prodHoneycombImg,
      filterName: "Honey Comb",
    },
    {
      title: "Gift & Celebrate",
      img: prodGiftpackImg,
      filterName: "Gift Packs",
    },
    {
      title: "Bulk & Wholesale",
      img: honeycombBeesImg,
      filterName: "Raw Honey",
    },
    {
      title: "All Products",
      img: heroProductsImg,
      filterName: "All Products",
    },
  ];

  return (
    <SiteLayout>
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
        ])}
      />

      {/* =========================================================================
          2. SHOP HERO (3-Slide Carousel, 1920x600 proportion)
         ========================================================================= */}
      {!overrideCategorySlug ? (
        <PageHeroSlider page="shop" />
      ) : (
        <section className="relative bg-cream-deep/40 py-16 sm:py-24 overflow-hidden">
          <div className="container-page relative z-10 text-center flex flex-col items-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso font-medium mb-4">
              {categories.find(c => c.slug === overrideCategorySlug)?.name || overrideCategorySlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            </h1>
          </div>
        </section>
      )}

      {/* (Old ShopCategorySection removed in favor of the Premium Nav below) */}


      {/* =========================================================================
          4. SHOP BY CATEGORY (Only show on main /shop route)
         ========================================================================= */}
      {!overrideCategorySlug && (
        <section className="bg-cream pt-10 sm:pt-12 pb-10">
        <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-2 sm:mb-4">FROM THE HIVE</div>
            <h1 className="font-serif text-[28px] sm:text-[36px] text-espresso font-[500]">Shop by Category</h1>
            <p className="text-espresso/70 text-[15px] max-w-2xl mt-2 text-center">Explore our pure, authentic honey and bee-crafted essentials.</p>
          </div>
          <div className="w-full max-w-[1250px] mx-auto overflow-hidden md:overflow-visible" ref={emblaRef}>
            <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center items-start gap-4 sm:gap-6 *:shrink-0 *:w-[140px] *:aspect-square md:*:w-[280px] md:*:h-[280px] pb-4 md:pb-0 touch-pan-y cursor-grab active:cursor-grabbing md:cursor-auto md:touch-auto">
            {[
              categories.find((c) => c.slug === "all-products" || c.name.toLowerCase() === "all products") || 
              { slug: "all-products", name: "All Products", image_url: heroProductsImg, hasCustomImage: false },
              ...categories.filter((c) => c.slug !== "all-products" && c.name.toLowerCase() !== "all products")
            ].map((c) => c.slug === "all-products" || c.name.toLowerCase() === "all products" ? (
              <Link
                key={c.slug}
                to="/shop"
                className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 aspect-square snap-start"
              >
                <img
                  src={c.image_url || undefined}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(event) => {
                    console.error("[CATEGORY IMAGE FAILED]", { slug: c.slug, name: c.name, src: event.currentTarget.src });
                  }}
                />
              </Link>
            ) : (
              <Link
                key={c.slug}
                to="/shop/$slug"
                params={{ slug: c.slug }}
                className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 aspect-square snap-start"
              >
                <img
                  src={c.image_url || undefined}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(event) => {
                    console.error("[CATEGORY IMAGE FAILED]", { slug: c.slug, name: c.name, src: event.currentTarget.src });
                  }}
                />
              </Link>
            ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* =========================================================================
          PROMOTIONAL MARQUEE
         ========================================================================= */}
      <div className="w-full bg-announcement py-2.5 sm:py-3 overflow-hidden ticker-wrap border-y border-white/10">
        <div className="flex w-max items-center animate-ticker" style={{ animationDuration: '55s' }}>
          {[1, 2].map((group) => (
            <div key={group} className="flex items-center whitespace-nowrap text-white text-[13px] sm:text-[14px] font-medium tracking-wide">
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🍯 <span>Pure & Unfiltered Honey</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6"><span>From the Wildflowers of Saurashtra</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🐝 <span>Responsibly Harvested</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">✨ <span>100% Natural & Authentic</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🍯 <span>Multi Flora | Ajwain Flora | Fennel Flora</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🎁 <span>Perfect for Gifting</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🚚 <span>Free Delivery on Orders Above ₹400</span></span>
              <span className="text-white/40">•</span>
              {/* Duplicate inner blocks once more to ensure it fills ultra-wide screens smoothly without ending early */}
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🍯 <span>Pure & Unfiltered Honey</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6"><span>From the Wildflowers of Saurashtra</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🐝 <span>Responsibly Harvested</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">✨ <span>100% Natural & Authentic</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🍯 <span>Multi Flora | Ajwain Flora | Fennel Flora</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🎁 <span>Perfect for Gifting</span></span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-2 mx-4 sm:mx-6">🚚 <span>Free Delivery on Orders Above ₹400</span></span>
              <span className="text-white/40">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. FILTER + SORT TOOLBAR & PRODUCT GRID (#products-grid)
         ========================================================================= */}
      <section id="products-grid" className="py-10 sm:py-12 bg-cream relative overflow-hidden">
        
        {/* FULL-HEIGHT DECORATIVE ARTWORK - LEFT */}
        <div className="hidden xl:flex absolute top-16 bottom-0 lg:-left-20 xl:-left-10 2xl:left-4 w-[300px] xl:w-[350px] 2xl:w-[450px] flex-col gap-[700px] opacity-10 mix-blend-multiply pointer-events-none z-0 select-none overflow-visible">
          {[
            "/images/bg_illustrations/floral_alpha.png",
            "/images/heritage/illus_beekeeping.png",
            "/images/bg_illustrations/bees_alpha.png",
            "/images/heritage/illus_wildflower.png",
            "/images/bg_illustrations/floral_alpha.png",
            "/images/heritage/illus_beekeeping.png"
          ].map((src, i) => (
            <img key={`left-art-${i}`} src={src} alt="" className="w-full object-contain shrink-0" loading="lazy" />
          ))}
        </div>

        {/* FULL-HEIGHT DECORATIVE ARTWORK - RIGHT */}
        <div className="hidden xl:flex absolute top-64 bottom-0 lg:-right-20 xl:-right-10 2xl:right-4 w-[350px] xl:w-[400px] 2xl:w-[500px] flex-col gap-[700px] opacity-10 mix-blend-multiply pointer-events-none z-0 select-none overflow-visible">
          {[
            "/images/bg_illustrations/honeycomb_alpha.png",
            "/images/heritage/illus_hive_to_home.png",
            "/images/bg_illustrations/dipper_alpha.png",
            "/images/heritage/illus_pure.png",
            "/images/bg_illustrations/honeycomb_alpha.png",
            "/images/heritage/illus_hive_to_home.png"
          ].map((src, i) => (
            <img key={`right-art-${i}`} src={src} alt="" className="w-full object-contain shrink-0" loading="lazy" />
          ))}
        </div>

        <div className="container-page relative z-10">

          {/* Toolbar (Desktop & Mobile) - NO STICKY */}
          <div className="relative z-30 bg-cream py-4 mb-8 border-b sm:border-none border-border/80 flex flex-wrap items-center justify-between gap-4">
            
            <div className="hidden sm:block text-[15px] text-espresso/80 font-medium">
              Showing {filtered.length} products
            </div>
          </div>

          {/* Product Grid — 5 columns on desktop matching reference image */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-border/80 rounded-3xl p-16 text-center shadow-soft max-w-xl mx-auto my-12">
              <div className="text-5xl mb-4">🐝</div>
              <h3 className="font-serif text-2xl font-bold text-espresso">
                {overrideCategorySlug ? "No products found in this category." : "No honey matches your filter"}
              </h3>
              <p className="mt-2 text-sm text-espresso/70">
                {overrideCategorySlug ? "Please try checking back later or browse our other collections." : "Try selecting a different category or viewing all products."}
              </p>
              {overrideCategorySlug ? (
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 bg-brand-orange text-white px-7 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  <span>VIEW ALL PRODUCTS</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setCat("All Products");
                    setQ("");
                    updateUrlWithoutScrolling(sort, "");
                  }}
                  className="mt-6 inline-flex items-center gap-2 bg-brand-orange text-white px-7 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  <span>VIEW ALL PRODUCTS</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Unified Mobile & Desktop View */}
              <div
                className="grid gap-5 sm:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {filtered.slice(0, visibleCount).map((product, idx) => (
                  <div 
                    key={`${product.slug}-${cat}`}
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <ProductCard
                      p={product}
                      onQuickView={(p) => setQuick(p)}
                    />
                  </div>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="w-full flex justify-center mt-12 mb-4 relative z-20">
                  <button 
                    onClick={() => setVisibleCount(c => c + 12)} 
                    className="bg-cream border border-brand-orange text-brand-orange px-8 py-3 rounded-full font-bold text-sm hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          6. ILLUSTRATED BRAND SECTION
         ========================================================================= */}
      <section className="bg-cream py-16 md:py-24 overflow-hidden border-t border-border/40">
        <IllustratedBrandSection />
      </section>
      {/* QUICK VIEW MODAL */}
      <QuickView product={quick} onClose={() => setQuick(null)} />


    </SiteLayout>
  );
}
