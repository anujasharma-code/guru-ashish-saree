const CACHE_NAME = "gas-storefront-v5";
const APP_SHELL = [
    "./",
    "./index.html",
    "./shop.html",
    "./about.html",
    "./contact.html",
    "./faq.html",
    "./shipping-returns.html",
    "./privacy-terms.html",
    "./product.html",
    "./cart.html",
    "./wishlist.html",
    "./checkout.html",
    "./order-confirmation.html",
    "../css/style.css",
    "../css/responsive.css",
    "../css/shop.css",
    "../css/commerce.css",
    "../css/commerce-enhancements.css",
    "../css/content-pages.css",
    "../css/advanced-ui.css",
    "../images/adobe-campaign-banner.jpg",
    "../js/product.js",
    "../js/store-config.js",
    "../js/content-pages.js",
    "../js/commerce.js",
    "../js/main.js",
    "../js/commerce-pages.js",
    "../js/storefront-features.js",
    "../js/shop.js",
    "./app.webmanifest",
    "./icons/app-icon.svg"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key.startsWith("gas-storefront-") && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
        if (request.destination !== "image") return;
        event.respondWith(
            caches.open(CACHE_NAME).then(async cache => {
                const cached = await cache.match(request);
                if (cached) return cached;
                try {
                    const response = await fetch(request);
                    if (response.ok || response.type === "opaque") {
                        cache.put(request, response.clone());
                    }
                    return response;
                } catch {
                    return new Response("", { status: 504, statusText: "Image unavailable offline" });
                }
            })
        );
        return;
    }

    event.respondWith(
        caches.match(request, {
            ignoreSearch: request.mode === "navigate"
        }).then(async cached => {
            if (cached) return cached;
            try {
                const response = await fetch(request);
                if (response.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(request, response.clone());
                }
                return response;
            } catch (error) {
                if (request.mode === "navigate") {
                    const fallback = await caches.match("./index.html");
                    if (fallback) return fallback;
                }
                throw error;
            }
        })
    );
});
