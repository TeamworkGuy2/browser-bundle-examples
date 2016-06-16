import babelify = require("babelify");
import gulp = require("gulp");
import gutil = require("gulp-util");
import rename = require("gulp-rename");
import vinylSourceStream = require("vinyl-source-stream");
import watchify = require("watchify");
import BrowserifyHelper = require("../BrowserifyHelper");

var shortName = BrowserifyHelper.toShortFileName;


module BabelBabelify {

    export function compileScripts(debug: boolean, verboseCompileInfo: boolean, paths: AppPaths) {
        var { dstDir, dstFile, entryFile } = paths;

        var bundlerOpts = BrowserifyHelper.createOptions(Object.assign({ debug }, paths), [watchify]);
        var bundler = BrowserifyHelper.create(bundlerOpts);

        bundler = bundler.transform((tr, opts) => {
            console.log("babelify: '" + shortName(tr) + "'");

            return babelify(tr, opts);
        }, {
            presets: ["es2015", "react"],
        });

        BrowserifyHelper.setupRebundleListener(dstDir + dstFile, bundler, () => {
            return bundler.bundle();
        }, [
            //var mapFile = dstDir + "app.map.js";
            ["to-vinyl-file", (prevSrc) => prevSrc.pipe(vinylSourceStream(dstFile))],
            //(prevSrc) => prevSrc.pipe(exorcist(mapFile)),
            //(prevSrc) => prevSrc.pipe(rename(dstFile)),
            ["write-to-dst", (prevSrc) => prevSrc.pipe(gulp.dest(dstDir))],
        ]);
    }

}

export = BabelBabelify;