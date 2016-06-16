(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var PowerSource = function () {
    function PowerSource() {
        this.powerLevel = 0;
    }
    PowerSource.prototype.morePower = function (level) {
        if (level === void 0) {
            level = 1;
        }
        this.powerLevel += level;
        return this.powerLevel;
    };
    // TODO better name?
    PowerSource.prototype.calmDown = function () {
        this.powerLevel = this.powerLevel / 2;
        return this.powerLevel;
    };
    PowerSource.prototype.reset = function () {
        this.powerLevel = 0;
    };
    return PowerSource;
}();
module.exports = PowerSource;

},{}],2:[function(require,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PowerSource = require("./PowerSource");
/** Safety is critical when dealing with PowerSources.
 * This class overrides dangerous PowerScope functions and provides safety checked versions
 */
var SafePowerSource = function (_super) {
    __extends(SafePowerSource, _super);
    function SafePowerSource() {
        _super.call(this);
    }
    SafePowerSource.prototype.morePower = function (level) {
        if (level === void 0) {
            level = 1;
        }
        return _super.prototype.morePower.call(this, Math.abs(level));
    };
    SafePowerSource.prototype.calmDown = function (level) {
        if (typeof level === "number") {
            return this.powerLevel = Math.max(0, this.powerLevel - level);
        } else {
            return _super.prototype.calmDown.call(this);
        }
    };
    return SafePowerSource;
}(PowerSource);
module.exports = SafePowerSource;

},{"./PowerSource":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXGV4YW1wbGUxXFxQb3dlclNvdXJjZS5qcyIsInNyY1xcZXhhbXBsZTFcXFNhZmVQb3dlclNvdXJjZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUNBLElBQUksY0FBZSxZQUFZO0FBQzNCLGFBQVMsV0FBVCxHQUF1QjtBQUNuQixhQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDSDtBQUNELGdCQUFZLFNBQVosQ0FBc0IsU0FBdEIsR0FBa0MsVUFBVSxLQUFWLEVBQWlCO0FBQy9DLFlBQUksVUFBVSxLQUFLLENBQW5CLEVBQXNCO0FBQUUsb0JBQVEsQ0FBUjtBQUFZO0FBQ3BDLGFBQUssVUFBTCxJQUFtQixLQUFuQjtBQUNBLGVBQU8sS0FBSyxVQUFaO0FBQ0gsS0FKRDs7QUFNQSxnQkFBWSxTQUFaLENBQXNCLFFBQXRCLEdBQWlDLFlBQVk7QUFDekMsYUFBSyxVQUFMLEdBQWtCLEtBQUssVUFBTCxHQUFrQixDQUFwQztBQUNBLGVBQU8sS0FBSyxVQUFaO0FBQ0gsS0FIRDtBQUlBLGdCQUFZLFNBQVosQ0FBc0IsS0FBdEIsR0FBOEIsWUFBWTtBQUN0QyxhQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDSCxLQUZEO0FBR0EsV0FBTyxXQUFQO0FBQ0gsQ0FsQmtCLEVBQW5CO0FBbUJBLE9BQU8sT0FBUCxHQUFpQixXQUFqQjs7O0FDcEJBOztBQUNBLElBQUksWUFBYSxhQUFRLFVBQUssU0FBZCxJQUE0QixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ3hELFNBQUssSUFBSSxDQUFULElBQWMsQ0FBZDtBQUFpQixZQUFJLEVBQUUsY0FBRixDQUFpQixDQUFqQixDQUFKLEVBQXlCLEVBQUUsQ0FBRixJQUFPLEVBQUUsQ0FBRixDQUFQO0FBQTFDLEtBQ0EsU0FBUyxFQUFULEdBQWM7QUFBRSxhQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFBdUI7QUFDdkMsTUFBRSxTQUFGLEdBQWMsTUFBTSxJQUFOLEdBQWEsT0FBTyxNQUFQLENBQWMsQ0FBZCxDQUFiLElBQWlDLEdBQUcsU0FBSCxHQUFlLEVBQUUsU0FBakIsRUFBNEIsSUFBSSxFQUFKLEVBQTdELENBQWQ7QUFDSCxDQUpEO0FBS0EsSUFBSSxjQUFjLFFBQVEsZUFBUixDQUFsQjs7OztBQUlBLElBQUksa0JBQW1CLFVBQVUsTUFBVixFQUFrQjtBQUNyQyxjQUFVLGVBQVYsRUFBMkIsTUFBM0I7QUFDQSxhQUFTLGVBQVQsR0FBMkI7QUFDdkIsZUFBTyxJQUFQLENBQVksSUFBWjtBQUNIO0FBQ0Qsb0JBQWdCLFNBQWhCLENBQTBCLFNBQTFCLEdBQXNDLFVBQVUsS0FBVixFQUFpQjtBQUNuRCxZQUFJLFVBQVUsS0FBSyxDQUFuQixFQUFzQjtBQUFFLG9CQUFRLENBQVI7QUFBWTtBQUNwQyxlQUFPLE9BQU8sU0FBUCxDQUFpQixTQUFqQixDQUEyQixJQUEzQixDQUFnQyxJQUFoQyxFQUFzQyxLQUFLLEdBQUwsQ0FBUyxLQUFULENBQXRDLENBQVA7QUFDSCxLQUhEO0FBSUEsb0JBQWdCLFNBQWhCLENBQTBCLFFBQTFCLEdBQXFDLFVBQVUsS0FBVixFQUFpQjtBQUNsRCxZQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUMzQixtQkFBTyxLQUFLLFVBQUwsR0FBa0IsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLEtBQUssVUFBTCxHQUFrQixLQUE5QixDQUF6QjtBQUNILFNBRkQsTUFHSztBQUNELG1CQUFPLE9BQU8sU0FBUCxDQUFpQixRQUFqQixDQUEwQixJQUExQixDQUErQixJQUEvQixDQUFQO0FBQ0g7QUFDSixLQVBEO0FBUUEsV0FBTyxlQUFQO0FBQ0gsQ0FsQnNCLENBa0JyQixXQWxCcUIsQ0FBdkI7QUFtQkEsT0FBTyxPQUFQLEdBQWlCLGVBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgUG93ZXJTb3VyY2UgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUG93ZXJTb3VyY2UoKSB7XHJcbiAgICAgICAgdGhpcy5wb3dlckxldmVsID0gMDtcclxuICAgIH1cclxuICAgIFBvd2VyU291cmNlLnByb3RvdHlwZS5tb3JlUG93ZXIgPSBmdW5jdGlvbiAobGV2ZWwpIHtcclxuICAgICAgICBpZiAobGV2ZWwgPT09IHZvaWQgMCkgeyBsZXZlbCA9IDE7IH1cclxuICAgICAgICB0aGlzLnBvd2VyTGV2ZWwgKz0gbGV2ZWw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG93ZXJMZXZlbDtcclxuICAgIH07XHJcbiAgICAvLyBUT0RPIGJldHRlciBuYW1lP1xyXG4gICAgUG93ZXJTb3VyY2UucHJvdG90eXBlLmNhbG1Eb3duID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucG93ZXJMZXZlbCA9IHRoaXMucG93ZXJMZXZlbCAvIDI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG93ZXJMZXZlbDtcclxuICAgIH07XHJcbiAgICBQb3dlclNvdXJjZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5wb3dlckxldmVsID0gMDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUG93ZXJTb3VyY2U7XHJcbn0oKSk7XHJcbm1vZHVsZS5leHBvcnRzID0gUG93ZXJTb3VyY2U7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG52YXIgUG93ZXJTb3VyY2UgPSByZXF1aXJlKFwiLi9Qb3dlclNvdXJjZVwiKTtcclxuLyoqIFNhZmV0eSBpcyBjcml0aWNhbCB3aGVuIGRlYWxpbmcgd2l0aCBQb3dlclNvdXJjZXMuXHJcbiAqIFRoaXMgY2xhc3Mgb3ZlcnJpZGVzIGRhbmdlcm91cyBQb3dlclNjb3BlIGZ1bmN0aW9ucyBhbmQgcHJvdmlkZXMgc2FmZXR5IGNoZWNrZWQgdmVyc2lvbnNcclxuICovXHJcbnZhciBTYWZlUG93ZXJTb3VyY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKFNhZmVQb3dlclNvdXJjZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIFNhZmVQb3dlclNvdXJjZSgpIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuICAgIFNhZmVQb3dlclNvdXJjZS5wcm90b3R5cGUubW9yZVBvd2VyID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcbiAgICAgICAgaWYgKGxldmVsID09PSB2b2lkIDApIHsgbGV2ZWwgPSAxOyB9XHJcbiAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUubW9yZVBvd2VyLmNhbGwodGhpcywgTWF0aC5hYnMobGV2ZWwpKTtcclxuICAgIH07XHJcbiAgICBTYWZlUG93ZXJTb3VyY2UucHJvdG90eXBlLmNhbG1Eb3duID0gZnVuY3Rpb24gKGxldmVsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb3dlckxldmVsID0gTWF0aC5tYXgoMCwgdGhpcy5wb3dlckxldmVsIC0gbGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5wcm90b3R5cGUuY2FsbURvd24uY2FsbCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNhZmVQb3dlclNvdXJjZTtcclxufShQb3dlclNvdXJjZSkpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IFNhZmVQb3dlclNvdXJjZTtcclxuIl19
