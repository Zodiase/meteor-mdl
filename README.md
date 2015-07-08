Material Design Lite wrapped for Meteor
==============================================================================
Contains a custom build of `material.js` having `componentHandler` available globally.

> Material Design Lite lets you add a Material Design look and feel to your websites. It doesn’t rely on any JavaScript frameworks and aims to optimize for cross-device use, gracefully degrade in older browsers, and offer an experience that is immediately accessible.
> - [getmdl.io](http://www.getmdl.io/index.html)

[Visit MDL's website](http://www.getmdl.io/started/index.html) to learn how to get started with MDL.

Features
------------------------------------------------------------------------------
* Exports `componentHandler` globally (Client Only).
* Supports [Iron:Router](https://github.com/iron-meteor/iron-router).

Install
------------------------------------------------------------------------------
```Bash
$ meteor add zodiase:mdl
```

Content
------------------------------------------------------------------------------
| File            | Description                                     |
| --------------- | ----------------------------------------------- |
| package.js      | package descriptions.                           |
| head.html       | used for adding fonts stylesheet to html head.  |
| material.css    | css file built straight from MDL.               |
| material.js     | custom built for exporting componentHandler.    |
| export.js       | used for exporting componentHandler.            |
| export-tests.js | tests of exporting.                             |
| patchers/*      | helpers for adding more MDL's auto-upgrades.    |

Versioning
------------------------------------------------------------------------------
The version of this package matches MDL's version to make it easy to perceive what version of MDL it contains.
In addition, it has a fourth version number indicating revisions not related to MDL.

License
------------------------------------------------------------------------------
([MDL source](https://github.com/google/material-design-lite) is owned by Google and licensed under an Apache-2 license.)
© Xingchen Hong, 2015. Licensed under an Apache-2 license.
