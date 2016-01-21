// This patch is used for auto-upgrading when DOM is changed by blaze.
// Well, maybe not just blaze.
// But when you are manipulating the DOM by yourself, you should remember to upgrade.
//
// Browser compatibility: check https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// also http://caniuse.com/#search=MutationObserver


/*global MDl:true*/
/*global componentHandler:true*/

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
if (!MutationObserver) return;

MDl.envConfig['blazeFix'] = true;
var myEnv = MDl.envConfig['patchers']['blaze'] = {};

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
        componentHandler.upgradeElements(mutation.target);
      }
      break;
    default:
      throw new Error('Invalid type of mutation.');
  }
};

var mutationObserverBehaviors = {
  'fullUpgrade': function (mutations, observer) {
    componentHandler.upgradeAllRegistered();
  },
  'mutationOnly': function (mutations, observer) {
    for (var i = 0, n = mutations.length; i < n; i++) {
      handleMutation(mutations[i]);
    }
  },
  'none': function (mutations, observer) {}
}
// After some testing, seems like 'fullUpgrade' tends to be more efficient than 'mutationOnly'.
, activeMutationObserverBehaviorName = 'fullUpgrade'
, activeMutationObserverBehavior = mutationObserverBehaviors[activeMutationObserverBehaviorName];

// Add public method for switching the mutation observer's behavior.
myEnv.setUpgradeStyle = function (name) {
  if (Object.prototype.hasOwnProperty.call(mutationObserverBehaviors, name)) {
    activeMutationObserverBehaviorName = name;
    activeMutationObserverBehavior = mutationObserverBehaviors[name];
  }
};
myEnv.getUpgradeStyle = function () {
  return activeMutationObserverBehaviorName;
};

var observerLocked = false;
var observer = new MutationObserver(function(mutations, observer) {
  // Use the lock to ignore mutations happened during the process of an update.
  if (observerLocked) return;
  observerLocked = true;

  activeMutationObserverBehavior(mutations, observer);

  observerLocked = false;
}), observing = false, observeConfig = {
    childList: true,
    attributes: true,
    characterData: false,
    subtree: true
//     attributeOldValue: false,
//     characterDataOldValue: false
//     attributeFilter: []
  };

Meteor.startup(function () {
  observer.observe(document.body, observeConfig);
});
