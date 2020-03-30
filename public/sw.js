//Version control of cache
const STATIC_ASSET_VERSION = 'staticAsset-v18';
const DYNAMIC_ASSET_VERSION = 'dynamicAsset-v8  ';

//triggered by the browser
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing the service worker...', event);

  //Pre-Caching static assets
  //Wait untill caching is done before finishing installation SW
  event.waitUntil(
    caches.open(STATIC_ASSET_VERSION).then(function(cache) {
      console.log('[Service Worker] Pre-caching App Shell...');
      cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/polyfills/fetch.js',
        '/src/js/polyfills/promise.js',
        '/src/js/material.min.js',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
      ]);
    })
  );
});

//triggered by the browser
self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating the service worker...', event);

  //Deleting old version of sw
  event.waitUntil(
    caches.keys().then(function(keysList) {
      //Execute all promises before continue
      return Promise.all(
        //Create a promises array from the string array keysList
        keysList.map(function(key) {
          if (key !== STATIC_ASSET_VERSION && key !== DYNAMIC_ASSET_VERSION) {
            console.log('[Service Worker] Removing old cache...', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim(); //Make the current service worker controls every pages under its scope immediately rather than waiting for reloading.
});

//CACHING STRATERGY: cache then network MIX network with cache fallback
//Intercepting all fetch requests, both from feed.js and from webpage
self.addEventListener('fetch', function(event) {
  //[Cache then network] Fetching url from feed.js, updating new version when there is network
  let url = 'https://httpbin.org/get';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(DYNAMIC_ASSET_VERSION).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
    );
  }
  //[Cache with network fallback] for other urls
  else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          return response; //search for request in Cache and return response
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(DYNAMIC_ASSET_VERSION).then(function(cache) {
                cache.put(event.request.url, res.clone());
                return res; //network fallback
              });
            })
            .catch(function(err) {
              return caches.open(STATIC_ASSET_VERSION).then(function(cache) {
                //Only returns offline page when requests to help page failed (other failed requests are irrelevant)
                if (event.request.url.indexOf('/help')) {
                  return cache.match('/offline.html'); //finall cache fallback
                }
              });
            });
        }
      })
    );
  }
});

//CACHING STRATERGY: network with cache fallback
//triggered by the app itself
// self.addEventListener('fetch', function (event) {
//     //Override the default response example
//     event.respondWith(
//         fetch(event.request)
//         .then(function (response) {
//             return caches.open(DYNAMIC_ASSET_VERSION).then(function (cache) {
//                 cache.put(event.request.url, response.clone());
//                 return response;
//             });
//         })
//         .catch(function (error) {
//             //Basically when the network fails, catch the problem and go for the cache
//             return caches.match(event.request);
//         })
//     );
// });

// //CACHING STRATERGY: cache with network fallback, and a final cache fallback
// //triggered by the app itself
// self.addEventListener('fetch', function (event) {
//     //Override the default response example
//     event.respondWith(
//         //Check if there is a cache for the request
//         caches.match(event.request).then(function (response) {
//             if (response) {
//                 return response; //return response from cache if available
//             } else {
//                 return fetch(event.request) //make fetch request response not yet stored in cache
//                     .then(function (res) {
//                         return caches.open(DYNAMIC_ASSET_VERSION).then(function (cache) {
//                             //Call put method to place the request and response (not execute and store as add method)
//                             cache.put(event.request.url, res.clone()); //store the url and the res clone as the res is one time only
//                             return res;
//                         });
//                     })
//                     .catch(function (error) {
//                         //When cannot make request (e.g no network)
//                         return caches.open(STATIC_ASSET_VERSION)
//                             .then(function (cache) {
//                                 return cache.match('/offline.html');
//                             })
//                     });
//             }
//         })
//     );
// });

//CACHING STRATERGY: cache-only
// //triggered by the app itself
// self.addEventListener('fetch', function (event) {
//     //Override the default response example
//     event.respondWith(
//         //Check if there is a cache for the request
//         caches.match(event.request).then(function (response) {
//             return response; //return response from cache if available
//         })
//     )
// })

//CACHING STRATERGY: network-only
// //triggered by the app itself
// self.addEventListener('fetch', function (event) {
//     //Override the default response example
//     event.respondWith(
//         fetch(event.request)
//     )
// })
