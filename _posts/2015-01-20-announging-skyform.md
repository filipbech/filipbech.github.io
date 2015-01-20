---
layout: post
title: Announcing skyform - Enhancing form-field layout
permalink: /2015/01/announcing-skyform-enhancing-form-field-layout/
---

![_config.yml]({{ site.baseurl }}/images/posts/forms.jpg)

TL;DR: [See skyform on github](https://github.com/filipbech/skyform).

The last couple of years, I've been wanting to ditch jQuery from our projects at skybrud.dk where I work. No doubt jQuery has been the biggest game-changer in frontend development since javascript itself, but this was what dr Henry Cloud calls a "Necessary Ending". Ever since we started using angularJS, we had only one thing holding back this enivitable ending - forms. We depend(ed) on jQuery uniform for styling of form fields, and the forms that Umbraco (the CMS of our choise) spits out, uses jQuery for handling conditional fields and for validation. We had a couple of slow days at the office, so I set off to rid these dependencies.

In a later post I might write up on how we (myself and [Rene Pjengaard](https://twitter.com/pjengaard) bend UmbracoForms to our will. This post will focus on enhancing the stylability of formfields.

The situation is nothing new - some fields just aren't styleable. The idea behind the solution is stolen from [jQuery.uniform](http://uniformjs.com/) - and it is bascially to wrap the non styleable fields in a styleable div, and make the field be transparent and ontop the styled element. That way it is still real form fields so you have all the accesibility, and the user can still change values and post the form in the good old fashion way, if something should happen so your javascript doesn't run.

I love and already heavily rely on angularJS, so the obvious solution for me was to use that powerfull beast already being loaded. What I wanted was for form-fields to automatically be "enhanced" unless specifically told not to. Directives are a perfect match - so thats what I went for. I wont go through all the code - you can [find it on github](https://github.com/filipbech/skyform).

