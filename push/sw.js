self.addEventListener('push', function(event, a, b) {  
  console.log('Received a push message', event, a, b);

  var title = '"Sartori Cabernet øko." er på tilbud';  
  var body = 'Sartori Cabernet øko fåes i denne uge til 65 kr. ';  
  var icon = '/push/test.png';  
  var tag = 'satori-cabernet';

  event.waitUntil(  
    self.registration.showNotification(title, {  
      body: body,  
      icon: icon,
      tag: tag,
      data:{
        'item':'http://www.nemlig.com/produkt/vin/vin/let--tor/sartori-cabernet-oko-075-l-rodvin-italien-veneto.aspx'
      },
      actions: [
        {
          action: "buy", 
          title: "Køb nu (åbner siden)"
        },
        {
          action: "email", 
          title: "Påmind mig på email"
        }
      ]
    })

  );


});



self.addEventListener('notificationclick', function(event) {
  event.notification.close();


  if(event.action === 'email') {
    //fire off fetch request to tell the server to email
  }

  if(event.action === 'buy') {
    event.waitUntil(
      clients.openWindow(event.notification.data.item)
    );
    //must be within waituntill to have permission to open window
  }

});