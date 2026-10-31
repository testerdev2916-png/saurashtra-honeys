import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { useSiteSettings } from "@/lib/site-settings";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function inject(src: string, id: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  s.id = id;
  document.head.appendChild(s);
}

function injectInline(code: string, id: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.text = code;
  document.head.appendChild(s);
}

export function AnalyticsScripts() {
  const { analytics } = useSiteSettings();
  const { ga4_measurement_id: ga, clarity_id: cl, gsc_verification: gsc } = analytics;
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const init = () => {
      if (ga) {
        inject(`https://www.googletagmanager.com/gtag/js?id=${ga}`, "ga4-src");
        injectInline(
          `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}',{send_page_view:true});`,
          "ga4-init",
        );
      }
      if (cl) {
        injectInline(
          `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${cl}");`,
          "clarity-init",
        );
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (window as any).requestIdleCallback(init);
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(init, 1000);
      return () => clearTimeout(timer);
    }
  }, [ga, cl]);

  useEffect(() => {
    if (gsc) {
      const m = document.querySelector(
        'meta[name="google-site-verification"]',
      ) as HTMLMetaElement | null;
      if (m) m.content = gsc;
      else {
        const el = document.createElement("meta");
        el.name = "google-site-verification";
        el.content = gsc;
        document.head.appendChild(el);
      }
    }
  }, [gsc]);

  // Fanout GA4 dataLayer events to Meta Pixel + Clarity
  useEffect(() => {
    if (typeof window === "undefined") return;
    const map: Record<string, string> = {
      view_item: "ViewContent",
      add_to_cart: "AddToCart",
      begin_checkout: "InitiateCheckout",
      purchase: "Purchase",
      search: "Search",
      view_item_list: "ViewCategory",
    };

    // Fanout GA4 dataLayer events to Meta Pixel + Clarity
    const handler = (event: Event) => {
      const e = event as CustomEvent<Record<string, unknown>>;
      const name = e.type.replace(/^analytics:/, "");
      const fbEvent = map[name];
      if (fbEvent && window.fbq) {
        const payload = e.detail ?? {};

        if (name === "view_item" || name === "add_to_cart") {
          const items = payload.items as any[];
          const item = items?.[0];
          if (item) {
            window.fbq("track", fbEvent, {
              content_ids: [item.item_id],
              content_type: "product",
              content_name: item.item_name,
              value: payload.value || item.price,
              currency: "INR",
            });
          }
        } else if (name === "begin_checkout" || name === "purchase") {
          const items = (payload.items as any[]) || [];
          window.fbq("track", fbEvent, {
            content_ids: items.map((i: any) => i.item_id),
            content_type: "product",
            num_items: items.reduce((acc: number, i: any) => acc + (i.quantity || 1), 0),
            value: payload.value,
            currency: "INR",
          });
        } else {
          window.fbq("track", fbEvent, payload);
        }
      }
      if (window.clarity) window.clarity("event", name);
    };
    const events = Object.keys(map).map((k) => `analytics:${k}`);
    events.forEach((ev) => window.addEventListener(ev, handler));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handler));
      observer.disconnect();
    };
  }, []);

  return null;
}
