"use strict";
var gulp = require("gulp");
var exorcist = require("exorcist");
var vinylSourceStream = require("vinyl-source-stream");
var watchify = require("watchify");
var PathUtil = require("../PathUtil");
var BrowserifyHelper = require("../BrowserifyHelper");
var Es6ifyLike = require("./Es6ifyLike");
var shortName = PathUtil.toShortFileName;
var TraceurEs6ify;
(function (TraceurEs6ify) {
    function compileScripts(debug, verboseCompileInfo, paths) {
        var dstDir = paths.dstDir, dstMapFile = paths.dstMapFile, dstFile = paths.dstFile, entryFile = paths.entryFile;
        var bfyOpts = {
            debug: debug,
        };
        var bundlerOpts = BrowserifyHelper.createOptions(Object.assign(bfyOpts, paths), [watchify]);
        var bundler = BrowserifyHelper.create(bundlerOpts);
        Es6ifyLike.traceurOverrides.global = true;
        // all JS files
        var es6ifyCompile = Es6ifyLike.es6ify(undefined, function (file, willProcess) {
            //console.log("traceur " + (willProcess ? "applied to" : "skipped") + " '" + shortName(file) + "'");
        }, function (file, data) {
            console.log("traceur: '" + shortName(file) + "'"); // + ", data " + data.length + " done");
        });
        bundler = bundler.transform(function (file, opts) {
            var res = es6ifyCompile(file);
            return res;
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
    TraceurEs6ify.compileScripts = compileScripts;
})(TraceurEs6ify || (TraceurEs6ify = {}));
module.exports = TraceurEs6ify;
