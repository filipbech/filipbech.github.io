---
layout: post
title: Writing Angular like its tomorrow.
permalink: /2015/04/writing-angular-like-its-tomorrow/

---

![_config.yml]({{ site.baseurl }}/images/posts/tomorrow.jpg)

**This post has been updated in 2017 to reflect the new naming conventions - eg. AngularJS for anything 1.x, Angular for anything >2.x**

Ever since the angular-team revealed their plan for angular2 (or just Angular), I've been asking myself how I could adapt a workflow that makes migration easier and my day to day development feel more Angularish. At the same time, I didn't want to add any extra unnessecary code-clutter. After writing a little angular app (still early alpha) and having pushed my AngularJS 1.x workflow along for months, I feel ready to share my workflow.

### I have to mention this
* You can write angular with the javascript of today, but this blogpost is about the workflow of tomorrow, so I will focus on the modern way of writing javascript with ES6 and typescript
* I'm deliberatly not showing any angular code, because it's still alpha days and syntax might change - however the concepts should be clear by now...

## Annotations
Annotations are hot these days. But I still hear some confused people out there, so I thought I would try to clear things up... An annotation is like meta-data with info about what the code is. Ill focus on these 2 purposes for annotations.

### Types
This allows you to specify that a variable should be a certain type. Its only a feature at development time - it will make your development a lot easier, your code better and your tools much more insightful. Check out the video on the frontpage of [typescriptlang.org](http://www.typescriptlang.org/) and scroll to the bottom of this post, to see my workflow with typescript and angularJS, using Grunt.

The community has already made [type-definitions for angularJS 1.x](https://github.com/borisyankov/DefinitelyTyped/tree/master/angularjs), so you can get all of these benefits today.

### Decorators
Decorators are a way to "upgrade" a piece of code. This is how you tell Angular that a given Class is a directive, or what dependencies in needed.

I chose a code style that resembles this idea. It doesn't look the same, but with function hoisting its closer. (first register, than inject dependencies, then the actual code).

```js
(function() {
	'use strict';
	angular.module('app').controller('MyCtrl', MyCtrl);
	MyCtrl.$inject = ['$http', '$timeout', ...];
	function MyCtrl($http, $timeout, ...) {
		/* actual code here... */
	}
})();
```

I got this idea from the great John Papa who wrote a brilliant code style guide for angularJS. Its worth a [read](https://github.com/johnpapa/angular-styleguide) - even though I don't agree with him on everything.


## (no) Classes and (no) ES6 Modules

I know this is a shocker, but at the moment I don't see the WIN in writing your angularJS controllers, services, directives etc as ES6 Classes (I think it [complicates things](http://blog.aaronholmes.net/writing-angularjs-directives-as-typescript-classes/)).

I don't use the ES6 modules either, because of the way the module-graph is gonna change with angular. In 1.x when you require a module, it is loaded and available "globally". In angular, the graph is a tree, where modules are only available downwards in the tree.
And since AngularJS 1.x doesn't support lazy loading of modules either, I think using a module-system (other than angular.module() ofcause) just complicates things and adds unnesecary overhead... I know [ozLacyload](https://github.com/ocombe/ocLazyLoad) does plug the lazy-loading, but I don't like having to write my dependencies differently, and to be honest, none of the apps I've written are big enough to justify that overhead anyway.

Of cause I seperate all angular.module()'s into folders and all controllers, services, directives into their own file (inside an iife) within that folder. But in the build, it's all compressed into a single file and all angularJS-modules are downloaded at once.

**... for now!** I really can't wait for this to change with angular - and who know, maybe I might actually change my workflow just for it to feel more like tomorrow...

## Directives
Angular also differs when it comes to directives. There will be two main kinds of directives - components (for encapsulating functionality within a custom tag - with webcomponents) and decorators (for adding some kind of special feature or hook onto an existing element. This makes alot of sense - and we can embrace this today.

My rule of thumb is that when a directive has a template its a component. All components should be restricted to E(elements) and should have their scope isolated.

If it doesn't have a template, it should be restricted to A(attribute) and should share the containing scope.

## Bootstrapping
Instead of using the regular old `ng-app`-directive attribute, I prefer to kick things off from the javascript-side with a `angular.bootstrap(document.body, ['app']);`

## Editing / the actual development
I'm adding this segment because there are a couple of hoops to jump through, for it to really kick ass.

With the release of the typescript 1.5 alpha, Microsoft released a plugin for sublimeText. Plugins for Vim, Emacs etc are coming as well. (there are unofficial ones out already).

They give you lots of insight and help you during development by making clever autosuggestions based on your actual types and by pointing out when you make mistakes (that jshint cant point out, because it doesn't know any better)...

In typescript you can reference other files either via modules (a TS 1.5 feature) or via a special triple-slash reference-tag. The manual referencing doesn't really scale, and I already made my case against modules at the moment.

**BUT WAIT. There is a third option.** You can also declare files from a special tsconfig.json-file. It can also take options on what version of the compiler you want etc, but I think thats the concern of the gruntfile in my setup. However for the time being it doesn't support wildcards in file-paths - which really doesn't scale either.

So I made a little [grunt-plugin](https://www.npmjs.com/package/grunt-tsconfig) that generates this file, based on wildcard-paths in your gruntfile... and wohoo, you are ready to go!


## The grunt workflow for it all

In my grunt file I have a watch-task that runs during development, and a build-task that runs on the build server. Of cause it also handles scss, image-optimizations etc. But in this post, Ill focus on just the javascript-part of it (if you are interested, reach out and I'll happily share the rest of it)

It comes down to these 4 tasks:

* **grunt-tsconfig:** generate tsconfig.json file
* **grunt-ts** run the typescript compiler
* **grunt-angular-templates** collects your templates and embed them directly in your apps $templateCache
* **grunt-concat-sourcemap** concatenate+minify lib, compiled app.js and the generated template javascript-file

The production-build is almost the same - except that I don't generate sourcemaps.

## Happy coding
I hope this will inspire or provoke you to think about how you develop. Don't get stuck in how you used to do!

If you think Im right, wrong or if you have questions, please add a comment below, or reach out on twitter [@filipbech](https://twitter.com/filipbech)


