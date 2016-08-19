var mdlVersion = '1.2.0';
var revision = 0;
var assetRevision = 0;
var mdiVersion = '2.2.3';

var packageVersion = (revision > 0) ? mdlVersion + '_' + revision : mdlVersion,
    assetPackageVersion = (assetRevision > 0) ? mdlVersion + '_' + assetRevision : mdlVersion;

var packageName = 'mdl';

if (process.env.EDGE_VERSION) {
  packageVersion = process.env.EDGE_VERSION;
  packageName = 'mdl-edge';
}

Package.describe({
  name: 'zodiase:' + packageName,
  version: packageVersion,
  summary: 'Google Material Design Lite for Meteor, with auto-upgrading, theme customization and SASS support.',
  git: 'https://github.com/Zodiase/meteor-mdl.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  'use strict';
  api.versionsFrom('1.3.5');
  api.use([
    'ecmascript',
    'isobuild:compiler-plugin@1.0.0',
    'fourseven:scss@3.8.1'
  ]);
  // `check` package is still in testing phase, lock version to prevent BC.
  api.use('zodiase:check@=0.0.4');
  // MDL Assets package has to match strictly.
  api.imply('zodiase:mdl-assets@=' + assetPackageVersion);
  // MDI can be freely updated.
  api.imply('zodiase:material-design-icons-fonts@' + mdiVersion);

  api.export(['MDl'], 'client');

  // Polyfill for MutationObserver.
  api.addFiles([
    'node_modules/webcomponents.js/MutationObserver.min.js'
  ], 'client');

  api.addFiles([
    'setup.js',
    'check.js'
  ], 'client');

  // Patches.
  api.addFiles([
    'patch/autoUpgrade.js'
  ], 'client');

  // Add helper scss file for fixing asset loading path.
  api.addFiles('theme.scss', 'client', {isImport: true});
});

Package.onTest(function (api) {
  api.use([
    'ecmascript',
    'tinytest',
    'jquery',
    'zodiase:function-bind@0.0.1', // Polyfill for PhantomJS.
    'zodiase:' + packageName
  ]);
  api.addFiles([
    'zodiase-mdl.json',
    'tests/export.js',
    'tests/patch-autoUpgrade.js'
  ], 'client');
});

Package.registerBuildPlugin({
  name: 'build',
  use: [
    'caching-compiler@1.0.0',
    'ecmascript',
    'zodiase:check@=0.0.4',
    'zodiase:mdl-assets@=' + assetPackageVersion
  ],
  sources: [
    'plugin/build.js'
  ],
  npmDependencies: {
    'extend': '3.0.0',
    'clone': '1.0.2'
  }
});

var logLabel = 'zodiase:' + packageName;
var log = function () {
  var args = sliceArguments(arguments);
  args.unshift('*', logLabel, '>');
  console.log.apply(console, args);
};
var sliceArguments = function (_arguments) {
  var args = new Array(_arguments.length);
  for (var i = 0, n = _arguments.length; i < n; i++) {
    args[i] = _arguments[i];
  }
  return args;
};
