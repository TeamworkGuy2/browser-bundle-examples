import babelify = require("babelify");
import gulp = require("gulp");
import gutil = require("gulp-util");
import exorcist = require("exorcist");
import vinylSourceStream = require("vinyl-source-stream");
import watchify = require("watchify");
import PathUtil = require("../PathUtil");
import BrowserifyHelper = require("../BrowserifyHelper");

var shortName = PathUtil.toShortFileName;


module BabelBabelify {

    export function compileScripts(debug: boolean, verboseCompileInfo: boolean, paths: AppPaths) {
        var { dstDir, dstFile, dstMapFile, entryFile } = paths;

        var bfyOpts: Browserify.Options & BrowserPack.Options = {
            debug,
        };
        var bundlerOpts = BrowserifyHelper.createOptions(Object.assign(bfyOpts, paths), [watchify]);
        var bundler = BrowserifyHelper.create(bundlerOpts);

        bundler = bundler.transform((tr, opts) => {
            console.log("babelify: '" + shortName(tr) + "'");

            return babelify(tr, opts);
        }, {
            presets: ["es2015"],
        });

        BrowserifyHelper.setupRebundleListener(dstDir + dstFile, bundler, () => {
            return bundler.bundle();
        }, [
            ["extract-source-maps", (prevSrc) => prevSrc.pipe(exorcist(dstMapFile))],
            ["to-vinyl-file", (prevSrc) => prevSrc.pipe(vinylSourceStream(dstFile))],
            //(prevSrc) => prevSrc.pipe(rename(dstFile)),
            ["write-to-dst", (prevSrc) => prevSrc.pipe(gulp.dest(dstDir))],
        ]);
    }

}

export = BabelBabelify;