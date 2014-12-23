---
layout: post
title: Moving day
permalink: /2014/12/moving-day/

---

It's been a long time coming, but this blog is now officially no longer on blogger.com. I've wanted more control and decent syntax-highlighting, so I've migrated all the old blogposts into a jekyll-powered blog, and its now hosted on github-pages. I thought I would share a couple of learnings on the blog, and give credit where credit is due! 

[Github-pages](https://pages.github.com/) is a great product and lets you host your page for free - you can even attach your own domain, should you want to (more on this later). 

I started out googling a little, and found [this great article on smashingmagazine](http://www.smashingmagazine.com/2014/08/01/build-blog-jekyll-github-pages/). It explains setting everything up - and suggest starting out with [Jekyll now](http://github.com/barryclark/jekyll-now) which is kind of a boilerplate for this exact purpose. It makes it really easy to get started! 

However, I didn't like the syntax-highligher that comes with it. Turns out if you set `markdown:redcarpet` in the _config.yml file from jekyll now, you can write your code like on github (using ``` etc). Then I just needed some styling. Again I turned to google and found [pygments css on github](https://github.com/richleland/pygments-css). It has the styles I needed - I picked 'monokai' and just did a quick search-and-replace (replace 'codehilite' with 'hightlight') to target the right elements and voila, code now looks awesome. To make it just right, I added a darker background-color, some padding, turned off line-wrapping and instead made it scrollable when overflowing on the x-axis. 

```css
.highlight { 
	background-color: #222222; 
	padding:10px; 
	white-space:nowrap; 
	overflow-x:auto;
}
```

Of cause I changed some styles, changed some configuration and stuff, but the most important (and least-obvious) thing left, was making sure that the moved content would keep its google juice. I could have moved my custom domain, but I've been wanting to skip that anyway and I wanted the ssl-connection that comes with github-pages - so I decided to keep it on the username.github.io-domain. 

Blogger uses a url like domain.tld/year/month/title, which is not quite how jekyll now does url. I added a permalink-variable in the posts header and manually picked a url that comes close to what blogger does ([link to examle](https://raw.githubusercontent.com/filipbech/filipbech.github.io/master/_posts/2013-6-29-mandatory-1st-post.md)).  - however blogger actually uses the `.html`-fileextension. I made a custom `.htaccess`-file for the site and made it so all links poiting to `.../file.html` [redirects with a 301-header to](https://support.google.com/webmasters/answer/93633?hl=en) `.../file/`. It looks like this. 

```js
RewriteEngine On
RewriteRule (.+)\.html$ /$1/ [L,R=301]
```

The only thing I needed now was to make my old domain point to the new blog with a general 301 redirect. 

```js
RewriteEngine On
RewriteRule ^(.*)$ https://filipbech.github.io/$1 [R=301]
```

Another added bonus of hosting on github pages is that the build-files of your blog is a [puclically available repository](https://github.com/filipbech/filipbech.github.io), so take a look around and see how I set it up.

Also, I wanted to wish you a Merry Christmas - I hope you enjoy your time with the people that are near and dear - I know I will...


