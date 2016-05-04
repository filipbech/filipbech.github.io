---
layout: post
title: Making your whiteboard collaborate with socketIO
permalink: /2014/06/making-your-whiteboard-collaborate-with/

---

![_config.yml]({{ site.baseurl }}/images/posts/socket.jpg)

So we build a whiteboard with touch-writing ([http://filipbech.github.io/2014/06/making-whiteboard-with-canvas-and-touch/](http://filipbech.github.io/2014/06/making-whiteboard-with-canvas-and-touch/)), now lets use a websocket to communicate directly with the server and allow for multiple people to draw on the same board. Websocket is an on-going open connection between the server and the browser (client) that allows both parties to push messages to the other and to listen for messages. 

Websockets isn’t really "new" (the first spec is from 2009), but lots of people still don’t use it. The spec, as always, make it seem complicated (http://dev.w3.org/html5/websockets/) but with socket.IO it really isn't. Its very easy to use, unifies the server (running nodeJS) and client APIs and fallbacks to long-polling, so you can basically use it today and have full support for all the browsers you wish to use… don’t wait - start using it - everybody loves realtime… seriously start coding right now! 
a
To get started we should have a development-server. This could/should just be your local machine. You need nodeJS to run socketIO on the server. To see if you have it (and what version you have), open your terminal and write 
node —version
If it ways a version number above 0.8 you should be fine. (mine says 0.10.28 at this time). If it doesn’t - head over to nodejs.org to get it (or see my post on grunt and sass, where I go over installing node). 

Create a project-folder somewhere you like. Create in it a basic package.json file (again see that same older post) but leave the dependencies array empty. Then open a terminal and “cd” into your project folder and write 
npm install --save express
npm install --save socket.io

This will download the two node-modules we need for this to get started, and (because of the "--save"-flag) add them to the dependencies array in our package.json. Now we are ready. Create a folder “public” that will contain the files for the client-side. And create a server.js file with the following contents. 

```js
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

http.listen(app.get('port'), function() {
  console.log('Server running on localhost:'+app.get('port'));
});
```

In your terminal run
node server.js

This will startup a server that will serve any file from the public folder. So go ahead and put an index.html file in there (do hello world or whatever), and confirm that it is working by opening your browser to the address the terminal will output. Most likely it will be http://localhost:3000/. For the sake of this guide, you don’t need to understand node or everything that happens in the server.js file. Whats important is that now you have an object called “io” to which you can assign event-listeners. This object, among other things, fire a “connection" even when a client connects with socket.io. Lets listen to the “connection” event and send (emit) a message to the new socket. Like this

```js
io.on('connection', function(socket){
  console.log('we have a new connection');
  socket.emit('myMessage','Hi there');
});
```

For this to work we need to stop the server we started earlier (if you haven’t already) and start it again. To terminate and node process in the terminal press ctrl+c. Then start it up again like before “node server.js”. If it displays an error, its most likely because you have a node process already running. (the process doesn’t end even though you close the terminal window). If this is the case you have to find the node-process and kill it manually, or maybe just log out and back in. (if you are on a mac you can easily find the process in “activity manager”, using search for “node” and then force kill it… All of this is applicable anytime we change something in server.js. You have to restart it to get your changes on!

Now the server is ready to receive a connection, and all we need is the client. So lets add the following to your index.html in the public folder. 

```js
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();

  socket.on('myMessage', function(msg) {
    alert(msg);
  });
</script>
```

This will use the client side part of socket IO, and assign an instance of it to a global variable called socket. We can now send or listen for messages on this object like on the server-side. So now the client starts out, the server receives a “connection” event, and emits a myMessage of “hi there” to the client. The client is listening for a “myMessage”, and will to an alert-box with the message when it gets one. Pretty straight forward… 

Of cause there is lots more you can do with socket.IO regarding who the server sends messages to and how thats dealt with. The important thing, for this demo, is to know that - on the server - if you emit a message on the socket, it goes only to the specific client, and if you emit it on the io-object it goes to everyone. 

So, now the rest of it is just tying up ends from the whiteboard demo. Instead of calling drawRect() when the user touches the canvas, lets send the parameters to the server and have it send it to everyone connected. We then make all the clients listen for a paint-call from the server and then do the drawRect(). 

Our server does this

```js
io.on('connection', function(socket){
  socket.on('draw', function(params) {
     io.emit('draw',params);
  });
});
```

and the client is equally simple...

```js
/* see the canvas stuff in the previous blogpost */
canvas.addEventListener("touchmove", function(e) {
  /* math to calculate params */
  socket.emit("draw", params);
});

socket.on("draw", function(params) {
  ctx.fillRect(params);
});
```

Thats it. You can find my demo at [http://flipboard.herokuapp.com](flipboard.herokuapp.com). It does a little more stuff, but I promise its all just as easy with socket.io...

Ideas (and hints) for you to build on from this point

- make a clear-button.
- make rooms so multiple boards can be drawn without affecting each other (and maybe a list of rooms)
- Make a list of users in a room - see who is painting
- Have new connected users “catch up” to what the others are seeing
- Optimize so you paint instantly locally, and only send the paint-events to other users than self
