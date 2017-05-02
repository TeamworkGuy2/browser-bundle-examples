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

        this.junctions = diagramParts.junctions;
        this.relays = diagramParts.relays;

        this.junctionCache = Junction.toMap(diagramParts.junctions);
        this.relayCache = Relay.toMap(diagramParts.relays);

        return diagramParts.size;
    }


    public createJunctionsGrid(map: string[]) {
        var jncs = map.reduce((m, ln, z) => {
            ln.split("").forEach((s, x) => {
                if (s === "+") {
                    var jnc = { junctionId: null, location: { x, y: 0, z } };
                    jnc.junctionId = PowerRelay.Junction.getJunctionId(jnc);
                    m.push(jnc);
                }
            });
            return m;
        }, [] as PowerRelay.Junction[]);

        this.junctions = jncs;

        this.junctionCache = Junction.toMap(jncs);

        return {
            width: map[0].length,
            height: map.length,
        };
    }


    public getJunction(id: JunctionId): Junction {
        return this.junctionCache[<string>id];
    }


    public getRelay(id: RelayId): Relay {
        return this.relayCache[<string>id];
    }

}

export = PowerGrid;