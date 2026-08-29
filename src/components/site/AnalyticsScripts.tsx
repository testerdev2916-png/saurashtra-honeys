import { useEffect } from "react";
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
  s.async = true; s.src = src; s.id = id;
  document.head.appendChild(s);
}

function injectInline(code: string, id: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id; s.text = code;
  document.head.appendChild(s);
}

export function AnalyticsScripts() {
  const { analytics } = useSiteSettings();
  const { ga4_measurement_id: ga, meta_pixel_id: fb, clarity_id: cl, gsc_verification: gsc } = analytics;

  useEffect(() => {
    if (ga) {
      inject(`https://www.googletagmanager.com/gtag/js?id=${ga}`, "ga4-src");
      injectInline(`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}',{send_page_view:true});`, "ga4-init");
    }
    if (fb) {
      injectInline(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fb}');fbq('track','PageView');`, "fbq-init");
    }
    if (cl) {
      injectInline(`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${cl}");`, "clarity-init");
    }
    if (gsc) {
      const m = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement | null;
      if (m) m.content = gsc;
      else { const el = document.createElement("meta"); el.name = "google-site-verification"; el.content = gsc; document.head.appendChild(el); }
    }
  }, [ga, fb, cl, gsc]);

  // Fanout GA4 dataLayer events to Meta Pixel + Clarity
  useEffect(() => {
    if (typeof window === "undefined") return;
    const map: Record<string, string> = {
      view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout",
      purchase: "Purchase", search: "Search", view_item_list: "ViewCategory",
    };
    const handler = (event: Event) => {
      const e = event as CustomEvent<Record<string, unknown>>;
      const name = e.type.replace(/^analytics:/, "");
      const fbEvent = map[name];
      if (fbEvent && window.fbq) window.fbq("track", fbEvent, e.detail ?? {});
      if (window.clarity) window.clarity("event", name);
    };
    const events = Object.keys(map).map((k) => `analytics:${k}`);
    events.forEach((ev) => window.addEventListener(ev, handler));
    return () => events.forEach((ev) => window.removeEventListener(ev, handler));
  }, []);

  return null;
}
