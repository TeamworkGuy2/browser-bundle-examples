import fs = require("fs");
import gutil = require("gulp-util");
import sass = require("node-sass");
import LogUtil = require("../LogUtil");

module ScssSass {

    export function compileScripts(debug: boolean, verboseCompileInfo: boolean, paths: AppPaths) {
        // https://medium.com/@brianhan/watch-compile-your-sass-with-npm-9ba2b878415b#.2pq0kxmmz
        var srcFile = "src/css/base.scss";
        var dstFile = "build/css/base.css";
        var dstFileMap = "build/css/base.css.map";
        var scssOpts: sass.Options = {
            file: srcFile,
            sourceMap: true,
            outFile: dstFile,
            outputStyle: "expanded",
        };
        sass.render(scssOpts, (err, res) => {
            if (err) {
                gutil.log("error compiling SCSS '" + srcFile + "': " + LogUtil.objToString(err, true, paths.projectRoot));
            }
            else {
                fs.writeFileSync(dstFile, res.css);
                fs.writeFileSync(dstFileMap, res.map);
                gutil.log("compiled SCSS '" + dstFile + "': " + LogUtil.objToString(res.stats, true, paths.projectRoot));
            }
        });
    }

}

export = ScssSass;