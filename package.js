var mdlVersion = '1.0.6';
var revision = 3;
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
  api.use('zodiase:check@0.0.4');
  api.imply('zodiase:mdl-assets@' + assetPackageVersion);
  api.imply('zodiase:material-design-icons-fonts@' + mdiVersion);
  api.use('fourseven:scss@3.4.1');

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
    'tests/export.js',
    'tests/patcher-blaze.js'
  ], 'client');
});

function getThemeFileName(primary, accent) {
  return 'material.' + primary + '-' + accent + '.min.css';
}
function prepandPathToFiles(files, path) {
  var npmPath = Npm.require('path');
  return files.map(function(file) {
    return npmPath.join(path, file);
  });
}

Package.registerBuildPlugin({
  name: 'build',
  use: [
    'ecmascript',
    'zodiase:check@0.0.4',
    'zodiase:mdl-assets@' + assetPackageVersion
  ],
  sources: [
    'plugin/build.js'
  ],
  npmDependencies: {
    'extend': '3.0.0',
    'clone': '1.0.2'
  }
});
