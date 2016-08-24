'use strict';

class PushSubscriptionManager { 
	constructor() {
		this.button = document.querySelector('.js-push-button');

		this.onClick = this.onClick.bind(this);
		this.button.addEventListener('click', this.onClick);
		this.updateBtnText();

		navigator.serviceWorker.register('/demos/push/sw.js').then((registration) => {
			this.registration = registration;

			navigator.serviceWorker.ready.then((registration)=> { 
				this.registration.pushManager.getSubscription().then((subscription)=> {
					if(subscription) {
						this.subscription = subscription;
						this.sendSubscriptionToServer(subscription);
						this.updateBtnText();
					}
				});
			});
		});	
	} 

	onClick() {
		if(this.subscription) {
			this.subscription.unsubscribe().then(()=>{
				this.subscription = null;
				this.updateBtnText();
			});
		} else {
			this.registration.pushManager.subscribe({userVisibleOnly: true}).then((subscription) =>{
				this.subscription = subscription;
				this.sendSubscriptionToServer(subscription);
				this.updateBtnText();
			});
		}
	}
	updateBtnText() {
		this.button.innerHTML = (this.subscription) ? 'Unsubscribe' : 'Subscribe';
	}

	sendSubscriptionToServer(subscription = mandatory('subscription')) {
		console.log('curl --header "Authorization: key=AIzaSyCdgt9Muuav7FfJDc0BipxJ6V9Zb4GIrS4" --header "Content-Type: application/json" https://android.googleapis.com/gcm/send -d "{\\"registration_ids\\":[\\"'+this.sanitizeEndpoint(subscription)+'\\"]}"');
	
		// store the subscription in idb
		this.registration.sync.register('sendSubscriptionToServer');		
	}

	sanitizeEndpoint({endpoint}) {
		return endpoint.match(/[\w-:]+$/i)[0];
	}
}

if(navigator.serviceWorker) {
 	var pushSubscriptionManager = new PushSubscriptionManager();
}

function mandatory(what) {
	throw new Error('You must provide a '+ what);
}