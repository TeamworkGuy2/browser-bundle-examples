/// <reference path="../definitions/node/node.d.ts" />
/// <reference path="../definitions/chai/chai.d.ts" />
/// <reference path="../definitions/exorcist/exorcist.d.ts" />
/// <reference path="../definitions/gulp/gulp.d.ts" />
/// <reference path="../definitions/gulp-rename/gulp-rename.d.ts" />
/// <reference path="../definitions/gulp-util/gulp-util.d.ts" />
/// <reference path="../definitions/mocha/mocha.d.ts" />
/// <reference path="../definitions/node-sass/node-sass.d.ts" />
/// <reference path="../definitions/react/react.d.ts" />
/// <reference path="../definitions/react/react-dom.d.ts" />
/// <reference path="../definitions/through/through.d.ts" />
/// <reference path="../definitions/vinyl-source-stream/vinyl-source-stream.d.ts" />
/// <reference path="../definitions/q/Q.d.ts" />
/// <reference path="../definitions/custom/babelify/babelify.d.ts" />
/// <reference path="../definitions/custom/browser-pack/browser-pack.d.ts" />
/// <reference path="../definitions/custom/watchify/watchify.d.ts" />

declare module "traceur" {

    export class NodeCompiler {
        constructor(opts?: any);

        compile(contents: string, file: string, opts: any): any;
    }

}


interface AppPaths {
    entryFile: string;
    dstDir: string;
    dstFile: string;
    dstMapFile: string;
    srcPaths: string[];
    projectRoot: string;
}