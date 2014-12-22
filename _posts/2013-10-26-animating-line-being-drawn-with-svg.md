---
layout: post
title: Animating a line being drawn with SVG
permalink: /2013/10/animating-line-being-drawn-with-svg/

---

I looove SVG. Its crisp vectorness makes my retina mac come to life. And when used inline you can interact with the svg-elements like dom-elements with javascript og css. Its fantastic… 

![_config.yml]({{ site.baseurl }}/images/posts/animating-svg.png)

I ran into a situation where I wanted to animate a line being drawn. Offcause SVG came to mind, but there is not really a line-drawing animation feature, so I googled around and found a solution that works pretty great. 

It turns out that if you let your line actually be a stroke on a path, there are two relevant properties you can change/animate that will simulate a line being drawn. The strokeDashArray and strokeDashOffset properties is what Im talking about. 

To understand how it works I suggest you open up a stroked path in the developer tools of your choose and play with these properties. The magic comes when you set the strokeDashArray to the length of the path, and then animate the strokeDashOffset from that same number and to 0. 

I made two demos. One is vanilla javascript with the drawing being done with css-transitions. Its the better way to go, but if you need IE-support, I made a demo that uses jQuery.animate() as well… 

Go ahead and check it out on code pen. [http://codepen.io/filipbech/pen/xKBwj](http://codepen.io/filipbech/pen/xKBwj)


