// EXAMPLE1: regular cache.addAll with module-files
// RESULT: CRASHES THE BROWSER (only when 2 or more javascript files present)
// self.addEventListener('install', event => {
//     const requests = ['/', 'app.js', 'dependency1.js', 'dependency2.js'];
//     event.waitUntil(caches.open('v1').then(cache=>cache.addAll(requests)));
// });

// EXAMPLE2: regular cache.addAll with module-like requests
// RESULT: CRASHES THE BROWSER (only when 2 or more javascript files present)
// self.addEventListener('install', event => {
//     const requests = ['app.js', 'dependency1.js', 'dependency2.js']
//         .map(url => new Request(url, { mode: 'cors', credentials: 'omit' }));
//         // this line to mimick a type=module request as per @jeffposnick
//     event.waitUntil(caches.open('v1').then(cache => cache.addAll(['/', ...requests])));
// });

// EXAMPLE3: Faking request.add by fetching and caching manually
// RESULT: Syntax-error from the contents of app.js (valid module syntax)
self.addEventListener('install', event => {
    const requests = ['app.js', 'dependency1.js', 'dependency2.js']
        .map(url => new Request(url, { mode: 'cors', credentials: 'omit' })); 
        // this line to mimick a type=module request as per @jeffposnick
    event.waitUntil(
        caches.open('v1').then(cache => {
            return Promise.all(requests.map(request => {
                return fetch(request).then(response => {
                    return cache.put(request, response.clone());
                });
        }));
    }));
});

// EXAMPLE4: Caching on demand (from fetch) instead of initialy
// (when testing this, make sure to enable the script-tag in index.html)
// RESULT: Works as intended, but is not desirable for critical resources
// self.addEventListener('fetch', e => {
//     console.log('from serviceworker');
//     e.respondWith(caches.open('v1').then(cache => {
//         return cache.match(e.request).then(cacheResponse =>
//             cacheResponse || fetch(e.request).then(serverResponse => {
//                 console.log('from network');
//                 return cache.put(e.request, serverResponse.clone()).then(_=>{
//                     console.log('put in cache');
//                     return serverResponse;
//                 })
//             })
//         )
//     }));
// });