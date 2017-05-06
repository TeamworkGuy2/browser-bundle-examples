browser-bundle-examples
==============

Example projects using [ts-bundlify](https://github.com/TeamworkGuy2/ts-bundlify) with Browserify, Traceur, gulp.js, etc. to build/bundle javascript code into browser ready bundles.
See the example source code in 'src/' and the output bundles in 'build/'.

To test, download and load `src/pages/power-grid.xhtml` into your favorite browser (currently tested in Chrome 57 and Firefox 52).  This page loads the `build/app-uglify.js` and `build/app-uglify-common.js` bundles to produce an SVG.

To compile the `build/` bundles yourself, run `gulp --scenario [babel|traceur|uglify]`