import gulp = require("gulp");
import gutil = require("gulp-util");
import vinylSourceStream = require("vinyl-source-stream");
import watchify = require("watchify");
import PathUtil = require("../PathUtil");
import BrowserifyHelper = require("../BrowserifyHelper");
import Es6ifyLike = require("./Es6ifyLike");

var shortName = PathUtil.toShortFileName;


module TraceurEs6ify {

    export function compileScripts(debug: boolean, verboseCompileInfo: boolean, paths: AppPaths) {
        var { dstDir, dstFile, entryFile } = paths;

        var bfyOpts: Browserify.Options & BrowserPack.Options = {
            debug,
        };
        var bundlerOpts = BrowserifyHelper.createOptions(Object.assign(bfyOpts, paths), [watchify]);
        var bundler = BrowserifyHelper.create(bundlerOpts);

        Es6ifyLike.traceurOverrides.global = true;
        // all JS files
        var es6ifyCompile = Es6ifyLike.es6ify(undefined, (file, willProcess) => {
            gutil.log("traceur " + (willProcess ? "applied to" : "skipped") + " '" + shortName(file) + "'");
        }, (file, data) => {
            gutil.log("traceur done '" + shortName(file) + "', data " + data.length + " done");
        });

        bundler = bundler.transform(function (file, opts) {
            var res = es6ifyCompile(file);
            return res;
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

export = TraceurEs6ify;