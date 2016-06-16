import gutil = require("gulp-util");
import browserify = require("browserify");
import browserPack = require("browser-pack");
import stream = require("stream");
import util = require("util");

module BrowserifyHelper {
    var projectRoot: string;


    export function setProjectRoot(projRoot: string) {
        projectRoot = projRoot.replace(/\\/g, '/');
    }


    export function getProjectRoot() {
        return projectRoot;
    }


    export function create(opts: Browserify.Options) {
        var bundler = new browserify(opts);
        return bundler;
    }


    export function createOptions(opts?: AppPaths & { debug?: boolean; } & Browserify.Options, plugins?: any[]): Browserify.Options {
        opts = <any>Object.assign({}, opts || {});
        var res: Browserify.Options = {
            debug: opts.debug,
            entries: [opts.entryFile],
            extensions: [".js", ".jsx"],
            paths: opts.srcPaths,
            plugin: plugins || [],
            cache: {},
            packageCache: {},
        };

        return Object.assign(res, opts);
    }


    /** Setup a watchify rebundler given an intial stream and further stream transforms.
     * Error callbacks are added to each stream
     * @param dstFilePath the name of the stream destination to display in success/error messages
     * @param bundler the browserify object with a watchify plugin used to listener for 'update' events on to determine when to rebundle
     * @param getInitialStream a function which creates the initial stream (i.e. bundler.bundle(opts))
     * @param additionalStreamPipes further transformations (i.e. [ (prevSrc) => prevSrc.pipe(vinyleSourceStream(...), (prevSrc) => prevSrc.pipe(gulp.dest(...)) ])
     */
    export function setupRebundleListener(dstFilePath: string, bundler: Browserify.BrowserifyObject, getInitialStream: () => NodeJS.ReadableStream,
            additionalStreamPipes: [string, (prevStream: NodeJS.ReadableStream) => NodeJS.ReadableStream][]) {
        function rebundle() {
            var startTime: number;
            var endTime: number;

            function startCb(stream) {
                startTime = Date.now();
                gutil.log("start building '" + dstFilePath + "' with (" + objName(stream) + ")...");
            }

            function doneCb() {
                endTime = Date.now();
                gutil.log("finished building '" + dstFilePath + "', " + (endTime - startTime) + " ms");
            }

            function createErrorCb(srcName: string) {
                return function (err) {
                    console.error("error building '" + dstFilePath + "' at stream '" + srcName + "'", err);
                };
            }

            var stream = getInitialStream();
            stream.on("error", createErrorCb("initial-stream"));

            var streams = additionalStreamPipes;
            for (var i = 0, size = streams.length; i < size; i++) {
                var streamName = streams[i][0];
                var streamCreator = streams[i][1];

                stream = streamCreator(stream);
                stream.on("error", createErrorCb(streamName));
            }

            startCb(stream);

            stream.on("end", doneCb);
            return stream;
        }

        bundler.on("update", rebundle);
        return rebundle();
    }


    export function getPreludeJsSource(cb: (preludeStr: string) => void) {
        var stream = browserPack({ raw: true });
        var str = "";

        stream.on("data", function (buf) {
            str += buf;
        });

        stream.on("end", function () {
            var suffixIdx = str.indexOf("({:[function(require,module,exports){");
            var preludeStr = str.substring(0, suffixIdx);
            cb(preludeStr);
        });

        stream.on("err", function (err) {
            cb(<any>new Error(err));
        });

        stream.write(<any>{ source: "" });
        stream.end();
    }


    interface BufferViewTransformFunc {
        (buf?: Buffer): void | string | Buffer;
    }


    export function createStreamTransformer(optionalTransforms: {
                prependInitial?: BufferViewTransformFunc;
                prependEach?: BufferViewTransformFunc,
                appendEach?: BufferViewTransformFunc,
            }) {

        function SimpleStreamView(opts?) {
            stream.Transform.call(this, opts);
        }

        util.inherits(SimpleStreamView, stream.Transform);

        SimpleStreamView["_transform"] = function _transform(chunk: Buffer, encoding: string, cb) {
            if (i === 0) {
                chunk = runFuncResultToBuffer(chunk, false, optionalTransforms.prependInitial);
            }
            chunk = runFuncResultToBuffer(chunk, false, optionalTransforms.prependEach);
            chunk = runFuncResultToBuffer(chunk, true, optionalTransforms.appendEach);
            this.push(chunk);
            cb();
            i++;
        };

        var i = 0;

        function runFuncResultToBuffer(chunk: Buffer, append: boolean, func: (buf?: Buffer) => void | string | Buffer): Buffer {
            if (func) {
                var res = func(chunk);
                if (res != null) {
                    // TODO deprecated in node v6
                    chunk = Buffer.isBuffer(res) ? <Buffer>res : Buffer.concat([append ? chunk : new Buffer(<string>res), append ? new Buffer(<string>res) : chunk]);
                }
                return chunk;
            }
        }

        return new SimpleStreamView();
    }


    /** Best attempt to get a descriptive name from an object, first by checking the object's .constructor, then .prototype, then .name, various Object.prototype.toString.call() permutations,
     * and eventually Object.keys().
     * If the object is not an object, String() is used
     * @param obj
     */
    export function objName(obj: any) {
        if (!obj) { return String(obj); }

        var toStr = Object.prototype.toString;

        if (typeof obj !== "object" && typeof obj !== "function") { return String(obj); }

        if (obj.constructor) {
            var res = (obj.constructor ? obj.constructor.name : toStr.call(obj.constructor));
            if (res !== "object") { return res; }
        }
        if (obj.prototype) {
            var res = (obj.prototype.constructor ? obj.prototype.constructor.name : (obj.prototype.name ? obj.prototype.name : toStr.call(obj.prototype)));
            if (res !== "object") { return res; }
        }
        return obj.name ? obj.name : (typeof obj === "object" ? ("keys:[" + Object.keys(obj).join(", ") + "]") : String(obj));
    }


    export function toShortFileName(file: string, projRoot?: string) {
        projRoot = projRoot || (projectRoot || (projectRoot = process.cwd().replace(/\\/g, '/')));
        var parts = file.replace(/\\/g, '/').split(projRoot);
        return parts[parts.length - 1];
    }


    export function createRegexInspector(regex: RegExp, showRegexTests: boolean) {
        if (showRegexTests) {
            var origTest = regex.test;
            regex.test = function testInspector(str: string) {
                var res = origTest.call(regex, str);
                gutil.log((res ? "building: " : "ignore: ") + toShortFileName(str));
                return res;
            };
        }
        return regex;
    }

}

export = BrowserifyHelper;