const CACHE_VERSION = "supertools-v1";
const APP_CACHE = `${CACHE_VERSION}-app`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const MAX_RUNTIME_ENTRIES = 80;

const PRECACHE_URLS = ["/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== APP_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await cache.delete(keys[0]);
  await trimCache(cacheName, maxEntries);
}

function isCacheableResponse(response) {
  return response.ok && response.type === "basic";
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (!isSameOrigin(url)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!isCacheableResponse(response)) return response;
          const clone = response.clone();
          caches
            .open(RUNTIME_CACHE)
            .then((cache) => cache.put(event.request, clone))
            .then(() => trimCache(RUNTIME_CACHE, MAX_RUNTIME_ENTRIES));
          return response;
        })
        .catch(async () => {
          const runtimeMatch = await caches.match(event.request);
          if (runtimeMatch) return runtimeMatch;

          const appMatch = await caches.match(url.pathname);
          if (appMatch) return appMatch;

          return caches.match("/offline.html");
        }),
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image")
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (!isCacheableResponse(response)) return response;
          const clone = response.clone();
          caches
            .open(RUNTIME_CACHE)
            .then((cache) => cache.put(event.request, clone))
            .then(() => trimCache(RUNTIME_CACHE, MAX_RUNTIME_ENTRIES));
          return response;
        });
      }),
    );
  }
});
