
(function () {
    this.StringUtil = {
        replaceAll: function replaceAll(str, oldStr, newStr) {
            return str.split(oldStr).join(newStr);
        }
    };
}());