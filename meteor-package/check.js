// When the document is loaded, check if MDl is correctly initialized.
if (Meteor.isClient) {
  Meteor.startup(function () {
    check(this, Match.ObjectIncluding({
      "settings": Match.Optional(Object),
      "componentHandler": Match.Optional(Object)
    }), 'Package is corrupted.');

    if (!this.settings) {
      console.warn("MDl disabled. Create a file named 'zodiase-mdl.json' at the root of the app to enable.");
    }
  }.bind(MDl));
}
