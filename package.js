Package.describe({
  name: 'zodiase:mdl',
  version: '1.0.6_2',
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
  var npmPath = Npm.require('path');
  var npmFs = Npm.require('fs');

  // Initialize variables.
  var color_primary_default = 'indigo', color_accent_default = 'pink';
  var color_primary = color_primary_default, color_accent = color_accent_default;
  var settingsFileName = 'zodiase-mdl.json';

  // Load "zodiase-mdl.json" from app's root directory.
  var appRoot = process.cwd();
  var settingsFilePath = npmPath.join(appRoot, settingsFileName);
  try {
    var settingsFileStats = npmFs.statSync(settingsFilePath);
    if (!settingsFileStats.isFile()) throw new Error('Settings file not found.');
    var settingsFileData = npmFs.readFileSync(settingsFilePath);
    console.log('MDL settings found', settingsFilePath);
    var settings = null;
    try {
      settings = JSON.parse(settingsFileData);
    } catch (error) {
      console.error('Could not parse file.', error);
      throw error;
    }
    console.info('MDL settings loaded', settings);

    // Read theme settings.
    if (settings.hasOwnProperty('theme')) {
      var theme = settings.theme;
      if (theme.hasOwnProperty('primary')) {
        color_primary = npmPath.basename(theme.primary);
      }
      if (theme.hasOwnProperty('accent')) {
        color_accent = npmPath.basename(theme.accent);
      }
    }
  } catch (error) {
    // Settings file not found.
  }

  // Add fonts for material icons.
  var fontAssets = [];
///>>>>FONTASSETS
  fontAssets = ["fonts/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2","fonts/2fcrYFNaTjcS6g4U3t-Y5ewrjPiaoEww8AihgqWRJAo.woff","fonts/2fcrYFNaTjcS6g4U3t-Y5RV6cRhDpPC5P4GCEJpqGoc.woff"];
///<<<<FONTASSETS
  api.addAssets(fontAssets, 'client');
  api.addFiles('material-icons.css', 'client');

  // Add main files.
  api.addFiles('envConfigs.js', 'client');
  // Load MDL files from npm directory.
  var mdlPath = '.npm/package/node_modules/material-design-lite/dist';
  var themeFileName = getThemeFileName(color_primary, color_accent);
  console.info('MDL Theme:', color_primary, color_accent);
  var mdlFiles = [
  	themeFileName,
  	'material.js'
  ];
  api.addFiles(prepandPathToFiles(mdlFiles, mdlPath), 'client');
  api.addFiles('export.js', 'client');

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

function getThemeFileName(primary, accent) {
  return 'material.' + primary + '-' + accent + '.min.css';
}
function prepandPathToFiles(files, path) {
  var npmPath = Npm.require('path');
  return files.map(function(file) {
    return npmPath.join(path, file);
  });
}

Npm.depends({
  'material-design-lite': '1.0.6'
});
