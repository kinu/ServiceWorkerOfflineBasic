importScripts('serviceworker-cache-polyfill.js');

self.oninstall = function(event) {
  event.waitUntil(
    caches.open('statics-v3').then(function(cache) {
      return cache.addAll([
        '/',
        '/page.js',
        '/nyancat.png',
        '/offline_icon.png',
        '/main.css']);
    })
  );
};

self.onactivate = function(event) {
  event.waitUntil(caches.delete('statics-v2'));
};

self.onfetch = function(event) {
  console.log('FETCHING:' + event.request.url);

  // 画像だったら nyancat の画像にさしかえる
  if (event.request.url.toLowerCase().indexOf('.png') != -1) {
    event.respondWith(caches.match('/nyancat.png'));
    return;
  }

  /*
  // (1) キャッシュからだけ返す:
  event.respondWith(caches.match(event.request));
  */

  // (2) キャッシュになかったらネットワークにfallback:
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
          console.log('Fetched:', event.request, response);
        }));

  /*
  // (3) キャッシュになかったらネットワークにfallbackし、レスポンスを
  //     キャッシュする
  event.respondWith(
    caches.open('statics-v1').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        console.log(event.request.url, response);
        if (response)
          return response;
        fetch(event.request.clone()).then(function(response) {
          if (response.status < 400) {
            console.log('Fetched: ', event.request, response);
            // HTTP response code がエラーじゃないときだけ fetch が返した
            // レスポンス(のコピー)をキャッシュする。
            // (no-CORS リクエストについてはレスポンスは opaque filtered response となり、
            // .status は常に 0 にセットされるため、エラーレスポンスをキャッシュしてしまう
            // 可能性があります
            // https://fetch.spec.whatwg.org/#concept-filtered-response-opaque)
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
  */
};
