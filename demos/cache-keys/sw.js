self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open('v1')
            .then(cache => 
                cache.match(event.request).then(response => 
                    response || fetch(event.request).then(response => 
                        cache.put(event.request, response.clone())
                            .then(_ => response)
                    )
                )
            )
    );
});
    

