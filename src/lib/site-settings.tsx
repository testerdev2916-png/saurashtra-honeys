import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  company: { name: string; tagline: string; logo_url: string; favicon_url: string };
  contact: { email: string; phone: string; whatsapp: string; address: string };
  seo: {
    default_title: string;
    default_description: string;
    default_keywords: string;
    default_og_image: string;
  };
  analytics: {
    ga4_measurement_id: string;
    meta_pixel_id: string;
    clarity_id: string;
    gsc_verification: string;
  };
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    x: string;
    pinterest: string;
  };
  whatsapp: { enabled: boolean; number: string; default_message: string };
  newsletter: { double_opt_in: boolean; welcome_reward_points: number };
  loyalty: {
    enabled: boolean;
    points_per_rupee: number;
    redeem_rate_paise: number;
    signup_bonus: number;
    referral_reward: number;
    referred_reward: number;
  };
  features: {
    recently_purchased_popup: boolean;
    trust_badges: boolean;
    low_stock_message: boolean;
    exit_intent_ready: boolean;
  };
  robots: { disallow_paths: string[]; extra: string };
  i18n: { default_locale: string; supported_locales: string[] };
};

const CACHE_KEY = "saurashtra_site_settings_v2";

const DEFAULTS: SiteSettings = {
  company: {
    name: "Saurashtra Honey",
    tagline: "Pure • Traceable • Lab-tested",
    logo_url:
      "https://ik.imagekit.io/fqbnkx3tz/saurashtra-honey/logos/HONEY_BEE_FARM4_HO5d9ZgI3.png",
    favicon_url:
      "https://ik.imagekit.io/fqbnkx3tz/saurashtra-honey/logos/fevicon_for_bees_9AwWZ6YRm.png",
  },
  contact: {
    email: "saurashtra.honey@gmail.com",
    phone: "+91 9664637665",
    whatsapp: "+91 9664637665",
    address: "At. Farm, Nicha Kotda,\nTa. Mahuva, Dist. Bhavnagar,\nGujarat – 364130",
  },
  seo: {
    default_title: "Saurashtra Honey",
    default_description: "Pure, raw and unfiltered honey from Saurashtra.",
    default_keywords: "",
    default_og_image: "",
  },
  analytics: { ga4_measurement_id: "", meta_pixel_id: "", clarity_id: "", gsc_verification: "" },
  social: {
    instagram: "https://www.instagram.com/saurashtra_honey?igsh=MTg1dnU5eDB1cWVoNg==",
    facebook: "https://www.facebook.com/Saurashtrahoneybeefarm/",
    youtube: "https://www.youtube.com/@saurashtrahoney2059",
    linkedin: "",
    x: "",
    pinterest: "",
  },
  whatsapp: {
    enabled: true,
    number: "919664637665",
    default_message: "Hi! I would like to know more about your honey.",
  },
  newsletter: { double_opt_in: true, welcome_reward_points: 0 },
  loyalty: {
    enabled: true,
    points_per_rupee: 1,
    redeem_rate_paise: 100,
    signup_bonus: 0,
    referral_reward: 100,
    referred_reward: 50,
  },
  features: {
    recently_purchased_popup: true,
    trust_badges: true,
    low_stock_message: true,
    exit_intent_ready: true,
  },
  robots: { disallow_paths: ["/admin", "/account", "/checkout", "/order", "/lovable"], extra: "" },
  i18n: { default_locale: "en", supported_locales: ["en", "hi", "gu"] },
};

function getInitialSettings(): SiteSettings {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const merged = { ...DEFAULTS } as SiteSettings;
        for (const [k, v] of Object.entries(parsed)) {
          if (merged[k as keyof SiteSettings] && typeof v === "object" && v !== null) {
            (merged as Record<string, unknown>)[k] = {
              ...(DEFAULTS[k as keyof SiteSettings] as object),
              ...(v as object),
            };
          }
        }
        if (merged.company.logo_url?.includes("res.cloudinary.com/yzmffalu/")) {
          merged.company.logo_url = DEFAULTS.company.logo_url;
        }
        if (merged.company.favicon_url?.includes("res.cloudinary.com/yzmffalu/")) {
          merged.company.favicon_url = DEFAULTS.company.favicon_url;
        }
        return merged;
      }
    } catch {
      // ignore
    }
  }
  return DEFAULTS;
}

const Ctx = createContext<SiteSettings>(DEFAULTS);
export const useSiteSettings = () => useContext(Ctx);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<SiteSettings>(getInitialSettings);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      if (!cancelled && data) {
        const merged = { ...DEFAULTS } as SiteSettings;
        for (const row of data) {
          const k = row.key as keyof SiteSettings;
          if (merged[k]) {
            (merged as Record<string, unknown>)[k] = {
              ...(DEFAULTS[k] as object),
              ...(row.value as object),
            };
          }
        }
        if (merged.company.logo_url?.includes("res.cloudinary.com/yzmffalu/")) {
          merged.company.logo_url = DEFAULTS.company.logo_url;
        }
        if (merged.company.favicon_url?.includes("res.cloudinary.com/yzmffalu/")) {
          merged.company.favicon_url = DEFAULTS.company.favicon_url;
        }
        setS(merged);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
}
