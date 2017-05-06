(function outer(m,c,e){
  function newReq(n,u){
    if(!c[n]){
      if(!m[n]){
        var curReq=typeof require=="function"&&require;
        if(!u&&curReq)return curReq(n,!0);
        if(prevReq)return prevReq(n,!0);
        var f=new Error("Cannot find module '"+n+"'");
        throw f.code="MODULE_NOT_FOUND",f
      }
      var l=c[n]={exports:{}};
      m[n][0].call(l.exports,function(x){var d=m[n][1][x];return newReq(d?d:x)},l,l.exports,outer,m,c,e)
    }
    return c[n].exports
  }
  var prevReq=typeof require=="function"&&require;
  for(var i=0;i<e.length;i++)newReq(e[i]);
  return newReq
})({2:[function(require,module,exports){
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

},{"./PowerRelay":5}],3:[function(require,module,exports){
"use strict";
var PowerGridWidgetHelper = require("./PowerGridWidgetHelper");
var PowerGridWidget;
(function (PowerGridWidget) {
    var dotColor = "#C44";
    function addSvgMap(doc, container, grid, gs) {
        var junctions = grid.junctions || [];
        var relays = grid.relays || [];
        for (var i = 0, size = junctions.length; i < size; i++) {
            var junctionElem = createJunctionUi(doc, junctions[i].location, grid, gs);
            container.appendChild(junctionElem);
        }
        for (var i = 0, size = relays.length; i < size; i++) {
            var relayElem = createRelayUi(doc, relays[i], grid, gs);
            container.appendChild(relayElem);
        }
    }
    PowerGridWidget.addSvgMap = addSvgMap;
    function createJunctionUi(doc, point, pg, gs) {
        var x = gs.xSize * (point.x + 0.5);
        var z = gs.zSize * (point.z + 0.5);
        var elem = doc.createElementNS("http://www.w3.org/2000/svg", "circle");
        elem.setAttributeNS(null, "r", 4 + '');
        elem.setAttributeNS(null, "stroke", "#555");
        elem.setAttributeNS(null, "stroke-width", 2 + '');
        elem.setAttributeNS(null, "fill", dotColor);
        elem.setAttributeNS(null, "cx", x + '');
        elem.setAttributeNS(null, "cy", z + '');
        return elem;
    }
    PowerGridWidget.createJunctionUi = createJunctionUi;
    function createRelayUi(doc, relay, pg, gs) {
        var pointsAttr = PowerGridWidgetHelper.relayToSvgPointsAttr(relay, pg, gs);
        var elem = doc.createElementNS("http://www.w3.org/2000/svg", "polyline");
        elem.setAttributeNS(null, "stroke", "#555");
        elem.setAttributeNS(null, "fill", "none");
        elem.setAttributeNS(null, "stroke-width", 2 + '');
        elem.setAttributeNS(null, "points", pointsAttr);
        return elem;
    }
    PowerGridWidget.createRelayUi = createRelayUi;
})(PowerGridWidget || (PowerGridWidget = {}));
// main - entry point
(function main() {
    var doc = window.document;
    PowerGridWidgetHelper.onReady(doc, function () {
        var gridUi = PowerGridWidgetHelper.newInst(doc, doc.getElementsByClassName("power-grid-widget")[0], { mapName: "defaultMap1" }, PowerGridWidget.addSvgMap);
    });
}());
module.exports = PowerGridWidget;

},{"./PowerGridWidgetHelper":4}],4:[function(require,module,exports){
"use strict";
var PowerGrid = require("./PowerGrid");
var PowerGridWidgetHelper;
(function (PowerGridWidgetHelper) {
    function newInst(doc, container, settings, buildSvgFunc) {
        var map = PowerGrid.maps[settings.mapName];
        var grid = new PowerGrid();
        var size = grid.createPowerGrid(map);
        //var size = grid.createJunctionsGrid(map);
        var gs = {
            xCount: size.width,
            zCount: size.height,
            xSize: 10,
            zSize: 10,
        };
        //addSvgMap(doc, container, grid.relays, grid.junctions, gs);
        var svgContainer = container.getElementsByClassName("map-display")[0];
        buildSvgFunc(doc, svgContainer, grid, gs);
    }
    PowerGridWidgetHelper.newInst = newInst;
    function relayToSvgPointsAttr(relay, pg, gs) {
        var pointToPx = function (p) { return (gs.xSize * (p.x + 0.5)) + ',' + (gs.zSize * (p.z + 0.5)); };
        var points = relay.path.map(pointToPx);
        var srcJnc = pg.getJunction(relay.srcJunctionId);
        points.unshift(pointToPx(srcJnc.location));
        var dstJnc = pg.getJunction(relay.dstJunctionId);
        points.push(pointToPx(dstJnc.location));
        return points.join(" ");
    }
    PowerGridWidgetHelper.relayToSvgPointsAttr = relayToSvgPointsAttr;
    function onReady(document, func) {
        if (typeof document === "function") {
            func = document;
            document = undefined;
        }
        var doc = document || window.document;
        function ready(func) {
            if (doc.readyState !== "loading") {
                func();
            }
            else {
                doc.addEventListener("DOMContentLoaded", func);
            }
        }
        ready(func);
    }
    PowerGridWidgetHelper.onReady = onReady;
})(PowerGridWidgetHelper || (PowerGridWidgetHelper = {}));
module.exports = PowerGridWidgetHelper;

},{"./PowerGrid":2}],5:[function(require,module,exports){
"use strict";
var assert = require("assert");
var ForEachUtil = require("../ForEachUtil");
var PowerRelay;
(function (PowerRelay) {
    var PowerRating;
    (function (PowerRating) {
        function getPowerRating() { return { maxPower: 271, safeOperatePower: 139, standbyPower: 43 }; }
        PowerRating.getPowerRating = getPowerRating;
    })(PowerRating = PowerRelay.PowerRating || (PowerRelay.PowerRating = {}));
    var Pwr;
    (function (Pwr) {
        function fromElectric(volts, amps) { return (volts * amps); }
        Pwr.fromElectric = fromElectric;
    })(Pwr = PowerRelay.Pwr || (PowerRelay.Pwr = {}));
    var JunctionId;
    (function (JunctionId) {
        function fromDb(id) { return id; }
        JunctionId.fromDb = fromDb;
    })(JunctionId = PowerRelay.JunctionId || (PowerRelay.JunctionId = {}));
    var RelayId;
    (function (RelayId) {
        function fromDb(id) { return id; }
        RelayId.fromDb = fromDb;
    })(RelayId = PowerRelay.RelayId || (PowerRelay.RelayId = {}));
    var Junction;
    (function (Junction) {
        function toMap(jns) {
            return jns.reduce(function (r, n) {
                var id = getJunctionId(n);
                r[id] = {
                    junctionId: JunctionId.fromDb(id),
                    location: n.location,
                };
                return r;
            }, {});
        }
        Junction.toMap = toMap;
        function getJunctionId(jnc) {
            return ("Junction{" + jnc.location.x + "," + jnc.location.y + "," + jnc.location.z + "}");
        }
        Junction.getJunctionId = getJunctionId;
    })(Junction = PowerRelay.Junction || (PowerRelay.Junction = {}));
    var Relay;
    (function (Relay) {
        function toMap(rls) {
            return rls.reduce(function (r, n) {
                var id = getRelayId(n);
                r[id] = {
                    relayId: RelayId.fromDb(id),
                    powerRating: n.powerRating,
                    path: n.path,
                    srcJunctionId: JunctionId.fromDb(n.srcJunctionId),
                    dstJunctionId: JunctionId.fromDb(n.dstJunctionId),
                };
                return r;
            }, {});
        }
        Relay.toMap = toMap;
        function getRelayId(rly) {
            return ("Relay{" + rly.srcJunctionId + "-to-" + rly.dstJunctionId + "}");
        }
        Relay.getRelayId = getRelayId;
    })(Relay = PowerRelay.Relay || (PowerRelay.Relay = {}));
    // map/board loading logic
    function shortestRelay(relays) {
        var min;
        var minDistance = Number.MAX_SAFE_INTEGER;
        var ds;
        for (var i = 0, size = relays.length; i < size; i++) {
            var rly = relays[i];
            if (!min || minDistance > (ds = rly.path.length)) {
                min = rly;
                minDistance = ds;
            }
        }
    }
    /**
     * @param lines assume each string is along the X-axis and the array of lines are along the Z-axis, 1x1 is the top-left corner
     */
    function diagramToJunctionRelays(y, lines) {
        assert(lines && lines.length > 0, "atleast 1 line required");
        var rlys = [];
        var jncs = [];
        var mapLines = lines.map(function (ln) { return ln.split(""); }); // [z][x]
        var zCount = mapLines.length;
        var xCount = mapLines[0].length;
        ForEachUtil.forEach2d(mapLines, function (ch, z, x, chs) {
            assert(chs.length === xCount, "all lines must be equal length");
            if (isJunction(ch, z, x, chs)) {
                jncs.push(newJunction(x, y, z, mapLines));
            }
        });
        var takenJncConns = [];
        jncs.forEach(function (jn) {
            var _a = jn.location, x = _a.x, z = _a.z;
            var jncRelays = walkConnections(x, z, xCount, zCount, mapLines, takenJncConns);
            Array.prototype.push.apply(rlys, jncRelays);
        });
        return {
            junctions: jncs,
            relays: rlys,
            size: { width: xCount, height: zCount }
        };
    }
    PowerRelay.diagramToJunctionRelays = diagramToJunctionRelays;
    function isJunction(ch, z, x, lines) {
        return ch === "+";
    }
    function newJunction(x, y, z, ary) {
        var jnc = {
            junctionId: null,
            location: { x: x, y: y, z: z }
        };
        jnc.junctionId = Junction.getJunctionId(jnc);
        return jnc;
    }
    /** given a junction, start looking down each path */
    function walkConnections(x, z, xCount, zCount, board, jncConnsUsed) {
        // TODO keep track of already used junction connections and don't re-walk them
        for (var i = 0, size = jncConnsUsed.length; i < size; i++) {
            var jnc = jncConnsUsed[i];
            if (jnc.x === x && jnc.z === z) {
                return;
            }
        }
        jncConnsUsed.push({ x: x, z: z });
        function toRelay(jncPath) {
            var relay = {
                relayId: null,
                powerRating: PowerRating.getPowerRating(),
                path: jncPath.points.map(function (p) { return ({ x: p.x, y: 0, z: p.z }); }),
                srcJunctionId: Junction.getJunctionId({ location: { x: x, y: 0, z: z } }),
                dstJunctionId: Junction.getJunctionId({ location: jncPath.junction }),
            };
            relay.relayId = Relay.getRelayId(relay);
            return relay;
        }
        var xOrig = x;
        var zOrig = z;
        var relays = [];
        function createRelayPath(x, z) {
            if (board[z][x] !== " ") {
                var path = walkToJunction(x, z, xCount, zCount, board, '+', xOrig, zOrig, true);
                relays.push(toRelay(path));
            }
        }
        ForEachUtil.forEachDirection(x, z, xCount, zCount, {
            top: createRelayPath,
            topRight: createRelayPath,
            right: createRelayPath,
            bottomRight: createRelayPath,
            bottom: createRelayPath,
            bottomLeft: createRelayPath,
            left: createRelayPath,
            topLeft: createRelayPath,
        });
        return relays;
    }
    /** given a starting point on a path, walk to the end
     * @return the path, including the ending junction, the points along the path, and the direction
     */
    function walkToJunction(x, z, xCount, zCount, board, endChar, xStartJunc, zStartJunc, ignorePointsBehind) {
        // initialize with the current point
        var dst = [{ x: x, z: z, }];
        var xPrev = xStartJunc;
        var zPrev = zStartJunc;
        do {
            var dstLen = dst.length;
            // TODO more than 1 next step may be added to 'dst'
            var res = nextStepPaths(x, z, xCount, zCount, board, endChar, xPrev, zPrev, true, dst);
            if (dstLen === (dstLen = dst.length)) {
                // dead-end, no next step found
                break;
            }
            xPrev = x;
            zPrev = z;
            x = dst[dstLen - 1].x;
            z = dst[dstLen - 1].z;
        } while (res == null && x > -1 && z > -1 && x < xCount && z < zCount);
        if (res == null) {
            throw new Error("no valid next step found moving from [x=" + xPrev + ",z=" + zPrev + "] through [x=" + x + ",z=" + z + "]");
        }
        // TODO res may be null
        return {
            connectionDirection: { x: xStartJunc - x, y: 0, z: zStartJunc - z },
            junction: { x: res.x, y: 0, z: res.z },
            points: dst,
        };
    }
    /** Check for valid next steps along the path and push the x,z pairs into 'dst'
     * @return whether endChar was found
     */
    function nextStepPaths(x, z, xCount, zCount, board, endChar, xPrev, zPrev, ignorePointsBehind, dst) {
        function checkAdjacent(expect, expect2, expect3, xx, zz, notExpect) {
            if (xx === xPrev && zz === zPrev) {
                return null;
            }
            var ch = board[zz][xx];
            if (ch === expect || ch === expect2 || ch === expect3) {
                dst.push({ x: xx, z: zz });
            }
            else if (notExpect === ch) { }
            else if (ch === endChar) {
                return { x: xx, z: zz };
            }
            return null;
        }
        var res = ForEachUtil.forEachDirection(x, z, xCount, zCount, {
            top: function (x, z) { return checkAdjacent('|', '/', '\\', x, z, '-'); },
            topRight: function (x, z) { return checkAdjacent('/', '|', '-', x, z, '\\'); },
            right: function (x, z) { return checkAdjacent('-', '/', '\\', x, z, '|'); },
            bottomRight: function (x, z) { return checkAdjacent('\\', '|', '-', x, z, '/'); },
            bottom: function (x, z) { return checkAdjacent('|', '/', '\\', x, z, '-'); },
            bottomLeft: function (x, z) { return checkAdjacent('/', '|', '-', x, z, '\\'); },
            left: function (x, z) { return checkAdjacent('-', '/', '\\', x, z, '|'); },
            topLeft: function (x, z) { return checkAdjacent('\\', '|', '-', x, z, '//'); },
        }, ignorePointsBehind, xPrev, zPrev);
        return res;
    }
    function invalidSymbolAt(x, z, ary, expected) {
        return new Error("invalid symbol '" + ary[z][x] + "' at x=" + x + ", z=" + z + (expected ? ", '" + expected : "'"));
    }
    PowerRelay.invalidSymbolAt = invalidSymbolAt;
})(PowerRelay || (PowerRelay = {}));
module.exports = PowerRelay;

},{"../ForEachUtil":1,"assert":6}]},{},[3])
//# sourceMappingURL=app-uglify.js.map
