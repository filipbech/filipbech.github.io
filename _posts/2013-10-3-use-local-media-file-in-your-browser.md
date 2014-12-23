---
layout: post
title: Use a local media file in your browser and grap a frame
permalink: /2013/10/use-local-media-file-in-your-browser/

---

![_config.yml]({{ site.baseurl }}/images/posts/localvideo.jpg)

As everybody knows, HTML5 came with the audio and video tags, and their respective cool javascript APIs.
Very powerful stuff, but for a recent project I needed to use this on a file completely client side. I came up with a solution that uses an input type=file form upload field as the source for a video-element.
I needed to mark in- and outpoint and set a video-frame for the poster, while the file was uploading. (the server would then do some ffmpeg magic to actually slice the video, and add the poster-frame to the database).

My demo is right here - make sure you select a media file thats supported by your browser (webkit->mp4/webm, ff -> ogv, IE10+ -> who knows/cares)...
[http://cdpn.io/bhCHu](http://cdpn.io/bhCHu)

The magic is in this line
```js
  videoEle.src = window.URL.createObjectURL(this.files[0]);
```
where 'this' is the <input type="file">-field. (note the shim for prefixing URL.createObjectURL in the top, so it works in webkit/non-webkit-browsers - webkit needs a prefix).

Now you can use all the events and properties of the media-element on a local file. To get the current time of the video being shown the media element has properties like
```js
  videoEle.currentTime
```
and many more. You can do lots of other stuff with the mediaElement - check out this resource: [http://www.w3.org/2010/05/video/mediaevents.html](http://www.w3.org/2010/05/video/mediaevents.html)

For trapping a frame I use the canvas-element, and the secret is getting the context and using the videoElement (and dimensions) as parameters for the drawImage()-method.
```js
  var canvasContext = posterCanvas.getContext('2d');
  canvasContext.drawImage(videoEle, 0, 0, videoEle.offsetWidth, videoEle.offsetHeight);
```

For uploading the canvas to your server you could use posterCanvas.toDataURL('image/jpeg') and send that string to the server that can make it into a file. (I'm aware that ffmpeg can also output a single frame from a video and a timecode, but for the sake of the demo, I thought I would do that client-side also).
