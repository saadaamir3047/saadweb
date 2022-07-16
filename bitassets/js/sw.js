var CACHE_NAME = 'rekomma-cache-v1';
var urlsToCache = [
  '../',
  '../index.php',
  '../css/main.css',
  '../css/home.css',
  '../css/style.css',
  '../slick/slick.css',
  '../slick/slick-theme.css',
  '../js/main.js',
  '../js/flexibility.js',
  '../js/js.cookie.min.js',
  '../js/jquery.countdown.js',
  '../js/jquery.menu-aim.js',
  '../js/jquery.min.js',
  '../js/jquery.plugin.js',
  '../js/jquery.timeago.js',
  '../js/jquery-pack.js',
  '../js/mail.js',
  '../js/mailer.js',
  '../js/mainmenu.js',
  '../js/modernizr.js',
  '../js/regvalidation.js',
  '../js/validation.js',
  '../js/jquery.elevatezoom.js',
  '../js/jquery-ui.min.js',
  '../js/jquery.ui.touch-punch.min.js',
  '../js/jquery.form.js',
  '../js/compare.js',
  'https://use.fontawesome.com/releases/v5.1.0/css/all.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});