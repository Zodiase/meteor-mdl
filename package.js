Package.describe({
  name: 'zodiase:mdl',
  version: '1.0.6_3',
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
  api.use('fourseven:scss@3.4.1');
  
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
  var mdlDistPath = 'dist'; // This relies on the symlink.
  var themeFileName = getThemeFileName(color_primary, color_accent);
  console.info('MDL Theme:', color_primary, color_accent);
  var mdlFiles = [
  	themeFileName,
  	'material.js'
  ];
  api.addFiles(prepandPathToFiles(mdlFiles, mdlDistPath), 'client');
  api.addFiles('export.js', 'client');

  // Add files to be imported by others.
  var importFiles = [];
///>>>>IMPORTFILES
  importFiles = ["_color-definitions.scss","_functions.scss","_mixins.scss","_variables.scss","material-design-lite-grid.scss","material-design-lite.scss","styleguide.scss","template.scss","animation/_animation.scss","badge/_badge.scss","button/_button.scss","card/_card.scss","checkbox/_checkbox.scss","data-table/_data-table.scss","footer/_mega_footer.scss","footer/_mini_footer.scss","grid/_grid.scss","icon-toggle/_icon-toggle.scss","layout/_layout.scss","menu/_menu.scss","palette/_palette.scss","progress/_progress.scss","radio/_radio.scss","resets/_h5bp.scss","resets/_mobile.scss","resets/_resets.scss","ripple/_ripple.scss","shadow/_shadow.scss","slider/_slider.scss","spinner/_spinner.scss","switch/_switch.scss","tabs/_tabs.scss","textfield/_textfield.scss","tooltip/_tooltip.scss","typography/_typography.scss"];
///<<<<IMPORTFILES
  var mdlSrcPath = 'src'; // This relies on the symlink.
  api.addFiles(prepandPathToFiles(importFiles, mdlSrcPath), 'client', {isImport: true});

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
