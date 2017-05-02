import PowerSource = require("./PowerSource");

/** Safety is critical when dealing with PowerSources.
 * This class overrides dangerous PowerScope functions and provides safety checked versions
 */
class SafePowerSource extends PowerSource {

    constructor() {
        super();
    }


    public increasePower(level = 1) {
        return super.increasePower(Math.abs(level));
    }


    public reducePower(level?: number) {
        if (typeof level === "number") {
            return this.powerLevel = Math.max(0, this.powerLevel - level);
        }
        else {
            return super.reducePower();
        }
    }

}

export = SafePowerSource;