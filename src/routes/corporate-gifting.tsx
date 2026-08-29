import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { Gift, ShieldCheck, HeartHandshake, PenTool, CheckCircle2, Building, Send, Award } from "lucide-react";
import { toast } from "sonner";
import { submitForm } from "@/lib/submit";
import { z } from "zod";

// Photographic assets
import giftPackImg from "@/assets/prod-giftpack.jpg";
import heroProductsImg from "@/assets/hero-products.jpg";
import familyHoneyImg from "@/assets/family-honey.jpg";

export const Route = createFileRoute("/corporate-gifting")({
  head: () => ({
    meta: [
      {
        title: "Corporate Gifting & Luxury Honey Hampers | Saurashtra Honey",
      },
      {
        name: "description",
        content: "Elevate your corporate gifting with premium natural honey hampers. Custom branding, greeting cards, and bulk delivery for clients and employees.",
      },
      { property: "og:title", content: "Corporate Gifting — Saurashtra Honey" },
      { property: "og:description", content: "Thoughtful luxury honey gifts that leave a sweet impression." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CorporateGiftingPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  company: z.string().trim().min(2, "Company name is required").max(120),
  quantity: z.string().min(1, "Quantity is required"),
  occasion: z.string().min(1, "Occasion is required"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function CorporateGiftingPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", quantity: "", occasion: "", message: "",
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
        name: form.name, email: form.email, phone: form.phone, company: form.company, city: "N/A", quantity: form.quantity, message: form.message,
        meta: { purpose: "Corporate Gifting", occasion: form.occasion },
      });
      toast.success("Request received!", { description: "Our gifting concierge will contact you shortly." });
      setForm({ name: "", email: "", phone: "", company: "", quantity: "", occasion: "", message: "" });
    } catch {
      toast.error("Couldn't submit right now. Please call +91 96873 28404.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToForm() {
    document.getElementById("request-catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SiteLayout>
      <StructuredData data={breadcrumbLd([{ name: "Home", url: "/" }, { name: "Bulk & Gifting", url: "/bulk-gifting" }, { name: "Corporate Gifting", url: "/corporate-gifting" }])} />

      {/* 1. Premium Hero */}
      <PageHeroSlider page="bulk-orders" />
      <div className="bg-[#2B2118] py-6 flex justify-center gap-4">
        <button onClick={scrollToForm} className="bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B57420] transition-colors">
          Request Corporate Catalogue
        </button>
      </div>

      {/* 2. Why Choose This Service */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 w-full relative aspect-square rounded-[24px] overflow-hidden">
            <img src={giftPackImg} alt="Corporate Gifting" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-6">
            <div className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706]">
              A Gift of Health
            </div>
            <h2 className="font-serif text-[34px] sm:text-[44px] text-[#2B2118] leading-tight">
              Gifts That Leave a Lasting Impression
            </h2>
            <p className="text-[#6B6257] leading-relaxed text-[16px]">
              Corporate gifting should be more than just a formality. At Saurashtra Honey, we craft premium, health-conscious gifts that reflect your company's values and genuine appreciation. From Diwali to work anniversaries, our pure honey hampers stand out.
            </p>
            <ul className="space-y-4 pt-4">
              {['100% Pure, Healthy & Meaningful', 'Fully Customizable Branding', 'Premium Luxury Packaging', 'Hassle-Free Doorstep Delivery'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#2B2118] font-[500]">
                  <CheckCircle2 className="size-5 text-[#D97706]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118]">Tailored for Your Brand</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center">
              <PenTool className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Custom Branding</h3>
              <p className="text-[#6B6257] leading-relaxed">Incorporate your company logo, custom sleeves, and personalized greeting cards.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center">
              <Gift className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Curated Options</h3>
              <p className="text-[#6B6257] leading-relaxed">Choose from single jars, multi-flavor luxury boxes, or elaborate festive hampers.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center">
              <Send className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Bulk Delivery</h3>
              <p className="text-[#6B6257] leading-relaxed">We manage the logistics. Ship in bulk to your office or individually to employee homes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118]">The Gifting Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {['Choose Your Hamper', 'Customize & Brand', 'Finalize Details', 'Delivered with Care'].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="size-16 rounded-full bg-white border border-[#D97706]/20 flex items-center justify-center text-[#D97706] font-serif text-[24px] font-bold shadow-sm mb-6">
                  {i + 1}
                </div>
                <h3 className="font-bold text-[#2B2118] text-[18px] mb-2">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Industries We Serve */}
      <section className="py-20 bg-white">
        <div className="container-page text-center">
          <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118] mb-12">Perfect For Every Industry</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {['Tech Companies', 'Financial Institutions', 'Real Estate Developers', 'Creative Agencies', 'Law Firms', 'Healthcare'].map((ind) => (
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
            {[heroProductsImg, giftPackImg, familyHoneyImg].map((img, idx) => (
              <div key={idx} className="aspect-[4/5] overflow-hidden rounded-[16px]">
                <img src={img} alt="Corporate Gifting" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
              { q: "What is the minimum order quantity for corporate gifts?", a: "Our corporate gifting MOQ starts at 50 units for standard hampers and 100 units for fully customized branding." },
              { q: "Can you ship directly to our employees' homes?", a: "Yes, we offer direct-to-home fulfillment services. You provide the address list, and we handle individual dispatch and tracking." },
              { q: "How far in advance should we place an order for Diwali?", a: "For major festivals like Diwali, we recommend confirming your order 4-6 weeks in advance to ensure stock availability and ample time for custom branding." }
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
            Client Testimonials
          </div>
          <p className="font-serif text-[24px] sm:text-[32px] text-[#2B2118] leading-relaxed italic">
            "We switched to Saurashtra Honey for our annual Diwali gifts and the response from our clients was overwhelming. The premium packaging and the purity of the honey perfectly aligned with our brand image."
          </p>
          <div className="mt-8 font-bold text-[#6B6257] uppercase tracking-widest text-[14px]">
            — HR Director, Leading Tech Firm
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section id="request-catalogue" className="py-20 bg-[#F8F5EF] border-t border-[#D97706]/20">
        <div className="container-page max-w-2xl mx-auto">
          <div className="bg-white p-8 sm:p-12 rounded-[24px] shadow-xl shadow-black/5">
            <div className="text-center mb-8">
              <h2 className="font-serif text-[32px] font-bold text-[#2B2118] mb-3">Request Corporate Catalogue</h2>
              <p className="text-[#6B6257]">Fill out the details below to receive our latest gifting catalogue and pricing.</p>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <input type="text" placeholder="Company Name" value={form.company} onChange={(e) => set("company", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <select value={form.occasion} onChange={(e) => set("occasion", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none" required>
                  <option value="" disabled>Gifting Occasion</option>
                  <option value="Diwali / Festivals">Diwali / Festivals</option>
                  <option value="Employee Onboarding">Employee Onboarding</option>
                  <option value="Client Appreciation">Client Appreciation</option>
                  <option value="Other">Other</option>
                </select>
                <select value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none" required>
                  <option value="" disabled>Estimated Quantity</option>
                  <option value="50-100">50 - 100 boxes</option>
                  <option value="100-500">100 - 500 boxes</option>
                  <option value="500+">500+ boxes</option>
                </select>
              </div>
              <textarea placeholder="Any specific requirements or budget..." value={form.message} onChange={(e) => set("message", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] min-h-[120px] resize-y"></textarea>
              
              <button type="submit" disabled={loading} className="w-full py-4 bg-[#D97706] hover:bg-[#B57420] text-white font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 mt-2">
                {loading ? "Sending..." : "Request Catalogue"}
              </button>
            </form>
            
            <div className="mt-8 text-center text-[#6B6257] text-[14px]">
              <p>Or contact us directly:</p>
              <div className="flex items-center justify-center gap-4 mt-2 font-bold text-[#2B2118]">
                <a href="tel:+919687328404" className="hover:text-[#D97706]">📞 +91 96873 28404</a>
                <span>|</span>
                <a href="mailto:gifting@saurashtrahoney.com" className="hover:text-[#D97706]">✉️ gifting@saurashtrahoney.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
