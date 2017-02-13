---
layout: post
title: Service worker and caching from other origins
permalink: /2017/02/service-worker-and-caching-from-other-origins
---

TLDR: add cors-headers (or choose a CDN that has it already) and/or register a serviceworker on the other host (the last is still experimental).

Update on Feb 13th: added Jeffs stackoverflow answer with a summary of how opaque-responses work.

For quite some time its been a popular best practice to host resources on other hosts: sub- or alternative domains or maybe third party CDN's. I won't go into the good and bad of that practice today, but I will share a challenge (and the solution/options) I've found when building an offline app with service-worker and using other hosts. 

Serviceworker gives you a programmable cache and acts as a proxy for all outgoing request your site is responsible for. It lets you determine the caching-strategy for your files. For the rest of this article I'll asume you know how it works, and focus on how its different when crossing origins. (if you are unsure, head over at read Jake Archibalds brilliant intro - [the offline cookbook](https://jakearchibald.com/2014/offline-cookbook/)).

There are basically two different approaches, and it comes down to which serviceworker is in control of the files. Maybe you want your Progressive Web App (PWA) to control the caching, or you want the other host (whether its yourself or not doesn't really matter) to control it. 

## You want your service-worker to be in control
This is what you probably want. It's where you are in control, and you get to decide what files are cached and for how long etc. The problem I faced was that even though I handled it like any other request, it just wouldn't go into the cache. Looking around I found lots of examples where it worked (with google-fonts etc.) - super frustrating. After digging deeper into the issue, it turns out that the cdn-files needs to be served with cors-headers, because (ofcause) javascript can't use third-party content if they don't. So its simple - on your static fileserver you should add these headers to your server-settings, or you could simply choose a CDN that does this for you. 

`access-control-allow-origin: https://firstparty.com`

or simply just `*`

The brillian [Jeff Posnick](https://twitter.com/jeffposnick) reached out to me an pointed me to his answer on this [stackoverflow-post](http://stackoverflow.com/questions/39109789/what-limitations-apply-to-opaque-responses/39109790#39109790). So, it turns out, you can use a no-cors request and receive an opaque-response (when cors-headers are not sent). You cannot open the response to verify the contents from your serviceworker - you actually don't know if it's a successful response or a server-error. But if you can live with that risc you CAN use your seviceworker to cache files from CDN's that doesn't serve this header. Another gotcha is that it isn't possible with the ´cache´-api (as in ´cache.addAll([...cdnImages])´) as it only accepts response-codes that 2xx, so you have to manually run fetch and stuff the opaque response in the cache. (just read the stackoverflow answer and it makes sense.)

## You want the other host to handle it
So the quick answer is to pick a host that does this already, but ofcause the question is how its done, so you can do it on your own subdomain (or maybe you run a CDN). 

The idea here is to have the CDN-domain register its own serviceworker and handle it itself. The problems (there are at least two of them) ofcause is that when we only serve assets, we can't run the code neede to install the serviceworker, and we can't intercept requests that isn't done from this (third-party) service-workers scope. The answer also has two parts. 

Note that these features are currently still experimental and in origin-trial in Chrome, and not in any other browser. You should read this [great article from Google](https://developers.google.com/web/updates/2016/09/foreign-fetch) that explains more about it, and just consider the following a brief introduction to the concepts. 

### Install the serviceworker via a special header
Turns out you can install a service-worker from any request (as long as it meets the regular sw-requirements like https) via a simple HTTP-header.

`Link: </service-worker.js>; rel="serviceworker"; `

Its a little more complicated to debug this process, but if you read the above-mentioned article, you are covered on that as well. 

### Listen for foreign-fetch
The event is similar to the fetch-event that we are used to handling in our local (first-party) serviceworker. The main difference is that instead of responding with a promise that resolves with a response, we need to resolve with an object that includes the response and a few extra details like origin and headers. (note that the example is simplified to a point where we still make the request - ofcause the fetch() call should be a fallback if there is nothing in the cache)

```js
self.addEventListener('foreignfetch', event => {
	event.respondWith(fetch(event.request).then(response => {
		return {
			response: response,
			origin: event.origin,
			headers: ['Content-Type']
		}
	}));
});
```

Now the only other thing we need is to tell the newly installed third-party serviceworker that we intend to listen for foreignfetch-events (and for what origins and under what scope). We do that at install time with a method on the install-event. 

```js
self.addEventListener('install', event => {
	event.registerForeignFetch({
		scopes:['/'],
		origins:['firstparty.com'] // or simply '*' to allow all origins
	});
});	
```

## Conclusion
It should be pretty simple, and if you know these gotchas it pretty much is! Thanks for reading...
