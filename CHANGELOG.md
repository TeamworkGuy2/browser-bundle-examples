# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).

--------
### [0.3.0](N/A) - 2016-07-13
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