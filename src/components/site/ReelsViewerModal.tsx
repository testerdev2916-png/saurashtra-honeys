import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Volume2, VolumeX, Star, CheckCircle2, Heart, Share, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/wishlist";

type Story = {
  id: string;
  type: "video" | "photo" | "review";
  customer_name: string;
  customer_city?: string | null;
  customer_state?: string | null;
  media_url?: string | null;
  poster_image?: string | null;
  review_text?: string | null;
  rating: number;
  product_slug?: string | null;
  product_name?: string | null;
  verified?: boolean;
};

interface ReelsViewerModalProps {
  stories: Story[];
  products?: any[];
  initialIndex: number;
  onClose: () => void;
}

export function ReelsViewerModal({
  stories,
  products = [],
  initialIndex,
  onClose,
}: ReelsViewerModalProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    startIndex: initialIndex,
    align: "start",
    loop: false,
    dragFree: false,
    containScroll: false,
  });

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showReviewsPanel, setShowReviewsPanel] = useState(false);

  const auth = useAuth();
  const wishlist = useWishlist();
  const navigate = useNavigate();

  const handleLike = async (story: Story) => {
    if (!story.product_slug) {
      // Optional: a subtle toast could be used, but alert works for now.
      return;
    }
    if (!auth.user) {
      onClose(); // close modal to go to auth
      navigate({ to: "/auth" });
      return;
    }
    await wishlist.toggle(story.product_slug);
  };

  const handleShare = async (story: Story) => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Saurashtra Honey - ${story.customer_name}'s Review`,
          url: url,
        });
      } catch (err) {
        // user cancelled or error
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  // Sync active index when swiping
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selected = emblaApi.selectedScrollSnap();
    setActiveIndex(selected);
    setIsPlaying(true); // Auto-play when swiped to
    setShowReviewsPanel(false); // Close review panel when swiping to another video
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Handle video play/pause side effects based on active slide change
  useEffect(() => {
    stories.forEach((story, index) => {
      const videoEl = document.getElementById(`reel-video-${story.id}`) as HTMLVideoElement;
      if (videoEl) {
        if (index === activeIndex) {
          // Only enforce play/pause here. Mute state should ideally persist 
          // or be explicitly applied during swipe if needed.
          if (isPlaying) {
            videoEl.muted = isMuted; // Try to retain user preference on swipe
            const playPromise = videoEl.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.warn("Reel video autoplay prevented on swipe:", err);
                // If it fails (likely due to unmuted autoplay), try muted
                if (!videoEl.muted) {
                  videoEl.muted = true;
                  setIsMuted(true);
                  videoEl.play().catch(() => {});
                }
              });
            }
          } else {
            videoEl.pause();
          }
        } else {
          // Reset other videos
          videoEl.pause();
          videoEl.currentTime = 0;
        }
      }
    });
  }, [activeIndex, isPlaying, stories]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a]/95 backdrop-blur-sm w-full h-full sm:flex sm:items-center sm:justify-center">
      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-end items-center p-4 sm:p-6 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/20"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation - Prev */}
      <div className="hidden sm:flex absolute left-8 lg:left-16 inset-y-0 items-center z-50">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all shadow-xl"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      {/* Desktop Navigation - Next */}
      <div className="hidden sm:flex absolute right-8 lg:right-16 inset-y-0 items-center z-50">
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all shadow-xl"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Vertical Carousel Container */}
      <div
        className="overflow-hidden w-full h-[100dvh] sm:w-auto sm:h-[85vh] sm:aspect-[9/16] sm:rounded-[24px] sm:border sm:border-white/10 relative bg-black shadow-2xl"
        ref={emblaRef}
      >
        <div className="flex flex-col h-full">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="flex-[0_0_100%] h-full w-full relative"
            >
              {/* Video Element */}
              <div 
                className="w-full h-full bg-black relative"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <video
                  id={`reel-video-${story.id}`}
                  className="w-full h-full object-cover"
                  src={story.media_url || ""}
                  poster={story.poster_image || ""}
                  playsInline
                  loop
                  muted={isMuted}
                />

                {/* Mute Toggle associated directly with this video */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newMuted = !isMuted;
                    
                    const videoEl = document.getElementById(`reel-video-${story.id}`) as HTMLVideoElement;
                    if (videoEl) {
                      videoEl.muted = newMuted;
                      if (!newMuted) {
                        videoEl.volume = 1;
                      }

                      console.log("=== TESTIMONIAL AUDIO DEBUG ===");
                      console.log("currentSrc:", videoEl.currentSrc);
                      console.log("muted:", videoEl.muted);
                      console.log("defaultMuted:", videoEl.defaultMuted);
                      console.log("volume:", videoEl.volume);
                      console.log("paused:", videoEl.paused);
                      console.log("readyState:", videoEl.readyState);
                      console.log("networkState:", videoEl.networkState);
                      console.log("error:", videoEl.error);
                      
                      const audioTracks = (videoEl as any).audioTracks;
                      console.log("audio track present:", audioTracks ? audioTracks.length > 0 : 'unknown API');
                      console.log("navigator.userAgent:", navigator.userAgent);

                      // Ensure it's playing
                      if (videoEl.paused) {
                        const playPromise = videoEl.play();
                        if (playPromise !== undefined) {
                          playPromise.then(() => {
                            console.log("play promise result: resolved successfully");
                          }).catch(err => {
                            console.error("play promise result: rejected", err);
                          });
                        }
                      }
                      
                      setIsMuted(videoEl.muted); // Update UI to match actual DOM state
                    }
                  }}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-[44px] sm:h-[44px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/20 z-40 pointer-events-auto shadow-md"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                {/* Play/Pause indicator overlay (optional, subtle) */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                      <div className="w-5 h-5 bg-white ml-1" style={{ clipPath: "polygon(0 0, 0 100%, 100% 50%)" }} />
                    </div>
                  </div>
                )}
                
                {/* Gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Right Side Action Rail */}
              <div className="absolute right-0 bottom-24 sm:bottom-32 p-4 flex flex-col items-center gap-6 z-30 pointer-events-auto drop-shadow-lg">
                
                {/* LIKE ACTION */}
                <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  handleLike(story);
                }}>
                  <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
                    <Heart 
                      className={`w-6 h-6 transition-colors ${
                        story.product_slug && wishlist.has(story.product_slug) 
                          ? "fill-red-500 text-red-500" 
                          : "text-white"
                      }`} 
                    />
                  </div>
                  <span className="text-white text-[12px] font-medium drop-shadow-md">Like</span>
                </div>

                {/* SHARE ACTION */}
                <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  handleShare(story);
                }}>
                  <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
                    <Share className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-[12px] font-medium drop-shadow-md">Share</span>
                </div>

                {/* REVIEWS ACTION */}
                <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  setShowReviewsPanel(true);
                }}>
                  <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white text-[12px] font-medium drop-shadow-md">Reviews</span>
                </div>
              </div>

              {/* Bottom Info Overlay */}
              <div className="absolute bottom-0 left-0 right-16 p-5 sm:p-6 pb-8 sm:pb-8 flex flex-col justify-end pointer-events-none z-20">
                
                {/* Product Thumbnail Only */}
                <div className="flex items-center gap-3 mb-2">
                  {story.product_slug && products && (
                    (() => {
                      const matchedProduct = products.find((p: any) => p.slug === story.product_slug);
                      const productImg = matchedProduct?.image_url || matchedProduct?.images?.[0];
                      if (matchedProduct && productImg) {
                        return (
                          <Link 
                            to={`/product/${matchedProduct.slug}` as any}
                            className="block w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-[12px] sm:rounded-2xl overflow-hidden border border-white/40 shadow-lg bg-white pointer-events-auto hover:scale-105 transition-transform"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Close modal when navigating
                              onClose();
                            }}
                          >
                            <img 
                              src={productImg} 
                              alt={matchedProduct.name} 
                              className="w-full h-full object-cover" 
                            />
                          </Link>
                        );
                      }
                      return null;
                    })()
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Panel */}
      {showReviewsPanel && (
        <div 
          className="absolute inset-0 z-[10000] sm:bg-black/40 transition-opacity"
          onClick={() => setShowReviewsPanel(false)}
        >
          {/* Mobile Bottom Sheet / Desktop Right Panel */}
          <div 
            className="absolute bottom-0 inset-x-0 h-[60vh] sm:h-full sm:top-0 sm:right-0 sm:left-auto sm:w-[400px] bg-[#111] sm:bg-[#111]/95 sm:backdrop-blur-xl border-t sm:border-t-0 sm:border-l border-white/10 rounded-t-[32px] sm:rounded-none flex flex-col pointer-events-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
              <h3 className="text-white font-serif text-xl font-medium">Customer Review</h3>
              <button 
                onClick={() => setShowReviewsPanel(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {stories[activeIndex] && (
                <div className="flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 text-brand-orange mb-6">
                    {[...Array(stories[activeIndex].rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current drop-shadow-sm" />
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  {stories[activeIndex].review_text ? (
                    <blockquote className="text-white/90 text-[17px] sm:text-lg leading-[1.6] font-medium mb-8">
                      "{stories[activeIndex].review_text}"
                    </blockquote>
                  ) : (
                    <div className="text-white/50 text-base italic mb-8">No review text provided.</div>
                  )}

                  {/* Customer Info */}
                  <div className="flex flex-col gap-1 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-white capitalize">
                        {stories[activeIndex].customer_name}
                      </span>
                      {stories[activeIndex].verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    {(stories[activeIndex].customer_city || stories[activeIndex].customer_state) && (
                      <div className="text-sm text-white/60 capitalize mt-1">
                        {[stories[activeIndex].customer_city, stories[activeIndex].customer_state].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
