import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  ArrowRight,
  PhoneCall,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { useSiteSettings } from "@/lib/site-settings";
import { toast } from "sonner";
import { submitForm } from "@/lib/submit";
import { z } from "zod";

// Assets matching our warm golden farm-origin photography
import honeyDrizzleImg from "@/assets/honey-drizzle.jpg";
import heroProductsImg from "@/assets/hero-products.jpg";
import beeFarmImg from "@/assets/bee-farm.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      {
        title:
          "Contact Us — We'd Love to Hear From You | Saurashtra Honey",
      },
      {
        name: "description",
        content:
          "Have a question, feedback or a special request? Reach out to Saurashtra Honey Bee Farm in Gujarat. Call, email, WhatsApp or send us a message — we are here to help.",
      },
      {
        property: "og:title",
        content: "Contact Us — Saurashtra Honey Bee Farm",
      },
      {
        property: "og:description",
        content:
          "We're Here for You. Let's Connect. Have a question, feedback or special request? We'd love to hear from you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  subject: z.string().min(1, "Please pick a subject"),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

function ContactPage() {
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await submitForm({ form_type: "contact", ...parsed.data });
      toast.success("Message sent!", {
        description: "Our team will get back to you within 24 hours.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error(
        "Couldn't send right now. Please try again or call +91 96873 28404."
      );
    } finally {
      setLoading(false);
    }
  }

  const contactChannels = [
    {
      title: "Call Us",
      value: settings.contact?.phone || "+91 96873 28404",
      subtext: "Mon – Sat: 9:00 AM – 6:00 PM",
      Icon: PhoneCall,
      href: `tel:${settings.contact?.phone?.replace(/\D/g, "") || "+919687328404"}`,
    },
    {
      title: "Email Us",
      value: settings.contact?.email || "hello@saurastrahoney.com",
      subtext: "We reply within 24 hours",
      Icon: Mail,
      href: `mailto:${settings.contact?.email || "hello@saurastrahoney.com"}`,
    },
    {
      title: "Visit Us",
      value: settings.contact?.address || "Saurashtra Honey Bee Farm, Saurashtra, Gujarat, India",
      subtext: "Our apiary & dispatch center",
      Icon: MapPin,
      href: "https://www.google.com/maps",
    },
    {
      title: "WhatsApp Us",
      value: settings.contact?.whatsapp || "+91 96873 28404",
      subtext: "Quick response on WhatsApp",
      Icon: MessageCircle,
      href: `https://wa.me/${settings.contact?.whatsapp?.replace(/\D/g, "") || "919687328404"}`,
    },
  ];

  const faqs = [
    {
      q: "Do you offer bulk orders for businesses?",
      a: "Yes! We supply retail stores, hotels, restaurants, and businesses with custom wholesale pricing on orders over 10 kg. Contact our bulk team or visit our Bulk & Gifting page to request a quote.",
      link: { text: "View Bulk & Gifting", to: "/bulk-gifting" },
    },
    {
      q: "How is your honey tested for purity?",
      a: "Every batch of Saurashtra Honey undergoes strict independent NABL lab testing for moisture content, HMF levels, and sugar profiles to ensure 0% additives and 100% natural purity.",
    },
    {
      q: "Do you ship across India?",
      a: "Yes, we provide safe, insured pan-India delivery. Orders are typically dispatched within 24–48 hours from our farm in Gujarat with full tracking information.",
    },
    {
      q: "What is the difference between raw and processed honey?",
      a: "Our raw honey is never heated above natural hive temperature or ultra-filtered. This preserves living enzymes, natural pollen, and antioxidants that commercial pasteurized honey loses.",
    },
  ];

  return (
    <SiteLayout>
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ])}
      />

      {/* =========================================================================
          2. CONTACT HERO (Left: Eyebrow + Serif Heading + Orange Italics + CTA, Right: Honey Photo)
         ========================================================================= */}
      <PageHeroSlider page="contact" />

      {/* =========================================================================
          4, 5, 6, 7 & 8. MAIN CONTACT SECTION (#contact-section)
         ========================================================================= */}
      <section
        id="contact-section"
        className="py-16 sm:py-24 bg-cream border-b border-border/80"
      >
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT COLUMN: Contact Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs font-bold tracking-[0.25em] uppercase text-brand-orange mb-2">
                  CONTACT US
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso tracking-tight leading-tight">
                  We&apos;d Love to Hear From You!
                </h2>
                <p className="text-sm sm:text-base text-espresso/80 leading-relaxed mt-3 mb-8">
                  Reach out to us for any queries, support or bulk orders. Our
                  team will get back to you as soon as possible.
                </p>
              </div>

              {/* Contact Channels List */}
              <div className="space-y-4">
                {contactChannels.map(
                  ({ title, value, subtext, Icon, href }) => (
                    <a
                      key={title}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-border/80 hover:border-brand-orange hover:shadow-xs transition-all duration-200 group"
                    >
                      <div className="size-12 sm:size-14 rounded-full bg-cream border border-border/70 flex items-center justify-center text-brand-orange shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="size-5 sm:size-6" />
                      </div>
                      <div className="pt-0.5">
                        <div className="font-serif text-base sm:text-lg font-bold text-espresso group-hover:text-brand-orange transition-colors">
                          {title}
                        </div>
                        <div className="font-semibold text-sm text-espresso mt-0.5">
                          {value}
                        </div>
                        <div className="text-xs text-espresso/70 mt-0.5">
                          {subtext}
                        </div>
                      </div>
                    </a>
                  )
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Contact Message Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-border/80 p-8 sm:p-12 shadow-soft">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso mb-7">
                  Send Us a Message
                </h3>

                <form onSubmit={onSubmit} className="space-y-4.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Your Name *"
                      className="w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
                    />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="Email Address *"
                      className="w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="Phone Number *"
                      className="w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
                    />
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      className="w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
                    >
                      <option value="">Subject *</option>
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Order Status & Shipping">
                        Order Status &amp; Shipping
                      </option>
                      <option value="Bulk & Wholesale Request">
                        Bulk &amp; Wholesale Request
                      </option>
                      <option value="Corporate Gifting & Hampers">
                        Corporate Gifting &amp; Hampers
                      </option>
                      <option value="Product & Testing Questions">
                        Product &amp; Testing Questions
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Your Message *"
                    className="w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
                  />

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full px-8 py-4 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-md hover:scale-[1.02] disabled:opacity-60 transition-all"
                    >
                      <span>{loading ? "SENDING..." : "SEND MESSAGE"}</span>
                      <Send className="size-4" />
                    </button>

                    <div className="flex items-center gap-2 text-xs text-espresso/70">
                      <ShieldCheck className="size-4 text-brand-orange shrink-0" />
                      <span>Your information is safe with us.</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. LOCATION / MAP SECTION (#map-section)
         ========================================================================= */}
      <section
        id="map-section"
        className="py-12 sm:py-16 bg-cream border-b border-border/80"
      >
        <div className="container-page">
          <div className="relative w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-border/80 shadow-soft bg-cream-deep min-h-[400px] sm:min-h-0 aspect-auto sm:aspect-[21/8]">
            {/* Interactive OpenStreetMap iframe centered on exact farm location */}
            <iframe
              title="Saurashtra Honey Bee Farm Map Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=71.366%2C22.891%2C71.566%2C23.091&layer=mapnik&marker=22.9914%2C71.4664"
              className="w-full h-full border-0 absolute inset-0"
              loading="lazy"
            />

            {/* Floating Glassmorphism Location Card Overlapping Top-Left of Map */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 bg-white/95 backdrop-blur-md rounded-2xl border border-border/80 p-6 sm:p-7 shadow-lift max-w-xs z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-cream border border-border text-brand-orange flex items-center justify-center shrink-0 shadow-xs">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-espresso">
                    Our Location
                  </h4>
                  <p className="text-xs sm:text-sm text-espresso/75 mt-0.5 leading-relaxed">
                    Saurashtra Honey Bee Farm
                    <br />
                    Saurashtra, Gujarat, India
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=22.9914292,71.4663753"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:translate-x-1 transition-transform mt-4 pt-3 border-t border-border/60 w-full"
              >
                <span>View on Google Maps</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10 & 11. FAQ SECTION + WHATSAPP HELP CARD (#faqs)
         ========================================================================= */}
      <section id="faqs" className="py-16 sm:py-24 bg-cream">
        <div className="container-page">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="text-xs font-bold tracking-[0.25em] uppercase text-brand-orange mb-2">
              FAQS
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto">
            {/* Left Col (7 cols) - Accordion FAQs */}
            <div className="lg:col-span-7 space-y-4">
              {faqs.map(({ q, a }, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={q}
                    className="bg-white rounded-2xl border border-border/80 px-6 py-5 shadow-xs hover:border-brand-orange/60 transition-all cursor-pointer"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-espresso">
                        {q}
                      </h3>
                      <div className="size-8 rounded-full bg-cream flex items-center justify-center text-brand-orange shrink-0">
                        {isOpen ? (
                          <Minus className="size-4" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                      </div>
                    </div>
                    {isOpen && (
                      <p className="mt-3 text-xs sm:text-sm text-espresso/75 leading-relaxed pt-2 border-t border-border/50">
                        {a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Col (5 cols) - WhatsApp Help Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#FFF9ED] border border-border/80 rounded-3xl p-8 sm:p-10 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="size-24 sm:size-28 rounded-2xl overflow-hidden shadow-sm border border-border/60 mb-5">
                    <img
                      src={heroProductsImg}
                      alt="Saurashtra Honey — Pure Raw Honey Support"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso leading-snug">
                    Still have questions?
                    <br />
                    We&apos;re happy to help!
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-espresso/75 leading-relaxed">
                    Chat with our friendly team directly on WhatsApp for quick
                    answers and order assistance.
                  </p>

                  <div className="mt-6">
                    <a
                      href="https://wa.me/919687328404"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full px-7 py-3.5 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all"
                    >
                      <span>CHAT ON WHATSAPP</span>
                      <ArrowRight className="size-4" />
                    </a>
                  </div>
                </div>

                {/* Decorative bee icon on bottom right */}
                <div className="absolute bottom-6 right-6 text-3xl opacity-80 pointer-events-none select-none hidden sm:block">
                  🐝
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY WHATSAPP BUTTON (Mobile Only) */}
      <div className="md:hidden fixed bottom-[84px] right-5 z-40">
        <a
          href="https://wa.me/919687328404"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center size-[52px] bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] active:scale-95 transition-transform"
        >
          <MessageCircle className="size-6" />
        </a>
      </div>
    </SiteLayout>
  );
}
