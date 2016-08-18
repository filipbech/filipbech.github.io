---
layout: post
title: First impressions of the new Payment Request API
permalink: /2016/08/payment-request-first-impressions
---

With Chrome 53 this pretty cool new feature is available for the masses. It's called Payment Request API and its going through [standardization](https://www.w3.org/TR/payment-request/).

![_config.yml]({{ site.baseurl }}/images/posts/payment-request.jpg)

*I am working for a client on a prototype to launch when Chrome 53 hits stable, and I'm pretty excited to see if we can notice better conversion-rates.*

Its the answer to the long-asked question "how do we achieve better conversion on mobile". The problem with checking out on your phone is that users dont want to type everything in, especially not long numbers (like for creditcards). Now the browser can show the user prefilled custom dialogbox that the user can just confirm with one click. 

The API is simple and cool, but it has a couple of gotchas that I had to wrap my ahead around. So I thought I would share my experience here...

The basic setup is straightforward. Construct a new `PaymentRequest` with some options and call the `show()` method on it. The show method return a promise that will resolve with the filled in data in a special object you then call `complete()` on when your server/paymentprovider determines that the order is confirmed. 

```js
var supportedInstruments = [{
	supportedMethods: ['visa', 'mastercard', ...others]
}];

var details = {
	total: {
		label: 'Total amount due',
		amount: { currency: 'DKK', value : '765.00' }
	},
	shippingOptions: [{
		id: 'free',
		label: 'Free shipping',
		amount: {currency: 'DKK', value: '0.00'},
		selected: true
	}]
};

var options = {
	requestShipping: true,
	requestPayerEmail: true,
	requestPayerPhone: true
};

var request = new PaymentRequest(supportedInstruments, details, options);

request.show().then(result => {
	return fetch('/pay', { 
		method:'POST', 
		body: JSON.stringify({ cardNum: result.details.cardNumber }) 
	}).then(response => {
		// payment was completed
		return result.complete('success');
	}, err => {
		// server declined 
		return result.complete('fail');
	});
});

```

## The complicated stuff
This looks pretty simple, and it actually works like that. But in real life, you might have different shipping-options, with different pricing and other business logic (one shipping provider is only available to certain countries, and one has different prices in different contries). We can make all that work, but then its not AS simple as such... 

## The general idea
The idea is that you can listen to events on your request object. Your listeners will fire with an event that has a `updateWith()`-method on it, that you then immidiatly call with a promise. You then resolve that promise with the new updated options (maybe coming from the server). 

```js
request.addEventListener('shippingaddresschange', event => {
	event.updateWith(fetch('/getShippingOptions', { 
		method:'POST', 
		body: JSON.stringify({ address: event.target.shippingAddress }) 
	}).then(response => {
		details.shippingsOptions = response.data;
		return details;
	}));
});
```

When you look at it like this, its still pretty simple but now it is even more powerful. YAY! 

## Get started
You can start using this today. Its in Chrome 53 (which at the time of this writing is in beta). The only requirement is that you have to use a secure connection (`https`), but I guess if you are processing creditcard information, you are hopefully doing that already. Even though it also works on localhost, this does make development a litle harder, since you don't run localhost on your phone, and it doesn't accept phony certificates. To work around it I used remote debugging via USB with an Android device from our device-wall, and a secure build-server that was just laying idle (if you find yourself lacking the server, you can find free ssl hosting out there - github pages is a good example).

A great place to read more is the integration guide on webfundamentals over at [developers.google.com](https://developers.google.com/web/fundamentals/primers/payment-request/?hl=en)

As always, reach out on twitter [@filipbech](https://twitter.com/filipbech) if you have questions or comments. 
