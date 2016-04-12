/*
 * Since we are not able to get the assets added by this package, we have to
 * rely on another package to provide the assets. That would be the mdl-assets
 * package, which would export `_mdlGetAsset` function for getting asset files.
 */

const settingsFileName = 'zodiase-mdl.json';

// `_mdlGetAsset` is exported from package 'zodiase:mdl-assets'.
const getAsset = _mdlGetAsset;
// jQuery.extend from npm.
const extend = Npm.require('extend');
// clone from npm.
const clone = Npm.require('clone');

const path = Plugin.path;

Plugin.registerCompiler({
  archMatching: 'web',
  extensions: [],
  filenames: [settingsFileName]
}, () => new Compiler);

class Compiler extends MultiFileCachingCompiler {

  constructor() {
    super({
      compilerName: 'zodiase-mdl',
      defaultCacheSize: 1024*1024*10,
    });
  }

  getCacheKey(inputFile) {
    return inputFile.getSourceHash();
  }

  /**
   * `compileResult` returned by `compileOneFile` is a string.
   * @param {String} compileResult
   * @returns {Number}
   */
  compileResultSize(compileResult) {
    return compileResult.length;
  }

  // We don't care settings files not at root directory.
  isRoot(inputFile) {
    return (inputFile.getDirname() === '.');
  }

  compileOneFile(inputFile, allFiles) {
    log('check 1', {
      SourceHash: inputFile.getSourceHash(),
      Arch: inputFile.getArch(),
      PackageName: inputFile.getPackageName(),
      PathInPackage: inputFile.getPathInPackage(),
      Basename: inputFile.getBasename(),
      Dirname: inputFile.getDirname(),
      ContentsAsString: inputFile.getContentsAsString().substr(0, 30)
    });
/*
    if (null === inputFile.getPackageName()) {
      return null;
    }
*/

    const self = Compiler;
    const fileContents = inputFile.getContentsAsString().trim();
    let finalSettings = null;

    if (fileContents === '') {
      log('Enabled with default settings. See documentation for customization options.');
      finalSettings = clone(self.defaultSettings, false);
    } else {
      try {
        const settingsFromFile = JSON.parse(fileContents);
        finalSettings = extend(true, {}, self.defaultSettings, settingsFromFile);
        check(finalSettings, self.settingsSchema);
        log('Using settings:', finalSettings);
      } catch (error) {
        settingsFile.error(error);
        finalSettings = null;
      }
    }
    if (!finalSettings) {
      return null;
    }
    //else

    return {
      // Use the string form to help calculate cache size.
      compileResult: JSON.stringify(finalSettings),
      referencedImportPaths: []
    };
  }

  /**
   * `compileResult` returned by `compileOneFile` is a string.
   * @param {InputFile} inputFile
   * @param {String} compileResult Guaranteed to be valid JSON.
   */
  addCompileResult(inputFile, compileResult) {
    log('check 2', {
      SourceHash: inputFile.getSourceHash(),
      Arch: inputFile.getArch(),
      PackageName: inputFile.getPackageName(),
      PathInPackage: inputFile.getPathInPackage(),
      Basename: inputFile.getBasename(),
      Dirname: inputFile.getDirname(),
      ContentsAsString: inputFile.getContentsAsString().substr(0, 30)
    });


    const settingsFile = inputFile;
    const finalSettings = JSON.parse(compileResult);

    // Attach the settings to MDl.
    settingsFile.addJavaScript({
      data: 'MDl.settings = JSON.parse(decodeURI("' + encodeURI(JSON.stringify(finalSettings)) + '"));\n',
      path: path.join('client', 'lib', 'settings-file-checked.generated.js'),
      bare: true
    });

    this._loadJsLib(settingsFile, finalSettings);
    this._loadTheme(settingsFile, finalSettings);
  }

  /**
   * Try to get the content of the specified asset.
   * If fails for any reason, the error will be thrown to the InputFile.
   * @param {InputFile} inputFile
   * @param {String} assetPath
   * @returns {String|null} Text content of the asset if found. Otherwise null.
   */
  _tryToGetAssetData(inputFile, assetPath) {
    try {
      return getAsset(assetPath);
    } catch (error) {
      inputFile.error(error);
      return null;
    }
  }

  /**
   * Returns the full theme file name for the given color combination.
   * @param {String} primary
   * @param {String} accent
   * @returns {String}
   */
  _getThemeFileName(primary, accent) {
    return 'material.' + path.basename(primary) + '-' + path.basename(accent) + '.min.css';
  }

  /**
   * Add js files to the InputFile based on the settings.
   * @param {InputFile} inputFile
   * @param {Object} settings
   * @param {Object} settings.jsLib
   * @param {Boolean} settings.jsLib.minified
   */
  _loadJsLib(inputFile, settings) {
    const jsLibFileName = settings.jsLib.minified ? 'material.min.js' : 'material.js';
    const jsLibFilePath = path.join('dist', jsLibFileName);
    const jsLibFileData = this._tryToGetAssetData(inputFile, jsLibFilePath);
    if (jsLibFileData === null) {
      // Has error getting the asset.
      inputFile.error(new Error('Could not load JavaScript lib file.'));
      return;
    }
    //else

    inputFile.addJavaScript({
      data: jsLibFileData,
      path: path.join('client', 'lib', jsLibFilePath),
      bare: true
    });
    inputFile.addJavaScript({
      data: 'MDl.componentHandler = componentHandler;\n',
      path: path.join('client', 'lib', 'attach-componentHandler.generated.js'),
      bare: true
    });
  }

  /**
   * Add css files to the InputFile based on the settings.
   * @param {InputFile} inputFile
   * @param {Object} settings
   * @param {Object|false} settings.theme
   * @param {String} settings.theme.primary
   * @param {String} settings.theme.accent
   */
  _loadTheme(inputFile, settings) {
    const theme = settings.theme;
    if (theme === false) {
      // Disable theme.
      return;
    }
    //else

    // Load theme.
    const themeFileName = this._getThemeFileName(theme.primary, theme.accent);
    const themeFilePath = path.join('dist', themeFileName);
    const themeFileData = this._tryToGetAssetData(inputFile, themeFilePath);
    if (themeFileData === null) {
      // Has error getting the asset.
      inputFile.error(new Error('Could not load theme stylesheet.'));
      return;
    }
    //else

    inputFile.addStylesheet({
      data: themeFileData,
      path: path.join('client', 'lib', themeFilePath),
      bare: true
    });
  }
}
Compiler.defaultSettings = {
  "jsLib": {
    "minified": false
  },
  "theme": {
    "primary": "indigo",
    "accent": "pink"
  },
  "patches": {
    "autoUpgrade": "fullUpgrade"
  },
  "verbose": false
};
Compiler.settingsSchema = Match.ObjectIncluding({
  "jsLib": Match.ObjectIncluding({
    "minified": Boolean
  }),
  // Note: there're only minified theme files.
  "theme": Match.OneOf(false, Match.ObjectIncluding({
    "primary": String,
    "accent": String
  })),
  "patches": {
    "autoUpgrade": Match.OneOf(false, "fullUpgrade", "mutationOnly", "none")
  },
  "verbose": Boolean
});

const logLabel = 'zodiase:mdl';
const log = function () {
  let args = sliceArguments(arguments);
  args.unshift('*', logLabel, '>');
  console.log.apply(console, args);
};

const sliceArguments = function (_arguments) {
  let args = new Array(_arguments.length);
  for (let i = 0, n = _arguments.length; i < n; i++) {
    args[i] = _arguments[i];
  }
  return args;
};
