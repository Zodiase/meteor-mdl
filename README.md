Material Design Lite wrapped for Meteor
==============================================================================
Contains a custom build of `material.js` having `componentHandler` available globally.

> Material Design Lite lets you add a Material Design look and feel to your websites. It doesn’t rely on any JavaScript frameworks and aims to optimize for cross-device use, gracefully degrade in older browsers, and offer an experience that is immediately accessible.
> - [getmdl.io](http://www.getmdl.io/index.html)

[Visit MDL's website](http://www.getmdl.io/started/index.html) to learn how to get started with MDL.

[![Build Status](https://travis-ci.org/Zodiase/meteor-mdl.svg?branch=master)](https://travis-ci.org/Zodiase/meteor-mdl)

Features
------------------------------------------------------------------------------

* **(New!) Theme color customization (See details below)**

* **(New!) Full access to SASS source code (See details below)**

* Exports `componentHandler` globally (Client Only).

* Exports `MDl` globally on the client for changing settings in runtime.

    * `MDl.componentHandler` mirrors `componentHandler`.

    * If `MDl.envConfig['blazeFix'] === true` then the Blaze patch is effective. And only in this case:

        * `MDl.envConfig.patchers.blaze.getUpgradeStyle()` returns the current auto-upgrading style.

        * `MDl.envConfig.patchers.blaze.setUpgradeStyle('fullUpgrade' | 'mutationOnly' | 'none')` sets the auto-upgrade style.

            * `'fullUpgrade'` uses `componentHandler.upgradeAllRegistered()` when any mutation is observed.
            * `'mutationOnly'` uses `componentHandler.upgradeElements(mutation.target)` on mutations when any mutation is observed.
            * `'none'` does nothing.

* If you don't want auto-upgrading, turn it off with:

    * `if (MDl.envConfig['blazeFix']) MDl.envConfig.patchers.blaze.setUpgradeStyle('none');`

    * (In the future this will be available through the setting file that's been recently supported.)

* Supports [Iron:Router](https://github.com/iron-meteor/iron-router).*

Install
------------------------------------------------------------------------------
```Bash
$ meteor add zodiase:mdl
```

How to Use
------------------------------------------------------------------------------
**(Important change since version `1.0.6_4`)** After installing, create an empty settings file `zodiase-mdl.json` under the root of your app. **Without it most functions will be disabled.**

Other than that, there is nothing special to do. Enjoy! :D

### If you want to pick your own theme, like [what the MDL team have here](http://www.getmdl.io/customize/index.html), here's how:

1. First pick your theme colors from that page. You would have to pick both the **primary color** and the **accent color**.

2. Note that on the lower part of that page, there's a link that basically tells you what colors you have picked.

    * The link is always composed by `material.{primary}-{accent}.min.css`. I picked `deep_orange` and `blue` for example, and that link looks like `material.deep_orange-blue.min.css`.

3. Now create a `zodiase-mdl.json` file under the root of your app if you haven't already. This file stores the settings.

4. In that setting file, compose a JSON document that looks similar to this:

    ```JSON
    {
      "theme": {
        "primary": "deep_orange",
        "accent": "blue"
      }
    }
    ```

5. This will tell the package to load the corresponding theme file. <del>***However, meteor might cache package files. To make sure the change is effective, execute `meteor reset`.***</del>(Issue resolved since version `1.0.6_4`.)

### If you want more than pre-built themes:

You can load up the SASS source code and define your own colors!

1. First you'd need to tell the package not to load any theme file.

    ```JSON
    {
      "theme": false
    }
    ```

2. Define your own theme colors and load MDL's SASS code.

    ```SASS
    // mdl-theme.scss
    $color-primary: "0,0,0";
    $color-accent: "255,255,255";
    @import '{zodiase:mdl}/theme';
    ```

3. There you go!

4. There's a full range of variables you can customize. Check out [MDL's variables](https://github.com/google/material-design-lite/blob/master/src/_variables.scss) to learn more.

### If you want to import SASS files from MDL's source code: (Updated in `1.0.6_4`)

They are all under <del>`{zodiase:mdl}/src`</del>`{zodiase:mdl-assets}/src` so have fun!

Known Issues
------------------------------------------------------------------------------

* ***Do not use MDL components at the top level of any templates or template event handlers may not work correctly.***

* Understand how MDL upgrades components and do not separate the necessary elements of a component into different templates unless you want to turn off auto-upgrading and do it manually.

* <del>Due to meteor caching package files, changes to the setting file may not take effect until you execute `meteor reset`. Be aware that doing so also resets your database!</del>(fixed)

Versioning
------------------------------------------------------------------------------
The version of this package matches MDL's version to make it easy to perceive what version of MDL it contains.
In addition, it has a fourth version number indicating revisions not related to MDL.

License
------------------------------------------------------------------------------
([MDL source](https://github.com/google/material-design-lite) is owned by Google and licensed under an Apache-2 license.)

© Xingchen Hong, 2015. Licensed under an Apache-2 license.


------------------------------------------------------------------------------
\* See [issues](https://github.com/Zodiase/meteor-mdl/issues) for more detail.
