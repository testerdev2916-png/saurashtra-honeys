import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  seo: { default_title: string; default_description: string; default_keywords: string; default_og_image: string };
  analytics: { ga4_measurement_id: string; meta_pixel_id: string; clarity_id: string; gsc_verification: string };
  social: { instagram: string; facebook: string; youtube: string; linkedin: string; x: string; pinterest: string };
  whatsapp: { enabled: boolean; number: string; default_message: string };
  newsletter: { double_opt_in: boolean; welcome_reward_points: number };
  loyalty: { enabled: boolean; points_per_rupee: number; redeem_rate_paise: number; signup_bonus: number; referral_reward: number; referred_reward: number };
  features: { recently_purchased_popup: boolean; trust_badges: boolean; low_stock_message: boolean; exit_intent_ready: boolean };
  robots: { disallow_paths: string[]; extra: string };
  i18n: { default_locale: string; supported_locales: string[] };
};

const DEFAULTS: SiteSettings = {
  seo: { default_title: "Saurashtra Honey", default_description: "Raw, unfiltered honey from Saurashtra.", default_keywords: "", default_og_image: "" },
  analytics: { ga4_measurement_id: "", meta_pixel_id: "", clarity_id: "", gsc_verification: "" },
  social: { instagram: "", facebook: "", youtube: "", linkedin: "", x: "", pinterest: "" },
  whatsapp: { enabled: true, number: "919687328404", default_message: "Hi! I would like to know more about your honey." },
  newsletter: { double_opt_in: true, welcome_reward_points: 0 },
  loyalty: { enabled: true, points_per_rupee: 1, redeem_rate_paise: 100, signup_bonus: 0, referral_reward: 100, referred_reward: 50 },
  features: { recently_purchased_popup: true, trust_badges: true, low_stock_message: true, exit_intent_ready: true },
  robots: { disallow_paths: ["/admin", "/account", "/checkout", "/order", "/lovable"], extra: "" },
  i18n: { default_locale: "en", supported_locales: ["en", "hi", "gu"] },
};

const Ctx = createContext<SiteSettings>(DEFAULTS);
export const useSiteSettings = () => useContext(Ctx);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<SiteSettings>(DEFAULTS);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("app_settings").select("data").eq("id", 1).maybeSingle();
      if (!cancelled && data?.data) {
        const merged = { ...DEFAULTS } as SiteSettings;
        for (const k of Object.keys(DEFAULTS) as (keyof SiteSettings)[]) {
          (merged as Record<string, unknown>)[k] = { ...(DEFAULTS[k] as object), ...((data.data as Record<string, object>)[k] ?? {}) };
        }
        setS(merged);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
}
