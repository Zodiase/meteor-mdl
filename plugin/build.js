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

class Compiler {
  static tryToGetAssetData(inputFile, assetPath) {
    let self = Compiler;
    try {
      return getAsset(assetPath);
    } catch (error) {
      inputFile.error(error);
      return null;
    }
  }

  static tryToParseAndLoadSettings(settingsFile) {
    let self = Compiler;
    let fileContents = settingsFile.getContentsAsString().trim();
    if (fileContents === '') {
      log('Enabled with default settings. See documentation for customization options.');
      return clone(self.defaultSettings, false);
    }
    //else
    try {
      let settingsFromFile = JSON.parse(fileContents);
      let finalSettings = extend(true, {}, self.defaultSettings, settingsFromFile);
      check(finalSettings, self.settingsSchema);
      return finalSettings;
    } catch (error) {
      settingsFile.error(error);
      return null;
    }
  }

  static getThemeFileName(primary, accent) {
    return 'material.' + path.basename(primary) + '-' + path.basename(accent) + '.min.css';
  }

  static loadJsLib(inputFile, settings) {
    let self = Compiler;
    let jsLibFileName = settings.jsLib.minified ? 'material.min.js' : 'material.js';
    let jsLibFilePath = path.join('dist', jsLibFileName);
    let jsLibFileData = self.tryToGetAssetData(inputFile, jsLibFilePath);
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

  static loadTheme(inputFile, settings) {
    let self = Compiler;
    let theme = settings.theme;
    if (theme === false) {
      // Disable theme.
      log('Theme disabled.');
      return;
    }
    //else

    // Load theme.
    let themeFileName = self.getThemeFileName(theme.primary, theme.accent);
    //log(themeFileName);
    let themeFilePath = path.join('dist', themeFileName);
    let themeFileData = self.tryToGetAssetData(inputFile, themeFilePath);
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

  processFilesForTarget(files) {
    let self = Compiler;

    let settingsFile = null,
        finalSettings = null;

    for (let file of files) {
      /*
       * .getContentsAsBuffer() - Returns the full contents of the file as a buffer.
       * .getContentsAsString() - Returns the full contents of the file as a string.
       * .getPackageName() - Returns the name of the package or null if the file is not in a package.
       * .getPathInPackage() - Returns the relative path of file to the package or app root directory. The returned path always uses forward slashes.
       * .getSourceHash() - Returns a hash string for the file that can be used to implement caching.
       * .getArch() - Returns the architecture that is targeted while processing this file.
       * .getBasename() - Returns the filename of the file.
       * .getDirname() - Returns the directory path relative to the package or app root. The returned path always uses forward slashes.
       * .error() - Call this method to raise a compilation or linting error for the file.
       * .getExtension() - Returns the extension that matched the compiler plugin. The longest prefix is preferred.
       * .getDeclaredExports() - Returns a list of symbols declared as exports in this target. The result of api.export('symbol') calls in target's control file such as package.js.
       * .getDisplayPath() Returns a relative path that can be used to form error messages or other display properties. Can be used as an input to a source map.
       * .addStlyesheet() - Web targets only. Add a stylesheet to the document. Not available for linter build plugins.
       * .addJavaScript() - Add JavaScript code. The code added will only see the namespaces imported by this package as runtime dependencies using 'api.use'. If the file being compiled was added with the bare flag, the resulting JavaScript won't be wrapped in a closure.
       * .addAsset() - Add a file to serve as-is to the browser or to include on the browser, depending on the target. On the web, it will be served at the exact path requested. For server targets, it can be retrieved using Assets.getText or Assets.getBinary.
       * .addHtml() - Works in web targets only. Add markup to the head or body section of the document.
       */
      let arch = file.getArch(),
          basename = file.getBasename(),
          dirname = file.getDirname();

      //log(arch, basename, dirname);

      // Changes only affect browser.
      if (arch !== 'web.browser') {
        continue;
      }
      //else

      // Settings file only allowed at root.
      if (dirname !== '.') {
        file.error(new Error('Please place the settings file at the root of the app.'));
        continue;
      }
      //else

      // Duplicate file found.
      if (settingsFile !== null) {
        file.error(new Error('Please do not use more than one settings file.'));
        continue;
      }
      //else

      settingsFile = file;
    }

    if (settingsFile !== null) {
      finalSettings = self.tryToParseAndLoadSettings(settingsFile);
      if (finalSettings === null) {
        // Has error parsing the settings.
        return;
      }
    } else {
      finalSettings = clone(self.defaultSettings, false);
    }
    log('Using settings:', finalSettings);

    // Attach the settings to MDl.
    settingsFile.addJavaScript({
      data: 'MDl.settings = JSON.parse(decodeURI("' + encodeURI(JSON.stringify(finalSettings)) + '"));\n',
      path: path.join('client', 'lib', 'settings-file-checked.generated.js'),
      bare: true
    });

    self.loadJsLib(settingsFile, finalSettings);
    self.loadTheme(settingsFile, finalSettings);

    // Apply List Icon Fix. See https://github.com/google/material-design-icons/issues/299.
    if (finalSettings.patches.applyListIconFix) {
      settingsFile.addStylesheet({
        data: '.mdl-list__item .mdl-list__item-primary-content .material-icons {height: auto; width: auto;}\n',
        path: path.join('client', 'lib', 'list-icon-fix.css'),
        bare: true
      });
    }
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
    "applyListIconFix": true
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
    "applyListIconFix": Boolean
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
