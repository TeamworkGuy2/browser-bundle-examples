"use strict";
var PowerRelay = require("./PowerRelay");
var Junction = PowerRelay.Junction;
var Relay = PowerRelay.Relay;
var PowerGrid = (function () {
    function PowerGrid() {
    }
    PowerGrid.prototype.createPowerGrid = function (map) {
        var diagramParts = PowerRelay.diagramToJunctionRelays(0, map);
        this.junctions = diagramParts.junctions;
        this.relays = diagramParts.relays;
        this.junctionCache = Junction.toMap(diagramParts.junctions);
        this.relayCache = Relay.toMap(diagramParts.relays);
        return diagramParts.size;
    };
    PowerGrid.prototype.createJunctionsGrid = function (map) {
        var jncs = map.reduce(function (m, ln, z) {
            ln.split("").forEach(function (s, x) {
                if (s === "+") {
                    var jnc = { junctionId: null, location: { x: x, y: 0, z: z } };
                    jnc.junctionId = PowerRelay.Junction.getJunctionId(jnc);
                    m.push(jnc);
                }
            });
            return m;
        }, []);
        this.junctions = jncs;
        this.junctionCache = Junction.toMap(jncs);
        return {
            width: map[0].length,
            height: map.length,
        };
    };
    PowerGrid.prototype.getJunction = function (id) {
        return this.junctionCache[id];
    };
    PowerGrid.prototype.getRelay = function (id) {
        return this.relayCache[id];
    };
    return PowerGrid;
}());
PowerGrid.maps = {
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
module.exports = PowerGrid;
