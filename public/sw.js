// Versioning - Update this version number with each deployment
const APP_VERSION = '1.0.1';
const CACHE_NAME = `food-delivery-${APP_VERSION}`;

// Files to cache with versioned URLs
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Install service worker
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate the new service worker immediately
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(`[Service Worker] Caching app version ${APP_VERSION}`);
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event with network-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Handle API requests with network-first strategy
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Always make a network request to update the cache
        const fetchPromise = fetch(event.request).then(
          (networkResponse) => {
            // If we got a valid response, update the cache
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          }
        ).catch(() => cachedResponse); // Fall back to cache if network fails

        // Return cached response immediately, then update from network
        return cachedResponse || fetchPromise;
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`[Service Worker] Removing old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
});
