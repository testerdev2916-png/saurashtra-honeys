import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { Sparkles, CheckCircle2, Gift, PenTool, Send, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { submitForm } from "@/lib/submit";
import { z } from "zod";

// Photographic assets
import giftPackImg from "@/assets/prod-giftpack.jpg";
import heroHoneyImg from "@/assets/hero-honey.jpg";
import beeFlowerImg from "@/assets/bee-flower.jpg";

export const Route = createFileRoute("/gift-hampers")({
  head: () => ({
    meta: [
      {
        title: "Luxury Honey Gift Hampers | Saurashtra Honey",
      },
      {
        name: "description",
        content: "Curated premium honey gift hampers for weddings, birthdays, return gifts, and festivals. Beautiful packaging with personalized notes and custom ribbons.",
      },
      { property: "og:title", content: "Luxury Honey Gift Hampers" },
      { property: "og:description", content: "The perfect sweet gift for your loved ones." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GiftHampersPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  occasion: z.string().min(1, "Occasion is required"),
  quantity: z.string().min(1, "Quantity is required"),
  customization: z.string().min(1, "Preference is required"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function GiftHampersPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", occasion: "", quantity: "", customization: "", message: "",
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
        name: form.name, email: form.email, phone: form.phone, company: "N/A", city: "N/A", quantity: form.quantity, message: form.message,
        meta: { purpose: "Gift Hampers", occasion: form.occasion, customization: form.customization },
      });
      toast.success("Design request received!", { description: "Our gifting specialist will contact you shortly." });
      setForm({ name: "", email: "", phone: "", occasion: "", quantity: "", customization: "", message: "" });
    } catch {
      toast.error("Couldn't submit right now. Please call +91 96873 28404.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToForm() {
    document.getElementById("design-hamper")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SiteLayout>
      <StructuredData data={breadcrumbLd([{ name: "Home", url: "/" }, { name: "Bulk & Gifting", url: "/bulk-gifting" }, { name: "Gift Hampers", url: "/gift-hampers" }])} />

      {/* 1. Premium Hero */}
      <PageHeroSlider page="bulk-orders" />
      <div className="bg-[#2B2118] py-6 flex justify-center gap-4">
        <button onClick={scrollToForm} className="bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B57420] transition-colors">
          Design My Gift Hamper
        </button>
      </div>

      {/* 2. Why Choose This Service */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706]">
              Meaningful Gifting
            </div>
            <h2 className="font-serif text-[34px] sm:text-[44px] text-[#2B2118] leading-tight">
              Curated with Care, Wrapped with Love
            </h2>
            <p className="text-[#6B6257] leading-relaxed text-[16px]">
              Gift health, taste, and purity. Our premium honey hampers are designed to make your special occasions unforgettable. Whether it's a wedding return gift or a festive family present, Saurashtra Honey delivers joy in every jar.
            </p>
            <ul className="space-y-4 pt-4">
              {['Beautiful Luxury Packaging', 'Personalized Handwritten Notes', 'Premium Satin Ribbon Options', 'Selection of Exotic Flora Honey'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#2B2118] font-[500]">
                  <CheckCircle2 className="size-5 text-[#D97706]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg">
            <img src={heroHoneyImg} alt="Luxury Honey Hamper" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 3. Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118]">Hamper Customizations</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center">
              <Sparkles className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Premium Presentation</h3>
              <p className="text-[#6B6257] leading-relaxed">Elegant wooden boxes, gold foil detailing, and custom ribbons for an unforgettable unboxing.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center">
              <PenTool className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Personalized Notes</h3>
              <p className="text-[#6B6257] leading-relaxed">Add a touch of warmth with custom printed or handwritten message cards in every box.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center">
              <Gift className="size-10 text-[#D97706] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Curated Varieties</h3>
              <p className="text-[#6B6257] leading-relaxed">Combine distinct flavors like Ajwain, Fennel, and Lychee in beautifully matched sets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118]">Designing Your Hamper</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {['Select Honey Flavors', 'Choose Packaging Style', 'Add Personalization', 'Delivered Safely'].map((step, i) => (
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

      {/* 5. Occasions We Serve */}
      <section className="py-20 bg-white">
        <div className="container-page text-center">
          <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118] mb-12">Perfect For Every Occasion</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {['Wedding Invitations', 'Return Gifts', 'Diwali & Festivals', 'Baby Showers', 'Birthdays', 'Anniversaries'].map((ind) => (
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
            {[heroHoneyImg, giftPackImg, beeFlowerImg].map((img, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-[16px]">
                <img src={img} alt="Gift Hampers" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
              { q: "Can I mix different sizes of honey jars in one hamper?", a: "Yes, our luxury gift boxes are designed to hold various combinations of 250g and 500g jars." },
              { q: "Is there a minimum order for custom ribbon and tags?", a: "Custom tags and ribbon printing are available for orders of 25 hampers or more." },
              { q: "Do you deliver pan-India for weddings?", a: "Absolutely! We specialize in secure, pan-India logistics to ensure your hampers arrive perfectly intact." }
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
            Happy Families
          </div>
          <p className="font-serif text-[24px] sm:text-[32px] text-[#2B2118] leading-relaxed italic">
            "We used Saurashtra Honey hampers as our wedding return gifts. The packaging was absolutely stunning and our guests loved the premium quality and the personalized tags."
          </p>
          <div className="mt-8 font-bold text-[#6B6257] uppercase tracking-widest text-[14px]">
            — Priya & Rahul, Mumbai
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section id="design-hamper" className="py-20 bg-[#F8F5EF] border-t border-[#D97706]/20">
        <div className="container-page max-w-2xl mx-auto">
          <div className="bg-white p-8 sm:p-12 rounded-[24px] shadow-xl shadow-black/5">
            <div className="text-center mb-8">
              <h2 className="font-serif text-[32px] font-bold text-[#2B2118] mb-3">Design My Gift Hamper</h2>
              <p className="text-[#6B6257]">Tell us about your occasion, and our design team will help you craft the perfect gift.</p>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <select value={form.occasion} onChange={(e) => set("occasion", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none" required>
                  <option value="" disabled>Occasion</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Festival">Festival</option>
                  <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <select value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none" required>
                  <option value="" disabled>Number of Hampers</option>
                  <option value="10-50">10 - 50 Hampers</option>
                  <option value="50-150">50 - 150 Hampers</option>
                  <option value="150+">150+ Hampers</option>
                </select>
                <select value={form.customization} onChange={(e) => set("customization", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none" required>
                  <option value="" disabled>Customization Need</option>
                  <option value="Standard Premium Box">Standard Premium Box</option>
                  <option value="Custom Tags & Notes">Custom Tags & Notes</option>
                  <option value="Fully Custom Branding">Fully Custom Branding</option>
                </select>
              </div>
              <textarea placeholder="Tell us more about your ideas or preferences..." value={form.message} onChange={(e) => set("message", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] min-h-[120px] resize-y"></textarea>
              
              <button type="submit" disabled={loading} className="w-full py-4 bg-[#D97706] hover:bg-[#B57420] text-white font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 mt-2">
                {loading ? "Sending..." : "Submit Enquiry"}
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
