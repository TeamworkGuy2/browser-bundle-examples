import fs = require("fs");
import gutil = require("gulp-util");
import StringUtil = require("./StringUtil");

module PathUtil {
    // delete file: fs.unlinkSync(fileName)
    // rename file: fs.renameSync(oldName, newName);
    // example tsc command: "tsc -t ES5 -m commonjs --preserveConstEnums " + projRelativeSrcPath

    // used to store/cache the project's root directory
    var projectRoot: string;


    export function setProjectRoot(projRoot: string) {
        projectRoot = projRoot.replace(/\\/g, '/');
    }


    export function getProjectRoot() {
        return projectRoot;
    }


    export function getSetOrDefaultProjectPath(projRoot?: string) {
        projRoot = projRoot ? projRoot.replace(/\\/g, '/') : (projectRoot || (projectRoot = process.cwd().replace(/\\/g, '/')));
        return projRoot;
    }


    /** Relativize a path against a root directory, also convert backslashes to forward slashes.
     * Example: toShortFileName('a\b\c\log.txt', 'a/b')
     * returns: 'c/log.txt'
     * @param file the file name to relativize
     * @param [projRoot] the optional path used to relativize the 'file', default value is 'process.cwd()'
     */
    export function toShortFileName(file: string, projRoot?: string) {
        projRoot = getSetOrDefaultProjectPath(projRoot);
        var parts = file.replace(/\\/g, '/').split(projRoot);
        return StringUtil.removeLeading(parts[parts.length - 1], '/');
    }


    /** Create a custom proxy for a RegExp's test() function which logs messages to gulp-util each time test() is called
     * @param regex the regular expression to modify
     * @param show an object containing a boolean property 'showRegexTests' which is dynamically checked each time the RegExp's test() function is called to determine whether or not to print a message
     */
    export function createRegexInspector(regex: RegExp, show: { showRegexTests: boolean; }) {
        var origTest = regex.test;
        regex.test = function testInspector(str: string) {
            var res = origTest.call(regex, str);
            if (show.showRegexTests) { gutil.log((res ? "building: " : "ignore: ") + toShortFileName(str)); }
            return res;
        };
        return regex;
    }

}

export = PathUtil;