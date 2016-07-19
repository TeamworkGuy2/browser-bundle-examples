"use strict";
var gutil = require("gulp-util");
var browserify = require("browserify");
var browserPack = require("browser-pack");
var stream = require("stream");
var util = require("util");
var BrowserifyHelper;
(function (BrowserifyHelper) {
    function create(opts) {
        var bundler = new browserify(opts);
        return bundler;
    }
    BrowserifyHelper.create = create;
    function createOptions(opts, plugins) {
        opts = Object.assign({}, opts || {});
        var res = {
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
    BrowserifyHelper.createOptions = createOptions;
    /** Setup a watchify rebundler given an intial stream and further stream transforms.
     * Error callbacks are added to each stream
     * @param dstFilePath the name of the stream destination to display in success/error messages
     * @param bundler the browserify object with a watchify plugin used to listener for 'update' events on to determine when to rebundle
     * @param getInitialStream a function which creates the initial stream (i.e. bundler.bundle(opts))
     * @param additionalStreamPipes further transformations (i.e. [ (prevSrc) => prevSrc.pipe(vinyleSourceStream(...), (prevSrc) => prevSrc.pipe(gulp.dest(...)) ])
     */
    function setupRebundleListener(dstFilePath, bundler, getInitialStream, additionalStreamPipes) {
        function rebundle() {
            var startTime;
            var endTime;
            function startCb(stream) {
                startTime = Date.now();
                gutil.log("start building '" + dstFilePath + "'");
            }
            function doneCb() {
                endTime = Date.now();
                gutil.log("finished building '" + dstFilePath + "', " + (endTime - startTime) + " ms");
            }
            function createErrorCb(srcName) {
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
    BrowserifyHelper.setupRebundleListener = setupRebundleListener;
    function getPreludeJsSource(cb) {
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
            cb(new Error(err));
        });
        stream.write({ source: "" });
        stream.end();
    }
    BrowserifyHelper.getPreludeJsSource = getPreludeJsSource;
    function createStreamTransformer(optionalTransforms) {
        function SimpleStreamView(opts) {
            stream.Transform.call(this, opts);
        }
        util.inherits(SimpleStreamView, stream.Transform);
        SimpleStreamView["_transform"] = function _transform(chunk, encoding, cb) {
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
        function runFuncResultToBuffer(chunk, append, func) {
            if (func) {
                var res = func(chunk);
                if (res != null) {
                    // TODO deprecated in node v6
                    chunk = Buffer.isBuffer(res) ? res : Buffer.concat([append ? chunk : new Buffer(res), append ? new Buffer(res) : chunk]);
                }
                return chunk;
            }
        }
        return new SimpleStreamView();
    }
    BrowserifyHelper.createStreamTransformer = createStreamTransformer;
})(BrowserifyHelper || (BrowserifyHelper = {}));
module.exports = BrowserifyHelper;
