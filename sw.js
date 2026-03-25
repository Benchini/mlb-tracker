var CACHE_NAME = 'mlb-tracker-v1';
var ASSETS = [
  '/mlb-tracker/',
  '/mlb-tracker/index.html'
];

// Install — cache all assets
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      console.log('Caching assets');
      return cache.addAll(ASSETS);
    })
  );
});

// Activate — clean up old caches
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; }).map(function(key){ return caches.delete(key); })
      );
    })
  );
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).then(function(response){
        return caches.open(CACHE_NAME).then(function(cache){
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(function(){
      return caches.match('/mlb-tracker/index.html');
    })
  );
});
