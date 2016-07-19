import SafePowerSource = require("./SafePowerSource");
import PowerRelay = require("./PowerRelay");

type Junction = PowerRelay.Junction;
var Junction = PowerRelay.Junction;
type Relay = PowerRelay.Relay;
var Relay = PowerRelay.Relay;
type JunctionId = PowerRelay.JunctionId;
type RelayId = PowerRelay.RelayId;


class PowerGrid {

    public static maps = {
        defaultMap1: [
            "                                                                                ",
            "                                                                                ",
            "        +                                        +                         +    ",
            "       /                                         |                        /     ",
            "      /                 +--------+---------------+                       +      ",
            "     |                 /         |               |                       |      ",
            "     +                +          |               +-----------+-----------+      ",
            "     |                           |                                       |      ",
            "     +---------------------------+                                       |      ",
            "                                             +--\\                        |      ",
            "                                                 +-----------------------+      ",
            "                       +-------------------------+                              ",
            "                      /                          |                              ",
            "                     +                           +                              ",
            "                                                                                ",
            "                                                                                ",
        ],

        hds: [
            "                                                                                ",
            "                                                                                ",
            "    +       +      +  +  +           + + + + +                                  ",
            "                                                                                ",
            "    +       +      +       +       +                                            ",
            "                                                                                ",
            "    +       +      +         +     +                                            ",
            "                                                                                ",
            "    + + + + +      +         +       + + + +                                    ",
            "                                                                                ",
            "    +       +      +         +               +                                  ",
            "                                                                                ",
            "    +       +      +       +                 +                                  ",
            "                                                                                ",
            "    +       +      +  +  +         + + + + +                                    ",
            "                                                                                ",
        ],
    };


    public junctions: Junction[];
    public relays: Relay[];
    public junctionCache: { [junctionId: string]: Junction; };
    public relayCache: { [relayId: string]: Relay; };


    public createPowerGrid(map: string[]) {
        var diagramParts = PowerRelay.diagramToJunctionRelays(0, map);

        this.junctionCache = Junction.toMap(diagramParts.junctions);
        this.junctions = Object.keys(this.junctionCache).map(k => this.junctionCache[k]);

        this.relayCache = Relay.toMap(diagramParts.relays);
        this.relays = Object.keys(this.relayCache).map(k => this.relayCache[k]);

        return diagramParts.size;
    }


    public getJunction(id: JunctionId): Junction {
        return this.junctionCache[id];
    }


    public getRelay(id: RelayId): Relay {
        return this.relayCache[id];
    }

}

export = PowerGrid;