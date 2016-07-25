// This patch is used for auto-upgrading when DOM is changed by blaze.
// Well, maybe not just blaze.
// But when you are manipulating the DOM by yourself, you should remember to upgrade.
//
// Browser compatibility: check https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// also http://caniuse.com/#search=MutationObserver

/*global MDl:true*/

if (Meteor.isClient) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  const ObjectHasOwnProperty = Object.prototype.hasOwnProperty;

  class AutoUpgrade {
    static handleMutation(mutation) {
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
            MDl.componentHandler.upgradeElements(mutation.target);
          }
          break;
        default:
          throw new Error('Invalid type of mutation.');
          break;
      }
    }
    constructor(MutationObserver) {
      this._upgradeStyle = false;
      this._upgradeBehavior = null;
      this._observer = new MutationObserver(this.onMutationObserved.bind(this));
    }
    onMutationObserved(mutations, observer) {
      if (this._upgradeBehavior) {
        this._upgradeBehavior(mutations, observer);
      }
    }
    setUpgradeStyle(style) {
      if (ObjectHasOwnProperty.call(AutoUpgrade.upgradeBehaviors, style)) {
        this._upgradeStyle = style;
        this._upgradeBehavior = AutoUpgrade.upgradeBehaviors[style];

        if (style === 'none') {
          this._observer.disconnect();
        } else {
          this._observer.observe(document.body, AutoUpgrade.observeConfig);
        }
      } else {
        throw new Error("Invalid upgrade style.");
      }
    }
    getUpgradeStyle() {
      return this._upgradeStyle;
    }
  }
  AutoUpgrade.upgradeBehaviors = {
    "fullUpgrade": function (mutations, observer) {
      MDl.componentHandler.upgradeAllRegistered();
    },
    "mutationOnly": function (mutations, observer) {
      for (let i = 0, n = mutations.length; i < n; i++) {
        AutoUpgrade.handleMutation(mutations[i]);
      }
    },
    "none": function (mutations, observer) {}
  };
  AutoUpgrade.observeConfig = {
    childList: true,
    attributes: true,
    characterData: false,
    subtree: true
    //attributeOldValue: false,
    //characterDataOldValue: false
    //attributeFilter: []
  };

  Meteor.startup(function () {
    // Check if settings is loaded.
    if (typeof this.settings === 'undefined') {
      return;
    }
    //else

    // Read settings.
    let upgradeStyle = this.settings.patches.autoUpgrade;
    // If upgradeStyle is `false`, disable everything.
    if (upgradeStyle === false) {
      this.autoUpgrade = null;
    } else {
      // If MutationObserver is not available on this platform, there's little we can do.
      if (!MutationObserver) {
        throw new Error("MDl AutoUpgrade doesn't support your current client environment. Please disable it.");
      } else {
        this.autoUpgrade = new AutoUpgrade(MutationObserver);
        this.autoUpgrade.setUpgradeStyle(upgradeStyle);
      }
    }
  }.bind(MDl));
}
