#!/usr/bin/env node

// Load modules
var fs = require("fs");
var path = require("path");
var getFiles = require('./imports/getFiles.js');

function print (data) {
	data = data || '';
	process.stdout.write(data);
}
function println (data) {
	data = data || '';
	process.stdout.write(data + '\n');
}

var pathToPackageRoot = '../';
var mdlPath = '.npm/package/node_modules/material-design-lite/src';
var packageFilePath = 'package.js';
var bookmarkName = 'MDLASSETS';
var variableName = 'mdlAssets';
var matchRegex = new RegExp('\\/\\/\\/>>>>' + bookmarkName + '((.|\\n)*?)\\/\\/\\/<<<<' + bookmarkName + '', 'g');
var fileTypes = [
  '.svg'
];

println('Scanning directory...');
var files = getFiles(path.resolve(__dirname, pathToPackageRoot, mdlPath), fileTypes, true, fs, path);
println(files.join('\n'));
println(files.length + ' files found.');

var packageFileFullPath = path.resolve(__dirname, pathToPackageRoot, packageFilePath);
var packageFile = fs.readFileSync(packageFileFullPath, {encoding: 'utf8'});
var filesJSON = JSON.stringify(files);
packageFile = packageFile.replace(matchRegex, '///>>>>' + bookmarkName + '\n  ' + variableName + ' = ' + filesJSON + ';\n///<<<<' + bookmarkName + '');
fs.writeFileSync(packageFileFullPath, packageFile, {encoding: 'utf8'});
