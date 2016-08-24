self.addEventListener('push', function(event) {  
  event.waitUntil(  
    self.registration.showNotification('Are you borred?', {  
      body: 'Hurry up - you can still catch a movie!',  
      icon: '/demos/push/push.png',
      tag: 'independence-day-resurgence',
      data: {
        'item': 'http://www.kino.dk/'
      },
      actions: [{
        action: "open", 
        title: "Buy tickets (opens browser)"
      },{
        action: "email", 
        title: "Remind me to watch later..."
      }]
    })
  );

});



self.addEventListener('notificationclick', function(event) {
  event.notification.close();


  if(event.action === 'email') {
    //fire off fetch request to tell the server to email
  }

  if(event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.item)
    );
    //must be within waituntill to have permission to open window
  }

});