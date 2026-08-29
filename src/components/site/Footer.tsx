import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Linkedin,
} from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { fetchPublicSiteSettings } from "@/lib/homepage-cms.functions";
import { BrandMark } from "./BeeLogo";
import {
  DEFAULT_SHOP_CATEGORIES,
  fetchShopCategories,
  type ShopCategory,
} from "@/lib/category-catalog";
import { getCategorySlug } from "@/lib/collection-helpers";

function FooterSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-4 lg:space-y-6">
      <h3 className="font-serif text-[12px] font-bold uppercase tracking-[0.2em] text-[#C57A1C]">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const subscribe = useServerFn(subscribeNewsletter);

  const [shopCategories, setShopCategories] = useState<ShopCategory[]>(
    DEFAULT_SHOP_CATEGORIES,
  );
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    void fetchShopCategories().then((res) => {
      if (res && Array.isArray(res) && res.length > 0) {
        setShopCategories(res);
      }
    });
    
    void fetchPublicSiteSettings().then(setSettings);

    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const r = await subscribe({ data: { email, source: "footer" } });
      toast.success(
        r.already
          ? "You're already subscribed 🍯"
          : "Welcome to the hive! Check your inbox to confirm.",
      );
      setEmail("");
    } catch {
      toast.error("Couldn't subscribe right now.");
    } finally {
      setLoading(false);
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const helpLinks = [
    ["FAQs", "/contact"],
    ["Shipping & Delivery", "/contact"],
    ["Returns & Refunds", "/contact"],
    ["Terms & Conditions", "/contact"],
    ["Privacy Policy", "/contact"],
    ["Track Order", "/track-order"],
  ] as const;

  const aboutLinks = [
    ["Our Story", "/our-story"],
    ["Bee Farming", "/bee-farming"],
    ["Quality Promise", "/bee-farming"],
    ["Bulk & Gifting", "/bulk-gifting"],
    ["Journal", "/blog"],
  ] as const;

  const socialLinks = [
    { I: Instagram, href: settings?.social?.instagram || "https://instagram.com", label: "Instagram", show: !!settings?.social?.instagram },
    { I: Facebook, href: settings?.social?.facebook || "https://facebook.com", label: "Facebook", show: !!settings?.social?.facebook },
    { I: Youtube, href: settings?.social?.youtube || "https://youtube.com", label: "YouTube", show: !!settings?.social?.youtube },
    {
      I: MessageCircle,
      href: settings?.contact?.whatsapp ? `https://wa.me/${settings.contact.whatsapp}` : "https://wa.me/919687328404",
      label: "WhatsApp",
      show: !!settings?.contact?.whatsapp
    },
    { I: Linkedin, href: settings?.social?.linkedin || "https://linkedin.com", label: "LinkedIn", show: !!settings?.social?.linkedin },
  ].filter(link => link.show || Object.keys(settings).length === 0);
  return (
    <footer className="relative bg-[#F9F4EC] text-[#2B1D14] pt-20 sm:pt-28 pb-4 overflow-hidden w-full max-w-full">
      {/* Background Parallax Honey Glow (Subtle) */}
      <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-[#C57A1C]/5 to-transparent pointer-events-none opacity-50 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-20">
        <div className="container-page px-6 lg:px-8 pb-12">
          
          {/* ==================================================
              1. DESKTOP 5-COLUMN / MOBILE 2-COLUMN GRID
              ================================================== */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-x-8 gap-y-14 items-start">
            
            {/* BRAND COLUMN */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-6">
                <BrandMark />
                <p className="text-[14px] sm:text-[15px] text-[#2B1D14]/80 max-w-[280px] leading-relaxed font-serif italic">
                  "{settings?.company?.tagline || "Handcrafted honey from the heart of Saurashtra.\nPure. Natural. Honest."}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                {socialLinks.map(({ I, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="size-10 rounded-full bg-[#EFE8DA] border-none text-[#2B1D14]/80 flex items-center justify-center hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(197,122,28,0.15)] hover:text-[#C57A1C] transition-all duration-300"
                  >
                    <I className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* LINKS GRID (Mobile: 2 cols, Desktop: 8 cols spanning) */}
            <div className="lg:col-span-8 w-full grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              
              {/* SHOP COLUMN */}
              <div className="col-span-1">
                <FooterSection title="Shop">
                  <ul className="space-y-4 text-[14px] lg:text-[14px] text-[#2B1D14]/80 font-medium">
                    {shopCategories.slice(0, 6).map((cat) => (
                      <li key={cat.slug}>
                        <Link to="/collections/$slug" params={{ slug: getCategorySlug(cat.slug || cat.name) }} className="hover:text-[#C57A1C] transition-colors duration-300">
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FooterSection>
              </div>

              {/* HELP COLUMN */}
              <div className="col-span-1">
                <FooterSection title="Help">
                  <ul className="space-y-4 text-[14px] lg:text-[14px] text-[#2B1D14]/80 font-medium">
                    {helpLinks.map(([label, href]) => (
                      <li key={label}>
                        <Link to={href} className="hover:text-[#C57A1C] transition-colors duration-300">{label}</Link>
                      </li>
                    ))}
                  </ul>
                </FooterSection>
              </div>

              {/* ABOUT COLUMN */}
              <div className="col-span-1">
                <FooterSection title="About">
                  <ul className="space-y-4 text-[14px] lg:text-[14px] text-[#2B1D14]/80 font-medium">
                    {aboutLinks.map(([label, href]) => (
                      <li key={label}>
                        <Link to={href} className="hover:text-[#C57A1C] transition-colors duration-300">{label}</Link>
                      </li>
                    ))}
                  </ul>
                </FooterSection>
              </div>

              {/* CONTACT COLUMN */}
              <div className="col-span-1">
                <FooterSection title="Contact">
                  <ul className="space-y-4 text-[14px] lg:text-[14px] text-[#2B1D14]/80 font-medium">
                    <li>
                      <a href={`tel:${settings?.contact?.phone || "+919687328404"}`} className="flex items-start gap-3 hover:text-[#C57A1C] transition-colors duration-300">
                        <Phone className="size-4 text-[#C57A1C] shrink-0 mt-0.5" />
                        <span>{settings?.contact?.phone || "+91 96873 28404"}</span>
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${settings?.contact?.email || "hello@saurastrahoney.com"}`} className="flex items-start gap-3 hover:text-[#C57A1C] transition-colors duration-300">
                        <Mail className="size-4 text-[#C57A1C] shrink-0 mt-0.5" />
                        <span>{settings?.contact?.email || "hello@saurastrahoney.com"}</span>
                      </a>
                    </li>
                    <li>
                      <div className="flex items-start gap-3">
                        <MapPin className="size-4 text-[#C57A1C] shrink-0 mt-0.5" />
                        <span className="leading-relaxed whitespace-pre-wrap">{settings?.contact?.address || "At & Post: Dhrangadhra,\nSurendranagar, Gujarat – 363310"}</span>
                      </div>
                    </li>
                    <li className="pt-2">
                      <a href={settings?.contact?.whatsapp ? `https://wa.me/${settings.contact.whatsapp}` : "https://wa.me/919687328404"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#C57A1C] font-bold text-[12px] uppercase tracking-widest hover:text-[#2B1D14] transition-colors duration-300">
                        <MessageCircle className="size-4" /> Chat with us
                      </a>
                    </li>
                  </ul>
                </FooterSection>
              </div>

            </div>
          </div>
        </div>

        {/* ==================================================
            3. COPYRIGHT
            ================================================== */}
        <div className="container-page px-6 lg:px-8 mt-12">
          <div className="w-full h-px bg-[#E6DEC8] opacity-60"></div>
          <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
            <p className="text-sm font-semibold text-brand-orange">
              Crafted with Nature • Harvested with Care
            </p>
            <p className="text-sm text-espresso/50 font-medium">
              {settings?.footer?.copyright || `© ${currentYear} Saurashtra Honey Bee Farm`}
            </p>
          </div>
        </div>
      </div>


    </footer>
  );
}
