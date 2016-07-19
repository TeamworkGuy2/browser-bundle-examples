"use strict";
var babelify = require("babelify");
var gulp = require("gulp");
var exorcist = require("exorcist");
var vinylSourceStream = require("vinyl-source-stream");
var watchify = require("watchify");
var PathUtil = require("../PathUtil");
var BrowserifyHelper = require("../BrowserifyHelper");
var shortName = PathUtil.toShortFileName;
var BabelBabelify;
(function (BabelBabelify) {
    function compileScripts(debug, verboseCompileInfo, paths) {
        var dstDir = paths.dstDir, dstFile = paths.dstFile, dstMapFile = paths.dstMapFile, entryFile = paths.entryFile;
        var bfyOpts = {
            debug: debug,
        };
        var bundlerOpts = BrowserifyHelper.createOptions(Object.assign(bfyOpts, paths), [watchify]);
        var bundler = BrowserifyHelper.create(bundlerOpts);
        bundler = bundler.transform(function (tr, opts) {
            console.log("babelify: '" + shortName(tr) + "'");
            return babelify(tr, opts);
        }, {
            presets: ["es2015"],
        });
        BrowserifyHelper.setupRebundleListener(dstDir + dstFile, bundler, function () {
            return bundler.bundle();
        }, [
            ["extract-source-maps", function (prevSrc) { return prevSrc.pipe(exorcist(dstMapFile)); }],
            ["to-vinyl-file", function (prevSrc) { return prevSrc.pipe(vinylSourceStream(dstFile)); }],
            //(prevSrc) => prevSrc.pipe(rename(dstFile)),
            ["write-to-dst", function (prevSrc) { return prevSrc.pipe(gulp.dest(dstDir)); }],
        ]);
    }
    BabelBabelify.compileScripts = compileScripts;
})(BabelBabelify || (BabelBabelify = {}));
module.exports = BabelBabelify;
