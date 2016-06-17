"use strict";
var fs = require("fs");
var gutil = require("gulp-util");
var sass = require("node-sass");
var PathUtil = require("../PathUtil");
var ScssSass;
(function (ScssSass) {
    function compileScripts(debug, verboseCompileInfo, paths) {
        // https://medium.com/@brianhan/watch-compile-your-sass-with-npm-9ba2b878415b#.2pq0kxmmz
        var srcFile = "src/css/base.scss";
        var dstFile = "build/css/base.css";
        var dstFileMap = "build/css/base.css.map";
        var scssOpts = {
            file: srcFile,
            sourceMap: true,
            outFile: dstFile,
            outputStyle: "expanded",
        };
        sass.render(scssOpts, function (err, res) {
            if (err) {
                gutil.log("error compiling SCSS '" + srcFile + "': " + PathUtil.objToString(err, true, paths.projectRoot));
            }
            else {
                fs.writeFileSync(dstFile, res.css);
                fs.writeFileSync(dstFileMap, res.map);
                gutil.log("compiled SCSS '" + dstFile + "': " + PathUtil.objToString(res.stats, true, paths.projectRoot));
            }
        });
    }
    ScssSass.compileScripts = compileScripts;
})(ScssSass || (ScssSass = {}));
module.exports = ScssSass;
