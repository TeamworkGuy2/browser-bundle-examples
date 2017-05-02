"use strict";
var PowerSource = (function () {
    function PowerSource() {
        this.powerLevel = 0;
    }
    PowerSource.prototype.increasePower = function (level) {
        if (level === void 0) { level = 1; }
        this.powerLevel += level;
        return this.powerLevel;
    };
    PowerSource.prototype.reducePower = function () {
        this.powerLevel = this.powerLevel / 2;
        return this.powerLevel;
    };
    PowerSource.prototype.reset = function () {
        this.powerLevel = 0;
    };
    return PowerSource;
}());
module.exports = PowerSource;
