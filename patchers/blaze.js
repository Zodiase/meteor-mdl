// This patch is used for auto-upgrading when DOM is changed by blaze.
// Well, maybe not just blaze.
// But when you are manipulating the DOM by yourself, you should remember to upgrade.
//
// Browser compatibility: check https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver


/*global EnvConfig:true*/
/*global componentHandler:true*/

if (typeof MutationObserver !== 'function') return;

EnvConfig['blazeFix'] = true;

var observer = new MutationObserver(function(mutations, observer) {
	componentHandler.upgradeAllRegistered();
}), observing = false, observeConfig = {
		childList: true,
		attributes: false,
		characterData: false,
		subtree: true
// 		attributeOldValue: false,
// 		characterDataOldValue: false
// 		attributeFilter: []
	};

Meteor.startup(function () {
	observer.observe(document.body, observeConfig);
});
