import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ArrowRight, Download, Award, Package, Megaphone, GraduationCap, Truck, Star, Store, Users2, ShoppingBag, ClipboardList, Headphones, ClipboardCheck, TrendingUp, Leaf, ShieldCheck, Handshake } from "lucide-react";
import handshake from "@/assets/partner-handshake.jpg";
import drizzle from "@/assets/honey-drizzle.jpg";
import { useState } from "react";
import { toast } from "sonner";
import { submitForm } from "@/lib/submit";
import { z } from "zod";

export const Route = createFileRoute("/become-a-partner")({
  head: () => ({
    meta: [
      { title: "Become a Partner — Let's Grow Naturally, Together | Saurashtra Honey" },
      { name: "description", content: "Join hands with Saurashtra Honey — retailers, distributors, wholesalers and online sellers. High margins, marketing support and reliable supply." },
      { property: "og:title", content: "Become a Partner — Saurashtra Honey" },
      { property: "og:description", content: "Let's grow naturally, together. Build a business rooted in purity and trust." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://id-preview--f7347c5b-4839-4afc-a6bf-ed617bd76e1d.lovable.app/become-a-partner" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://id-preview--f7347c5b-4839-4afc-a6bf-ed617bd76e1d.lovable.app/become-a-partner" }],
  }),
  component: Partner,
});

const partnerSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(7, "Phone is required").max(20),
  email: z.string().trim().email("Enter a valid email").max(255),
  city: z.string().trim().min(2, "City is required").max(80),
  interest: z.string().min(1, "Select interest"),
});

const perks = [
  [Award, "Premium Products", "100% pure, raw and unfiltered honey."],
  [Package, "Attractive Margins", "Competitive pricing with good profit."],
  [Megaphone, "Marketing Support", "Product creatives, posters and promotional support."],
  [GraduationCap, "Training & Guidance", "Complete knowledge and business support."],
  [Truck, "Reliable Supply", "Timely delivery and consistent stock."],
];

const whoJoins = [
  [Store, "Retail Stores", "Expand your product range with pure honey."],
  [Award, "Distributors", "Distribute a trusted brand with high demand."],
  [Users2, "Wholesalers", "Partner with a brand that customers love."],
  [ShoppingBag, "Online Sellers", "Sell natural, chemical-free honey online."],
];

const steps = [
  [ClipboardList, "Fill the Form", "Share your details and business information."],
  [Headphones, "Connect With Us", "Our team will connect with you shortly."],
  [ClipboardCheck, "Discuss & Onboard", "We will discuss terms and finalise onboarding."],
  [Package, "Get Products", "Receive your products and marketing materials."],
  [TrendingUp, "Grow Together", "Sell with confidence — we grow together."],
];

const partners = [
  { n: "Manish Patel", role: "Distributor, Rajkot", q: "Saurashtra Honey has excellent quality and the support from their team is outstanding. Great brand to work with." },
  { n: "Neha Agarwal", role: "Retailer, Ahmedabad", q: "The demand for natural honey is always high. My customers love the taste and purity of Saurashtra Honey." },
  { n: "Rakesh Verma", role: "Wholesaler, Surat", q: "Timely delivery, great margins and a trusted product. It's a perfect partnership for our business." },
];

function Partner() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", interest: "" });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = partnerSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    try {
      await submitForm({ form_type: "partner", name: form.name, phone: form.phone, email: form.email, city: form.city, meta: { interest: form.interest } });
      toast.success("Application received!", { description: "Our partnerships team will reach out shortly." });
      setForm({ name: "", phone: "", email: "", city: "", interest: "" });
    } catch { toast.error("Couldn't submit. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <SiteLayout>
      <HeroSlider variant="inner" size="sm" slides={[
        { image: handshake, title: "Let's Grow Together.", ctaTo: "/become-a-partner" },
        { image: drizzle, title: "Stock a Brand Customers Love.", ctaTo: "/become-a-partner" },
        { image: handshake, title: "Reliable Supply. Real Support.", ctaTo: "/contact" },
      ]} />

      {/* WHY */}
      <section className="container-page py-16 grid lg:grid-cols-[1fr_2fr] gap-10 items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-burnt-orange font-bold">Why Partner With Us?</div>
          <h2 className="mt-3 font-serif text-4xl font-bold text-espresso">More Than a Partnership, It's a Growing Relationship.</h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">We provide our partners with everything they need to succeed in the fast-growing natural & organic food market.</p>
          <div className="mt-4 w-12 h-0.5 bg-burnt-orange" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {perks.map(([I, t, b]) => {
            const Icon = I as typeof Award;
            return (
              <div key={t as string} className="text-center bg-cream-deep/50 border border-border/80 rounded-2xl p-5 shadow-xs">
                <div className="mx-auto size-14 rounded-full bg-white flex items-center justify-center text-burnt-orange shadow-xs"><Icon className="size-6" /></div>
                <div className="mt-3.5 font-bold text-sm text-espresso">{t as string}</div>
                <p className="mt-1 text-xs text-muted-foreground">{b as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHO CAN JOIN + PROCESS */}
      <section className="container-page pb-14 grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
        <div className="bg-espresso text-cream rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-lg border border-white/10">
          <div className="text-xs uppercase tracking-widest text-burnt-orange font-bold">Who Can Join?</div>
          <h3 className="mt-2 font-serif text-2xl font-bold">Partner Programs</h3>
          <ul className="mt-7 space-y-6">
            {whoJoins.map(([I, t, b]) => {
              const Icon = I as typeof Store;
              return (
                <li key={t as string} className="flex gap-3.5 items-start">
                  <div className="size-10 rounded-xl bg-cream/10 flex items-center justify-center text-burnt-orange shrink-0"><Icon className="size-5" /></div>
                  <div>
                    <div className="font-bold text-sm text-cream">{t as string}</div>
                    <div className="text-xs text-cream/75 mt-0.5 leading-relaxed">{b as string}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="bg-white border border-border/80 rounded-3xl p-8 md:p-10 shadow-soft">
          <div className="text-xs uppercase tracking-widest text-burnt-orange font-bold">Our Partnership Process</div>
          <h3 className="mt-2 font-serif text-3xl font-bold text-espresso">Simple Steps to Partner With Us</h3>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-5">
            {steps.map(([I, t, b], i) => {
              const Icon = I as typeof ClipboardList;
              return (
                <div key={t as string} className="text-center relative">
                  <div className="mx-auto size-8 rounded-full bg-espresso text-cream text-xs font-bold flex items-center justify-center shadow-xs">{i + 1}</div>
                  <Icon className="mx-auto mt-3.5 size-6 text-burnt-orange" />
                  <div className="mt-2 font-bold text-sm text-espresso">{t as string}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{b as string}</p>
                  {i < steps.length - 1 && <ArrowRight className="hidden md:block absolute top-4 -right-3 size-3.5 text-burnt-orange" />}
                </div>
              );
            })}
          </div>
          <div className="text-center mt-9 pt-6 border-t border-border/60">
            <a href="#apply" className="inline-flex items-center gap-2 bg-espresso text-cream rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all shadow-sm">START PARTNERSHIP JOURNEY <ArrowRight className="size-4" /></a>
          </div>
        </div>
      </section>

      {/* PARTNER APPLICATION FORM */}
      <section id="apply" className="container-page pb-16">
        <div className="bg-espresso text-cream rounded-3xl p-8 md:p-12 shadow-xl border border-white/10 grid lg:grid-cols-[1fr_1.3fr] gap-10 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-burnt-orange font-bold">Apply Online</div>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-bold">Join the Saurashtra Honey Network</h2>
            <p className="mt-3 text-sm text-cream/80 leading-relaxed">Fill out your details below. Our partnership manager will review your profile and connect within 24 hours to discuss margins, samples, and terms.</p>
            <div className="mt-6 space-y-3 text-xs text-cream/75">
              <div className="flex items-center gap-2.5"><ShieldCheck className="size-4 text-burnt-orange" /> 100% Direct Manufacturer Supply</div>
              <div className="flex items-center gap-2.5"><ShieldCheck className="size-4 text-burnt-orange" /> Guaranteed Batch Purity & NABL Reports</div>
              <div className="flex items-center gap-2.5"><ShieldCheck className="size-4 text-burnt-orange" /> Dedicated Regional Marketing Assistance</div>
            </div>
          </div>
          <form onSubmit={onSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <h3 className="font-serif text-xl font-bold text-white mb-5">Partner Registration Form</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full Name *" className="bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm placeholder:text-cream/60 focus:outline-none focus:border-burnt-orange transition-colors" />
              <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone / WhatsApp *" className="bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm placeholder:text-cream/60 focus:outline-none focus:border-burnt-orange transition-colors" />
              <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Business Email *" className="bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm placeholder:text-cream/60 focus:outline-none focus:border-burnt-orange transition-colors" />
              <input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City / State *" className="bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm placeholder:text-cream/60 focus:outline-none focus:border-burnt-orange transition-colors" />
              <select required value={form.interest} onChange={(e) => set("interest", e.target.value)} className="sm:col-span-2 bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm text-cream/90 focus:outline-none focus:border-burnt-orange transition-colors">
                <option value="" className="text-espresso">Select Partnership Type *</option>
                {whoJoins.map(([_, t]) => <option key={t as string} value={t as string} className="text-espresso">{t as string}</option>)}
              </select>
            </div>
            <button disabled={loading} className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-burnt-orange text-white rounded-xl py-3.5 text-xs font-bold tracking-widest hover:bg-terracotta disabled:opacity-60 transition-all shadow-md">
              {loading ? "SUBMITTING…" : "SUBMIT PARTNER APPLICATION"}
            </button>
            <div className="mt-3 text-center text-[11px] text-cream/70">Our team will get in touch shortly after submission.</div>
          </form>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-page py-14">
        <div className="bg-cream-deep/50 border border-border/80 rounded-3xl p-8 md:p-10 shadow-soft">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-burnt-orange font-bold">Our Partners Speak</div>
              <h3 className="mt-2 font-serif text-3xl font-bold text-espresso">Growing Businesses. Building Trust.</h3>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {partners.map((p) => (
              <figure key={p.n} className="bg-white rounded-2xl p-6 border border-border/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-full bg-burnt-orange text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">{p.n[0]}</div>
                    <div>
                      <div className="font-bold text-sm text-espresso">{p.n}</div>
                      <div className="text-xs text-muted-foreground font-medium">{p.role}</div>
                    </div>
                  </div>
                  <blockquote className="mt-4 text-sm text-foreground/85 leading-relaxed">"{p.q}"</blockquote>
                </div>
                <div className="mt-4 flex text-amber-500">{[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-amber-500" />)}</div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl shadow-lg border border-white/10">
          <img src={drizzle} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/95 via-espresso/90 to-espresso/60" />
          <div className="relative p-8 md:p-12 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center text-cream">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Let's create sweetness together.</h2>
              <p className="mt-3 text-sm text-cream/80">Join the Saurashtra Honey family today!</p>
              <a href="#apply" className="mt-6 inline-flex items-center gap-2 bg-burnt-orange text-white rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-terracotta transition-all shadow-md">JOIN NOW <Handshake className="size-4" /></a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {[["10K+", "Happy Partners"], ["500+", "Cities Covered"], ["100%", "Pure & Natural"], ["Growing", "Stronger Together"]].map(([n, l]) => (
                <div key={l} className="text-center border-l border-cream/25 first:border-0 pl-3">
                  <div className="font-serif text-2xl font-bold text-burnt-orange">{n}</div>
                  <div className="text-cream/75 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
