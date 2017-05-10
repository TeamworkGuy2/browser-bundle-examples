# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.5.2](N/A) - 2017-05-09
#### Changed
* Update to TypeScript 2.3, add tsconfig.json, use @types/ definitions


--------
### [0.5.1](https://github.com/TeamworkGuy2/browser-bundle-examples/commit/ee4f80123680ce4b3114f7fa6322f7fc2530b736) - 2017-05-06
#### Changed
* Updated readme.md


--------
### [0.5.0](https://github.com/TeamworkGuy2/browser-bundle-examples/commit/0a2d247d002bc591344def597cd81a927c5cfac8) - 2017-05-06
#### Changed
* Updated to ts-bundlify@0.5.0
* bundle specific prelude source strings


--------
### [0.4.0](https://github.com/TeamworkGuy2/browser-bundle-examples/commit/b7982386b3161669aab7cc4bed0adc23869585d6) - 2017-05-02
#### Changed
* Extensive gulpfile.js modifications to test Browserify multiple output bundles with uglify
* Renamed directory example1 -> example-code

#### Removed
* build-scripts BrowserifyHelper, FileUtil, LogUtil, PathUtil, StringUtil, TypeScriptUtil, and others, these exist in [ts-bundlify](https://github.com/TeamworkGuy2/ts-bundlify)


--------
### [0.3.1](https://github.com/TeamworkGuy2/browser-bundle-examples/commit/c24cdd57ae763b8a2df3f159ce536ed1277f4503) - 2016-07-19
#### Changed
Few minor changes to prep the project for live demo of build process using PowerGridWidget.js and then switching to PowerGridWidget.jsx


--------
### [0.3.0](https://github.com/TeamworkGuy2/browser-bundle-examples/commit/358a26013afbda1cf66121dd735f2414deb13924) - 2016-07-14
#### Added
* pages/power-grid.xhtml
* Added utils: FileUtil, LogUtil, StringUtil, TypeScriptUtil
* Added example1: PowerGrid, PowerGridWidget (ts and tsx), PowerGridWidgetHelper, PowerRelay
* Added source map file suport using exorcist
* Added chai and mocha packges for unit testing

#### Modified
* Enabled TSX compilation for the project
* Refactored/removed functions from PathUtil into FileUtil and StringUtil


--------
### [0.2.0](https://github.com/TeamworkGuy2/browser-bundle-examples/commit/e95705007b5618be91c173b9a06e942235ca1ff7) - 2016-06-17
#### Added
* Scss example compiling a .scss (aka SASS) file to .css using node-sass package

#### Changed
* Moved and renamed some functions
* Expanded PathUtil with new checkFileAsciiEncodingSync(), objToString(), and exists*Sync() file and directory functions


--------
### [0.1.0](https://github.com/TeamworkGuy2/browser-bundle-examples/commit/dc20b31407021b5cdc588272a866192a25dff4a2) - 2016-06-16
#### Added
Initial commit of existing babel and traceur example build scripts, including BrowserifyHelper with helper functions for projects using browserify.