#!/usr/bin/env node

// Load modules
var fs = require("fs");
var path = require("path");

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
var bookmarkName = 'IMPORTFILES';
var variableName = 'importFiles';
var matchRegex = new RegExp('\\/\\/\\/>>>>' + bookmarkName + '((.|\\n)*?)\\/\\/\\/<<<<' + bookmarkName + '', 'g');
var importTypes = [
//   '.svg',
  '.scss'
];

println('Scanning directory...');
var importFiles = getFiles(path.resolve(__dirname, pathToPackageRoot, mdlPath), importTypes, true, fs, path);
println(importFiles.join('\n'));
println(importFiles.length + ' files found.');

var packageFileFullPath = path.resolve(__dirname, pathToPackageRoot, packageFilePath);
var packageFile = fs.readFileSync(packageFileFullPath, {encoding: 'utf8'});
var importFilesJSON = JSON.stringify(importFiles);
packageFile = packageFile.replace(matchRegex, '///>>>>' + bookmarkName + '\n  ' + variableName + ' = ' + importFilesJSON + ';\n///<<<<' + bookmarkName + '');
fs.writeFileSync(packageFileFullPath, packageFile, {encoding: 'utf8'});

function getFiles(destPath, extNames, recursive, npmFs, npmPath) {
  npmFs = npmFs || Npm.require('fs');
  npmPath = npmPath || Npm.require('path');
  var dirContents = npmFs.readdirSync(destPath);
  var resultFiles = [];
  var _filename, _fullpath, _filestat, _dirContents;
  var __filename;
  while (dirContents.length) {
    _filename = dirContents.shift();
    _fullpath = npmPath.join(destPath, _filename);
    _filestat = npmFs.statSync(_fullpath);
    if (_filestat.isDirectory() && recursive) {
      _dirContents = npmFs.readdirSync(_fullpath);
      while (_dirContents.length) {
        __filename = _dirContents.shift();
        dirContents.push(npmPath.join(_filename, __filename));
      }
    } else if (_filestat.isFile()) {
      if (extNames.indexOf(npmPath.extname(_filename)) > -1) {
        resultFiles.push(_filename);
      }
    }
  }
  return resultFiles;
}
