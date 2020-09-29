// worker.js
// © 2020 Kilobit Labs Inc.
//
// Simple service worker for PWAs.

// 515

(function(){

    const CACHE = location.host
    const URIFILE = '/cache.json';
    
    self.addEventListener('install', function(event) {
	self.skipWaiting();

	console.log('foo!');

	event.waitUntil(caches.open(CACHE)
			.then(cache => {
			    fetch(URIFILE)
				.then(response => response.json())
				.then(data => {
				    console.log("Opened cache, " + CACHE);
				    return cache.addAll(data.uris);
				});
			})
			.catch(err => console.error(err)));
    });
    
    self.addEventListener('fetch', function(event) {

	let url = new URL(event.request.url);

	event.respondWith((async () => {

	    switch(url.pathname) {
	    case URIFILE:
		return fetch(event.request);
	    case "/worker.js":
		return fetch(event.request);
	    }

	    const response = await caches.match(event.request);
	    if(response) {
		return response;
	    }

	    return fetch(event.request);
	    
	})());
    });
  
})();


