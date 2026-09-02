import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  ArrowRight,
  Sparkles,
  Leaf,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { StructuredData, breadcrumbLd, organizationLd } from "@/components/site/StructuredData";
import { fetchPageSections } from "@/lib/page-cms.functions";

// Assets matching the Our Story photographic language
import heroHoneyImg from "@/assets/hero-honey.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";
import honeycombBeesImg from "@/assets/honeycomb-bees.jpg";
import familyHoneyImg from "@/assets/family-honey.jpg";
import honeyDrizzleImg from "@/assets/honey-drizzle.jpg";
import heroProductsImg from "@/assets/hero-products.jpg";
import beeFlowerImg from "@/assets/bee-flower.jpg";
import infographicImg from "@/assets/our-bee-farm-timeline.jpg";
import boxImg from "@/assets/box.jpg";
import ourBeesIllustration from "@/assets/our-bees-illustration.jpg";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      {
        title: "Our Story — Rooted in Nature, Driven by Purpose | Saurashtra Honey",
      },
      {
        name: "description",
        content:
          "From the heart of Saurashtra to your home, our journey is one of passion, purity and purpose. Discover our ethical beekeeping and natural farms.",
      },
      { property: "og:title", content: "Our Story — Saurashtra Honey" },
      {
        property: "og:description",
        content: "Rooted in Nature, Driven by Purpose.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => fetchPageSections("our-story"),
  component: OurStory,
});



function OurStory() {
  const sections = Route.useLoaderData();
  const heroSettings = sections.find((s) => s.section_key === "hero")?.settings || {};
  const founderSettings = sections.find((s) => s.section_key === "founder")?.settings || {};

  // Simple fade-in animation hook
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in", "fade-in", "slide-in-from-bottom-8", "duration-1000", "opacity-100");
            entry.target.classList.remove("opacity-0", "translate-y-8");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <SiteLayout>
      <StructuredData data={[
        breadcrumbLd([ { name: "Home", url: "/" }, { name: "Our Story", url: "/our-story" } ]),
        organizationLd(),
      ]} />

      <main className="bg-[#F8F5EF] min-h-screen text-[#2B2118] overflow-hidden">
        
        <PageHeroSlider page="our-story" />

        {/* SECTION 1 - THE BEGINNING */}
        <section id="the-beginning" className="pt-20 pb-12 md:pt-32 md:pb-16 bg-[#FDFBF7]">
          
          {/* SECTION EYEBROW */}
          <div className="container-page text-center mb-10 md:mb-14 reveal-on-scroll opacity-0 translate-y-8">
            <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.3em] text-[#A6610E] font-[600] block">OUR STORY</span>
          </div>

          {/* TOP: 4 Illustrations Row */}
          <div className="w-full mb-12 md:mb-16">
            {/* Mobile Swipe / Desktop Grid */}
            <div 
              className="container-page flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-6 md:gap-10 pb-8 md:pb-0 [&::-webkit-scrollbar]:hidden" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              
              {/* Step 1 */}
              <div className="snap-start shrink-0 w-[70vw] md:w-auto flex flex-col items-center text-center reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: '100ms' }}>
                <img src="/images/heritage/illus_wildflower.png" alt="The Beginning" className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain mix-blend-multiply opacity-90 mb-6 hover:opacity-100 transition-opacity duration-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A6610E] font-bold mb-3">01</span>
                <h3 className="font-serif text-xl font-bold text-[#2B2118] mb-2">The Beginning</h3>
                <p className="text-sm text-[#2B2118]/70 leading-relaxed px-4">Rooted in the wild landscapes of Saurashtra.</p>
              </div>

              {/* Step 2 */}
              <div className="snap-start shrink-0 w-[70vw] md:w-auto flex flex-col items-center text-center reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: '200ms' }}>
                <img src="/images/heritage/illus_beekeeping.png" alt="The Bees" className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain mix-blend-multiply opacity-90 mb-6 hover:opacity-100 transition-opacity duration-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A6610E] font-bold mb-3">02</span>
                <h3 className="font-serif text-xl font-bold text-[#2B2118] mb-2">The Bees</h3>
                <p className="text-sm text-[#2B2118]/70 leading-relaxed px-4">Healthy bees, thriving among wildflowers.</p>
              </div>

              {/* Step 3 */}
              <div className="snap-start shrink-0 w-[70vw] md:w-auto flex flex-col items-center text-center reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: '300ms' }}>
                <img src="/images/heritage/illus_hive_to_home.png" alt="Careful Harvest" className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain mix-blend-multiply opacity-90 mb-6 hover:opacity-100 transition-opacity duration-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A6610E] font-bold mb-3">03</span>
                <h3 className="font-serif text-xl font-bold text-[#2B2118] mb-2">Careful Harvest</h3>
                <p className="text-sm text-[#2B2118]/70 leading-relaxed px-4">Honey gathered with care and responsibility.</p>
              </div>

              {/* Step 4 */}
              <div className="snap-start shrink-0 w-[70vw] md:w-auto flex flex-col items-center text-center reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: '400ms' }}>
                <img src="/images/heritage/illus_pure.png" alt="From Hive to Home" className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain mix-blend-multiply opacity-90 mb-6 hover:opacity-100 transition-opacity duration-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#A6610E] font-bold mb-3">04</span>
                <h3 className="font-serif text-xl font-bold text-[#2B2118] mb-2">From Hive to Home</h3>
                <p className="text-sm text-[#2B2118]/70 leading-relaxed px-4">Pure honey, brought from our hives to you.</p>
              </div>

            </div>
          </div>

          {/* BOTTOM: Text Content */}
          <div className="container-page text-center max-w-[800px] mx-auto reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: '500ms' }}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-[#2B2118]">
              {heroSettings.heading || "The Beginning"}
            </h2>
            
            <p className="text-lg md:text-xl leading-relaxed text-[#2B2118]/80 mb-6 font-light whitespace-pre-wrap">
              {heroSettings.description || "Saurashtra Honey was born from a deep respect for nature and a simple belief: the best honey comes from healthy bees living in a healthy environment."}
            </p>
            
            <a
              href="#our-bees"
              className="inline-flex items-center justify-center bg-transparent border border-[#A6610E] text-[#A6610E] px-8 py-3.5 rounded-full font-bold text-[12px] tracking-[0.15em] hover:bg-[#A6610E] hover:text-white transition-all duration-400 mt-4"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('our-bees')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              OUR JOURNEY &rarr;
            </a>
          </div>

        </section>

        {/* SECTION 2 - FROM HIVE TO HONEY */}
        <section id="from-hive-to-honey" className="pt-0 pb-20 md:pb-32 bg-[#FDFBF7] relative overflow-hidden flex flex-col items-center w-full">
          <div className="w-full max-w-none px-0 reveal-on-scroll opacity-0 translate-y-8 flex flex-col items-center">
            <img 
              src={infographicImg} 
              alt="Our Bee Farm - From Hive to Honey Timeline" 
              className="w-full h-auto block object-contain"
              loading="lazy"
            />
          </div>
        </section>


        {/* SECTION 3 - OUR BEES */}
        <section id="our-bees" className="py-20 md:py-32 container-page">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl reveal-on-scroll opacity-0 translate-y-8">
              <img src={ourBeesIllustration} alt="Custom illustration of our healthy bees and honeycomb" className="w-full h-auto block object-cover hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="reveal-on-scroll opacity-0 translate-y-8">
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand-orange mb-4 block">The Heart of Our Brand</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Our Bees</h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Healthy bees are the foundation of everything we do. A strong, vibrant colony is essential not only for producing premium honey but also for sustaining the local environment through pollination.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                We closely monitor the health and vitality of our hives, ensuring our bees have everything they need to flourish naturally. Our deep understanding of bee behavior guides our gentle approach to colony management.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 - BEEKEEPING */}
        <section id="responsible-beekeeping" className="py-24 bg-[#FDFBF7] text-[#2B2118]">
          <div className="container-page text-center">
            <div className="max-w-3xl mx-auto reveal-on-scroll opacity-0 translate-y-8">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8 text-[#2B2118]">Responsible Beekeeping</h2>
              <p className="text-lg md:text-xl text-[#2B2118]/80 leading-relaxed mb-12">
                Our beekeeping practices are rooted in respect for the natural ecosystem. We harvest honey only at the right time, ensuring the bees always have enough reserves for themselves. We believe in minimal intervention—letting nature take its course while we serve as careful stewards of the hives.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-left mt-16">
              {[
                { title: "Gentle Harvesting", desc: "Extracting honey without harming the comb or the colony.", icon: HeartHandshake },
                { title: "Natural Foraging", desc: "Placing hives near rich, pesticide-free floral sources.", icon: Sparkles },
                { title: "Ecosystem First", desc: "Supporting local biodiversity through active pollination.", icon: Leaf },
              ].map((item, i) => (
                <div key={i} className="bg-[#F8F5EF] rounded-2xl p-8 border border-[#2B2118]/5 reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: `${i * 150}ms` }}>
                  <item.icon className="size-10 text-brand-orange mb-6" />
                  <h3 className="font-serif text-2xl font-bold mb-4 text-[#2B2118]">{item.title}</h3>
                  <p className="text-[#2B2118]/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 - TIMELINE (Replaced by Infographic in Section 2) */}

        {/* SECTION 6 - PURE & NATURAL */}
        <section className="py-20 bg-white">
          <div className="container-page">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px] reveal-on-scroll opacity-0 translate-y-8">
                <img src={honeyDrizzleImg} alt="Pure golden honey" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="order-1 lg:order-2 reveal-on-scroll opacity-0 translate-y-8">
                <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Pure & Natural</h2>
                <div className="w-16 h-1 bg-brand-orange mb-8 rounded-full" />
                <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                  Our philosophy is simple: honey should be exactly as the bees made it. We do not pasteurize, ultra-filter, or add anything artificial. 
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  By maintaining this commitment to rawness, we preserve the natural pollens, enzymes, and unique floral profiles that give our honey its authentic character and distinct regional taste.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 - OUR COMMITMENT */}
        <section className="py-24 bg-cream-deep/30">
          <div className="container-page">
            <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll opacity-0 translate-y-8">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Our Commitment</h2>
              <p className="text-foreground/70 text-lg">A promise to our bees, our environment, and to you.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                "Respecting bees and their natural rhythms.",
                "Practicing responsible and ethical beekeeping.",
                "Protecting and nurturing natural ecosystems.",
                "Maintaining uncompromised raw quality.",
                "Supporting local environments and farmers.",
                "Delivering 100% authentic, traceable honey.",
              ].map((text, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4 border border-border/40 reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: `${i * 100}ms` }}>
                  <CheckCircle2 className="size-6 text-brand-orange shrink-0 mt-0.5" />
                  <p className="text-foreground/90 font-medium leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8 - VISUAL FARM GALLERY */}
        <section className="py-24 container-page">
          <div className="text-center mb-16 reveal-on-scroll opacity-0 translate-y-8">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Life on the Farm</h2>
            <p className="text-foreground/70 text-lg">A glimpse into our daily dedication.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="col-span-2 md:col-span-1 row-span-2 rounded-3xl overflow-hidden shadow-md reveal-on-scroll opacity-0 translate-y-8">
              <img src={beeFarmImg} alt="Farm landscape" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-md aspect-square md:aspect-auto h-[200px] md:h-full reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: '100ms' }}>
              <img src={honeycombBeesImg} alt="Honeycomb" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-md aspect-square md:aspect-auto h-[200px] md:h-full reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: '200ms' }}>
              <img src={beeFlowerImg} alt="Bee on flower" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="col-span-2 rounded-3xl overflow-hidden shadow-md h-[250px] md:h-[300px] reveal-on-scroll opacity-0 translate-y-8" style={{ animationDelay: '300ms' }}>
              <img src={familyHoneyImg} alt="Beekeeping community" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </section>

      </main>
    </SiteLayout>
  );
}
