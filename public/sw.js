// Remove all existing caches on activation
self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  // Simple pass-through fetch handler
  self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
  });