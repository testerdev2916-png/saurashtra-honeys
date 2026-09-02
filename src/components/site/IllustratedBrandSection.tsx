import { Link } from "@tanstack/react-router";

export function IllustratedBrandSection({ className = "", settings }: { className?: string, settings?: Record<string, any> }) {
  const eyebrow = settings?.illus_eyebrow ?? "FROM THE HIVE";
  const ctaText = settings?.illus_cta_text ?? "Explore our story \u2192";
  const ctaUrl = settings?.illus_cta_url ?? "/our-story";
  const leftImg = settings?.illus_left_img ?? "/images/heritage/illus_beekeeping.png";
  const rightImg = settings?.illus_right_img ?? "/images/heritage/illus_wildflower.png";

  return (
    <div className={`container-page px-6 md:px-12 lg:px-20 overflow-hidden ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 max-w-[1400px] mx-auto">
        
        {/* Left Illustration */}
        <div className="w-full md:w-[35%] flex justify-center md:justify-end animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both" style={{ animationDelay: "100ms" }}>
          <img 
            src={leftImg} 
            alt="Heritage Beekeeping" 
            className="w-[260px] sm:w-[320px] md:w-full max-w-[420px] object-contain opacity-90 mix-blend-multiply" 
            loading="lazy" 
          />
        </div>

        {/* Center CTA */}
        <div className="w-full md:w-[30%] flex flex-col items-center text-center px-4 shrink-0 animate-in fade-in zoom-in-95 duration-1000 ease-out fill-mode-both" style={{ animationDelay: "300ms" }}>
          <span className="text-xs uppercase tracking-widest text-brand-orange font-semibold mb-5">{eyebrow}</span>
          <Link
            to={ctaUrl}
            className="inline-flex items-center justify-center bg-brand-orange text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm hover:bg-brand-orange-hover transition-all duration-400 shadow-[0_8px_20px_rgba(166,97,14,0.15)] hover:shadow-[0_12px_25px_rgba(166,97,14,0.25)] hover:-translate-y-1 whitespace-nowrap"
          >
            {ctaText}
          </Link>
        </div>

        {/* Right Illustration */}
        <div className="w-full md:w-[35%] flex justify-center md:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both" style={{ animationDelay: "500ms" }}>
          <img 
            src={rightImg} 
            alt="Wildflowers" 
            className="w-[260px] sm:w-[320px] md:w-full max-w-[420px] object-contain opacity-90 mix-blend-multiply" 
            loading="lazy" 
          />
        </div>
        
      </div>
    </div>
  );
}
