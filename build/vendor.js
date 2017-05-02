
(function () {
    var version = "1.0.0";
    console.log("power-regulator " + version + " initialized");
}());


// ==== file separator ====

(function () {
    this.StringUtil = {
        replaceAll: function replaceAll(str, oldStr, newStr) {
            return str.split(oldStr).join(newStr);
        }
    };
}());