import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { ArrowRight, Leaf, HeartHandshake, CheckCircle2, Droplet, Sprout, Wind, Target } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { StructuredData, breadcrumbLd, organizationLd } from "@/components/site/StructuredData";
import { fetchPageSections } from "@/lib/page-cms.functions";

// Photographic assets
import heroHoneyImg from "@/assets/hero-honey.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";
import honeycombBeesImg from "@/assets/honeycomb-bees.jpg";
import familyHoneyImg from "@/assets/family-honey.jpg";
import heroProductsImg from "@/assets/hero-products.jpg";
import honeyDrizzleImg from "@/assets/honey-drizzle.jpg";
import beeFlowerImg from "@/assets/bee-flower.jpg";
import { HiveToJarTimeline } from "@/components/site/HiveToJarTimeline";

const RawIcon = ({ className, strokeWidth = 1 }: { className?: string; strokeWidth?: number | string }) => (
  <svg viewBox="-5 -5 110 110" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="50,25 68,35.5 68,56.5 50,67 32,56.5 32,35.5" />
    <polygon points="50,28 64,36.5 64,54 50,62 36,54 36,36.5" strokeWidth="0.5" />
    <polygon points="50,31 60,38 60,52 50,58 40,52 40,38" strokeWidth="0.25" />
    <path d="M40,38 L60,45 M38,42 L62,50 M36,48 L58,55 M42,54 L52,58" strokeWidth="0.2" />
    
    <polygon points="32,14.5 50,25 50,46 32,56.5 14,46 14,25" />
    <polygon points="32,17.5 46,26 46,43.5 32,51.5 18,43.5 18,26" strokeWidth="0.5" />
    <path d="M20,28 L42,35 M18,32 L44,40 M16,38 L40,45" strokeWidth="0.2" />
    
    <polygon points="68,14.5 86,25 86,46 68,56.5 50,46 50,25" />
    <polygon points="68,17.5 82,26 82,43.5 68,51.5 54,43.5 54,26" strokeWidth="0.5" />
    <path d="M56,28 L78,35 M54,32 L80,40 M52,38 L76,45" strokeWidth="0.2" />
    
    <polygon points="32,56.5 50,67 50,88 32,98.5 14,88 14,67" />
    <polygon points="32,59.5 46,68 46,85.5 32,93.5 18,85.5 18,68" strokeWidth="0.5" />
    <path d="M20,70 L42,77 M18,74 L44,82 M16,80 L40,87" strokeWidth="0.2" />
    
    <polygon points="68,56.5 86,67 86,88 68,98.5 50,88 50,67" />
    <polygon points="68,59.5 82,68 82,85.5 68,93.5 54,85.5 54,68" strokeWidth="0.5" />
    <path d="M56,70 L78,77 M54,74 L80,82 M52,80 L76,87" strokeWidth="0.2" />
    
    <path d="M35,65 C30,85 45,95 50,95 C55,95 70,85 65,65 Z" fill="#EBEFE9" />
    <path d="M35,65 C30,85 45,95 50,95 C55,95 70,85 65,65 Z" />
    <path d="M38,72 C35,85 45,91 50,91 M62,72 C65,85 55,91 50,91" strokeWidth="0.5" />
    <path d="M42,68 L42,75 M46,70 L46,85 M58,68 L58,75 M54,70 L54,85" strokeWidth="0.3" />
    
    <path d="M50,98 C48,102 52,102 50,98 Z" fill="currentColor" />
    <path d="M35,90 C34,93 36,93 35,90 Z" fill="currentColor" />
    
    <circle cx="25" cy="15" r="0.5" fill="currentColor" />
    <circle cx="28" cy="18" r="0.3" fill="currentColor" />
    <circle cx="75" cy="12" r="0.5" fill="currentColor" />
    <circle cx="85" cy="55" r="0.4" fill="currentColor" />
    <circle cx="12" cy="50" r="0.6" fill="currentColor" />
  </svg>
);

const HonestIcon = ({ className, strokeWidth = 1 }: { className?: string; strokeWidth?: number | string }) => (
  <svg viewBox="-5 -5 110 110" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M50,45 C20,70 20,95 50,95 C80,95 80,70 50,45 Z" fill="#EBEFE9" />
    <path d="M50,45 C20,70 20,95 50,95 C80,95 80,70 50,45 Z" />
    <path d="M35,75 C32,80 35,88 45,92 M38,72 C35,78 38,85 46,89 M41,70 C38,75 41,82 48,86" strokeWidth="0.3" />
    <path d="M65,75 C68,80 65,88 55,92 M62,72 C65,78 62,85 54,89 M59,70 C62,75 59,82 52,86" strokeWidth="0.3" />
    
    <path d="M45,35 C40,45 40,55 50,60 C60,55 60,45 55,35 Z" fill="#EBEFE9" />
    <path d="M45,35 C40,45 40,55 50,60 C60,55 60,45 55,35 Z" />
    <path d="M44,38 L56,38 M43,42 L57,42 M42,46 L58,46 M42,50 L58,50 M43,54 L57,54 M46,58 L54,58" strokeWidth="0.5" />
    <path d="M46,36 C45,45 46,55 50,59 M50,35 L50,60 M54,36 C55,45 54,55 50,59" strokeWidth="0.3" />
    
    <circle cx="50" cy="25" r="8" fill="#EBEFE9" />
    <circle cx="50" cy="25" r="8" />
    <path d="M44,22 L46,24 M48,21 L50,23 M52,20 L53,22 M56,22 L54,24 M43,26 L45,26 M57,25 L55,26 M44,29 L46,28 M48,31 L49,29 M52,31 L51,29 M56,28 L54,28" strokeWidth="0.5" />
    
    <path d="M46,17 C46,14 54,14 54,17 C54,20 46,20 46,17 Z" fill="#EBEFE9" />
    <path d="M46,17 C46,14 54,14 54,17 C54,20 46,20 46,17 Z" />
    <path d="M45,15 C44,16 44,18 46,19 M55,15 C56,16 56,18 54,19" strokeWidth="0.5" />
    <path d="M47,15 C45,10 40,8 38,10 M53,15 C55,10 60,8 62,10" strokeWidth="0.5" />
    
    <path d="M42,25 C20,10 5,20 15,45 C25,50 38,40 42,32 Z" fill="#EBEFE9" />
    <path d="M42,25 C20,10 5,20 15,45 C25,50 38,40 42,32 Z" />
    <path d="M42,25 C30,22 15,25 15,45 M58,25 C70,22 85,25 85,45" strokeWidth="0.3" />
    <path d="M35,28 L25,35 M32,32 L20,40 M38,30 L30,42" strokeWidth="0.2" />
    
    <path d="M58,25 C80,10 95,20 85,45 C75,50 62,40 58,32 Z" fill="#EBEFE9" />
    <path d="M58,25 C80,10 95,20 85,45 C75,50 62,40 58,32 Z" />
    <path d="M65,28 L75,35 M68,32 L80,40 M62,30 L70,42" strokeWidth="0.2" />
    
    <path d="M41,32 C25,35 15,55 25,60 C35,62 42,45 42,38 Z" fill="#EBEFE9" opacity="0.9" />
    <path d="M41,32 C25,35 15,55 25,60 C35,62 42,45 42,38 Z" />
    <path d="M41,32 C30,40 25,50 25,60 M59,32 C70,40 75,50 75,60" strokeWidth="0.3" />
    
    <path d="M59,32 C75,35 85,55 75,60 C65,62 58,45 58,38 Z" fill="#EBEFE9" opacity="0.9" />
    <path d="M59,32 C75,35 85,55 75,60 C65,62 58,45 58,38 Z" />
    
    <path d="M42,20 L35,15 L30,18 M58,20 L65,15 L70,18" strokeWidth="0.5" />
    <path d="M40,28 L30,25 L25,30 M60,28 L70,25 L75,30" strokeWidth="0.5" />
    <path d="M43,35 L35,45 L30,55 M57,35 L65,45 L70,55" strokeWidth="0.5" />
  </svg>
);

const ResponsibleIcon = ({ className, strokeWidth = 1 }: { className?: string; strokeWidth?: number | string }) => (
  <svg viewBox="-5 -5 110 110" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M25,95 C20,70 30,40 50,30" strokeWidth="1.5" fill="none" />
    <path d="M23,95 C18,70 28,40 48,31" strokeWidth="0.5" fill="none" />
    
    <path d="M25,80 C40,85 45,70 35,60 C25,65 20,75 25,80 Z" fill="#EBEFE9" />
    <path d="M25,80 C40,85 45,70 35,60 C25,65 20,75 25,80 Z" />
    <path d="M25,80 C35,78 40,70 35,60" strokeWidth="0.5" />
    <path d="M28,75 L32,78 M30,71 L35,74 M32,67 L38,70" strokeWidth="0.2" />
    
    <path d="M50,30 C52,35 58,38 65,35 C60,28 55,28 50,30 Z" fill="#EBEFE9" />
    <path d="M50,30 C52,35 58,38 65,35 C60,28 55,28 50,30 Z" />
    
    <path d="M60,32 C65,15 75,10 85,15 C75,20 65,25 60,32 Z" fill="#EBEFE9" strokeWidth="0.5" />
    
    <path d="M65,35 C80,30 90,40 85,55 C75,50 65,45 65,35 Z" fill="#EBEFE9" />
    <path d="M65,35 C80,30 90,40 85,55 C75,50 65,45 65,35 Z" />
    <path d="M65,35 C75,38 82,45 85,55" strokeWidth="0.5" />
    <path d="M70,38 L75,42 M72,42 L78,46 M75,46 L80,50" strokeWidth="0.2" />
    
    <path d="M65,35 C70,20 85,15 95,25 C85,30 75,30 65,35 Z" fill="#EBEFE9" />
    <path d="M65,35 C70,20 85,15 95,25 C85,30 75,30 65,35 Z" />
    <path d="M65,35 C72,25 80,20 95,25" strokeWidth="0.5" />
    <path d="M72,28 L78,25 M76,30 L84,28 M78,32 L88,30" strokeWidth="0.2" />
    
    <path d="M10,40 C5,50 15,60 25,55 C32,50 30,40 25,35 C18,30 12,32 10,40 Z" fill="#EBEFE9" />
    <path d="M10,40 C5,50 15,60 25,55 C32,50 30,40 25,35 C18,30 12,32 10,40 Z" />
    <path d="M12,38 C15,45 15,50 12,52 M16,35 C20,42 20,48 17,54 M22,34 C26,40 26,48 23,55" strokeWidth="0.75" />
    <path d="M14,37 L16,39 M18,35 L20,38 M12,41 L14,43" strokeWidth="0.3" />
    
    <circle cx="32" cy="42" r="8" fill="#EBEFE9" />
    <circle cx="32" cy="42" r="8" />
    <path d="M26,38 L28,40 M28,36 L30,38 M30,35 L32,37 M26,45 L28,43 M30,48 L32,46 M34,49 L35,47" strokeWidth="0.3" />
    
    <circle cx="43" cy="40" r="4" fill="#EBEFE9" />
    <circle cx="43" cy="40" r="4" />
    <path d="M42,38 A1,1 0 0,0 43,37" strokeWidth="0.5" />
    <path d="M45,38 C50,35 55,38 58,42 M46,41 C50,42 53,46 55,50" strokeWidth="0.5" />
    
    <path d="M40,44 L45,52 L55,52" strokeWidth="0.5" />
    <path d="M35,48 L38,58 L45,62" strokeWidth="0.5" />
    <path d="M28,49 L25,60 L32,65" strokeWidth="0.5" />
    
    <path d="M35,36 C40,20 55,15 65,25 C65,35 45,40 35,36 Z" fill="#EBEFE9" opacity="0.8" />
    <path d="M35,36 C40,20 55,15 65,25 C65,35 45,40 35,36 Z" strokeWidth="0.5" opacity="0.8" />
    <path d="M35,36 C45,30 55,25 65,25" strokeWidth="0.2" />
    
    <path d="M32,35 C25,15 40,5 50,15 C55,25 42,35 32,35 Z" fill="#EBEFE9" opacity="0.9" />
    <path d="M32,35 C25,15 40,5 50,15 C55,25 42,35 32,35 Z" />
    <path d="M32,35 C40,25 45,18 50,15" strokeWidth="0.3" />
    <path d="M38,30 L45,25 M35,28 L40,20 M40,32 L48,28" strokeWidth="0.2" />
    
    <circle cx="58" cy="35" r="0.5" fill="currentColor" />
    <circle cx="55" cy="40" r="0.8" fill="currentColor" />
    <circle cx="60" cy="42" r="0.5" fill="currentColor" />
  </svg>
);

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Saurashtra Honey" },
      { name: "description", content: "From the heart of Saurashtra to your home. Discover our ethical beekeeping and natural farms." },
    ],
  }),
  loader: () => fetchPageSections("our-story"),
  component: OurStory,
});

function OurStory() {
  const sections = Route.useLoaderData();
  const getS = (key: string) => sections.find((s) => s.section_key === key)?.settings || {};

  const hero = getS("hero");
  const origin = getS("where_it_began");
  const land = getS("saurashtra_land");
  const heart = getS("heart_of_everything");
  const steps = getS("hive_to_jar");
  const promise = getS("our_promise");
  const responsible = getS("responsible_beekeeping");
  const people = getS("the_people");
  const gallery = getS("life_around_hives");
  const finalCta = getS("final_cta");

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <SiteLayout>
      <StructuredData data={[
        breadcrumbLd([ { name: "Home", url: "/" }, { name: "Our Story", url: "/our-story" } ]),
        organizationLd(),
      ]} />

      <main className="bg-[#FDFBF7] text-[#2B2118] overflow-hidden">
        
        {/* 1. HERO SECTION */}
        <section className="relative w-full aspect-[1920/600] min-h-[400px] sm:min-h-[450px] md:min-h-[500px] flex items-center bg-[#2B2118]">
          <div className="absolute inset-0 w-full h-full">
            <picture>
              {hero.mobile_image && <source media="(max-width: 768px)" srcSet={hero.mobile_image} />}
              <img 
                src={hero.desktop_image || heroHoneyImg} 
                alt="Saurashtra Landscape" 
                className="w-full h-full object-cover opacity-80"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent mix-blend-multiply" />
          </div>
          <div className="container-page relative z-10 text-white reveal opacity-0 translate-y-8 transition-all duration-1000">
            <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.25em] font-semibold text-white/90 mb-4 block">
              {hero.eyebrow || "OUR STORY"}
            </span>
            <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[72px] leading-[1.1] mb-6 max-w-2xl text-white">
              <span className="whitespace-pre-wrap">{hero.heading || "Born in Saurashtra.\nMade by Nature."}</span>
            </h1>
            <p className="text-[16px] md:text-[18px] text-white/90 max-w-xl leading-relaxed mb-8 font-light">
              {hero.description || "A journey from wildflowers and healthy hives to pure honey, carefully brought to your home."}
            </p>
            <Link to="/our-story" onClick={() => document.getElementById('origin')?.scrollIntoView({behavior: 'smooth'})} className="inline-flex items-center gap-3 bg-[#3B5241] hover:bg-[#2C3D30] text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors">
              {hero.cta_text || "DISCOVER OUR JOURNEY"} <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* 2. WHERE IT BEGAN */}
        <section id="origin" className="py-24 md:py-32 bg-white">
          <div className="container-page max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="w-full md:w-1/2 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden">
                <img src={origin.image || beeFarmImg} alt="Where it began" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6 reveal opacity-0 translate-y-8 transition-all duration-1000 delay-150">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block">
                {origin.eyebrow || "WHERE IT BEGAN"}
              </span>
              <h2 className="font-serif text-[36px] sm:text-[48px] leading-tight text-[#2B2118]">
                {origin.heading || "It started with the bees."}
              </h2>
              <div className="space-y-4 text-[16px] text-[#2B2118]/70 leading-relaxed font-light whitespace-pre-wrap">
                {origin.description || "In the heart of Saurashtra, where the land blooms with wildflowers and the winds carry stories of tradition, our journey began with a deep respect for nature.\n\nWhat started as a small passion for beekeeping has grown into a promise to deliver honey that is raw, pure and honest.\n\nEvery jar you hold is a reflection of our love for bees, our land and our commitment to quality.\n\nThis is where our story begins."}
              </div>
            </div>
          </div>
        </section>

        {/* 3. SAURASHTRA - THE LAND */}
        <section className="relative py-32 bg-[#F8F5EF] overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img src={land.bg_image || heroHoneyImg} className="w-full h-full object-cover object-bottom" alt="Landscape" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5EF] via-[#F8F5EF]/80 to-transparent" />
          </div>
          <div className="container-page relative z-10 text-center max-w-4xl mx-auto reveal opacity-0 translate-y-8 transition-all duration-1000">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4">
              {land.eyebrow || "THE LAND THAT GIVES US HONEY"}
            </span>
            <h2 className="font-serif text-[44px] md:text-[64px] leading-tight text-[#2B2118] mb-6">
              {land.heading || "Saurashtra"}
            </h2>
            <p className="text-[18px] md:text-[20px] text-[#2B2118]/80 leading-relaxed font-light max-w-2xl mx-auto mb-16">
              {land.description || "Where the land, flowers, seasons and bees come together."}
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-20">
              {[
                { icon: Wind, label: "FIELD" },
                { icon: Sprout, label: "FLOWERS" },
                { icon: Target, label: "HIVE" },
                { icon: Droplet, label: "HONEY" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4 reveal opacity-0 translate-y-8 transition-all duration-1000" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="w-16 h-16 rounded-full border border-[#3B5241]/20 flex items-center justify-center text-[#3B5241] bg-white/50 backdrop-blur-sm">
                    <item.icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#2B2118]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. THE HEART OF EVERYTHING */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container-page max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 space-y-10 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4">
                  {heart.eyebrow || "THE HEART OF EVERYTHING"}
                </span>
                <h2 className="font-serif text-[36px] sm:text-[48px] leading-tight text-[#2B2118]">
                  {heart.heading || "Without healthy bees, there is no honey."}
                </h2>
              </div>
              
              <div className="space-y-8">
                {[
                  { t: heart.feature1_title || "Healthy Colonies", d: heart.feature1_desc || "We nurture strong, disease-free colonies." },
                  { t: heart.feature2_title || "Natural Foraging", d: heart.feature2_desc || "Our bees collect nectar from diverse wildflowers." },
                  { t: heart.feature3_title || "Pollination Heroes", d: heart.feature3_desc || "They help pollinate crops and support the ecosystem." },
                  { t: heart.feature4_title || "Gentle Care", d: heart.feature4_desc || "We follow natural, non-invasive beekeeping with minimum intervention." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="size-6 text-[#3B5241] shrink-0" strokeWidth={1.5} />
                    <div>
                      <h4 className="font-bold text-[#2B2118] mb-1">{item.t}</h4>
                      <p className="text-[14px] text-[#2B2118]/70 leading-relaxed font-light">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 reveal opacity-0 translate-y-8 transition-all duration-1000 delay-150">
              <img src={heart.image || honeycombBeesImg} alt="Honeycomb" className="w-full aspect-[4/3] md:aspect-[4/5] object-cover rounded-[24px]" />
            </div>
          </div>
        </section>

        {/* 5. FROM HIVE TO JAR */}
        <HiveToJarTimeline 
          eyebrow={steps.eyebrow}
          heading={steps.heading}
          description={steps.description}
          closing_eyebrow={steps.closing_eyebrow}
          closing_heading={steps.closing_heading}
          closing_description={steps.closing_description}
          closing_cta_text={steps.closing_cta_text}
          steps={steps.steps || []}
        />

        {/* 6. OUR PROMISE */}
        <section className="py-24 bg-[#EBEFE9]">
          <div className="container-page max-w-5xl mx-auto text-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4 reveal opacity-0 translate-y-8 transition-all duration-1000">
              {promise.eyebrow || "OUR PROMISE"}
            </span>
            <h2 className="font-serif text-[36px] sm:text-[48px] leading-tight text-[#2B2118] mb-16 reveal opacity-0 translate-y-8 transition-all duration-1000 delay-100">
              {promise.heading || "Keep it close to nature."}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: promise.promise1_title || "RAW", desc: promise.promise1_desc || "As close to nature as possible.", icon: RawIcon },
                { title: promise.promise2_title || "HONEST", desc: promise.promise2_desc || "No unnecessary additions.", icon: HonestIcon },
                { title: promise.promise3_title || "RESPONSIBLE", desc: promise.promise3_desc || "Care for bees, land & people.", icon: ResponsibleIcon },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center reveal opacity-0 translate-y-8 transition-all duration-1000" style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="text-[#3B5241] mb-8">
                    <p.icon className="w-36 h-36 md:w-44 md:h-44" strokeWidth={1} />
                  </div>
                  <h3 className="font-bold tracking-widest text-[#2B2118] mb-3 uppercase">{p.title}</h3>
                  <p className="text-[15px] text-[#2B2118]/70 font-light">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. RESPONSIBLE BEEKEEPING */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container-page max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 space-y-10 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4">
                  {responsible.eyebrow || "RESPONSIBLE BEEKEEPING"}
                </span>
                <h2 className="font-serif text-[36px] sm:text-[48px] leading-tight text-[#2B2118] whitespace-pre-wrap">
                  {responsible.heading || "We don't just take from nature.\nWe care for it."}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { t: responsible.feature1_title || "Gentle Harvesting", d: responsible.feature1_desc || "We harvest honey with respect for the colony." },
                  { t: responsible.feature2_title || "Natural Foraging", d: responsible.feature2_desc || "Natural bee forage away from pesticides." },
                  { t: responsible.feature3_title || "Healthy Hives", d: responsible.feature3_desc || "We prioritize the health and strength of every hive." },
                  { t: responsible.feature4_title || "Eco Balance", d: responsible.feature4_desc || "We support local biodiversity." },
                ].map((item, i) => (
                  <div key={i} className="bg-[#FDFBF7] p-6 rounded-[16px] border border-[#2B2118]/5 hover:border-[#3B5241]/20 transition-colors">
                    <Leaf className="size-5 text-[#3B5241] mb-4" strokeWidth={1.5} />
                    <h4 className="font-bold text-[#2B2118] mb-2 text-sm">{item.t}</h4>
                    <p className="text-[13px] text-[#2B2118]/70 leading-relaxed font-light">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 reveal opacity-0 translate-y-8 transition-all duration-1000 delay-150">
              <img src={responsible.image || beeFarmImg} alt="Responsible Beekeeping" className="w-full aspect-[4/3] md:aspect-square object-cover rounded-[24px]" />
            </div>
          </div>
        </section>

        {/* 8. THE PEOPLE BEHIND THE HONEY */}
        <section className="py-24 md:py-32 bg-[#FDFBF7]">
          <div className="container-page max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <img src={people.image || familyHoneyImg} alt="The Team" className="w-full aspect-[4/3] object-cover rounded-[24px] shadow-sm" />
            </div>
            <div className="w-full md:w-1/2 space-y-6 reveal opacity-0 translate-y-8 transition-all duration-1000 delay-150">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block">
                {people.eyebrow || "THE PEOPLE BEHIND THE HONEY"}
              </span>
              <h2 className="font-serif text-[36px] sm:text-[48px] leading-tight text-[#2B2118]">
                {people.heading || "A family connected by nature."}
              </h2>
              <div className="text-[16px] text-[#2B2118]/70 leading-relaxed font-light whitespace-pre-wrap space-y-4">
                {people.description || "Saurashtra Honey is a family initiative built on trust, tradition and a deep connection with nature.\n\nFrom managing hives to packing each jar, we do everything with our own hands and a lot of heart.\n\nFor us, this is not just honey. It's our way of life."}
              </div>
              <div className="pt-6 font-serif italic text-2xl text-[#2B2118]">
                {people.signature_text || "— The Saurashtra Honey Family"}
              </div>
            </div>
          </div>
        </section>

        {/* 9. LIFE AROUND THE HIVES (Masonry Gallery) */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container-page max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 reveal opacity-0 translate-y-8 transition-all duration-1000">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4">
                {gallery.eyebrow || "LIFE AROUND OUR HIVES"}
              </span>
              <h2 className="font-serif text-[36px] sm:text-[48px] leading-tight text-[#2B2118]">
                {gallery.heading || "Moments from our everyday life."}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {/* Large vertical */}
              <div className="col-span-2 row-span-2 overflow-hidden rounded-[16px] reveal opacity-0 translate-y-8 transition-all duration-1000 delay-75">
                <img src={gallery.gallery_img_1 || beeFarmImg} className="w-full h-full object-cover min-h-[300px] md:min-h-[600px] hover:scale-105 transition-transform duration-700" alt="Gallery 1" />
              </div>
              {/* Horizontal */}
              <div className="col-span-2 overflow-hidden rounded-[16px] reveal opacity-0 translate-y-8 transition-all duration-1000 delay-100">
                <img src={gallery.gallery_img_4 || honeycombBeesImg} className="w-full h-full object-cover min-h-[150px] md:min-h-[300px] hover:scale-105 transition-transform duration-700" alt="Gallery 4" />
              </div>
              {/* Small square */}
              <div className="col-span-1 overflow-hidden rounded-[16px] reveal opacity-0 translate-y-8 transition-all duration-1000 delay-150">
                <img src={gallery.gallery_img_2 || honeyDrizzleImg} className="w-full h-full object-cover min-h-[150px] md:min-h-[284px] hover:scale-105 transition-transform duration-700" alt="Gallery 2" />
              </div>
              {/* Small square */}
              <div className="col-span-1 overflow-hidden rounded-[16px] reveal opacity-0 translate-y-8 transition-all duration-1000 delay-200">
                <img src={gallery.gallery_img_3 || beeFlowerImg} className="w-full h-full object-cover min-h-[150px] md:min-h-[284px] hover:scale-105 transition-transform duration-700" alt="Gallery 3" />
              </div>
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="relative py-32 bg-[#FDFBF7] overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3">
            <img src={heroHoneyImg} className="w-full h-full object-cover rounded-full blur-3xl" alt="" />
          </div>
          <div className="container-page text-center max-w-3xl mx-auto relative z-10 reveal opacity-0 translate-y-8 transition-all duration-1000">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#3B5241] font-bold block mb-4">
              {finalCta.eyebrow || "FROM SAURASHTRA, WITH CARE"}
            </span>
            <h2 className="font-serif text-[40px] md:text-[56px] leading-tight text-[#2B2118] mb-10">
              {finalCta.heading || "Every jar carries a little piece of where it began."}
            </h2>
            <Link to={finalCta.cta_link || "/shop"} className="inline-flex items-center gap-3 bg-[#3B5241] hover:bg-[#2C3D30] text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase transition-colors">
              {finalCta.cta_text || "SHOP OUR HONEY"} <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
