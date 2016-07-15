"use strict";
var UseBrowserifyShim;
(function (UseBrowserifyShim) {
    function pathJoin(parent, child) {
        return path.join(parent, child);
    }
    UseBrowserifyShim.pathJoin = pathJoin;
})(UseBrowserifyShim || (UseBrowserifyShim = {}));
module.exports = UseBrowserifyShim;
