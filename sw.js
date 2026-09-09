self.addEventListener('install',function(event){
 console.log('PWA installazione Service Worker.');
 event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',function(event){
 console.log('PWA attivazione Service Worker.');
 event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',function(event){
 event.respondWith(
  caches.match(event.request).then(response=>{
   console.log('Richiesto file',event.request.url);
   return response||fetch(event.request);
  })
 );
});