/**
 * This is a Meteor package.
 * `require` is not available in this file.
 */

var packageName = 'zodiase:mdl';
/**
 * This defines which MDL version to use.
 * @type {String}
 */
var mdlVersion = '1.3.0';
/**
 * Since this Meteor package follows the version of MDL,
 * we only use this revision number.
 * @type {Number}
 */
var revision = 0;
/**
 * Since the asset package also follows the version of MDL,
 * we only use this revision number.
 * @type {Number}
 */
var assetRevision = 0;
/**
 * The actual version of this Meteor package.
 * @type {String}
 */
var packageVersion = (revision > 0)
                     ? mdlVersion + '_' + revision
                     : mdlVersion;
/**
 * The version of the corresponding asset package.
 * @type {String}
 */
var assetPackageVersion = (assetRevision > 0)
                          ? mdlVersion + '_' + assetRevision
                          : mdlVersion;
/**
 * This defines the version of the icon font package.
 * @type {String}
 */
var mdiVersion = '3.0.1';
/**
 * Gather all dependencies in one place.
 */
var deps = {
  'ECMA': 'ecmascript@0.9.0',
  'SCSS': 'fourseven:scss@4.5.4',
  'check': 'zodiase:check@=0.0.5',
  'npmExtend': '3.0.1',
  'npmClone': '2.1.1'
};

if (process.env.EDGE_VERSION) {
  packageVersion = process.env.EDGE_VERSION;
  packageName = 'zodiase:mdl-edge';
}

Package.describe({
  name: packageName,
  version: packageVersion,
  summary: 'Google Material Design Lite for Meteor, with auto-upgrading, theme customization and SASS support.',
  git: 'https://github.com/Zodiase/meteor-mdl.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  'use strict';

  api.use([
    deps.ECMA,
    'isobuild:compiler-plugin@1.0.0',
    deps.SCSS,
    // `check` package is still in testing phase, lock version to prevent BC.
    deps.check
  ]);

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
    packageName
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
    deps.ECMA,
    'caching-compiler@1.0.0',
    deps.check,
    'zodiase:mdl-assets@=' + assetPackageVersion
  ],
  sources: [
    'plugin/build.js'
  ],
  npmDependencies: {
    'extend': deps.npmExtend,
    'clone': deps.npmClone
  }
});
