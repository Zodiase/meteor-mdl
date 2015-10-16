Package.describe({
    name: 'zodiase:mdl',
    version: '1.0.5',
    // Brief, one-line summary of the package.
    summary: 'A wrapper package for Google\'s Material Design Lite.',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/Zodiase/meteor-mdl.git',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');

    // SCSS file support
    api.use([
        'fourseven:scss@3.3.3'
    ]); 
    
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
    
    // SCSS files
    var scssFiles = [
        '_animation.scss',
        '_badge.scss',
        '_button.scss',
        '_card.scss',
        '_checkbox.scss',
        '_color-definitions.scss',
        '_data-table.scss',
        '_functions.scss',
        '_grid.scss',
        '_h5bp.scss',
        '_icon-toggle.scss',
        '_layout.scss',
        '_material-design-lite-grid.scss',
        '_material-design-lite.scss',
        '_mega_footer.scss',
        '_menu.scss',
        '_mini_footer.scss',
        '_mixins.scss',
        '_mobile.scss',
        '_palette.scss',
        '_progress.scss',
        '_radio.scss',
        '_resets.scss',
        '_ripple.scss',
        '_shadow.scss',
        '_slider.scss',
        '_snackbar.scss',
        '_spinner.scss',
        '_switch.scss',
        '_tabs.scss',
        '_textfield.scss',
        '_tooltip.scss',
        '_typography.scss',
        '_variables.scss',
    ];

    scssFiles = prepandPathToFiles(scssFiles, 'sass/');
    api.addFiles(scssFiles, 'client');
    api.addFiles('material.scss', 'client');
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


function prepandPathToFiles(files, path) {
    return files.map(function(file) {
        return path + file;
    });
}