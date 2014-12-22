---
layout: post
title: Explaining Promisses
permalink: /2014/06/explaining-promisses/

---

![_config.yml]({{ site.baseurl }}/images/posts/i_promise.jpg)

Native promises are landing in browser land these days, so I thought I would do a little writeup on that! 

A javascript promise is a way to handle an asynchronous action, and deal with that in our favourite otherwise synchronous programming language (javascript). Since support for native promises are still rare, I will try to explain using the jQuery syntax for promises for now. In a later blogpost I will compare that to the native promises and $q which is the implementation that is used in Angular (and elsewhere).

Traditionally asynchronous functions has been dealt with using the callback pattern, where you pass in a callback function to the asynchronous function, and then the callback function will be executed when the asynchronous function is done. This works, but it complicates error-handling, and makes execution-order very hard to visualize. Enter promises! 

The concept is that an asynchronous call will return immediately with an object. That object typically has a “then” method which will take two functions (the success and the error handlers) as parameters. For a jQuery ajax call (which by nature is asynchronous) could look like this. 

{% highlight javascript %}
var myRequest = $.ajax(‘http://path-to-file');
myRequest.then(function(data) {
 // handle the data on success
},function(error) {
 // handle the error on error
});
{% endhighlight %}

You can also make your own promise, and resolve or reject it with some data, to deal with it this way… Maybe just to wrap around a setTimeout call. 

{% highlight javascript %}
var myTimeout = new $.Deferred();

setTimeout(function() {
  myTimeout.resolve("someValue");
},3000);

myTimeout.then(function(value) {
  // value will now be "someValue"
}, function() {
  //this second function is optional and could be left out in this example.
});
{% endhighlight %}


Most promise implementations also have a when/all feature, that will turn multiple promises into just one, so it resolves when all the promises resolve, or fails if just one fails. This is very useful if you want to, say, get multiple files via ajax, and then do something (update UI or whatever) when all the files are complete! Could look like this! 

{% highlight javascript %}
var london = $.ajax('http://api.openweathermap.org/data/2.5/weather?q=London,uk');
var copenhagen = $.ajax('http://api.openweathermap.org/data/2.5/weather?q=Copenhagen,dk');

var allCities = $.when(london,copenhagen);

allCities.then(function(data) {
  //both of them complete
  console.log('both complete');
}, function() {
  console.log('one or more failed');
  //one or more failed
});
{% endhighlight %}


The beauty, and the real power (IMHO), of promises shows itself when you return a new promise from the success/error handler. That way you can build of a chain of “then”’s that will make your sequence of asynchronous actions very visual, and a lot easier to debug. 

{% highlight javascript %}
var mySequence = new $.Deferred();
mySequence.resolve();

mySequence
    .then(function() {
        //because we start off with resolving, we go in here
        console.log('here1');
        var later = new $.Deferred();

        setTimeout(function() {
            later.reject("someValue");
        }, 3000);
        return later;

    }, function() {
        //and never here
    })
    .then(function() {
        //and this time not here
    }, function() {
        //but here
        console.log('here2');
        return new $.Deferred().resolve();
    })
    .then(function() {
        //ends up here
        console.log('here3’);
        return new $.Deferred().resolve();
    }, function() {
        //not here
    });
{% endhighlight %}

We start off with defining our mySequence as a new $.Deferred, and resolve it right after. Thats just for convenience so we can also start the first action out with a ".then”. This is pretty awesome. But since we are returning a new promise in each “step”, we could easily be listening for another “.then” somewhere completely different in you app. If we overwrite mySequence with the return value of the chain like this. 

{% highlight javascript %}
mySequence = mySequence.then( /*same code as before*/ ).then( /*same code as before*/ ).then( /*same code as before*/ );
{% endhighlight %}

we can then do
{% highlight javascript %}
mySequence = mySequence.then( /*this when the the above is complete*/ );
{% endhighlight %}

Powerfull stuff, right?
I hope this helps you understand the power of promises, and that it is available for you today!