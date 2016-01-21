// When the document is loaded, check if MDl is correctly initialized.
if (Meteor.isClient) {
  Meteor.startup(function () {
    check(MDl, Match.ObjectIncluding({
      "envConfig": Match.ObjectIncluding({
        "patchers": Object
      }),
      "settings": Match.Optional(Object),
      "componentHandler": Match.Optional(Object)
    }), 'Package is corrupted.');

/*
    if (!Meteor._bootstrapSettingsFileLoaded) {
      console.warn("Bootstrap disabled. Create a file named 'bootstrap-settings.json' to enable.");
    } else {
      try {
        Meteor._bootstrapSettingsFileLoaded = undefined;
        delete Meteor._bootstrapSettingsFileLoaded;
      } catch (e) {}
    }
*/
  });
}
