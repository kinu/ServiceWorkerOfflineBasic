function log(msg) {
  document.querySelector('#log').textContent = msg;
}

navigator.serviceWorker.register('./service-worker.js', {scope:'./'})
  .then(function(sw) {
      if (navigator.serviceWorker.controller) {
        log('このページは ServiceWorker にコントロールされています');
      } else {
        log('ServiceWorker が登録されました');
      }
    })
  .catch(function(err) {
    log('ServiceWorker の登録に失敗しました: ' + err);
  });
