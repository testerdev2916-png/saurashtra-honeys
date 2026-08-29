import { useEffect } from "react";
import { useCompanySettings } from "@/lib/company-settings";

export function FaviconUpdater() {
  const settings = useCompanySettings();
  const faviconUrl = settings?.favicon_url?.trim();

  useEffect(() => {
    const rawUrl = faviconUrl || "/favicon.ico";
    const sep = rawUrl.includes("?") ? "&" : "?";
    const versionedUrl = `${rawUrl}${sep}v=${Date.now()}`;

    const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    if (iconLinks.length > 0) {
      iconLinks.forEach((link) => {
        link.href = versionedUrl;
        if (rawUrl.endsWith(".svg")) {
          link.type = "image/svg+xml";
        } else if (rawUrl.endsWith(".png")) {
          link.type = "image/png";
        } else {
          link.type = "image/x-icon";
        }
      });
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = versionedUrl;
      newLink.type = rawUrl.endsWith(".svg")
        ? "image/svg+xml"
        : rawUrl.endsWith(".png")
          ? "image/png"
          : "image/x-icon";
      document.head.appendChild(newLink);
    }
  }, [faviconUrl]);

  return null;
}
