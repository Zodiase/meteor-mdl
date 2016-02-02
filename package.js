var mdlVersion = '1.0.6';
var revision = 7;
var assetRevision = 0;
var mdiVersion = '2.1.3';

var packageVersion = (revision > 0) ? mdlVersion + '_' + revision : mdlVersion,
    assetPackageVersion = (assetRevision > 0) ? mdlVersion + '_' + assetRevision : mdlVersion;

Package.describe({
  name: 'zodiase:mdl',
  version: packageVersion,
  summary: 'A wrapper package for Google\'s Material Design Lite.',
  git: 'https://github.com/Zodiase/meteor-mdl.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  'use strict';
  api.versionsFrom('1.2.1');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.use('zodiase:check@=0.0.4');
  api.imply('zodiase:mdl-assets@=' + assetPackageVersion);
  api.imply('zodiase:material-design-icons-fonts@=' + mdiVersion);
  api.use('fourseven:scss@3.4.1');

  log('Warning! Breaking Compatibility!');
  log('Since version 1.0.6_4, now the settings file IS required. Without it, most of the functions of this package will be turned off!');
  log('Also if you have been using the SASS assets provided by this package from version 1.0.6_3, now you have to load the assets from package `zodiase:mdl-assets` instead.');
  log('These are permanent changes. Sorry for the inconvenience!');

  api.export(['MDl'], 'client');

  api.addFiles([
    'setup.js',
    'check.js'
  ], 'client');

  // Patchers.
  api.addFiles([
    'patchers/blaze.js'
  ], 'client');

  // Add helper scss file for fixing asset loading path.
  api.addFiles('theme.scss', 'client', {isImport: true});
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('jquery');
  api.use('zodiase:mdl');
  api.addFiles([
    'zodiase-mdl.json',
    'tests/export.js',
    'tests/patcher-blaze.js'
  ], 'client');
});

Package.registerBuildPlugin({
  name: 'build',
  use: [
    'ecmascript@0.1.6',
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

var logLabel = 'zodiase:mdl';
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
