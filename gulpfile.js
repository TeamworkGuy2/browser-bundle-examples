"use strict";
var gulp = require("gulp");
var gutil = require("gulp-util");
var babelify = require("babelify");
var traceur = require("traceur");
//import nodeSass = require("node-sass");
var uglifyJs = require("uglify-js");
var FileUtil = require("../ts-bundlify/utils/FileUtil");
var GulpUtil = require("../ts-bundlify/utils/GulpUtil");
var BrowserMultiPack = require("../ts-bundlify/bundlers/browser/BrowserMultiPack");
var BundlifyHelper = require("../ts-bundlify/bundlers/BundlifyHelper");
var BundleBuilder = require("../ts-bundlify/bundlers/BundleBuilder");
var BabelBundler = require("../ts-bundlify/bundlers/babel/BabelBundler");
var TraceurBundler = require("../ts-bundlify/bundlers/traceur/TraceurBundler");
var UglifyBundler = require("../ts-bundlify/bundlers/uglify/UglifyBundler");
// TODO: Work in progess to output bundle to multiple files
// browserify uses labeled-stream-splicer as it's pipeline for processing files from input, through transforms, to output.
// The transform process goes from json to string at the browser-pack 'pack' pipeline step which is the last pipeline step.
// Output is feed to vinyl-source-stream and gulp.dest() (which uses vinyl-fs).
// Need to create a new version of browser-pack that outputs to multiple streams and then setup ts-bundlify to support multiple streams from browserify.
// !An Idea: make the browserify 'pack' step a pass-through stream and handle it all on our end with a custom browser-pack that supports filters to split up files to multiple destinations
// https://fettblog.eu/gulp-browserify-multiple-bundles/
// https://lincolnloop.com/blog/speedy-browserifying-multiple-bundles/
/**
 * If a 'dstFile' path is specified, the special characters are dropped amd the resulting text is written to the 'dstFile' path.
 * If 'dstFile' path is '*in' the file is overwritten with the special characters dropped
 * parameters:
 * '--file ../... [--dstFile [../...]|[*in]]' - path of file to check
 */
gulp.task("checkFileEncoding", function () {
    FileUtil.checkOrConvertFileEncodingToAscii(gutil.env["file"], gutil.env["dstFile"]);
});
// compile 3rd party library files
gulp.task("vendor", function () {
    return BundlifyHelper.concat([
        "src/vendor/power-regulator.js",
        "src/vendor/string-utils.js",
    ], "build/vendor.js", "\n\n\n// ==== file separator ====\n");
});
gulp.task("build", ["vendor"], function () {
    var rebuild = GulpUtil.parseFlag("rebuild", "true");
    var debug = GulpUtil.parseFlag("debug");
    var verbose = GulpUtil.parseFlag("verboseCompileInfo", "false");
    var scenarioName = GulpUtil.parseString("scenario");
    gutil.log("{ rebuild: " + rebuild + ", debug: " + debug + ", scenario: " + scenarioName + ", verboseCompileInfo: " + verbose + ", process.cwd: " + process.cwd() + " }");
    var paths = {
        entryFile: "./src/example-code/power-grid/PowerGridWidget.js",
        dstDir: "./build/",
        srcPaths: ["node_modules", "./src/example-code/power-grid"],
        projectRoot: process.cwd(),
    };
    var bundleOpts = {
        rebuild: rebuild,
        debug: debug,
        verbose: verbose,
        typescript: { includeHelpers: true }
    };
    var browserifyOpts;
    var bundleBldr = BundleBuilder.buildOptions(bundleOpts, function (brwsOpts) { return browserifyOpts = brwsOpts; });
    // TODO testing in progress
    debugger;
    switch (scenarioName) {
        case "babel":
            bundleBldr
                .transforms(function (browserify) { return [
                BabelBundler.createTransformer(babelify)
            ]; })
                .compileBundle(paths, { dstFileName: "app-babel-babelify.js" });
            return;
        case "traceur":
            //TraceurEs6ify
            bundleBldr
                .transforms(function (browserify) { return [
                TraceurBundler.createTransformer(traceur)
            ]; })
                .compileBundle(paths, { dstFileName: "app-traceur-es6ify.js" });
            return;
        case "uglify":
            BrowserMultiPack.overrideBrowserifyPack(bundleBldr, BundleBuilder.getBrowserify(), function () { return ({
                bundles: [{
                        dstFileName: "app-uglify.js",
                        prelude: browserifyOpts.prelude,
                    }, {
                        dstFileName: "app-uglify-common.js",
                        prelude: browserifyOpts.typescriptHelpers + "var require = " + browserifyOpts.prelude,
                        preludePath: "./_prelude-with-typescript-helpers.js",
                    }],
                maxDestinations: 2,
                destinationPicker: function (path) {
                    return path.indexOf("power-grid") > -1 ? 0 : 1;
                },
            }); });
            bundleBldr
                .transforms(function (browserify) { return [
                UglifyBundler.createTransformer(uglifyJs, {
                    test: function (s) {
                        var pth = s.split("src");
                        pth.shift();
                        console.log("checking: " + pth.join("src"));
                        return false;
                    }
                }, {
                    output: {
                        indent_level: 2,
                        beautify: true,
                        comments: true,
                    }
                })
            ]; })
                .compileBundle(paths, null);
            return;
        case "scss":
            paths.srcPaths = ["src/css/base.scss"];
            //SassBundler.compileBundle(nodeSass, { rebuild, debug, verbose }, paths, { dstFileName: "css/base.css" });
            gutil.log("currently unsupported by node-sas on x64 environments (2017-04)");
            return;
        default:
            gutil.log("Error: unknown compile scenario '" + scenarioName + "'");
    }
});
gulp.task("default", ["build"]);
