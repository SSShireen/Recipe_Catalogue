const CACHE_NAME = `temperature-converter-v1`;

// Use the install event to pre-cache all initial resources, including new recipe pages.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '/',                // Homepage
      '/recipe-style.css',   // CSS file
      '/breakfast.html',  // Breakfast recipes page
      '/lunch.html',      // Lunch recipes page
      '/dinner.html',     // Dinner recipes page
      '/dessert.html'     // Dessert recipes page
    ]);
  })());
});

// Handle fetch events: Serve files from the cache, and fetch new ones when needed.
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Try to get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
      try {
        // If the resource was not in the cache, try fetching from the network.
        const fetchResponse = await fetch(event.request);

        // Save the fetched resource in the cache and return it.
        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      } catch (e) {
        // The network request failed; the resource is unavailable.
        console.error('Fetch failed; returning offline page instead.', e);
      }
    }
  })());
});
