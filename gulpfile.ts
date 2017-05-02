import stream = require("stream");
import gulp = require("gulp");
import gutil = require("gulp-util");
import babelify = require("babelify");
import traceur = require("traceur");
//import nodeSass = require("node-sass");
import uglifyJs = require("uglify-js");
import FileUtil = require("../ts-bundlify/utils/FileUtil");
import GulpUtil = require("../ts-bundlify/utils/GulpUtil");
import BrowserMultiPack = require("../ts-bundlify/bundlers/browser/BrowserMultiPack");
import BundlifyHelper = require("../ts-bundlify/bundlers/BundlifyHelper");
import BundleBuilder = require("../ts-bundlify/bundlers/BundleBuilder");
import BabelBundler = require("../ts-bundlify/bundlers/babel/BabelBundler");
import TraceurBundler = require("../ts-bundlify/bundlers/traceur/TraceurBundler");
import SassBundler = require("../ts-bundlify/bundlers/sass/SassBundler");
import UglifyBundler = require("../ts-bundlify/bundlers/uglify/UglifyBundler");

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

    var paths: CodePaths = {
        entryFile: "./src/example-code/power-grid/PowerGridWidget.js",
        dstDir: "./build/",
        srcPaths: ["node_modules", "./src/example-code/power-grid"],
        projectRoot: process.cwd(),
    };

    var bundleOpts: BundleOptions = {
        rebuild,
        debug,
        verbose,
        typescript: { includeHelpers: true }
    };
    var browserifyOpts: Browserify.Options & BrowserPack.Options;
    var bundleBldr = BundleBuilder.buildOptions(bundleOpts, (brwsOpts) => browserifyOpts = brwsOpts);

    // TODO testing in progress
    debugger;

    switch (scenarioName) {
        case "babel":
            bundleBldr
                .transforms((browserify) => [
                    BabelBundler.createTransformer(babelify)
                ])
                .compileBundle(paths, { dstFileName: "app-babel-babelify.js" });
            return;
        case "traceur":
            //TraceurEs6ify
            bundleBldr
                .transforms((browserify) => [
                    TraceurBundler.createTransformer(traceur)
                ])
                .compileBundle(paths, { dstFileName: "app-traceur-es6ify.js" });
            return;
        case "uglify":
            BrowserMultiPack.overrideBrowserifyPack(bundleBldr, BundleBuilder.getBrowserify(), () => ({
                bundles: [{
                    dstFileName: "app-uglify.js"
                }, {
                    dstFileName: "app-uglify-common.js"
                }],
                maxDestinations: 2,
                destinationPicker: (row) => {
                    return row.sourceFile.indexOf("power-grid") > -1 ? 0 : 1;
                },
            }), () => ({
                prelude: browserifyOpts.prelude,
                preludePath: browserifyOpts.preludePath,
            }));

            bundleBldr
                .transforms((browserify) => [
                    UglifyBundler.createTransformer(uglifyJs, {
                        test: (s) => {
                            var pth = s.split("src");
                            pth.shift();
                            console.log("checking: " + pth.join("src"));
                            return false;
                        }
                    }, {
                        output: <any>{
                            indent_level: 2,
                            beautify: true,
                            comments: true,
                        }
                    })
                ])
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
