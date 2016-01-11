function getFiles(destPath, extNames, recursive, npmFs, npmPath) {
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

module.exports = getFiles;
