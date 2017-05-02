
class PowerSource {
    protected powerLevel = 0;


    constructor() {
    }


    public increasePower(level = 1) {
        this.powerLevel += level;
        return this.powerLevel;
    }


    public reducePower() {
        this.powerLevel = this.powerLevel / 2;
        return this.powerLevel;
    }


    public reset() {
        this.powerLevel = 0;
    }

}

export = PowerSource;