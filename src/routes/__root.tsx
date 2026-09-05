import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { CompareProvider } from "@/lib/compare";
import { CartDrawer } from "@/components/site/CartDrawer";
import { CompareBar } from "@/components/site/CompareBar";
import { AuthProvider } from "@/lib/auth";
import { SiteSettingsProvider } from "@/lib/site-settings";
import { I18nProvider } from "@/lib/i18n";
import { AnalyticsScripts } from "@/components/site/AnalyticsScripts";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";

import { FaviconUpdater } from "@/components/site/FaviconUpdater";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Try again</button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#2B1B14" },
      { property: "og:site_name", content: "Saurashtra Honey" },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:site", content: "@saurashtrahoney" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Saurashtra Honey",
          url: "https://id-preview--f7347c5b-4839-4afc-a6bf-ed617bd76e1d.lovable.app",
          description: "Raw, unfiltered honey from the wildflower farms of Saurashtra.",
          contactPoint: { "@type": "ContactPoint", telephone: "+91-96873-28404", contactType: "customer service", email: "hello@saurastrahoney.com", areaServed: "IN" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const envScript = `window.__ENV = { 
    SUPABASE_URL: ${JSON.stringify(typeof process !== 'undefined' ? process.env.SUPABASE_URL : "")}, 
    SUPABASE_PUBLISHABLE_KEY: ${JSON.stringify(typeof process !== 'undefined' ? process.env.SUPABASE_PUBLISHABLE_KEY : "")} 
  };`;

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: envScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for(let registration of registrations) {
                registration.unregister();
              }
            }).catch(function(err) {
              console.error('Service Worker unregistration failed: ', err);
            });
          }
          if (window.caches) {
            caches.keys().then(function(names) {
              for (let name of names) {
                caches.delete(name);
              }
            });
          }
        `}} />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const isAdmin = router.state.location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <I18nProvider>
          <AuthProvider>
            <WishlistProvider>
              <CompareProvider>
                <CartProvider>
                  <Outlet />
                  <CartDrawer />
                  <CompareBar />
                  {!isAdmin && <WhatsAppFloat />}

                  <AnalyticsScripts />
                  <FaviconUpdater />
                  <Toaster position="top-right" richColors />
                </CartProvider>
              </CompareProvider>
            </WishlistProvider>
          </AuthProvider>
        </I18nProvider>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}
