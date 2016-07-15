"use strict";
var ToStringUtil;
(function (ToStringUtil) {
    // TODO copy of ts-mortar/utils/Strings
    function removeLeading(str, leadingStr, removeRepeats) {
        if (removeRepeats === void 0) { removeRepeats = false; }
        var res = str;
        var leadingStrLen = leadingStr.length;
        if (res.indexOf(leadingStr) === 0) {
            res = res.substr(leadingStrLen);
        }
        if (removeRepeats) {
            while (res.indexOf(leadingStr) === 0) {
                res = res.substr(leadingStrLen);
            }
        }
        return res;
    }
    ToStringUtil.removeLeading = removeLeading;
    // TODO copy of ts-mortar/utils/Strings
    function removeTrailing(str, trailingStr, removeRepeats) {
        if (removeRepeats === void 0) { removeRepeats = false; }
        var res = str;
        var trailingStrLen = trailingStr.length;
        if (res.lastIndexOf(trailingStr) === res.length - trailingStrLen) {
            res = res.substr(0, res.length - trailingStrLen);
        }
        if (removeRepeats) {
            while (res.lastIndexOf(trailingStr) === res.length - trailingStrLen) {
                res = res.substr(0, res.length - trailingStrLen);
            }
        }
        return res;
    }
    ToStringUtil.removeTrailing = removeTrailing;
})(ToStringUtil || (ToStringUtil = {}));
module.exports = ToStringUtil;
