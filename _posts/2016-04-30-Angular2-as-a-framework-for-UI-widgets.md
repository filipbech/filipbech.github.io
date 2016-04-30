---
layout: post
title: Angular2 as a framework for UI widgets
permalink: /2016/04/Angular2-for-ui-widgets
---


In Angular 1.x a very used pattern has been to bootstrap your application on the body- (or even html-) tag, and use components (or directives or even controllers) in markup to handle UI-components like galleries. The markup might then come from a CMS where an editor can insert a gallery, and the cms will generate the appropriate markup (than angular will then "activate").

I am very excited about the philosophy of Angular2, but trying to use it for UI-widgets like described before, turns out to be a struggle since there isn't really a root-component to bootstrap (which is how angular2 starts up). I spend some time investigating, and even though I haven't yet settled on an approach, I thought I would share my thoughts and the good/bad of them.

**TL;DR: Using óne root bodyComponent is probably the simplest approach to this issue.** 

## 1. Approach: Bootstrapping multiple components.
Just like in Angular1, you can always bootstrap multiple components. Of cause we want our components to be able to share data (like they were in the same app), but we can use platform injectors (since there is only one platform) to instantiate services instead of instantiating them at bootstrap-time. 

```js
//So where we normally do 
bootstrap(MyRootComponent, [MySharedService]);

//We could start by doing
let app = platform(BROWSER_PROVIDERS).application([[BROWSER_APP_PROVIDERS],[MySharedService]]);

// ... and then bootstrap the individual components
app.bootstrap(MyGallery);
app.bootstrap(MyOhterUIComponent);
```

(for the sake of simplicity I have left out the imports)

This can work, but the CMS would have to keep a reference of what is on a page, so angular2 can be told what to bootstrap.

There is another issue to this approach which is basically that the bootstrapper only looks for the first instance of a component, so you can't bootstrap two galleries on the same page. This issue is being [discussed](https://github.com/angular/angular/issues/7136) but it seems the solution will be to add an option where you can pass an html-element or a custom-selector to the bootstrapper. This kind of solves the issues, however the cms would then also need to hold this information and feed it to the bootstrapper. Working yeah, but not ideal IMHO.. (cudoes to the wunderground.com guys for [figuring this out](http://www.mediacurrent.com/blog/building-wundergroundcom-drupal-angular-2-component-reuse-page-challenge-2) however).

Another issues with this approach is that [rootComponents cannot have inputs](https://github.com/angular/angular/issues/1858). I believe it's for performance reasons (??), but I would like to pass parameters to my gallery (it might have settings or whatever). Of cause we can make a workaround that injects the ElementRef and reads its attributes, but that would meen my gallery-component would have a different api's depending on wheather its used as a root-component or not. 

Finally root-Components cannot use content-projection (formerly known as translution in angular1). There doesn't seem to be a workaround for this. 

If you can live with these issues, or good solutions come up, this could be a way to go... (This is the approach that the Wunderground guys ended opting for)

## 2. Approach: A Root body-component (my preference at the moment)

Another way to approach this problem is to make a bodyComponent that uses its initial content as its template. The obvious way would be to use content-projection, but as we know thats not allowed on the root-component. A workaround is to set the template to document.body.innerHTML (this seems so "dirty" though...).

The body-component approach is simpler, but (because of the flexibility of angular2) in order for components to "start up" when used in a template we need to make the bodyComponent aware of them. Or at least aware of what components might possibly be used. An approach could be to add all components that should be able to load this way to the bodyComponents definition, so they become available. 

That would make them kind of "global", so we can't have different components with the same selector (which we otherwise could). If these components are "global", we might as well add them to the PLATFORM_DIRECTIVES so they are truly global and can be used everywhere without further defintion (like the built in ngFor, ngIf, etc.)... 

```js
bootstrap(BodyComponent, [
	provide(PLATFORM_DIRECTIVES, { useValue: [MyGallery], multi:true })
]);
```

## Conclusion

**I prefer the second approach**, but dislike the dirty referencing of innerHTML and the global components part of it. It does however seem to be the least of two evils. Of cause Angular2 is still in beta, and everything might change, but I don't really have an idea for how this could/should work.

If you have insights, ideas or questions feel free to reach out on twitter, or in the comments below if you prefer. 