import fs = require("fs");
import gutil = require("gulp-util");

module FileUtil {

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

}

export = FileUtil;