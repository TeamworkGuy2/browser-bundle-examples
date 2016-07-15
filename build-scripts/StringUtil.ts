
module ToStringUtil {

    // TODO copy of ts-mortar/utils/Strings
    export function removeLeading(str: string, leadingStr: string, removeRepeats: boolean = false) {
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


    // TODO copy of ts-mortar/utils/Strings
    export function removeTrailing(str: string, trailingStr: string, removeRepeats: boolean = false) {
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

}

export = ToStringUtil;