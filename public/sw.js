//triggered by the browser
self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing the service worker...', event);
})

//triggered by the browser
self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating the service worker...', event);
    return self.clients.claim(); //Make the current service worker controls every pages under its scope immediately rather than waiting for reloading.
})

//triggered by the app itself
self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetching something...', event);
    event.respondWith(fetch(event.request)); //override the default response example    
})