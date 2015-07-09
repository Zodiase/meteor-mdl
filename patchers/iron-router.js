/*global EnvConfig:true*/

// If blaze patcher worked, skip this.
if (Object.prototype.hasOwnProperty.call(EnvConfig, 'blazeFix') && EnvConfig['blazeFix']) return;

EnvConfig['ironRouterFix'] = true;

// Re-upgrade DOM after the layout is rendered.
var onLayoutRendered = function () {
	window.componentHandler.upgradeAllRegistered();
};

// Have a record to avoid injecting the handler twice.
// Any method to unregister?
var injectedTemplates = {};
var injectUpgrader = function () {
	var thisLayoutName = Router._layout.template();
	if (!(Object.prototype.hasOwnProperty.call(injectedTemplates, thisLayoutName))) {
		Template[thisLayoutName].onRendered(onLayoutRendered);
		injectedTemplates[thisLayoutName] = true;
	}
};


var patch = function () {
	Router.onAfterAction(injectUpgrader);
};

Meteor.startup(function () {
	// If iron:router is detected, apply the patch.
	if (typeof Iron === 'object' && typeof Iron.Router === 'function') {
		patch();
	}
});
