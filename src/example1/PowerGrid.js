"use strict";
var PowerRelay = require("./PowerRelay");
var Junction = PowerRelay.Junction;
var Relay = PowerRelay.Relay;
var PowerGrid = (function () {
    function PowerGrid() {
    }
    PowerGrid.prototype.createPowerGrid = function (map) {
        var _this = this;
        var diagramParts = PowerRelay.diagramToJunctionRelays(0, map);
        this.junctionCache = Junction.toMap(diagramParts.junctions);
        this.junctions = Object.keys(this.junctionCache).map(function (k) { return _this.junctionCache[k]; });
        this.relayCache = Relay.toMap(diagramParts.relays);
        this.relays = Object.keys(this.relayCache).map(function (k) { return _this.relayCache[k]; });
        return diagramParts.size;
    };
    PowerGrid.prototype.getJunction = function (id) {
        return this.junctionCache[id];
    };
    PowerGrid.prototype.getRelay = function (id) {
        return this.relayCache[id];
    };
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
    };
    return PowerGrid;
}());
module.exports = PowerGrid;
