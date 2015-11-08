Package.describe({
  name: 'zodiase:mdl',
  version: '1.0.6_1',
  // Brief, one-line summary of the package.
  summary: 'A wrapper package for Google\'s Material Design Lite.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/Zodiase/meteor-mdl.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');

  var assets = [];
///>>>>ASSETS
  assets = ["fonts/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2","fonts/2fcrYFNaTjcS6g4U3t-Y5ewrjPiaoEww8AihgqWRJAo.woff","fonts/2fcrYFNaTjcS6g4U3t-Y5bbKic1PW3nceB3q24YFOMg.ttf"];
///<<<<ASSETS

  api.addAssets(assets, 'client');

  api.addFiles([
    'material.css',
    'material-icons.css',
    'envConfigs.js',
    'material.js',
    'export.js'
  ], 'client');
  api.export([
    "componentHandler",
    "MDl"
  ], 'client');
  // Patchers.
  api.addFiles([
    'patchers/blaze.js'
  ], 'client');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('jquery');
  api.use('zodiase:mdl');
  api.addFiles([
    'tests/export.js',
    'tests/patcher-blaze.js'
  ], 'client');
});