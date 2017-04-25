---
layout: post
title: Using non-singleton services instances in angularJS 1.x
permalink: /2015/07/Non-singleton-service-instances-in-angular/
---

TL;DR: [Check out the repository here](https://github.com/skybrud/sky-list)

I love angularJS and I use services everywhere in my code. However I wanted to share some functionality between components with the option of sharing or not-sharing state. Services are always singletons in AngularJS today so that wasn't a viable solution.

I didn't want to have the service be a factory that I should `new` myself, because that would be hard to test. 

I thought hard, researched a bit, and came up with a solution where a new instance of a service is returned from a method inside the factory. The instance is saved and can be pulled out from elsewhere with the corresponding token (in this implementation the token is a string, but it could be anything really). Everything in an async promise-based-fashion.

I started using this in production recently, and it works just like I wished it would. This example is from a generic list-service that can be instantiated with different options. For the sake of simplicity, this example is pure javascript - see the production-code, and what skyList can do, in the [repository on github](https://github.com/skybrud/sky-list).

```js
angular.module('skyList').factory('skyList',function($q) {
	var factory = this;
	factory.deferreds = {};
		
	return {
		createInstance(token, instancePreferences) {
			// Create a deferred if not exists
			if(!factory.deferreds[token]) {
				factory.deferreds[token] = $q.defer();
			}
			
			// Throw error if the deferred has already been resolved
			if(factory.deferreds[token].promise.$$state.status == 1) {
				throw new Error('Instance with token: "'+name+'" already created.');
			}

			// Resolve the deferred with a new instance
			factory.deferreds[token].resolve(new SkyList(instancePreferences));
				
			// Return the promise of the deferred
			return factory.deferreds[token].promise;			
		},
		getInstance(token) {
			// Create a deferred if not exists
			if (!factory.deferreds[token]) { 
				factory.deferreds[token] = $q.defer();
			}		
			
			// Return the promise of the deferred
			return factory.deferreds[token].promise;
		}
	}
			
	function SkyList(preferences) {
		/* shared functionality with different preferences */
	}
	
});
```

**Usage**

```js
angular.module('myApp').directive('someDirective', function(skyList) {
	skyList.createInstance('myNewsList',{ api: '/api/getNews' }).then(function(myNewsList) {
		myNewsList.invokeSomeMethod()...
	});
});
```

For an example of how this is used also check out the [skyNews components](https://github.com/skybrud/sky-news) on github. 