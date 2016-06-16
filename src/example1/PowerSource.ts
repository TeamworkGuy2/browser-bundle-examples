
class PowerSource {
    protected powerLevel = 0;

    constructor() {
    }


    public morePower(level = 1) {
        this.powerLevel += level;
        return this.powerLevel;
    }


    // TODO better name?
    public calmDown() {
        this.powerLevel = this.powerLevel / 2;
        return this.powerLevel;
    }


    public reset() {
        this.powerLevel = 0;
    }

}

export = PowerSource;