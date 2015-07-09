// This patch is used for auto-upgrading when DOM is changed by blaze.
// Well, maybe not just blaze.
// But when you are manipulating the DOM by yourself, you should remember to upgrade.
//
// Browser compatibility: check https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// also http://caniuse.com/#search=MutationObserver


/*global EnvConfig:true*/
/*global componentHandler:true*/

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
if (typeof MutationObserver !== 'function') return;

EnvConfig['blazeFix'] = true;

var handleMutation = function (mutation) {
	switch (mutation.type) {
		case 'attributes':
			//! Try to upgrade this element.
			break;
		case 'characterData':
			// Ignore character changes.
			break;
		case 'childList':
			// Upgrade the new children.
			if (mutation.addedNodes.length > 0 && mutation.target instanceof Element) {
				console.log('upgrading');
				componentHandler.upgradeAllRegistered(mutation.target);
			}
			break;
		default:
			throw new Error('Invalid type of mutation.');
	}
};

var observerLocked = false;
var observer = new MutationObserver(function(mutations, observer) {
	// Use the lock to ignore mutations happened during the process of an update.
	if (observerLocked) return;
	observerLocked = true;
	
	mutations.forEach(handleMutation);
	// componentHandler.upgradeAllRegistered uses querySelectorAll to find upgradable targets.
	// so I don't really need to look into each mutations.
// 	componentHandler.upgradeAllRegistered();
	
	observerLocked = false;
}), observing = false, observeConfig = {
		childList: true,
		attributes: true,
		characterData: false,
		subtree: true
// 		attributeOldValue: false,
// 		characterDataOldValue: false
// 		attributeFilter: []
	};

Meteor.startup(function () {
	observer.observe(document.body, observeConfig);
});
