---
layout: post
title: Handling form-validation without jQuery
permalink: /2015/01/handling-form-validation-without-jquery/
---

![_config.yml]({{ site.baseurl }}/images/posts/validation.jpg)

TL;DR: [See code on github](https://github.com/filipbech/sky-umbraco-forms)

The last part of getting rid of jQuery in our frontend at skybrud.dk, is all about Umbraco Forms (afka Contour). Umbraco Forms relies on jQuery for conditions (show this field, when that field is 'value') and validation (this field is mandatory - that field should match a given regex). So on my quest towards getting rid of jQuery the last step (after building [skyform](http://filipbech.github.io/2015/01/announcing-skyform-enhancing-form-field-layout/) for styling) was handling this, while still being able to update Umbraco forms etc. My friend and colleague [Rene Pjengaard](https://twitter.com/pjengaard) did the Umbraco part of this - when its available I'll post a link to that.

## Lets start with conditional fields
When you make conditional fields, Umbraco will build some jQuery-code to handle this. It basically adds change-listeners to all the relevant fields. When a change-event is fired, it saves the new value into a global window-object (where the key is the name of the field), and fires a function that checks the conditions and shows/hides the fields based on that. It's not rocketscience - however for now I don't want to rewrite the logic of this.

I looked in my virtual toolbelt and realized that AngularJS included a good part (not all) of the jQuery-methods used - just aliased as angular.element(). I thought about that for a while, and came up with an idea that is two things: Wrapping the jQuery-code in a self-invoking function and passing angular.element as $ AND adding the missing jQuery methods (or simplified, slimmed down versions of them) to the angular.element.prototype.

```js
/* Adding a simplified hide()-method to angular.element */
angular.element.prototype.hide = function() {
	this[0].style.display = 'none';
	return this;
};

(function($) {
  //jQuery stuff from umbraco forms
})(angular.element);
```

I ended up monkey-patching hide, show, change, is, each and closest. The only thing lacking is the actual selection of fields. You cannot perform dom-lookups via angular.element() as you can with $(), so I ended up adding a .search()-method to the prototype as well, and replacing all lookups with that

```js
$('#13213-sdfsdf123')...
becomes
angular.element(document).search('#13213-sdfsdf123')...
```

Take a look in this github repository to how I patched the given methods. I know I simplified them a lot, but for what Umbraco forms need, and for the browsers I support, this works like a charm, and adds minimal number of bytes.

## How about validation then
For this to make sence, I should out by explaining how Umbraco Forms does validation. In the backend the editor can select if a field is mandatory and/or if is should match a regex to be valid. It then outputs the fields with data-attributes that exposes those choises and the error-messages to display when the requirements are not met. Umbraco uses a variant of jQuery.validate to actually handle this.

The most obvious way I could think of was to also add methods for this to the angular.element prototype. There is now a method for adding a single field and a method for adding an entire form. The difference between adding all fields in a form and actually adding the form is that the latter will now allow the form to be sutmitted unless all fields are valid. Use the previous .search()-method to activate validation on contourforms.

```js
angular.element(document).search('.contour form').validateForm();
```

I'm pretty happy about the solution I came up with, and it works like a charm. However, it only makes sense if you - like we do - already include angular in your projects and want to not also have to include jQuery. 

Please file issues or make a pull request on github if you find bugs, have ideas or just want to join the project...
