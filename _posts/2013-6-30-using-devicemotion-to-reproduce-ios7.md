---
layout: post
title: Using DeviceMotion to reproduce iOS7 homescreen
permalink: /2013/06/using-devicemotion-to-reproduce-ios7/

---

![_config.yml]({{ site.baseurl }}/images/posts/ku-xlarge.gif)

TL;DR - Demo: [http://cdpn.io/qBLpj](http://cdpn.io/qBLpj)

At WWDC 2013 Apple showed off iOS7, with its layered flat-design. As you move the phone around the background moves a little to give the sense of movement. I thought this would be fun to show off in JS. As it turns out, its quite simple…

I made a little demo with a background thats 20px too tall and too wide, and simply change the background-position on either horisontal or vertial movement.

Basically there is a window.ondevicemotion that you can assign a function to. In this function I read out horisontal and vertical accelleration/movement (and ignore the much more data thats in this fantastic event), and when Im not at the outer limits of the background-image and the movement is significant (I set a sensitivity of 20 to avoid flickering when the device is not or just barely moved), I change the position by 1px in the appropriate direction.

It looks something like this


```js
if (window.DeviceMotionEvent) { // check to see if ths feature is available
 var vMov = 0,
     hMov = 0,
     rotation={},
     phone = document.getElementById('phone'),
     sensitivity = 20,
     bgXPos=-10,
     bgYPos=-10;
   
 window.ondevicemotion = function(event) {
  rotation = event.rotationRate
  if (rotation != null) {
   vMov = Math.round(rotation.alpha);
   hMov = Math.round(rotation.beta);
  
   // these two for vertical movement
   if (vMov*-1 > sensitivity) {
    bgYPos = ((bgYPos+1 > 0) ? 0 : bgYPos+1);
   }
   if (vMov > sensitivity) {
    bgYPos = ((bgYPos-1 < -20) ? -20 : bgYPos-1);
   }
   
   // these two for horisontal movement
   if (hMov*-1 > sensitivity) {
    bgXPos = ((bgXPos+1 > 0) ? 0 : bgXPos+1);
   }
   if (hMov > sensitivity) {
    bgXPos = ((bgXPos-1 < -20) ? -20 : bgXPos-1);
   }
  
   // now set the adjusted backgroundPosition
   phone.style.backgroundPosition = bgXPos+"px "+bgYPos+"px";
  }
 }
}
```

Its not clear (after 2 seconds of googling) how the support of DeviceMotion is, but it works on my iPad3 in iOS6.
