const CACHE_NAME = "projaska-v4";
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

self.addEventListener("push", (event) => {
    const data = event.data?.json() ?? {};
    event.waitUntil(
        self.registration.showNotification(data.title ?? "Projaska", {
            body: data.body ?? "",
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            tag: "store-order",
            renotify: true,
            data: { url: data.url ?? "/admin/store-orders" },
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url ?? "/admin/store-orders";
    event.waitUntil(
        clients
            .matchAll({ type: "window", includeUncontrolled: true })
            .then((clientList) => {
                for (const client of clientList) {
                    if ("focus" in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow(url);
            })
    );
});
