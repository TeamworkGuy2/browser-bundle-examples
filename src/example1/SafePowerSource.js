"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PowerSource = require("./PowerSource");
/** Safety is critical when dealing with PowerSources.
 * This class overrides dangerous PowerScope functions and provides safety checked versions
 */
var SafePowerSource = (function (_super) {
    __extends(SafePowerSource, _super);
    function SafePowerSource() {
        _super.call(this);
    }
    SafePowerSource.prototype.morePower = function (level) {
        if (level === void 0) { level = 1; }
        return _super.prototype.morePower.call(this, Math.abs(level));
    };
    SafePowerSource.prototype.calmDown = function (level) {
        if (typeof level === "number") {
            return this.powerLevel = Math.max(0, this.powerLevel - level);
        }
        else {
            return _super.prototype.calmDown.call(this);
        }
    };
    return SafePowerSource;
}(PowerSource));
module.exports = SafePowerSource;
