const CACHE_NAME = 'primer-latido-v1';
const urls = ['/marketing-con-eli/docs/', '/marketing-con-eli/docs/index.html', '/marketing-con-eli/docs/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urls))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    ).catch(() => caches.match('/'))
  );
});
