import React, { useState, useEffect } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

export type Achievement = {
  id: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
};

export function AchievementsGallery({ items }: { items: Achievement[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowLeft" && selectedIdx !== null) handlePrev();
      if (e.key === "ArrowRight" && selectedIdx !== null) handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx]);

  const displayItems = items && items.length > 0 ? items : [
    {
      id: "placeholder-1",
      media_type: "image",
      media_url: "https://images.unsplash.com/photo-1587049352847-81a56d773c1c?q=80&w=800&auto=format&fit=crop",
      thumbnail_url: null,
      title: "Best Organic Honey 2026",
      description: "Recognized for our pure, unadulterated raw honey harvesting process.",
    },
    {
      id: "placeholder-2",
      media_type: "image",
      media_url: "https://images.unsplash.com/photo-1587049352851-8d4e8e10b60e?q=80&w=800&auto=format&fit=crop",
      thumbnail_url: null,
      title: "Sustainable Beekeeping Award",
      description: "Awarded for our commitment to ethical and sustainable apiary practices.",
    },
    {
      id: "placeholder-3",
      media_type: "image",
      media_url: "https://images.unsplash.com/photo-1557165961-460b13d33ff0?q=80&w=800&auto=format&fit=crop",
      thumbnail_url: null,
      title: "Community Impact",
      description: "Celebrating our work with local farmers across Saurashtra.",
    }
  ] as Achievement[];

  const handlePrev = () => {
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx === 0 ? displayItems.length - 1 : selectedIdx - 1);
  };

  const handleNext = () => {
    if (selectedIdx === null) return;
    setSelectedIdx(selectedIdx === displayItems.length - 1 ? 0 : selectedIdx + 1);
  };

  const selectedItem = selectedIdx !== null ? displayItems[selectedIdx] : null;

  return (
    <section className="py-24 bg-[#FDFBF7]">
      <div className="container-page max-w-7xl mx-auto">
        <div className="text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-1000">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4">
            A JOURNEY WORTH CELEBRATING
          </span>
          <h2 className="font-serif text-[36px] sm:text-[48px] leading-tight text-[#2B2118] mb-6">
            Our Achievements & Recognition
          </h2>
          <p className="text-[15px] text-[#2B2118]/70 max-w-2xl mx-auto">
            Every milestone reflects our commitment to quality, responsible beekeeping, and naturally ripened honey.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              className="break-inside-avoid group cursor-pointer relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 reveal opacity-0 translate-y-8 border border-[#EBEFE9]"
              style={{ transitionDelay: `${(idx % 6) * 100}ms` }}
              onClick={() => setSelectedIdx(idx)}
            >
              <div className="relative w-full overflow-hidden bg-[#EBEFE9]">
                {item.media_type === "image" ? (
                  <img
                    src={item.media_url}
                    alt={item.title || "Achievement"}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <>
                    <img
                      src={item.thumbnail_url || item.media_url.replace(".mp4", ".jpg")} // Fallback if supported
                      alt={item.title || "Video thumbnail"}
                      loading="lazy"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#3B5241] shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="size-6 ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {(item.title || item.description) && (
                <div className="p-6 bg-white">
                  {item.title && (
                    <h3 className="font-serif text-lg text-[#2B2118] mb-2 leading-tight">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-[14px] text-[#2B2118]/70 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIdx !== null && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8 opacity-0 animate-in fade-in duration-300">
          
          {/* Close Button */}
          <button
            onClick={() => setSelectedIdx(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="size-6" />
          </button>

          {/* Navigation */}
          {displayItems.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          {/* Media Content */}
          <div className="relative max-w-5xl w-full max-h-full flex flex-col items-center justify-center gap-6" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-h-[75vh] flex items-center justify-center">
              {selectedItem.media_type === "video" ? (
                <video
                  src={selectedItem.media_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <img
                  src={selectedItem.media_url}
                  alt={selectedItem.title || ""}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                />
              )}
            </div>
            
            {(selectedItem.title || selectedItem.description) && (
              <div className="text-center text-white max-w-2xl px-4">
                {selectedItem.title && (
                  <h3 className="font-serif text-2xl mb-2">{selectedItem.title}</h3>
                )}
                {selectedItem.description && (
                  <p className="text-white/70 text-sm md:text-base">{selectedItem.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
