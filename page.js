function log(msg) {
  document.querySelector('#log').textContent += msg;
}

navigator.serviceWorker.register('./service-worker.js', {scope:'./inscope.html'})
  .then(function(sw) {
      log('ServiceWorker を登録しました', sw);
    })
  .catch(function(err) {
    log('ServiceWorker の登録に失敗しました: ' + err);
  });
