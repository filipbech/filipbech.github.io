---
layout: post
title: Smooth parallax scrolling on iOS with iScroll and requestAnimationFrame
permalink: /2013/07/smooth-parallax-scrolling-on-ios-with/

---

![_config.yml]({{ site.baseurl }}/images/posts/parallax.gif)

TL:DR -> go to the bottom of the post to see the code! (demo: [http://cdpn.io/ixKLz](http://cdpn.io/ixKLz))

##So.. parallax scrolling is kinda cool… 
I came across a project where I needed to do a parallax effect - where elements scroll with different speeds - so I started googling for solutions. Lots came up. But they all more or less worked the same way (somehow calculate the new position of the element every time the scroll-position changes) and had the same problem (on my iPad and iPhone they wait and then jumps after I scroll).

The root of the problem is that in iOS the onscroll-event, (jQuery calls it jQuery.scroll) doesn't fire untill the scroll has stopped (and also doesn't set the scrollPosition untill that time). 

##iScroll to the rescue!
So in order to make this work on any iOS device we can't use the native scrolling. iScroll is a javascript library that is the closest thing to feeling like native scrolling that I've found. Basically you just  drop it in, initiate it and you have what feels like regular scrolling without the stupid limitation I explained earlier. But in order to make use of it you have to understand how it works… You basically set a container-element and inside that the native scrolling is disabled. iScroll listens for drag-events inside of the container and moves the inside of the container the opposite direction. 
(download iScroll or read more about it right here: [http://cubiq.org/iscroll-4](http://cubiq.org/iscroll-4)) 

##Important lessons learnt
1. Since there is no onscroll-event in iScroll we setup a continous loop that checks for the scrollPosition. I recommend doing this with requestAnimationFrame thats optimized for doing something each time the screen refreshes. (I really recommend Paul Irish's [http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/](blogpost) on RAF which also includes a shim that falls back to a setTimeout for older browsers)

2. The elements you dont want to move with the regular scroll-speed must be outside of the iscroll-container. This really bugs me, but the performance is horrible when you are moving something inside of the iScroll-container. Putting them out-side has one pretty big drawback - since iScroll uses css-transforms (it uses translate or translate3d) to move the inside, the iScroll-layer is flattened when scrolled - maybe its a cheap trade-off, but be aware that this makes setting different z-indexes inside and outside of the iScroll container impossible. (I made a simple example to show the problem. Open this on your computer and on an iPad to see the difference (hint: on iOS the blue-element is above all the li's) - [http://codepen.io/filipbech/pen/jDJum](http://codepen.io/filipbech/pen/jDJum)). I googled this over and over, but if anybody can prove me wrong on this, I would be forever gratefull)

3. Only use iScroll on mobile
You shouldn't use iScroll anywhere I wasn't made for. So setup some kinda system (i use modernizr and check for touch-support) that enables it on the appropriate devices. This also demands other things from your code: 
- Setup your parallax stuff so that they are position:fixed on desktop and position:absolute on mobile. Use css transform:translate() on mobile and maybe margin on desktop to move the layers - that way its hardware accelerated on mobile and on desktop its safe for everyone. 
- You should use a layer to get the current scrollPosition because natively it's document.body.scrollTop and in iScroll its a property (which is also reversed) of the object (so if your iScroll-instance is called myScroller, you read it like myScroller.y*-1. 

Ill try to make a quick example to show off what I mean. 

```html
<div id="scroller">
  <div class="scrollerContent">
    <!-- the natural-scroll content goes here -->
  </div>
</div>
<div id="parallax-item">
  This is some kinda parallax thing
</div>
```

```css
.touch body, .touch {
  height:100%;
  position:relative;
}
#scroller {
  overflow:scroll;
}
.touch #scroller {
  overflow: hidden;
  position:relative;
  height:100%;
}
#parallax-item {
  position:fixed;
}
.touch #parallax-item {
  position:absolute;
}
```

```js
var myScroller, //the iScroll-object
paraElem = document.getElementById('parallax-item'); //the parallax-element

function getScrollYPosition(iScroll) {
  var y;
  if(Modernizr.touch && iScroll) {
    y = iScroll.y*-1;
  } else {
    y = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  }
  return y;
}

function render() {
  var scrollPosition = getScrollYPosition(myScroller);
  var newPosition = Math.round(scrollPosition*0.2);
  if (Modernizr.touch) {
    paraElem.style.webkitTransform = 'translate(0px,'+newPosition+'px)';
  } else {
    paraElem.style.marginTop = newPosition+'px';
  }
}

function pageHasLoaded() {
  if (Modernizr.touch) {
    document.addEventListener('touchmove', function(e){ e.preventDefault(); }); 
    myScroller = new iScroll('scroller');
  }
  (function animloop(){
    window.requestAnimationFrame(animloop);
    render();
  })();
}
document.addEventListener('DOMContentLoaded', pageHasLoaded);
```

DEMO: [http://cdpn.io/ixKLz](http://cdpn.io/ixKLz) (the demo contains shims for requestAnimationFrame, extra styling and lots of lorem ipsum…)