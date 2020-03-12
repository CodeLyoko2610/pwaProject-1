self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing the service worker...', event);
})

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating the service worker...', event);
    return self.clients.claim(); //Make the current service worker controls every pages under its scope immediately rather than waiting for reloading.
})