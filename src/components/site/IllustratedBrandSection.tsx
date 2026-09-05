import { Link } from "@tanstack/react-router";

export function IllustratedBrandSection({ className = "", settings }: { className?: string, settings?: Record<string, any> }) {
  const eyebrow = settings?.illus_eyebrow ?? "FROM THE HIVE";
  const ctaText = settings?.illus_cta_text ?? "Explore our story \u2192";
  const ctaUrl = settings?.illus_cta_url ?? "/our-story";
  const leftImg = settings?.illus_left_img ?? "/images/heritage/illus_beekeeping.webp";
  const rightImg = settings?.illus_right_img ?? "/images/heritage/illus_wildflower.webp";

  return (
    <div className={`w-full px-2 sm:px-6 md:px-12 lg:px-20 overflow-hidden pb-10 pt-4 md:py-0 ${className}`}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2 sm:gap-6 md:gap-12 max-w-[1400px] mx-auto w-full">
        
        {/* Left Illustration */}
        <div className="w-full flex justify-end animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both" style={{ animationDelay: "100ms" }}>
          <img 
            src={leftImg} 
            alt="Heritage Beekeeping" 
            className="w-full max-w-[420px] object-contain opacity-90 mix-blend-multiply" 
            loading="lazy" 
          />
        </div>

        {/* Center CTA */}
        <div className="w-full flex flex-col items-center text-center px-1 sm:px-4 md:px-8 shrink-0 animate-in fade-in zoom-in-95 duration-1000 ease-out fill-mode-both" style={{ animationDelay: "300ms" }}>
          <span className="text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#D97706] font-bold mb-2 sm:mb-4 md:mb-6 whitespace-nowrap">
            {eyebrow}
          </span>
          <Link
            to={ctaUrl}
            className="inline-flex items-center justify-center bg-[#D97706] text-white px-4 sm:px-7 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-full font-bold text-[12px] sm:text-[13px] md:text-sm hover:bg-[#B46204] transition-all duration-400 shadow-[0_4px_14px_rgba(217,119,6,0.2)] hover:shadow-[0_8px_20px_rgba(217,119,6,0.3)] hover:-translate-y-0.5 whitespace-nowrap"
          >
            {ctaText}
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="w-full flex justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both" style={{ animationDelay: "500ms" }}>
          <img 
            src={rightImg} 
            alt="Wildflowers" 
            className="w-full max-w-[420px] object-contain opacity-90 mix-blend-multiply" 
            loading="lazy" 
          />
        </div>
        
      </div>
    </div>
  );
}
