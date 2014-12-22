---
layout: post
title: Why I don’t use the ever-so-popular html5-markup-tags…
permalink: /2014/03/why-i-dont-use-ever-so-popular-html5/

---

![_config.yml]({{ site.baseurl }}/images/posts/why.jpg)

Beware - this post contains no code, and is opinionated. Its my blog so its my opinion, but I love to learn, so please correct me if I have my facts wrong.

Last week at work, a co-frontender had a weird problem that only showed in IE8 and older. It turned out to be because of load order of the html5shim and some other scripts. We talked about the need for the very popular shim, and I figured I would turn my arguments into a(this) blogpost.

Basically, this is how i feel: Don’t use the “new” html tags unless you really need to! Turns out: hat the tags that you NEED, bring functionality (video, audio etc) won’t work with just the shim.

I give you the fact that it looks cooler, and if a client looks in the source, they get to say: “look how modern we are - we use the section-tag” or something like that. But to me, using a div/span with a classname for styling and maybe some role-stuff for screen readers and search-engines is just as good - AND you end up with a site, that doesn’t need javascript for the layout to work.

They are like that pretty guest you didn’t invite to your birthday, but who showed up anyway and didn’t bring any presents...

Maybe its me, but I just don’t see the point?