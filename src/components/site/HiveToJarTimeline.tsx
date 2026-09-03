import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface ProcessStep {
  number: string;
  category: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  active: boolean;
}

export function HiveToJarTimeline({
  eyebrow,
  heading,
  description,
  closing_eyebrow,
  closing_heading,
  closing_description,
  closing_cta_text,
  steps,
}: {
  eyebrow?: string;
  heading?: string;
  description?: string;
  closing_eyebrow?: string;
  closing_heading?: string;
  closing_description?: string;
  closing_cta_text?: string;
  steps: ProcessStep[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Video Intersection Observer (Play when visible, Pause when hidden)
  useEffect(() => {
    const videos = document.querySelectorAll(".process-video");
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // Attempt to play, catch and ignore autoplay restrictions
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 } // Play when at least 20% visible
    );

    videos.forEach((vid) => observer.observe(vid));
    return () => observer.disconnect();
  }, [steps]);

  // Active step observer for timeline highlight
  useEffect(() => {
    const stepEls = document.querySelectorAll(".process-step-container");
    if (!stepEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepNum = entry.target.getAttribute("data-step");
            document.querySelectorAll(".timeline-dot").forEach(dot => dot.classList.remove("bg-[#3B5241]", "scale-125"));
            document.querySelector(`.timeline-dot-${stepNum}`)?.classList.add("bg-[#3B5241]", "scale-125");
          }
        });
      },
      { threshold: 0.5 } // Highlight when 50% visible
    );

    stepEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [steps]);

  const activeSteps = steps?.filter(s => s.active !== false) || [];

  if (activeSteps.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-[#FDFBF7] relative overflow-hidden" ref={containerRef}>
      
      {/* Intro Header */}
      <div className="container-page max-w-4xl mx-auto text-center mb-24 reveal opacity-0 translate-y-8 transition-all duration-1000">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4">
          {eyebrow || "FROM HIVE TO JAR"}
        </span>
        <h2 className="font-serif text-[36px] md:text-[56px] leading-tight text-[#2B2118] mb-8">
          {heading || "A Journey of Care in Every Drop."}
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#2B2118]/80 leading-relaxed font-light max-w-2xl mx-auto">
          {description || "From a bee visiting a flower to the moment a jar reaches your home, every drop of Saurashtra Honey follows a careful journey. We let the bees do what nature intended, harvest with care, filter gently, test for quality, and pack the honey for its journey to you."}
        </p>
      </div>

      <div className="container-page max-w-6xl mx-auto relative">
        
        {/* Vertical Timeline Line (Desktop Only) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-black/10 -translate-x-1/2 z-0" />

        {/* Steps */}
        <div className="space-y-24 md:space-y-32 relative z-10">
          {activeSteps.map((step, idx) => {
            const isEven = idx % 2 === 1;
            
            return (
              <div 
                key={idx} 
                className="process-step-container flex flex-col md:flex-row items-center gap-12 md:gap-24 group reveal opacity-0 translate-y-8 transition-all duration-1000"
                data-step={idx}
              >
                
                {/* Timeline Dot (Desktop) */}
                <div className={`hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white bg-black/20 timeline-dot timeline-dot-${idx} transition-all duration-500 shadow-sm z-20`} />

                {/* Video Column */}
                <div className={`w-full md:w-1/2 order-1 ${isEven ? "md:order-2" : "md:order-1"}`}>
                  <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-[24px] overflow-hidden bg-black/5 shadow-sm transform transition-transform duration-700 group-hover:scale-[1.02]">
                    {step.video ? (
                      <video 
                        className="process-video w-full h-full object-cover"
                        poster={step.poster}
                        playsInline
                        muted
                        loop
                      >
                        <source src={step.video} type="video/mp4" />
                        <source src={step.video} type="video/webm" />
                      </video>
                    ) : (
                      <img 
                        src={step.poster || "/placeholder-image.jpg"} 
                        alt={step.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Text Column */}
                <div className={`w-full md:w-1/2 order-2 space-y-6 ${isEven ? "md:order-1 md:text-right" : "md:order-2 md:text-left"}`}>
                  <div className={`flex items-center gap-4 mb-2 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                    <span className="font-serif text-3xl md:text-4xl text-[#3B5241] opacity-40">
                      {step.number || `0${idx + 1}`}
                    </span>
                    <span className="h-px w-12 bg-[#3B5241]/20 hidden md:block"></span>
                  </div>
                  
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block">
                    {step.category}
                  </span>
                  
                  <h3 className="font-serif text-[28px] md:text-[36px] leading-tight text-[#2B2118]">
                    {step.title}
                  </h3>
                  
                  <p className="text-[15px] md:text-[16px] text-[#2B2118]/70 leading-relaxed font-light max-w-md mx-auto md:mx-0">
                    {step.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Closing Statement */}
      <div className="container-page max-w-4xl mx-auto text-center mt-32 md:mt-48 reveal opacity-0 translate-y-8 transition-all duration-1000">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4">
          {closing_eyebrow || "FROM SAURASHTRA, WITH CARE"}
        </span>
        <h2 className="font-serif text-[32px] md:text-[48px] leading-tight text-[#2B2118] mb-8">
          {closing_heading || "Every Jar Carries a Little Piece of Where It Began."}
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#2B2118]/80 leading-relaxed font-light max-w-2xl mx-auto mb-10">
          {closing_description || "From a flower visited by a bee to a jar delivered to your home — that's the journey behind every jar of Saurashtra Honey."}
        </p>
        <Link to="/shop" className="inline-flex items-center gap-3 bg-[#3B5241] hover:bg-[#2C3D30] text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors">
          {closing_cta_text || "SHOP OUR HONEY"} <ArrowRight className="size-4" />
        </Link>
      </div>

    </section>
  );
}
