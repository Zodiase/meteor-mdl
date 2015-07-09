Material Design Lite wrapped for Meteor
==============================================================================
Contains a custom build of `material.js` having `componentHandler` available globally.

> Material Design Lite lets you add a Material Design look and feel to your websites. It doesn’t rely on any JavaScript frameworks and aims to optimize for cross-device use, gracefully degrade in older browsers, and offer an experience that is immediately accessible.
> - [getmdl.io](http://www.getmdl.io/index.html)

[Visit MDL's website](http://www.getmdl.io/started/index.html) to learn how to get started with MDL.

[![Build Status](https://travis-ci.org/Zodiase/meteor-mdl.svg?branch=master)](https://travis-ci.org/Zodiase/meteor-mdl)

Features
------------------------------------------------------------------------------
* Exports `componentHandler` globally (Client Only).
* Supports [Iron:Router](https://github.com/iron-meteor/iron-router).

Install
------------------------------------------------------------------------------
```Bash
$ meteor add zodiase:mdl
```

Change Log
------------------------------------------------------------------------------
* v1.0.0-2
	* Fixed a bug causing build to fail. 
* v1.0.0-1
    * Started using `MutationObserver` to detect changes in DOM and then call MDL's `componentHandler.upgradeAllRegistered()`.
    * If `MutationObserver` is not available, falls back to the old (buggy) approach.

Content
------------------------------------------------------------------------------
| File            | Description                                     |
| --------------- | ----------------------------------------------- |
| package.js      | package descriptions.                           |
| head.html       | used for adding fonts stylesheet to html head.  |
| material.css    | css file built straight from MDL.               |
| material.js     | custom built for exporting componentHandler.    |
| envConfigs.js   | defines global vars shared among other scripts. |
| export.js       | used for exporting componentHandler.            |
| export-tests.js | tests of exporting.                             |
| patchers/*      | helpers for adding more MDL's auto-upgrades.    |
| demo/*          | demos.                                          |

Versioning
------------------------------------------------------------------------------
The version of this package matches MDL's version to make it easy to perceive what version of MDL it contains.
In addition, it has a fourth version number indicating revisions not related to MDL.

License
------------------------------------------------------------------------------
([MDL source](https://github.com/google/material-design-lite) is owned by Google and licensed under an Apache-2 license.)
© Xingchen Hong, 2015. Licensed under an Apache-2 license.
