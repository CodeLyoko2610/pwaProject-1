//triggered by the browser
self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing the service worker...', event);

    //Pre-Caching static assets
    //Wait untill caching is done before finishing installation SW
    event.waitUntil(
        caches.open('staticAsset')
        .then(function (cache) {
            console.log('[Service Worker] Pre-caching App Shell...');
            cache.add('/src/js/app.js');
        })
    );
})

//triggered by the browser
self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating the service worker...', event);
    return self.clients.claim(); //Make the current service worker controls every pages under its scope immediately rather than waiting for reloading.
})

//triggered by the app itself
self.addEventListener('fetch', function (event) {
    //Override the default response example    
    event.respondWith(
        //Check if there is a cache for the request
        caches.match(event.request)
        .then(function (response) {
            if (response) {
                return response;
            } else {
                return fetch(event.request);
            }
        })
    );
})