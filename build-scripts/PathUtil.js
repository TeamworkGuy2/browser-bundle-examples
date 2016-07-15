"use strict";
var gutil = require("gulp-util");
var StringUtil = require("./StringUtil");
var PathUtil;
(function (PathUtil) {
    // delete file: fs.unlinkSync(fileName)
    // rename file: fs.renameSync(oldName, newName);
    // example tsc command: "tsc -t ES5 -m commonjs --preserveConstEnums " + projRelativeSrcPath
    // used to store/cache the project's root directory
    var projectRoot;
    function setProjectRoot(projRoot) {
        projectRoot = projRoot.replace(/\\/g, '/');
    }
    PathUtil.setProjectRoot = setProjectRoot;
    function getProjectRoot() {
        return projectRoot;
    }
    PathUtil.getProjectRoot = getProjectRoot;
    function getSetOrDefaultProjectPath(projRoot) {
        projRoot = projRoot ? projRoot.replace(/\\/g, '/') : (projectRoot || (projectRoot = process.cwd().replace(/\\/g, '/')));
        return projRoot;
    }
    PathUtil.getSetOrDefaultProjectPath = getSetOrDefaultProjectPath;
    /** Relativize a path against a root directory, also convert backslashes to forward slashes.
     * Example: toShortFileName('a\b\c\log.txt', 'a/b')
     * returns: 'c/log.txt'
     * @param file the file name to relativize
     * @param [projRoot] the optional path used to relativize the 'file', default value is 'process.cwd()'
     */
    function toShortFileName(file, projRoot) {
        projRoot = getSetOrDefaultProjectPath(projRoot);
        var parts = file.replace(/\\/g, '/').split(projRoot);
        return StringUtil.removeLeading(parts[parts.length - 1], '/');
    }
    PathUtil.toShortFileName = toShortFileName;
    /** Create a custom proxy for a RegExp's test() function which logs messages to gulp-util each time test() is called
     * @param regex the regular expression to modify
     * @param show an object containing a boolean property 'showRegexTests' which is dynamically checked each time the RegExp's test() function is called to determine whether or not to print a message
     */
    function createRegexInspector(regex, show) {
        var origTest = regex.test;
        regex.test = function testInspector(str) {
            var res = origTest.call(regex, str);
            if (show.showRegexTests) {
                gutil.log((res ? "building: " : "ignore: ") + toShortFileName(str));
            }
            return res;
        };
        return regex;
    }
    PathUtil.createRegexInspector = createRegexInspector;
})(PathUtil || (PathUtil = {}));
module.exports = PathUtil;
