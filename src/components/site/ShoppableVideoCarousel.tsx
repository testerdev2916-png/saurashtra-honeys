import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link, useSearch, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight, Star } from "lucide-react";
import { type Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-catalog";
import { fetchHomepageVideos, type HomepageVideoItem } from "@/lib/homepage-videos";
import { SectionEyebrow } from "@/components/site/Layout";
import { ShoppableReelViewer } from "./ShoppableReelViewer";

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
  uniqueId: string;
  className?: string;
};

function ShoppableVideoCard({
  item,
  product,
  index,
  isVisible,
  uniqueId,
  className,
}: ShoppableVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const formatDuration = (sec: number) => {
    if (!sec || isNaN(sec) || !isFinite(sec)) return "";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Handle mute global event
  useEffect(() => {
    const handleGlobalMute = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.id !== uniqueId) {
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
      }
    };
    window.addEventListener('shoppable-video-mute-others', handleGlobalMute);
    return () => window.removeEventListener('shoppable-video-mute-others', handleGlobalMute);
  }, [uniqueId]);

  // Attempt to play when visible
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(e => console.error("Autoplay prevented:", e));
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  useEffect(() => {
    // Trigger mount animation
    const t = setTimeout(() => setHasLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isMuted) {
      setIsMuted(false);
      window.dispatchEvent(new CustomEvent("shoppable-video-mute-others", { detail: { id: uniqueId } }));
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(console.error);
      }
    } else {
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
  };

  const displayTitle = item.title || product?.name || "Saurashtra Honey";
  const displaySubtitle = item.subtitle || product?.tagline || product?.category || "";

  // The required Custom transition
  const customBezier = "cubic-bezier(0.22, 1, 0.36, 1)";
  const customDuration = "350ms";

  return (
    <div
      ref={cardRef}
      data-card-id={uniqueId}
      className={`shoppable-video-card group relative shrink-0 flex flex-col snap-center sm:snap-start
        ${className || "w-[70vw] sm:w-[calc(50vw-24px)] md:w-[calc(33.33vw-24px)] lg:w-[calc(20vw-24px)] xl:w-[280px]"}
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
      {/* Mute/Unmute Interaction Layer */}
      <button
        type="button"
        onClick={handleVideoClick}
        className="absolute inset-0 z-10 w-full h-full cursor-pointer outline-none appearance-none bg-transparent border-none p-0 m-0"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      />

      {duration > 0 && (
        <div className="absolute top-3 right-3 z-40 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-white text-[11px] font-semibold tracking-wide pointer-events-none shadow-sm flex items-center gap-1.5">
          {!isMuted && (
            <div className="flex gap-[2px] h-[10px] items-end">
              <div className="w-[2px] bg-white/90 animate-[soundWave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.0s', height: '100%' }}></div>
              <div className="w-[2px] bg-white/90 animate-[soundWave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.2s', height: '60%' }}></div>
              <div className="w-[2px] bg-white/90 animate-[soundWave_1s_ease-in-out_infinite]" style={{ animationDelay: '0.4s', height: '80%' }}></div>
            </div>
          )}
          {formatDuration(duration)}
        </div>
      )}

      {/* Hover scale effect wrapper for video */}
      <div 
        className="absolute inset-0 w-full h-full group-hover:scale-[1.03] origin-center bg-[#2B2118]"
        style={{ transition: `transform ${customDuration} ${customBezier}` }}
      >
        {item.video_url ? (
          <video
            ref={videoRef}
            src={item.video_url}
            poster={item.thumbnail_url || item.fallbackImage || undefined}
            autoPlay
            playsInline
            muted={isMuted}
            loop
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
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

      {/* FLOATING PRODUCT CARD */}
      {product && (
        <Link 
          to="."
          search={((prev: any) => ({ ...prev, reel: item.id })) as any}
          className="absolute z-20 w-[76%] left-1/2 -translate-x-1/2 bottom-[5%] rounded-[16px] sm:rounded-[18px] bg-white/60 backdrop-blur-[16px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)] p-2.5 sm:p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-white/70 transition-colors"
        >
          <div className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] bg-white/60 border border-white/60 flex items-center justify-center mb-1.5 shadow-sm shrink-0 rounded-sm">
             <img loading="lazy" src={product.image} alt={product.name} className="w-full h-full object-contain p-0.5" />
          </div>
          <h3 className="font-semibold text-black text-center text-[12px] sm:text-[13px] leading-tight mb-0.5 px-1">
            {displayTitle}
          </h3>
          <div className="text-black font-bold text-[12px] sm:text-[13px]">
            {product.priceMax ? (
              <>₹{product.price.toLocaleString("en-IN")} - ₹{product.priceMax.toLocaleString("en-IN")}</>
            ) : (
              <>
                ₹{product.price.toLocaleString("en-IN")}
                {product.mrp && product.mrp > product.price && (
                  <span className="text-black/60 line-through font-medium ml-1 text-[11px]">
                    ₹{product.mrp.toLocaleString("en-IN")}
                  </span>
                )}
              </>
            )}
          </div>
        </Link>
      )}
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: 60,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const [videos, setVideos] = useState<HomepageVideoItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  const search = useSearch({ strict: false }) as any;
  const navigate = useNavigate({ strict: false } as any) as any;
  const activeReelId = search?.reel;

  const handleCloseViewer = useCallback(() => {
    navigate({ search: ((prev: any) => { const { reel, ...rest } = prev; return rest; }) as any, replace: true });
  }, [navigate]);

  const sectionRef = useRef<HTMLElement>(null);

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

  // IntersectionObserver to detect when carousel is near viewport
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
      { rootMargin: "600px" } // trigger visibility slightly before it enters viewport
    );

    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

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

      </div>

      {/* MOBILE VIEW (Exactly 2 cards, arrows, swipeable) */}
      <div className="block md:hidden container-page pb-10">
        <div className="relative w-full">
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-[8px] sm:left-[10px] top-1/2 -translate-y-1/2 z-20 w-[36px] h-[36px] rounded-full bg-white/95 border-none shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#2B2118] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-[8px] sm:right-[10px] top-1/2 -translate-y-1/2 z-20 w-[36px] h-[36px] rounded-full bg-white/95 border-none shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#2B2118] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="overflow-hidden w-full relative" ref={emblaRef}>
            <div className="flex gap-[12px] touch-pan-y cursor-grab active:cursor-grabbing">
              {sortedVideos.map((item, idx) => (
                <div key={`mob-${item.id}-${idx}`} className="flex-[0_0_calc(50%_-_6px)] min-w-0 pb-6">
                  <ShoppableVideoCard
                    item={item}
                    product={allProducts.find((p) => p.slug === item.product_slug)}
                    index={idx}
                    isVisible={isSectionVisible}
                    uniqueId={`mob-${item.id}-${idx}`}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Stats below Video Carousel */}
        <div className="grid grid-cols-2 gap-[12px] w-full mt-[12px]">
          <div className="p-3 sm:p-4 rounded-[16px] bg-white border border-black/5 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="font-serif text-xl font-bold text-[#D97706] mb-1">
              15+ Years
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-[#2B2118]/80 leading-snug">
              Beekeeping<br/>Experience
            </div>
          </div>
          <div className="p-3 sm:p-4 rounded-[16px] bg-white border border-black/5 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="font-serif text-xl font-bold text-[#D97706] mb-1">
              2000+
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-[#2B2118]/80 leading-snug">
              Happy Customers<br/>Across India
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW (Full-width Carousel Track Marquee) */}
      <div className="hidden md:flex w-full overflow-hidden ticker-wrap pb-10 pt-4">
        <div 
          className="flex w-max animate-ticker hover:[animation-play-state:paused]"
          style={{ animationDuration: '600s' }}
        >
          {/* First set of duplicated videos */}
          <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
            {[...sortedVideos, ...sortedVideos, ...sortedVideos].map((item, idx) => (
              <ShoppableVideoCard
                key={`set1-${item.id}-${idx}`}
                item={item}
                product={allProducts.find((p) => p.slug === item.product_slug)}
                index={idx}
                isVisible={isSectionVisible}
                uniqueId={`set1-${item.id}-${idx}`}
              />
            ))}
          </div>
          {/* Second identical set for seamless looping */}
          <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
            {[...sortedVideos, ...sortedVideos, ...sortedVideos].map((item, idx) => (
              <ShoppableVideoCard
                key={`set2-${item.id}-${idx}`}
                item={item}
                product={allProducts.find((p) => p.slug === item.product_slug)}
                index={idx}
                isVisible={isSectionVisible}
                uniqueId={`set2-${item.id}-${idx}`}
              />
            ))}
          </div>
        </div>
      </div>

      {activeReelId && sortedVideos.length > 0 && (
        <ShoppableReelViewer 
          videos={sortedVideos}
          allProducts={allProducts}
          initialReelId={activeReelId}
          onClose={handleCloseViewer}
        />
      )}
    </section>
  );
}
