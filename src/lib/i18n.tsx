// Minimal i18n scaffolding: locale store + t() passthrough. Ready to swap in
// a real dictionary loader (react-i18next / react-intl) without touching UI.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { locale: string; setLocale: (l: string) => void; t: (key: string, fallback?: string) => string };

const I18nCtx = createContext<Ctx>({ locale: "en", setLocale: () => {}, t: (_, f) => f ?? "" });

const KEY = "sh_locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("en");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const l = window.localStorage.getItem(KEY);
    if (l) setLocale(l);
    document.documentElement.lang = l ?? "en";
  }, []);
  function set(l: string) {
    setLocale(l);
    try { window.localStorage.setItem(KEY, l); } catch { /* noop */ }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }
  const t = (_key: string, fallback?: string) => fallback ?? _key;
  return <I18nCtx.Provider value={{ locale, setLocale: set, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
