// main.js
// © 2020 Kilobit Labs Inc.

import {Drawing, animateFractal} from "./draw.js";

(function() {

    function init() {
	Drawing(document.body, animateFractal, null, null, "drawing1");
	Drawing(document.body, animateFractal, null, null, "drawing2");

	let forms = document.getElementsByTagName("form");
	for(let form of forms) {
	    form.onsubmit = submitContact;
	}
	
    }

    // Handle form submission
    function submitContact(event) {

	console.log(event);
	event.preventDefault();

	let form = event.target;
	let fd = new FormData(form);
	console.debug(fd);

	fetch(form.action, {
	    method: form.method,
	    mode: 'no-cors',
	    cache: 'no-cache',
	    redirect: 'follow',
	    headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'X-REQUEST-TIME': '' + Date.now(),
	    },
	    body: new URLSearchParams(fd),
	})
	    .then(response => {
		if(response.type === 'opaque') {
		    console.info("Form received an opaque response.");
		    form.classList.remove("submitting");
		    form.classList.add("submitted-opaque");
		    return;
		}
		
		if(response.ok) {
		    console.info("Form sent successfully.");
		    form.classList.remove("submitting");
		    form.classList.add("submitted");
		}
		else {
		    console.error(response);
		    form.classList.remove("submitting");
		    form.classList.add("submit-error");
		    setTimeout(() => {form.classList.remove("submit-error")}, 8000);
		}
		    
	    })
	    .catch(err => {
		console.error(err);
		form.classList.remove("submitting");
		form.classList.add("submit-error");
		setTimeout(() => {form.classList.remove("submit-error")}, 8000);
	    });

	form.classList.add("submitting");
    }
    
    window.onload = init;
    
    // Setup service worker
    if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
	    navigator.serviceWorker.register('/worker.js').then(function(registration) {
		console.debug('ServiceWorker registration successful with scope: ', registration.scope);
	    }, function(err) {
		console.error('ServiceWorker registration failed: ', err);
	    });
	});
    }
    
})();



// Handle form submissions
