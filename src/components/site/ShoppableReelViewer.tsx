import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Heart, Share2, ShoppingBag, Volume2, VolumeX, Play, ExternalLink, ChevronDown } from "lucide-react";
import type { HomepageVideoItem } from "@/lib/homepage-videos";
import type { Product } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

interface ShoppableReelViewerProps {
  videos: HomepageVideoItem[];
  allProducts: Product[];
  initialReelId: string;
  onClose: () => void;
}

export function ShoppableReelViewer({ videos, allProducts, initialReelId, onClose }: ShoppableReelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [activeReelId, setActiveReelId] = useState<string>(initialReelId);
  const navigate = useNavigate();

  // Handle ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Update URL silently when active reel changes
  useEffect(() => {
    if (activeReelId) {
      navigate({ search: { reel: activeReelId } as any, replace: true } as any);
    }
  }, [activeReelId, navigate]);

  // Scroll to initial index on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const initialIndex = videos.findIndex(v => v.id === initialReelId);
    if (initialIndex >= 0) {
      setTimeout(() => {
        if (containerRef.current) {
          const vh = containerRef.current.clientHeight;
          containerRef.current.scrollTo({ top: initialIndex * vh, behavior: 'instant' });
        }
      }, 50);
    }
  }, [initialReelId, videos]);

  // Desktop wheel navigation (throttle)
  const isWheeling = useRef(false);
  const handleWheel = (e: React.WheelEvent) => {
    if (window.innerWidth < 768) return; // Only custom logic on desktop
    e.preventDefault();
    if (isWheeling.current) return;
    
    if (e.deltaY > 50) {
      // scroll down -> next reel
      const currentIndex = videos.findIndex(v => v.id === activeReelId);
      if (currentIndex < videos.length - 1) {
        scrollToIndex(currentIndex + 1);
      }
    } else if (e.deltaY < -50) {
      // scroll up -> prev reel
      const currentIndex = videos.findIndex(v => v.id === activeReelId);
      if (currentIndex > 0) {
        scrollToIndex(currentIndex - 1);
      }
    }
  };

  const scrollToIndex = (idx: number) => {
    if (!containerRef.current) return;
    isWheeling.current = true;
    const vh = containerRef.current.clientHeight;
    containerRef.current.scrollTo({ top: idx * vh, behavior: 'smooth' });
    setTimeout(() => { isWheeling.current = false; }, 600); // block wheel for 600ms
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-[60] size-12 rounded-full bg-black/20 text-white hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors shadow-lg"
      >
        <X className="size-6" />
      </button>

      {/* Main Snap Container */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        className="w-full h-full max-w-7xl mx-auto overflow-y-auto overflow-x-hidden snap-y snap-mandatory no-scrollbar md:p-8 flex flex-col"
        style={{ height: '100dvh' }}
      >
        {videos.map((item, idx) => (
          <ReelSection 
            key={item.id} 
            item={item} 
            index={idx}
            product={allProducts.find(p => p.slug === item.product_slug)}
            isActive={item.id === activeReelId}
            setActiveReelId={setActiveReelId}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}

interface ReelSectionProps {
  item: HomepageVideoItem;
  index: number;
  product?: Product;
  isActive: boolean;
  setActiveReelId: (id: string) => void;
  isMuted: boolean;
  setIsMuted: (b: boolean) => void;
  onClose: () => void;
}

function ReelSection({ item, index, product, isActive, setActiveReelId, isMuted, setIsMuted, onClose }: ReelSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFailed, setIsFailed] = useState(false);

  // Intersection observer to set active ID
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        setActiveReelId(item.id);
      }
    }, { threshold: [0.6] });

    obs.observe(el);
    return () => obs.disconnect();
  }, [item.id, setActiveReelId]);

  // Handle play/pause based on isActive
  useEffect(() => {
    if (isActive && !isFailed) {
      setIsPlaying(true);
      videoRef.current?.play().catch(() => {
        // Autoplay policy might block or video error
      });
    } else {
      setIsPlaying(false);
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0; // Reset
    }
  }, [isActive, isFailed]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const c = videoRef.current.currentTime;
    const d = videoRef.current.duration;
    if (d > 0) {
      setCurrentTime(c);
      setProgress((c / d) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (Number(e.target.value) / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(Number(e.target.value));
  };

  const togglePlay = () => {
    if (!videoRef.current || isFailed) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const isLiked = product ? has(product.slug) : false;

  const handleShare = async () => {
    const url = window.location.origin + window.location.pathname + "?reel=" + item.id;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.subtitle,
          url: url
        });
      } catch (err) {
        // user cancelled or error
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!"); 
    }
  };

  const handleAddToCart = () => {
    if (product) {
      add(product, product.sizes?.[0] || "", 1);
    }
  };

  return (
    <div 
      ref={sectionRef}
      className="shrink-0 w-full snap-start snap-always relative flex items-center justify-center md:h-[calc(100dvh-64px)] h-[100dvh]"
    >
      {/* Desktop / Mobile structural split */}
      <div className="w-full h-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12 bg-transparent">
        
        {/* Left: Video Container (9:16) */}
        <div 
          className="relative w-full h-[100dvh] md:h-[80vh] md:w-auto md:aspect-[9/16] bg-espresso md:rounded-[32px] overflow-hidden shadow-2xl flex-shrink-0 flex items-center justify-center group"
          onClick={togglePlay}
        >
          {item.video_url && !isFailed ? (
            <video
              ref={videoRef}
              src={item.video_url}
              poster={item.thumbnail_url || item.fallbackImage}
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onError={() => setIsFailed(true)}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <img src={item.thumbnail_url || item.fallbackImage} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white bg-black/50 px-4 py-2 rounded-lg font-medium backdrop-blur-md">Video Unavailable</span>
              </div>
            </div>
          )}

          {/* Desktop Progress Bar */}
          <div className="absolute bottom-4 left-4 right-4 hidden md:block z-30 px-4 bg-black/40 backdrop-blur-md rounded-xl py-2">
            <ReelProgressBar progress={progress} currentTime={currentTime} duration={duration} onSeek={handleSeek} />
          </div>

          {/* Vertical Interaction Controls (Inside Video) */}
          <div className="absolute right-4 md:right-5 bottom-[90px] md:bottom-[72px] z-40 flex flex-col gap-3 pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); if(product) toggle(product.slug); }} 
              className="size-[36px] rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-transform hover:bg-black/50 active:scale-95 group outline-none"
              aria-label="Like"
            >
              <Heart className={`size-[18px] transition-colors ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleShare(); }} 
              className="size-[36px] rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-transform hover:bg-black/50 active:scale-95 group outline-none"
              aria-label="Share"
            >
              <Share2 className="size-[18px] text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              className="size-[36px] rounded-full bg-black/30 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-transform hover:bg-black/50 active:scale-95 group outline-none"
              aria-label="Toggle sound"
            >
              {isMuted ? <VolumeX className="size-[18px] text-white" /> : <Volume2 className="size-[18px] text-white" />}
            </button>
          </div>

          {/* Play/Pause indicator */}
          {!isPlaying && isActive && !isFailed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/20 transition-all">
              <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-110 shadow-xl">
                <Play className="size-8 text-white fill-white translate-x-1" />
              </div>
            </div>
          )}

          {/* Mobile UI Overlay (only visible < md) */}
          <div className="absolute inset-0 pointer-events-none md:hidden flex flex-col justify-end p-4 pb-[8vh] bg-gradient-to-t from-black/80 via-black/10 to-transparent z-20">


            {/* Mobile Product Bottom Sheet Info */}
            <div className="w-full pr-[70px] pointer-events-auto relative z-30 flex flex-col gap-1.5">
              <div className="w-full mb-3">
                <ReelProgressBar progress={progress} currentTime={currentTime} duration={duration} onSeek={handleSeek} />
              </div>
              <h2 className="text-white font-serif font-bold text-[22px] leading-tight drop-shadow-md">
                {product ? product.name : item.title}
              </h2>
              <p className="text-white/95 text-[14px] line-clamp-2 drop-shadow leading-snug font-medium mb-1">
                {product ? (product.description || "Description coming soon.") : item.subtitle}
              </p>
              
              {product ? (
                <div className="mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] p-2.5 flex items-center gap-3 w-full shadow-lg">
                  <div className="size-[48px] rounded-[14px] overflow-hidden bg-white/10 shrink-0 border border-white/10">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-white font-semibold text-[13px] leading-tight truncate drop-shadow-sm">{product.name}</h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-white font-bold text-[14px] drop-shadow-sm">₹{product.price.toLocaleString("en-IN")}</span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-white/70 text-[11px] line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                    className="shrink-0 bg-burnt-orange text-white px-4 py-2.5 rounded-[12px] text-[13px] font-bold shadow-md active:scale-95 transition-transform tracking-wide"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-white/80 text-[12px] font-bold uppercase tracking-wider drop-shadow-sm">About this Reel</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Desktop Details Panel (Hidden < md) */}
        <div className="hidden md:flex flex-col w-[420px] h-full max-h-[80vh] justify-center gap-8 pl-4 py-8">
          <div className="space-y-4">
            {(product?.category || item.badge) && (
              <div className="text-burnt-orange font-bold tracking-[0.2em] text-[11px] uppercase">
                {product ? product.category : item.badge}
              </div>
            )}
            <h2 className="text-5xl font-serif text-white leading-tight font-medium">
              {product ? product.name : item.title}
            </h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              {product ? (product.description || "Description coming soon.") : item.subtitle}
            </p>
          </div>



          {/* Desktop Product Card */}
          {product ? (
            <div className="bg-white rounded-[32px] p-7 shadow-2xl space-y-6 transform transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.3)]">
              <div className="flex gap-5">
                <div className="size-[100px] rounded-[24px] overflow-hidden bg-[#F8F5EF] shrink-0 border border-black/5 shadow-inner">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-serif font-bold text-2xl text-espresso line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="font-bold text-2xl text-burnt-orange">₹{product.price.toLocaleString("en-IN")}</span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-sm text-muted-foreground line-through font-medium">₹{product.mrp.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="w-full h-14 rounded-[16px] bg-[#253C27] text-white font-bold text-[13px] tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:bg-[#1A2D1B] active:scale-[0.98] transition-all shadow-lg"
                >
                  <ShoppingBag className="size-[18px]" /> Add to Cart
                </button>
                <Link 
                  to={`/product/${product.slug}` as any}
                  onClick={onClose}
                  className="w-full h-[52px] rounded-[16px] border border-black/10 text-espresso font-semibold text-[13px] tracking-wide flex items-center justify-center gap-2 hover:bg-black/5 active:scale-[0.98] transition-all"
                >
                  View Product Details <ExternalLink className="size-[18px]" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 shadow-2xl">
              <h3 className="font-serif font-bold text-2xl text-white">About this Reel</h3>
              <p className="text-white/80 mt-3 text-sm leading-relaxed font-medium">Enjoy this glimpse into our apiaries and the journey of pure Saurashtra Honey.</p>
            </div>
          )}

          <div className="mt-auto text-white/50 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 pt-4">
            Scroll for more <ChevronDown className="size-4 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "--:--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function ReelProgressBar({ progress, currentTime, duration, onSeek }: { progress: number, currentTime: number, duration: number, onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="w-full flex items-center gap-3 text-white pointer-events-auto" onClick={(e) => e.stopPropagation()}>
      <span className="text-[11px] font-medium font-mono drop-shadow-md w-10 text-right">{formatTime(currentTime)}</span>
      
      <div className="relative flex-1 h-4 flex items-center group cursor-pointer">
        {/* The range input overlay */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="0.1"
          value={isNaN(progress) ? 0 : progress} 
          onChange={onSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        {/* Track */}
        <div className="absolute left-0 right-0 h-[3px] bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
        </div>
        {/* Thumb */}
        <div 
          className="absolute h-3 w-3 bg-white rounded-full shadow-md z-10 transition-all duration-75 ease-linear transform -translate-x-1/2 group-hover:scale-125"
          style={{ left: `${progress}%` }}
        />
      </div>
      
      <span className="text-[11px] font-medium font-mono drop-shadow-md w-10">{formatTime(duration)}</span>
    </div>
  );
}
