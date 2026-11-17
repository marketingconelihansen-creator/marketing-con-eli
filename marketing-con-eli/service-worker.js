// Service Worker para control de caché
const CACHE_VERSION = 'v' + new Date().getTime();
const CACHE_NAME = `libertad-financiera-${CACHE_VERSION}`;

// Instalar - limpiar caché viejo
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

// Activar
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch - siempre traer versión más reciente
self.addEventListener('fetch', (event) => {
  // Para index.html, nunca cachear
  if (event.request.url.includes('index.html') || event.request.url.endsWith('/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Para assets, cachear agresivamente
  event.respondWith(
    caches.match(event.request).then((response) => {
      return fetch(event.request).then((fetchResponse) => {
        if (!fetchResponse || fetchResponse.status !== 200) {
          return response;
        }
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return fetchResponse;
      }).catch(() => {
        return response;
      });
    })
  );
});
