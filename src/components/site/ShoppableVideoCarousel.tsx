import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight, Star } from "lucide-react";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import { fetchHomepageVideos, type HomepageVideoItem } from "@/lib/homepage-videos";
import { SectionEyebrow } from "@/components/site/Layout";

export type ShoppableVideoCarouselProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  category?: string;
  currentSlug?: string;
  placementContext?: "all" | "homepage" | "shop" | "pdp";
  className?: string;
};

type ShoppableVideoCardProps = {
  item: HomepageVideoItem;
  product?: Product;
  index: number;
  isVisible: boolean;
};

function ShoppableVideoCard({
  item,
  product,
  index,
  isVisible,
}: ShoppableVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVideoInView, setIsVideoInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Play video only when this specific card is within the viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsVideoInView(entry.isIntersecting && entry.intersectionRatio > 0.5);
      },
      { threshold: [0.5] }
    );

    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  // Handle play/pause based on viewport and tab visibility
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const playVideo = async () => {
      try {
        await vid.play();
      } catch (err) {
        // Autoplay may be blocked
      }
    };

    if (isVideoInView && !document.hidden) {
      void playVideo();
    } else {
      vid.pause();
    }

    const handleVisibility = () => {
      if (document.hidden) {
        vid.pause();
      } else if (isVideoInView) {
        void playVideo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isVideoInView]);

  useEffect(() => {
    // Trigger mount animation
    const t = setTimeout(() => setHasLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toUrl = product ? `/product/${product.slug}` : item.link_url || "/shop";
  const displayTitle = item.title || product?.name || "Saurashtra Honey";
  const displaySubtitle = item.subtitle || product?.tagline || product?.category || "";

  // The required Custom transition
  const customBezier = "cubic-bezier(0.22, 1, 0.36, 1)";
  const customDuration = "350ms";

  return (
    <div
      ref={cardRef}
      className={`group relative shrink-0 flex flex-col snap-center sm:snap-start
        w-[70vw] sm:w-[calc(50vw-24px)] md:w-[calc(33.33vw-24px)] lg:w-[calc(20vw-24px)] xl:w-[280px]
        aspect-[9/16]
        rounded-[24px] overflow-hidden cursor-pointer
        shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)]
        transition-all will-change-transform bg-espresso
      `}
      style={{
        transitionDuration: customDuration,
        transitionTimingFunction: customBezier,
        transform: hasLoaded ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
        opacity: hasLoaded ? 1 : 0,
        transitionDelay: hasLoaded ? "0ms" : `${index * 40}ms`,
      }}
    >
      <Link to={toUrl as never} className="absolute inset-0 z-30 outline-none" aria-label={`View ${displayTitle}`} />

      {/* Hover scale effect wrapper for video */}
      <div 
        className="absolute inset-0 w-full h-full group-hover:scale-[1.03] origin-center"
        style={{ transition: `transform ${customDuration} ${customBezier}` }}
      >
        {item.video_url ? (
          <video
            ref={videoRef}
            src={item.video_url}
            poster={item.thumbnail_url || item.fallbackImage}
            preload="metadata"
            playsInline
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05]"
            style={{ transition: `transform ${customDuration} ${customBezier}` }}
          />
        ) : (
          <img loading="lazy"
            src={item.thumbnail_url || item.fallbackImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05]"
            style={{ transition: `transform ${customDuration} ${customBezier}` }}
          />
        )}
      </div>

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

      {/* BOTTOM OVERLAY INFO */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 z-20 flex items-center gap-2 sm:gap-3">
        {/* Left: Product Thumbnail */}
        {product && (
          <div className="shrink-0 size-10 sm:size-14 rounded-xl border border-white/20 bg-cream/10 backdrop-blur-md overflow-hidden shadow-sm">
            <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}
        
        {/* Center: Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center text-white">
          <h3 className="font-serif font-bold text-sm sm:text-base truncate drop-shadow-sm">
            {displayTitle}
          </h3>
          
          {product && (
            <div className="flex items-baseline gap-1.5 mt-0.5 drop-shadow-sm">
              <span className="font-bold text-sm">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[10px] sm:text-[11px] text-white/70 line-through">
                  ₹{product.mrp.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Circular arrow button */}
        <div className="shrink-0 size-8 sm:size-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-burnt-orange group-hover:border-burnt-orange transition-colors">
          <ArrowRight 
            className="size-4 sm:size-5 group-hover:translate-x-1" 
            style={{ transition: `transform ${customDuration} ${customBezier}` }} 
          />
        </div>
      </div>
    </div>
  );
}

export function ShoppableVideoCarousel({
  eyebrow = "FROM THE HIVE",
  title = "Stories from the Hive",
  subtitle = "Watch the journey behind every jar and discover how purity begins long before it reaches your home.",
  category,
  currentSlug,
  placementContext = "all",
  className,
}: ShoppableVideoCarouselProps) {
  const [videos, setVideos] = useState<HomepageVideoItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  useEffect(() => {
    let mounted = true;
    void Promise.all([fetchHomepageVideos(), fetchProducts()]).then(
      ([videoList, productList]) => {
        if (!mounted) return;
        if (productList.length > 0) setAllProducts(productList);
        setVideos(videoList);
      }
    );
    return () => {
      mounted = false;
    };
  }, []);

  const activeVideos = useMemo(() => {
    return videos.filter((v) => {
      if (!v.is_active || v.status !== "published") return false;
      if (
        placementContext !== "all" &&
        v.placement &&
        v.placement !== "all" &&
        v.placement !== placementContext
      ) {
        return false;
      }
      return true;
    });
  }, [videos, placementContext]);

  const sortedVideos = useMemo(() => {
    if (!category && !currentSlug) return activeVideos;

    const catLower = category?.toLowerCase() ?? "";
    const matchesCat = (v: HomepageVideoItem) => {
      if (!v.product_slug) return false;
      const prod = allProducts.find((p) => p.slug === v.product_slug);
      if (!prod) return false;
      return (
        prod.category?.toLowerCase() === catLower ||
        prod.flora?.toLowerCase() === catLower ||
        v.title.toLowerCase().includes(catLower) ||
        v.subtitle.toLowerCase().includes(catLower)
      );
    };

    return [...activeVideos].sort((a, b) => {
      const aIsCurrent = a.product_slug === currentSlug;
      const bIsCurrent = b.product_slug === currentSlug;
      if (aIsCurrent && !bIsCurrent) return 1;
      if (!aIsCurrent && bIsCurrent) return -1;

      const aMatch = matchesCat(a);
      const bMatch = matchesCat(b);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return (a.display_order ?? 0) - (b.display_order ?? 0);
    });
  }, [activeVideos, category, currentSlug, allProducts]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
          obs.disconnect(); // Only need to trigger entry animation once
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  const handleNextSlide = useCallback(() => {
    const track = carouselRef.current;
    if (track) {
      const cardWidth = track.children[0]?.clientWidth || 300;
      track.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
    }
  }, []);

  const handlePrevSlide = useCallback(() => {
    const track = carouselRef.current;
    if (track) {
      const cardWidth = track.children[0]?.clientWidth || 300;
      track.scrollBy({ left: -(cardWidth + 24), behavior: "smooth" });
    }
  }, []);

  // Mouse drag functionality for desktop
  const onMouseDown = (e: React.MouseEvent) => {
    const track = carouselRef.current;
    if (!track) return;
    isDown = true;
    track.classList.add('cursor-grabbing');
    track.classList.remove('snap-mandatory');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  };
  
  const onMouseLeave = () => {
    const track = carouselRef.current;
    if (!track) return;
    isDown = false;
    track.classList.remove('cursor-grabbing');
    track.classList.add('snap-mandatory');
  };
  
  const onMouseUp = () => {
    const track = carouselRef.current;
    if (!track) return;
    isDown = false;
    track.classList.remove('cursor-grabbing');
    track.classList.add('snap-mandatory');
  };
  
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const track = carouselRef.current;
    if (!track) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 2; 
    track.scrollLeft = scrollLeft - walk;
  };

  if (sortedVideos.length === 0) return null;

  return (
    <section ref={sectionRef} className={`py-12 md:py-20 bg-[#F8F5EF] overflow-hidden ${className ?? ""}`}>
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-[70px]">
          <div className="text-[12px] uppercase tracking-[6px] text-[#D97706] font-[600] mb-2 sm:mb-4">
            {eyebrow}
          </div>
          <h2 className="font-serif text-[34px] md:text-[44px] lg:text-[56px] font-[500] text-[#2B2118] leading-tight mb-[20px]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[17px] md:text-[21px] text-[#6B6257] max-w-[700px] leading-[1.7] mb-[36px]">
              {subtitle}
            </p>
          )}

        </div>

        {/* Carousel Track */}
        <div className="relative group">
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="absolute left-2 sm:-left-6 top-[40%] -translate-y-1/2 z-20 size-12 rounded-full border border-border/80 bg-white hover:bg-cream-deep hover:border-burnt-orange text-espresso flex items-center justify-center transition-all shadow-sm hover:scale-105 opacity-0 group-hover:opacity-100 hidden sm:flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="absolute right-2 sm:-right-6 top-[40%] -translate-y-1/2 z-20 size-12 rounded-full border border-border/80 bg-white hover:bg-cream-deep hover:border-burnt-orange text-espresso flex items-center justify-center transition-all shadow-sm hover:scale-105 opacity-0 group-hover:opacity-100 hidden sm:flex"
          >
            <ChevronRight className="size-5" />
          </button>
        <div
          ref={carouselRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-10 pt-4 px-[15vw] sm:px-0 -mx-4 sm:mx-0 cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: 'smooth' }}
        >
          {sortedVideos.map((item, idx) => (
            <ShoppableVideoCard
              key={item.id}
              item={item}
              product={allProducts.find((p) => p.slug === item.product_slug)}
              index={idx}
              isVisible={isSectionVisible}
            />
          ))}
          {/* Duplicate cards for infinite loop effect optionally, but CSS snap + momentum is smoother natively. For clean code, native scroll is used. */}
        </div>
        </div>
      </div>
    </section>
  );
}
