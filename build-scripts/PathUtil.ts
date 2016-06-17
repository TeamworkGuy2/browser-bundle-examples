import fs = require("fs");
import gutil = require("gulp-util");

module PathUtil {
    // delete file: fs.unlinkSync(fileName)
    // rename file: fs.renameSync(oldName, newName);

    // used to store/cache the project's root directory
    var projectRoot: string;


    export function setProjectRoot(projRoot: string) {
        projectRoot = projRoot.replace(/\\/g, '/');
    }


    export function getProjectRoot() {
        return projectRoot;
    }


    function getSetOrDefaultProjectPath(projRoot?: string) {
        projRoot = projRoot ? projRoot.replace(/\\/g, '/') : (projectRoot || (projectRoot = process.cwd().replace(/\\/g, '/')));
        return projRoot;
    }


    /** Relativize a path against a root directory, also convert backslashes to forward slashes.
     * Example: toShortFileName('a\b\c\log.txt', 'a/b')
     * returns: 'c/log.txt'
     * @param file
     * @param projRoot
     */
    export function toShortFileName(file: string, projRoot?: string) {
        projRoot = getSetOrDefaultProjectPath(projRoot);
        var parts = file.replace(/\\/g, '/').split(projRoot);
        return removeLeading(parts[parts.length - 1], '/');
    }


    /** Converts an object to a string using JSON.stringify, but reformats escaped newlines, quotes and forward slashes back to
     * unescaped form for pretty console printing and relativizes project paths if requested
     * @param obj the objec to stringify
     * @param [relativizeProjPaths] if specified, replace all path backslashes with forward slashes and relativize any paths against the 'projRoot' parameter
     * @param [projRoot] optional project root directory, defaults to process.cwd()
     */
    export function objToString(obj: any, relativizeProjPaths?: boolean, projRoot?: string) {
        projRoot = getSetOrDefaultProjectPath(projRoot);
        var res = JSON.stringify(obj, undefined, "  ").split("\\n").join("\n").split("\\\"").join("\"").split("\\\\").join("\\");
        if (relativizeProjPaths) {
            res = res.replace(/\\/g, '/').split(projRoot).join("");
        }
        return res;
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


    export function existsFileOrDirSync(path: string) {
        return _existsFileOrDirSync(path, true, true);
    }


    export function existsDirSync(path: string) {
        return _existsFileOrDirSync(path, false, true);
    }


    export function existsFileSync(path: string) {
        return _existsFileOrDirSync(path, true, false);
    }


    function _existsFileOrDirSync(path: string, orFile: boolean, orDir: boolean) {
        try {
            var info = fs.statSync(path);
            return (orFile ? info.isFile() : false) || (orDir ? info.isDirectory() : false);
        } catch (err) {
            return err.code === "ENOENT" ? false : null;
        }
    }


    /** Read the specified file from the file system and check whether it contains only ASCII characters and return data about lines and characters in the file which contain non-ASCII characters.
     * Also, optionally log messages gulp-util.
     * @param fileName the file to check
     * @param debug whether to print debugging messages
     */
    export function checkFileAsciiEncodingSync(fileName: string, debug?: boolean) {
        var f = fs.readFileSync(fileName);

        if (debug) { gutil.log("checking '" + fileName + "' file for ASCII encoding"); }

        var lines = f.toString().split("\n");
        var badCharRanges: { startIndex: number; length: number; lineNumber: number; line: string; text: string; }[] = [];
        for (var i = 0, size = lines.length; i < size; i++) {
            var ln = lines[i];
            for (var k = 0, count = ln.length; k < count; k++) {
                // found invalid char
                if (ln.charCodeAt(k) > 127) {
                    var startIndex = k;
                    var length = 0;
                    while (k < count && ln.charCodeAt(k) > 127) {
                        k++;
                    }
                    var badCharRng = { startIndex, length: k - startIndex, lineNumber: i + 1, line: ln, text: ln.substr(startIndex, k - startIndex) };
                    badCharRanges.push(badCharRng);
                }
            }
        }

        if (debug) {
            gutil.log("bad char segments:\n" +
                badCharRanges.map(r => "(" + r.lineNumber + ":[" + r.startIndex + "," + (r.startIndex + r.length) + "])" +
                    " '" + r.text + "' line: '" + (r.line.length > 200 ? r.line.substr(0, 200) + "..." : r.line) + "'\n")
            );
        }

        return badCharRanges;
    }


    // TODO copy of ts-mortar/utils/Strings
    function removeLeading(str: string, leadingStr: string, removeRepeats: boolean = false) {
        var res = str;
        var leadingStrLen = leadingStr.length;

        if (res.indexOf(leadingStr) === 0) {
            res = res.substr(leadingStrLen);
        }

        if (removeRepeats) {
            while (res.indexOf(leadingStr) === 0) {
                res = res.substr(leadingStrLen);
            }
        }
        return res;
    }


    // TODO copy of ts-mortar/utils/Strings
    function removeTrailing(str: string, trailingStr: string, removeRepeats: boolean = false) {
        var res = str;
        var trailingStrLen = trailingStr.length;

        if (res.lastIndexOf(trailingStr) === res.length - trailingStrLen) {
            res = res.substr(0, res.length - trailingStrLen);
        }

        if (removeRepeats) {
            while (res.lastIndexOf(trailingStr) === res.length - trailingStrLen) {
                res = res.substr(0, res.length - trailingStrLen);
            }
        }
        return res;
    }

}

export = PathUtil;