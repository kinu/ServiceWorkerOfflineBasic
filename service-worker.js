importScripts('serviceworker-cache-polyfill.js');

self.oninstall = function(event) {
  event.waitUntil(
    caches.open('statics-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/page.js',
        '/offline_icon.png',
        '/main.css']);
    })
  );
};

self.onfetch = function(event) {
  /*
  // (1) キャッシュからだけ返す:
  event.respondWith(caches.match(event.request));

  // (2) キャッシュになかったらネットワークにfallback:
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
  */

  // (3) キャッシュになかったらネットワークにfallbackし、レスポンスを
  //     キャッシュする
  event.respondWith(
    caches.open('statics-v1').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        console.log(event.request.url, response);
        if (response)
          return response;
        console.log('Fetching: ', event.request.url);
        fetch(event.request.clone()).then(function(response) {
          if (response.status < 400) {
            // HTTP response code がエラーじゃないときだけ fetch が返した
            // レスポンス(のコピー)をキャッシュする。
            // (ただし、non-CORS リクエストについてはレスポンスは filtered
            // opaque response となり、.status は常に 0 にセットされるため、
            // エラーレスポンスをキャッシュしてしまう可能性はある
            // https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
};
