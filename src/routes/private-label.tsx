import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { Tag, ShieldCheck, Factory, CheckCircle2, Truck, Package, Microscope, Palette } from "lucide-react";
import { toast } from "sonner";
import { submitForm } from "@/lib/submit";
import { z } from "zod";

// Photographic assets
import ajwainImg from "@/assets/prod-ajwain.jpg";
import heroProductsImg from "@/assets/hero-products.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";
import honeycombBeesImg from "@/assets/honeycomb-bees.jpg";

export const Route = createFileRoute("/private-label")({
  head: () => ({
    meta: [
      {
        title: "Private Label Honey Manufacturing | Saurashtra Honey",
      },
      {
        name: "description",
        content: "Start your own honey brand with our end-to-end white label manufacturing. From raw honey sourcing to lab testing, bottle selection, and custom labeling.",
      },
      { property: "og:title", content: "Private Label Honey Manufacturing" },
      { property: "og:description", content: "Your Brand, Our Pure Honey. Complete OEM Solutions." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivateLabelPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  company: z.string().trim().min(2, "Company name is required").max(120),
  country: z.string().trim().min(2, "Country is required").max(80),
  estimated_volume: z.string().min(1, "Volume is required"),
  services: z.string().min(1, "Service type is required"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function PrivateLabelPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", country: "", estimated_volume: "", services: "", message: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await submitForm({
        form_type: "bulk_order",
        name: form.name, email: form.email, phone: form.phone, company: form.company, city: form.country, quantity: form.estimated_volume, message: form.message,
        meta: { purpose: "Private Label", services_needed: form.services },
      });
      toast.success("Manufacturing enquiry received!", { description: "Our OEM specialist will contact you shortly." });
      setForm({ name: "", email: "", phone: "", company: "", country: "", estimated_volume: "", services: "", message: "" });
    } catch {
      toast.error("Couldn't submit right now. Please call +91 96873 28404.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToForm() {
    document.getElementById("start-brand")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SiteLayout>
      <StructuredData data={breadcrumbLd([{ name: "Home", url: "/" }, { name: "Bulk & Gifting", url: "/bulk-gifting" }, { name: "Private Label", url: "/private-label" }])} />

      {/* 1. Premium Hero */}
      <PageHeroSlider page="bulk-orders" />
      <div className="bg-[#2B2118] py-6 flex justify-center gap-4">
        <button onClick={scrollToForm} className="bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B57420] transition-colors">
          Start Your Honey Brand
        </button>
      </div>

      {/* 2. Why Choose This Service */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706]">
              White Label Manufacturing
            </div>
            <h2 className="font-serif text-[34px] sm:text-[44px] text-[#2B2118] leading-tight">
              Your Brand. Our Pure Honey.
            </h2>
            <p className="text-[#6B6257] leading-relaxed text-[16px]">
              Building a premium food brand requires a partner you can completely trust. We provide fully certified OEM/White Label manufacturing services, empowering entrepreneurs and established brands to launch world-class honey products without the hassle of setting up a facility.
            </p>
            <ul className="space-y-4 pt-4">
              {['End-to-End Contract Manufacturing', 'NABL Certified Quality Control', 'Custom Bottle & Jar Sourcing', 'Global Export Support'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#2B2118] font-[500]">
                  <CheckCircle2 className="size-5 text-[#D97706]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg border border-[#D97706]/10">
            <img src={heroProductsImg} alt="Private Label Manufacturing" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 3. Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118]">Complete OEM Solutions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center transition-transform hover:-translate-y-2 duration-500">
              <Microscope className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[20px] font-bold text-[#2B2118] mb-3">Lab Testing</h3>
              <p className="text-[#6B6257] text-[14px] leading-relaxed">Rigorous independent quality control for moisture, HMF, and sugar profiles.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center transition-transform hover:-translate-y-2 duration-500">
              <Package className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[20px] font-bold text-[#2B2118] mb-3">Jar Selection</h3>
              <p className="text-[#6B6257] text-[14px] leading-relaxed">Choose from our extensive catalog of premium glass jars and squeeze bottles.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center transition-transform hover:-translate-y-2 duration-500">
              <Palette className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[20px] font-bold text-[#2B2118] mb-3">Custom Labels</h3>
              <p className="text-[#6B6257] text-[14px] leading-relaxed">In-house design assistance to ensure your labels meet compliance and look stunning.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center transition-transform hover:-translate-y-2 duration-500">
              <ShieldCheck className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[20px] font-bold text-[#2B2118] mb-3">Certifications</h3>
              <p className="text-[#6B6257] text-[14px] leading-relaxed">Manufactured in a certified facility ready for domestic retail and international export.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118]">Launch Timeline</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { t: 'Consultation', d: 'Discuss volume & vision' },
              { t: 'Formulation', d: 'Select honey varieties' },
              { t: 'Packaging', d: 'Finalize jars & labels' },
              { t: 'Production', d: 'Filling & QC testing' },
              { t: 'Delivery', d: 'Dispatch to warehouse' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative group">
                <div className="size-16 rounded-full bg-white border border-[#D97706]/20 flex items-center justify-center text-[#D97706] font-serif text-[24px] font-bold shadow-sm mb-6 z-10 transition-transform duration-500 group-hover:scale-110">
                  {i + 1}
                </div>
                <h3 className="font-bold text-[#2B2118] text-[16px] mb-2">{step.t}</h3>
                <p className="text-[13px] text-[#6B6257] leading-relaxed">{step.d}</p>
                {i < 4 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-[#D97706]/20 -z-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Industries We Serve */}
      <section className="py-20 bg-white">
        <div className="container-page text-center">
          <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118] mb-12">Who Partners With Us</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {['Supermarket Chains', 'Health Supplements', 'D2C Brands', 'International Exporters', 'Boutique Food Labels', 'Wellness Resorts'].map((ind) => (
              <div key={ind} className="px-8 py-4 bg-[#FDFBF7] rounded-full border border-[#D97706]/10 text-[#2B2118] font-bold tracking-wide">
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Gallery */}
      <section className="py-20 bg-[#2B2118]">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[ajwainImg, beeFarmImg, honeycombBeesImg].map((img, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-[16px]">
                <img src={img} alt="Manufacturing" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page max-w-3xl mx-auto">
          <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118] text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "What is the Minimum Order Quantity (MOQ) for private label?", a: "Our private label MOQ starts at 500 units per SKU. This ensures cost-effective production while keeping the barrier to entry manageable for new brands." },
              { q: "Do you assist with FDA / FSSAI labeling compliance?", a: "Yes. Our team will review your label design to ensure all nutritional facts, barcode placements, and legal declarations meet FSSAI and international standards." },
              { q: "Can I provide my own jars and labels?", a: "Absolutely. We offer complete flexibility. You can ship your proprietary packaging to our facility, and we will handle the filling, sealing, and testing." }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-[16px] shadow-sm border border-[#D97706]/10">
                <h3 className="font-bold text-[#2B2118] text-[18px] mb-2">{faq.q}</h3>
                <p className="text-[#6B6257]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-20 bg-white">
        <div className="container-page max-w-4xl mx-auto text-center">
          <div className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706] mb-6">
            Partner Success
          </div>
          <p className="font-serif text-[24px] sm:text-[32px] text-[#2B2118] leading-relaxed italic">
            "Launching our organic food brand seemed daunting until we partnered with Saurashtra Honey. Their contract manufacturing team guided us through jar selection, testing, and scaling up production seamlessly."
          </p>
          <div className="mt-8 font-bold text-[#6B6257] uppercase tracking-widest text-[14px]">
            — Founder, Premium D2C Wellness Brand
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section id="start-brand" className="py-20 bg-[#F8F5EF] border-t border-[#D97706]/20">
        <div className="container-page max-w-2xl mx-auto">
          <div className="bg-white p-8 sm:p-12 rounded-[24px] shadow-xl shadow-black/5">
            <div className="text-center mb-8">
              <h2 className="font-serif text-[32px] font-bold text-[#2B2118] mb-3">Start Your Honey Brand</h2>
              <p className="text-[#6B6257]">Submit your project details below to schedule a consultation with our OEM specialists.</p>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <input type="text" placeholder="Company / Brand Name" value={form.company} onChange={(e) => set("company", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="text" placeholder="Target Country / Market" value={form.country} onChange={(e) => set("country", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <select value={form.estimated_volume} onChange={(e) => set("estimated_volume", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none" required>
                  <option value="" disabled>Estimated Monthly Volume</option>
                  <option value="500-1000 units">500 - 1,000 units</option>
                  <option value="1000-5000 units">1,000 - 5,000 units</option>
                  <option value="5000+ units">5,000+ units</option>
                </select>
              </div>
              <select value={form.services} onChange={(e) => set("services", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none" required>
                <option value="" disabled>Required Services</option>
                <option value="Full Turnkey (Honey + Jars + Labels)">Full Turnkey (Honey + Jars + Labels)</option>
                <option value="Filling Only (We provide packaging)">Filling Only (I will provide packaging)</option>
                <option value="Bulk Honey Supply Only">Bulk Honey Supply Only (Drums/Buckets)</option>
              </select>
              <textarea placeholder="Describe your vision, flavors needed, or any specific certifications..." value={form.message} onChange={(e) => set("message", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] min-h-[120px] resize-y"></textarea>
              
              <button type="submit" disabled={loading} className="w-full py-4 bg-[#D97706] hover:bg-[#B57420] text-white font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 mt-2">
                {loading ? "Sending..." : "Start Your Honey Brand"}
              </button>
            </form>
            
            <div className="mt-8 text-center text-[#6B6257] text-[14px]">
              <p>Or contact us directly:</p>
              <div className="flex items-center justify-center gap-4 mt-2 font-bold text-[#2B2118]">
                <a href="tel:+919687328404" className="hover:text-[#D97706]">📞 +91 96873 28404</a>
                <span>|</span>
                <a href="mailto:oem@saurashtrahoney.com" className="hover:text-[#D97706]">✉️ oem@saurashtrahoney.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
