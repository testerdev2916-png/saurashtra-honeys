// Service Worker with Cache-First strategy for images to prevent repeated requests to ImageKit
const CACHE_NAME = "saurashtra-images-v2";
const IMAGEKIT_HOST = "ik.imagekit.io";

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Intercept all ImageKit images and static image assets
  const isImageKit = url.hostname.includes(IMAGEKIT_HOST);
  const isImageFile = url.pathname.match(/\.(png|jpe?g|webp|avif|ico|svg)(\?.*)?$/i);

  if (isImageKit || isImageFile) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async function (cache) {
        // 1. Check local device cache first (Zero network request!)
        const cached = await cache.match(req);
        if (cached) {
          return cached;
        }

        // 2. Fetch once from network, clone and store in disk cache for future visits
        try {
          const networkResponse = await fetch(req);
          if (
            networkResponse &&
            (networkResponse.status === 200 || networkResponse.type === "opaque")
          ) {
            cache.put(req, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cached || Response.error();
        }
      }),
    );
  }
});
