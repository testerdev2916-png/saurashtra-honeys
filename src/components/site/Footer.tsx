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
import { BrandMark } from "./BeeLogo";
import { useSiteSettings } from "@/lib/site-settings";
import {
  DEFAULT_SHOP_CATEGORIES,
  fetchShopCategories,
  type ShopCategory,
} from "@/lib/category-catalog";
import { getCategorySlug } from "@/lib/collection-helpers";


const HoneycombCluster = ({ cx, cy, radius, opacity = 0.3 }: { cx: number, cy: number, radius: number, opacity?: number }) => {
  const R = 32;
  const w = Math.sqrt(3) * R; 
  const h = 2 * R; 
  const hexes = [];
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      const x = cx + w * (q + r/2);
      const y = cy + (h * 3/4) * r;
      const dist = Math.sqrt(q*q + r*r + (q+r)*(q+r));
      const hexOpacity = Math.max(0, 1 - dist/(radius+0.5));
      if (hexOpacity > 0.05) {
         hexes.push(<polygon key={`${q}-${r}`} points={`${x},${y-R} ${x+w/2},${y-R/2} ${x+w/2},${y+R/2} ${x},${y+R} ${x-w/2},${y+R/2} ${x-w/2},${y-R/2}`} opacity={hexOpacity * opacity} />);
      }
    }
  }
  return <g stroke="#E6DDCF" strokeWidth="1" fill="none">{hexes}</g>;
};

const FooterDecorativeBackground = () => (
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
    
    {/* Top Corner Honeycombs */}
    <div className="absolute top-0 left-0 w-full h-[400px]">
      <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMin slice" className="absolute top-0 w-full h-full">
        <HoneycombCluster cx={50} cy={100} radius={5} opacity={0.15} />
        <HoneycombCluster cx={1390} cy={150} radius={4} opacity={0.1} />
      </svg>
    </div>

    {/* Bottom Waves */}
    <div className="absolute bottom-0 left-0 w-full h-[400px]">
      <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 w-full h-full text-[#9A855A]">
        {/* Soft Smooth Landscape Waves */}
        <path d="M0,280 C300,350 700,200 1440,300 L1440,400 L0,400 Z" fill="#F6EFE3" opacity="0.6" />
        <path d="M0,320 C400,380 800,250 1440,350 L1440,400 L0,400 Z" fill="#F1EAD7" opacity="0.5" />
        <path d="M0,350 C500,400 900,300 1440,380 L1440,400 L0,400 Z" fill="#EAE2CD" opacity="0.4" />
      </svg>
    </div>

    {/* Exact Match Realistic Botanicals 
        Scaled up significantly and positioned perfectly at the edges as shown in the mockup 
    */}
    <img 
      src="/images/footer-botanical-left.jpg" 
      alt=""
      className="absolute bottom-[-10px] left-[-30px] w-[300px] md:w-[450px] lg:w-[600px] h-auto mix-blend-darken brightness-[1.05] contrast-[1.05] opacity-40 object-contain origin-bottom-left"
      style={{
        WebkitMaskImage: 'radial-gradient(110% 110% at 0% 100%, black 75%, transparent 100%)',
        maskImage: 'radial-gradient(110% 110% at 0% 100%, black 75%, transparent 100%)'
      }}
    />
    <img 
      src="/images/footer-botanical-right.jpg" 
      alt=""
      className="absolute bottom-[-10px] right-[-30px] w-[300px] md:w-[450px] lg:w-[600px] h-auto mix-blend-darken brightness-[1.05] contrast-[1.05] opacity-40 object-contain origin-bottom-right"
      style={{
        WebkitMaskImage: 'radial-gradient(110% 110% at 100% 100%, black 75%, transparent 100%)',
        maskImage: 'radial-gradient(110% 110% at 100% 100%, black 75%, transparent 100%)'
      }}
    />
  </div>
);

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
  
  const settings = useSiteSettings();

  useEffect(() => {
    void fetchShopCategories().then((res) => {
      if (res && Array.isArray(res) && res.length > 0) {
        setShopCategories(res);
      }
    });

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
    <footer className="relative bg-[#FCFAF5] text-[#2B1D14] pt-20 sm:pt-28 pb-4 overflow-hidden w-full max-w-full">
      <FooterDecorativeBackground />

      {/* FOREGROUND CONTENT */}
      <div className="relative z-20">
        <div className="container-page px-6 lg:px-8 pb-12">
          
          {/* ==================================================
              1. DESKTOP 5-COLUMN / MOBILE 2-COLUMN GRID
              ================================================== */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-x-8 gap-y-14 items-start">
            
            {/* BRAND COLUMN */}
            <div className="lg:col-span-4 flex flex-col items-center text-center w-full">
              <BrandMark />
              
              <p className="mt-10 text-[14px] sm:text-[15px] text-[#2B1D14]/80 max-w-[280px] leading-relaxed font-serif italic">
                "{settings.company?.tagline || "Handcrafted honey from the heart of Saurashtra.\nPure. Natural. Honest."}"
              </p>
              
              <div className="mt-10 flex items-center justify-center gap-4">
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
                    {shopCategories.map((cat) => {
                      const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      const isAll = slug === "all-products" || slug === "all";
                      
                      if (isAll) {
                        return (
                          <li key={cat.slug || cat.name}>
                            <Link to="/shop" className="hover:text-[#C57A1C] transition-colors duration-300">
                              {cat.name}
                            </Link>
                          </li>
                        );
                      }

                      return (
                        <li key={cat.slug || cat.name}>
                          <Link 
                            to="/shop/$slug" 
                            params={{ slug }} 
                            className="hover:text-[#C57A1C] transition-colors duration-300"
                          >
                            {cat.name}
                          </Link>
                        </li>
                      );
                    })}
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
        <div className="container-page px-6 lg:px-8 mt-12 pb-6">
          <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
            <p className="text-[15px] font-semibold text-[#C57A1C]">
              Crafted with Nature • Harvested with Care
            </p>
            <p className="text-sm text-[#2B1D14]/60 font-medium">
              {(settings as any)?.footer?.copyright || `© ${currentYear} Saurashtra Honey Bee Farm`}
            </p>
          </div>
        </div>
      </div>


    </footer>
  );
}
