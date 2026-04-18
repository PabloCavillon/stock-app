const CACHE_NAME = "projaska-v3";
const STATIC_PREFIXES = ["/_next/static/", "/icon-", "/favicon"];

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => k !== CACHE_NAME)
                        .map((k) => caches.delete(k))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    const isStatic = STATIC_PREFIXES.some((p) => url.pathname.startsWith(p));

    if (isStatic) {
        // Cache-first para assets estáticos de Next.js (hashed, inmutables)
        event.respondWith(
            caches.match(event.request).then(
                (cached) =>
                    cached ||
                    fetch(event.request).then((response) => {
                        const clone = response.clone();
                        caches
                            .open(CACHE_NAME)
                            .then((cache) => cache.put(event.request, clone));
                        return response;
                    })
            )
        );
        return;
    }

    if (event.request.mode === "navigate") {
        // Network-first para navegación; fallback a cache si offline
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches
                        .open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    }
});
