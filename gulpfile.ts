import gulp = require("gulp");
import gutil = require("gulp-util");
import BabelBabelify = require("./build-scripts/babel/BabelBabelify");
import TraceurEs6ify = require("./build-scripts/traceur/TraceurEs6ify");


function parseString(flagName: string, defaultValue: string = "") {
    var flagStr = (<string>gutil.env[flagName] || defaultValue).toString().trim();
    return flagStr;
}


function parseFlag(flagName: string, defaultValue: string = "", strictTrue: boolean = false) {
    var flagStr = (<string>gutil.env[flagName] || defaultValue).toString().trim().toLowerCase();
    return strictTrue ? flagStr === "true" : flagStr !== "false";
}


gulp.task("default", [], function () {
    var debug = parseFlag("debug");
    var verboseCompileInfo = parseFlag("verboseCompileInfo", "false");
    var scenarioName = parseString("scenario");
    gutil.log("{ debug: " + debug + ", verboseCompileInfo: " + verboseCompileInfo + ", process.cwd: " + process.cwd() + " }");

    switch (scenarioName) {
        case "babel-babelify":
            BabelBabelify.compileScripts(debug, verboseCompileInfo, {
                entryFile: "./src/example1/SafePowerSource.js",
                dstDir: "./build/",
                dstFile: "app-babel-babelify.js",
                srcPaths: ["node_modules", "./src/example1"],
                projectRoot: process.cwd(),
            });
            return;
        case "traceur-es6ify":
            TraceurEs6ify.compileScripts(debug, verboseCompileInfo, {
                entryFile: "./src/example1/SafePowerSource.js",
                dstDir: "./build/",
                dstFile: "app-traceur-es6ify.js",
                srcPaths: ["node_modules", "./src/example1"],
                projectRoot: process.cwd(),
            });
            return;
        default:
            gutil.log("Error: unknown compile scenario '" + scenarioName + "'");
    }
});