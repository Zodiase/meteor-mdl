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
  extensions: [],
  filenames: [settingsFileName],
  archMatching: 'web'
}, () => new Compiler);

class Compiler {
  static tryToParseAndLoadSettings(settingsFile) {
    let self = Compiler;
    let fileContents = settingsFile.getContentsAsString();
    try {
      let settingsFromFile = EJSON.parse(fileContents);
      let finalSettings = extend(true, {}, self.defaultSettings, settingsFromFile);
      check(finalSettings, self.settingsSchema);
      return finalSettings;
    } catch (error) {
      settingsFile.error(error);
      return null;
    }
  }
  static getThemeFileName(primary, accent, minified = true) {
    return 'material.' + path.basename(primary) + '-' + path.basename(accent) + (minified ? '.min' : '') + '.css';
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
      data: 'MDl.settings = EJSON.parse(decodeURI("' + encodeURI(EJSON.stringify(finalSettings)) + '"));\n console.info("compiler");',
      path: path.join('client', 'lib', 'settings-file-checked.generated.js'),
      bare: true
    });

    // Load Js Lib.
    let jsLibFileName = finalSettings.jsLib.minified ? 'material.min.js' : 'material.js';
    let jsLibPath = path.join('dist', jsLibFileName);
    settingsFile.addJavaScript({
      data: getAsset(jsLibPath),
      path: path.join('client', 'lib', jsLibPath),
      bare: true
    });
    settingsFile.addJavaScript({
      data: 'MDl.componentHandler = componentHandler;\n',
      path: path.join('client', 'lib', 'attach-componentHandler.generated.js'),
      bare: true
    });

    if (finalSettings.theme === false) {
      // Disable theme.
      log('Theme disabled.');
    } else {
      // Load theme.
      let themeFileName = self.getThemeFileName(finalSettings.theme.primary, finalSettings.theme.accent, finalSettings.theme.minified);
      log(themeFileName);
      let themeFilePath = path.join('dist', themeFileName);

      //! For some reason `.addStlyesheet` does not exist.
      log(settingsFile.addStlyesheet);
/*
      settingsFile.addStlyesheet({
        data: getAsset(jsLibPath),
        path: path.join('client', 'lib', jsLibPath),
        bare: true
      });
*/
    }

//     log(Assets.getText('src/images/buffer.svg'));
  }
}
Compiler.defaultSettings = {
  "jsLib": {
    "minified": false
  },
  "theme": {
    "primary": "indigo",
    "accent": "pink",
    "minified": false
  },
  "verbose": false
};
Compiler.settingsSchema = Match.ObjectIncluding({
  "jsLib": Match.ObjectIncluding({
    "minified": Boolean
  }),
  "theme": Match.OneOf(false, Match.ObjectIncluding({
    "primary": String,
    "accent": String,
    "minified": Boolean
  })),
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
