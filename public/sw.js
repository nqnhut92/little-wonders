const CACHE = "little-wonders-__BUILD_ID__";
// Filled at build time with bundled files the HTML does not link directly (self-hosted fonts).
const BUNDLED = [/*__BUNDLED__*/];
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const response = await fetch("/");
      const html = await response.text();
      const files = [
        ...html.matchAll(/(?:src|href)="(\/assets\/[^" ]+)"/g),
      ].map((m) => m[1]);
      await cache.put(
        "/",
        new Response(html, { headers: { "Content-Type": "text/html" } }),
      );
      const assets = [
        "/favicon.ico",
        "/favicon.svg",
        "/icon-32.png",
        "/icon-180.png",
        "/icon-192.png",
        "/icon-512.png",
        "/icon-maskable-192.png",
        "/icon-maskable-512.png",
        "/manifest.webmanifest",
        ...files,
        ...BUNDLED,
      ];
      // Batch precaching so iOS Safari does not fail installation on hundreds of concurrent fetches.
      for (let i = 0; i < assets.length; i += 24) {
        await cache.addAll(assets.slice(i, i + 24));
      }
    })(),
  );
});
// The page asks for takeover once a new worker is installed (see src/services/update.ts).
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith("little-wonders-") && key !== CACHE)
          await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== "GET" ||
    url.origin !== location.origin ||
    url.pathname === "/version.json" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_vercel/")
  )
    return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("/")));
    return;
  }
  event.respondWith(
    caches
      .match(event.request, { ignoreVary: true })
      .then((cached) => cached || fetch(event.request)),
  );
});
