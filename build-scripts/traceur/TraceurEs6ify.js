"use strict";
var gulp = require("gulp");
var gutil = require("gulp-util");
var vinylSourceStream = require("vinyl-source-stream");
var watchify = require("watchify");
var BrowserifyHelper = require("../BrowserifyHelper");
var Es6ifyLike = require("./Es6ifyLike");
var shortName = BrowserifyHelper.toShortFileName;
var TraceurEs6ify;
(function (TraceurEs6ify) {
    function compileScripts(debug, verboseCompileInfo, paths) {
        var dstDir = paths.dstDir, dstFile = paths.dstFile, entryFile = paths.entryFile;
        var bundlerOpts = BrowserifyHelper.createOptions(Object.assign({ debug: debug }, paths), [watchify]);
        var bundler = BrowserifyHelper.create(bundlerOpts);
        Es6ifyLike.traceurOverrides.global = true;
        // all JS files
        var es6ifyCompile = Es6ifyLike.es6ify(undefined, function (file, willProcess) {
            gutil.log("traceur " + (willProcess ? "applied to" : "skipped") + " '" + shortName(file) + "'");
        }, function (file, data) {
            gutil.log("traceur done '" + shortName(file) + "', data " + data.length + " done");
        });
        bundler = bundler.transform(function (file, opts) {
            var res = es6ifyCompile(file);
            return res;
        });
        BrowserifyHelper.setupRebundleListener(dstDir + dstFile, bundler, function () {
            return bundler.bundle();
        }, [
            //var mapFile = dstDir + "app.map.js";
            ["to-vinyl-file", function (prevSrc) { return prevSrc.pipe(vinylSourceStream(dstFile)); }],
            //(prevSrc) => prevSrc.pipe(exorcist(mapFile)),
            //(prevSrc) => prevSrc.pipe(rename(dstFile)),
            ["write-to-dst", function (prevSrc) { return prevSrc.pipe(gulp.dest(dstDir)); }],
        ]);
    }
    TraceurEs6ify.compileScripts = compileScripts;
})(TraceurEs6ify || (TraceurEs6ify = {}));
module.exports = TraceurEs6ify;
