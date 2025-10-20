const CACHE_NAME = 'offline-v2'; // Increment version number!
const OFFLINE_URL = 'offline.html';
// --- ADD IMAGE PATH HERE ---
const OFFLINE_IMAGE_URL = '/assets/images/Sona-flat.png'; // Or the correct path/name of your image

// 1. Installation: Cache the offline page AND the image
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      // Add both files to the cache
      await cache.addAll([
         new Request(OFFLINE_URL, { cache: 'reload' }),
         new Request(OFFLINE_IMAGE_URL, { cache: 'reload' }) // Add the image request
      ]);
      console.log('[ServiceWorker] Offline page and image cached successfully');
    } catch (error) {
      console.error('[ServiceWorker] Failed to cache offline assets:', error);
    }
  })());
  self.skipWaiting();
});

// 2. Activation: Clean up old caches (IMPORTANT since we changed CACHE_NAME)
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil((async () => {
    // ... (Navigation preload logic can stay the same) ...
    if ('navigationPreload' in self.registration) { /* ... */ }

    // Clean up old caches (uses CACHE_NAME defined above)
    const cacheWhitelist = [CACHE_NAME]; // Only keep the new cache
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(async (cacheName) => {
        if (!cacheWhitelist.includes(cacheName)) {
          console.log('[ServiceWorker] Deleting old cache:', cacheName);
          await caches.delete(cacheName);
        }
      })
    );
  })());
  self.clients.claim();
});

// 3. Fetch Handling: (Mostly the same, but IMPORTANT change for image requests)
self.addEventListener('fetch', (event) => {
  // Handle navigation requests (serve offline.html on failure)
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) return preloadResponse;
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        console.log('[ServiceWorker] Network fetch failed for navigation, serving offline page.');
        const cache = await caches.open(CACHE_NAME);
        // Ensure you are matching the correct OFFLINE_URL
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }
  // --- ADD THIS BLOCK FOR CACHED ASSETS (like the image) ---
  // If the request is for one of our cached assets, serve from cache first.
  else if (event.request.url.endsWith(OFFLINE_IMAGE_URL) || event.request.url.endsWith(OFFLINE_URL)) {
      event.respondWith(
          caches.match(event.request)
              .then((cachedResponse) => {
                  if (cachedResponse) {
                      console.log('[ServiceWorker] Serving asset from cache:', event.request.url);
                      return cachedResponse;
                  }
                  // If not in cache (shouldn't happen for pre-cached items unless error), try network
                  console.log('[ServiceWorker] Asset not in cache, fetching from network:', event.request.url);
                  return fetch(event.request);
              })
      );
  }
  // --- END ADDED BLOCK ---

  // Let other requests pass through to the network normally
  // (You might add more caching strategies here later if needed)
});