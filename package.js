Package.describe({
	name: 'zodiase:mdl',
	version: '1.0.2-2',
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
		'patchers/blaze.js',
		'patchers/iron-router.js'
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