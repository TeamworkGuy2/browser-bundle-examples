"use strict";
var gulp = require("gulp");
var gutil = require("gulp-util");
var BabelBabelify = require("./build-scripts/babel/BabelBabelify");
var TraceurEs6ify = require("./build-scripts/traceur/TraceurEs6ify");
var ScssSass = require("./build-scripts/scss/ScssSass");
function parseString(flagName, defaultValue) {
    if (defaultValue === void 0) { defaultValue = ""; }
    var flagStr = (gutil.env[flagName] || defaultValue).toString().trim();
    return flagStr;
}
function parseFlag(flagName, defaultValue, strictTrue) {
    if (defaultValue === void 0) { defaultValue = ""; }
    if (strictTrue === void 0) { strictTrue = false; }
    var flagStr = (gutil.env[flagName] || defaultValue).toString().trim().toLowerCase();
    return strictTrue ? flagStr === "true" : flagStr !== "false";
}
gulp.task("default", [], function () {
    var debug = parseFlag("debug");
    var verboseCompileInfo = parseFlag("verboseCompileInfo", "false");
    var scenarioName = parseString("scenario");
    gutil.log("{ debug: " + debug + ", verboseCompileInfo: " + verboseCompileInfo + ", process.cwd: " + process.cwd() + " }");
    var opts = {
        entryFile: "./src/example1/PowerGridWidget.js",
        dstDir: "./build/",
        dstFile: null,
        dstMapFile: null,
        srcPaths: ["node_modules", "./src/example1"],
        projectRoot: process.cwd(),
    };
    switch (scenarioName) {
        case "babel":
            opts.dstFile = "app-babel-babelify.js";
            opts.dstMapFile = opts.dstDir + "app-babel-babelify.js.map";
            BabelBabelify.compileScripts(debug, verboseCompileInfo, opts);
            return;
        case "traceur":
            opts.dstFile = "app-traceur-es6ify.js";
            opts.dstMapFile = opts.dstDir + "app-traceur-es6ify.js.map";
            TraceurEs6ify.compileScripts(debug, verboseCompileInfo, opts);
            return;
        case "scss":
            opts.dstFile = "css/base.css";
            ScssSass.compileScripts(debug, verboseCompileInfo, opts);
            return;
        default:
            gutil.log("Error: unknown compile scenario '" + scenarioName + "'");
    }
});
