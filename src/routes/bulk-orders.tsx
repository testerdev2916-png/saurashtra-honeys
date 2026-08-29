import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { Package, ShieldCheck, Truck, ArrowRight, CheckCircle2, Factory, Store, Hotel } from "lucide-react";
import { toast } from "sonner";
import { submitForm } from "@/lib/submit";
import { z } from "zod";

// Photographic assets
import heroProductsImg from "@/assets/hero-products.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";
import familyHoneyImg from "@/assets/family-honey.jpg";

export const Route = createFileRoute("/bulk-orders")({
  head: () => ({
    meta: [
      {
        title: "Wholesale & Bulk Honey Orders | Saurashtra Honey",
      },
      {
        name: "description",
        content: "Premium wholesale honey supply for restaurants, retailers, hotels, and distributors. Custom packaging, reliable delivery, and competitive B2B pricing.",
      },
      { property: "og:title", content: "Wholesale Honey Supply — Saurashtra Honey" },
      { property: "og:description", content: "Premium bulk honey for businesses." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BulkOrdersPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  company: z.string().trim().min(2, "Company name is required").max(120),
  city: z.string().trim().min(2, "City is required").max(80),
  quantity: z.string().min(1, "Quantity is required"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function BulkOrdersPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    quantity: "",
    message: "",
  });

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

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
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        city: form.city,
        quantity: form.quantity,
        message: form.message,
      });
      toast.success("Request received!", {
        description: "Our wholesale team will contact you within 24 hours.",
      });
      setForm({ name: "", email: "", phone: "", company: "", city: "", quantity: "", message: "" });
    } catch {
      toast.error("Couldn't submit right now. Please call +91 96873 28404.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToForm() {
    document.getElementById("request-quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SiteLayout>
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Bulk & Gifting", url: "/bulk-gifting" },
          { name: "Bulk Orders", url: "/bulk-orders" },
        ])}
      />

      {/* 1. Premium Hero */}
      <PageHeroSlider page="bulk-orders" />
      <div className="bg-[#2B2118] py-6 flex justify-center gap-4">
        <button onClick={scrollToForm} className="bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B57420] transition-colors">
          Request Wholesale Pricing
        </button>
      </div>

      {/* 2. Why Choose This Service */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706]">
              Trusted Supply Partner
            </div>
            <h2 className="font-serif text-[34px] sm:text-[44px] text-[#2B2118] leading-tight">
              Uncompromising Quality at Scale
            </h2>
            <p className="text-[#6B6257] leading-relaxed text-[16px]">
              When you partner with Saurashtra Honey, you are guaranteed 100% pure, natural honey sourced directly from our ethical farms. We maintain strict quality control across every batch, ensuring your business receives exactly what was promised—every single time.
            </p>
            <ul className="space-y-4 pt-4">
              {['Low Minimum Order Quantities (MOQ)', 'Customizable Packaging Sizes', 'NABL Lab Certified Purity', 'Dedicated Account Manager'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#2B2118] font-[500]">
                  <CheckCircle2 className="size-5 text-[#D97706]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full relative aspect-square rounded-[24px] overflow-hidden">
            <img src={beeFarmImg} alt="Honey farm" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 3. Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118]">Wholesale Benefits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15">
              <Package className="size-10 text-[#D97706] mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Flexible Packaging</h3>
              <p className="text-[#6B6257] leading-relaxed">Available in bulk food-grade buckets, drums, or retail-ready glass jars.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15">
              <Truck className="size-10 text-[#D97706] mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Fast Delivery</h3>
              <p className="text-[#6B6257] leading-relaxed">Reliable pan-India dispatch and logistics support to keep your inventory full.</p>
            </div>
            <div className="p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15">
              <ShieldCheck className="size-10 text-[#D97706] mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-[22px] font-bold text-[#2B2118] mb-3">Consistent Pricing</h3>
              <p className="text-[#6B6257] leading-relaxed">Transparent B2B pricing structures designed to support your margins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-20 bg-[#FDFBF7]">
        <div className="container-page">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118]">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {['Submit Enquiry', 'Consultation & Samples', 'Confirm Order', 'Dispatch & Delivery'].map((step, i) => (
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
          <h2 className="font-serif text-[36px] sm:text-[44px] text-[#2B2118] mb-12">Industries We Serve</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {['Restaurants & Cafes', 'Luxury Hotels', 'Retail Chains', 'Distributors', 'Health Food Brands', 'Bakeries'].map((ind) => (
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
            {[heroProductsImg, beeFarmImg, familyHoneyImg].map((img, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-[16px]">
                <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
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
              { q: "What is the Minimum Order Quantity (MOQ)?", a: "Our wholesale MOQ starts at just 10kg, making it accessible for both small cafes and large retail chains." },
              { q: "Do you provide lab test reports?", a: "Yes, every bulk dispatch is accompanied by an independent NABL lab report guaranteeing purity." },
              { q: "Can I get samples before ordering?", a: "Absolutely. We provide commercial sample kits for businesses to evaluate quality and taste profiles." }
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
            Partner Testimonials
          </div>
          <p className="font-serif text-[24px] sm:text-[32px] text-[#2B2118] leading-relaxed italic">
            "Saurashtra Honey has been our exclusive supplier for over two years. Their consistency in quality and flawless delivery schedule has made them an invaluable partner for our restaurant chain."
          </p>
          <div className="mt-8 font-bold text-[#6B6257] uppercase tracking-widest text-[14px]">
            — Executive Chef, Premium Hospitality Group
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section id="request-quote" className="py-20 bg-[#F8F5EF] border-t border-[#D97706]/20">
        <div className="container-page max-w-2xl mx-auto">
          <div className="bg-white p-8 sm:p-12 rounded-[24px] shadow-xl shadow-black/5">
            <div className="text-center mb-8">
              <h2 className="font-serif text-[32px] font-bold text-[#2B2118] mb-3">Request Wholesale Pricing</h2>
              <p className="text-[#6B6257]">Fill out the details below and our B2B team will reach out shortly.</p>
            </div>
            
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <input type="text" placeholder="Company / Business Name" value={form.company} onChange={(e) => set("company", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="email" placeholder="Email Address" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input type="text" placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]" required />
                <select value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none" required>
                  <option value="" disabled>Estimated Monthly Quantity</option>
                  <option value="10-50kg">10 - 50 kg</option>
                  <option value="50-200kg">50 - 200 kg</option>
                  <option value="200kg+">200+ kg</option>
                </select>
              </div>
              <textarea placeholder="Tell us about your requirements..." value={form.message} onChange={(e) => set("message", e.target.value)} className="w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] min-h-[120px] resize-y"></textarea>
              
              <button type="submit" disabled={loading} className="w-full py-4 bg-[#D97706] hover:bg-[#B57420] text-white font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 mt-2">
                {loading ? "Sending..." : "Submit Request"}
              </button>
            </form>
            
            <div className="mt-8 text-center text-[#6B6257] text-[14px]">
              <p>Or contact us directly:</p>
              <div className="flex items-center justify-center gap-4 mt-2 font-bold text-[#2B2118]">
                <a href="tel:+919687328404" className="hover:text-[#D97706]">📞 +91 96873 28404</a>
                <span>|</span>
                <a href="mailto:wholesale@saurashtrahoney.com" className="hover:text-[#D97706]">✉️ wholesale@saurashtrahoney.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
