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
      m[n][0].call(l.exports,function(x){        var d=m[n][1][x];        return newReq(d?d:x)      },l,l.exports,outer,m,c,e)
    }
    return c[n].exports
  }
  var prevReq=typeof require=="function"&&require;
  for(var i=0;i<e.length;i++)newReq(e[i]);
  return newReq
})({1:[function(require,module,exports){
"use strict";
/** Utilities for 2-dimensional array iteration */

var ForEachUtil;
(function (ForEachUtil) {
    var dirDown = 1;
    var dirDownLeft = 2;
    var dirLeft = 4;
    var dirUpLeft = 8;
    var dirUp = 16;
    var dirUpRight = 32;
    var dirRight = 64;
    var dirDownRight = 128;
    /** Given a point on a grid of given size and handlers for 8 directions (horizontal, vertical, diagonal),
     * call the directional handlers for adjacent cells which are still within grid bounds.
     * @param x the 0-based X position of the point being checked
     * @param z the 0-based Z position of the point being checked
     * @param xCount the exclusive width (X) size of the grid
     * @param zCount the exclusive depth (Z) size of the grid
     * @param dirHandlers the map associating directions with handler functions (all properties must not be null)
     * @param ignoreBehindPoints ignore the 3 points in the direction away from a line draw from 'xPrev,zPrev' to 'x,z'
     * @return the first handler return value other than undefined (handlers are called based on the above described criteria)
     */
    function forEachDirection(x, z, xCount, zCount, dirHandlers, ignoreBehindPoints, xPrev, zPrev) {
        if (x === xPrev && z === zPrev) {
            throw new Error("cannot determine direction since x,z and xPrev,zPrev are the same");
        }
        var dir = z === zPrev ? x < xPrev ? dirLeft : dirRight /*left or right*/ : z > zPrev ? x > xPrev ? dirDownRight : x === xPrev ? dirDown : dirDownLeft : /*down-ish*/x > xPrev ? dirUpRight : x === xPrev ? dirUp : dirUpLeft /*up-ish*/;
        var ignore = ignoreBehindPoints;
        var ignoreTop = ignore ? dir === dirDownRight || dir === dirDown || dir === dirDownLeft : false;
        var ignoreTopRight = ignore ? dir === dirDown || dir === dirDownLeft || dir === dirLeft : false;
        var ignoreRight = ignore ? dir === dirDownLeft || dir === dirLeft || dir === dirUpLeft : false;
        var ignoreBottomRight = ignore ? dir === dirLeft || dir === dirUpLeft || dir === dirUp : false;
        var ignoreBottom = ignore ? dir === dirUpLeft || dir === dirUp || dir === dirUpRight : false;
        var ignoreBottomLeft = ignore ? dir === dirUp || dir === dirUpRight || dir === dirRight : false;
        var ignoreLeft = ignore ? dir === dirUpRight || dir === dirRight || dir === dirDownRight : false;
        var ignoreTopLeft = ignore ? dir === dirRight || dir === dirDownRight || dir === dirDown : false;
        var topLeftRan = false;
        var topRightRan = false;
        var bottomLeftRan = false;
        var bottomRightRan = false;
        if (x > 0) {
            if (z > 0) {
                // = = .
                // = + .
                // . . .
                if (!ignoreLeft) {
                    var res = dirHandlers.left(x - 1, z);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreTopLeft) {
                    var res = dirHandlers.topLeft(x - 1, z - 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreTop) {
                    var res = dirHandlers.top(x, z - 1);
                    if (res != null) {
                        return res;
                    }
                }
                topLeftRan = true;
            }
            if (z < zCount - 1) {
                // . = =
                // . + =
                // . . .
                if (!ignoreTop && !topLeftRan) {
                    var res = dirHandlers.top(x, z - 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreTopRight) {
                    var res = dirHandlers.topRight(x + 1, z - 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreRight) {
                    var res = dirHandlers.right(x + 1, z);
                    if (res != null) {
                        return res;
                    }
                }
                topRightRan = true;
            }
        }
        if (x < xCount - 1) {
            if (z > 0) {
                // . . .
                // = + .
                // = = .
                if (!ignoreBottom) {
                    var res = dirHandlers.bottom(x, z + 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreBottomLeft) {
                    var res = dirHandlers.bottomLeft(x - 1, z + 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreLeft && !topLeftRan) {
                    var res = dirHandlers.left(x - 1, z);
                    if (res != null) {
                        return res;
                    }
                }
                bottomLeftRan = true;
            }
            if (z < zCount - 1) {
                // . . .
                // . + =
                // . = =
                if (!ignoreBottom && !bottomLeftRan) {
                    var res = dirHandlers.bottom(x, z + 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreBottomRight) {
                    var res = dirHandlers.bottomRight(x + 1, z + 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreRight && !topRightRan) {
                    var res = dirHandlers.right(x + 1, z);
                    if (res != null) {
                        return res;
                    }
                }
                bottomRightRan = true;
            }
        }
        return undefined;
    }
    ForEachUtil.forEachDirection = forEachDirection;
    /** Given a point on a grid of given size and handlers for 8 directions (horizontal, vertical, diagonal),
     * call the directional handlers for adjacent cells which are still within grid bounds.
     * @param x the 0-based X position of the point being checked
     * @param z the 0-based Z position of the point being checked
     * @param xCount the exclusive width (X) size of the grid
     * @param zCount the exclusive depth (Z) size of the grid
     * @param dirHandlers the map associating directions with handler functions (all properties must not be null)
     * @param ignoreBehindPoints ignore the 3 points in the direction away from a line draw from 'xPrev,zPrev' to 'x,z'
     * @return the first handler return value other than undefined (handlers are called based on the above described criteria)
     */
    function forEachDirectionConsume(x, z, xCount, zCount, dirHandler, ignoreBehindPoints, xPrev, zPrev) {
        if (x === xPrev && z === zPrev) {
            throw new Error("cannot determine direction since x,z and xPrev,zPrev are the same");
        }
        var dir = z === zPrev ? x < xPrev ? dirLeft : dirRight /*left or right*/ : z > zPrev ? x > xPrev ? dirDownRight : x === xPrev ? dirDown : dirDownLeft : /*down-ish*/x > xPrev ? dirUpRight : x === xPrev ? dirUp : dirUpLeft /*up-ish*/;
        var ignore = ignoreBehindPoints;
        var ignoreTop = ignore ? dir === dirDownRight || dir === dirDown || dir === dirDownLeft : false;
        var ignoreTopRight = ignore ? dir === dirDown || dir === dirDownLeft || dir === dirLeft : false;
        var ignoreRight = ignore ? dir === dirDownLeft || dir === dirLeft || dir === dirUpLeft : false;
        var ignoreBottomRight = ignore ? dir === dirLeft || dir === dirUpLeft || dir === dirUp : false;
        var ignoreBottom = ignore ? dir === dirUpLeft || dir === dirUp || dir === dirUpRight : false;
        var ignoreBottomLeft = ignore ? dir === dirUp || dir === dirUpRight || dir === dirRight : false;
        var ignoreLeft = ignore ? dir === dirUpRight || dir === dirRight || dir === dirDownRight : false;
        var ignoreTopLeft = ignore ? dir === dirRight || dir === dirDownRight || dir === dirDown : false;
        var topLeftRan = false;
        var topRightRan = false;
        var bottomLeftRan = false;
        var bottomRightRan = false;
        if (x > 0) {
            if (z > 0) {
                // = = .
                // = + .
                // . . .
                if (!ignoreLeft) {
                    var res = dirHandler(x - 1, z);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreTopLeft) {
                    var res = dirHandler(x - 1, z - 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreTop) {
                    var res = dirHandler(x, z - 1);
                    if (res != null) {
                        return res;
                    }
                }
                topLeftRan = true;
            }
            if (z < zCount - 1) {
                // . = =
                // . + =
                // . . .
                if (!ignoreTop && !topLeftRan) {
                    var res = dirHandler(x, z - 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreTopRight) {
                    var res = dirHandler(x + 1, z - 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreRight) {
                    var res = dirHandler(x + 1, z);
                    if (res != null) {
                        return res;
                    }
                }
                topRightRan = true;
            }
        }
        if (x < xCount - 1) {
            if (z > 0) {
                // . . .
                // = + .
                // = = .
                if (!ignoreBottom) {
                    var res = dirHandler(x, z + 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreBottomLeft) {
                    var res = dirHandler(x - 1, z + 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreLeft && !topLeftRan) {
                    var res = dirHandler(x - 1, z);
                    if (res != null) {
                        return res;
                    }
                }
                bottomLeftRan = true;
            }
            if (z < zCount - 1) {
                // . . .
                // . + =
                // . = =
                if (!ignoreBottom && !bottomLeftRan) {
                    var res = dirHandler(x, z + 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreBottomRight) {
                    var res = dirHandler(x + 1, z + 1);
                    if (res != null) {
                        return res;
                    }
                }
                if (!ignoreRight && !topRightRan) {
                    var res = dirHandler(x + 1, z);
                    if (res != null) {
                        return res;
                    }
                }
                bottomRightRan = true;
            }
        }
        return undefined;
    }
    ForEachUtil.forEachDirectionConsume = forEachDirectionConsume;
    function forEach2d(tArys, func) {
        for (var i1 = 0, size1 = tArys.length; i1 < size1; i1++) {
            var ts = tArys[i1];
            for (var i2 = 0, size2 = ts.length; i2 < size2; i2++) {
                func(ts[i2], i1, i2, ts, tArys);
            }
        }
    }
    ForEachUtil.forEach2d = forEach2d;
})(ForEachUtil || (ForEachUtil = {}));
module.exports = ForEachUtil;

},{}],2:[function(require,module,exports){
"use strict";

var PowerRelay = require("./PowerRelay");
var Junction = PowerRelay.Junction;
var Relay = PowerRelay.Relay;
var PowerGrid = function () {
    function PowerGrid() {}
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
            height: map.length
        };
    };
    PowerGrid.prototype.getJunction = function (id) {
        return this.junctionCache[id];
    };
    PowerGrid.prototype.getRelay = function (id) {
        return this.relayCache[id];
    };
    return PowerGrid;
}();
PowerGrid.maps = {
    defaultMap1: ["                                                                                ", "                                                                                ", "        +                                        +                         +    ", "       /                                         |                        /     ", "      /                 +--------+---------------+                       +      ", "     |                 /         |               |                       |      ", "     +                +          |               +-----------+-----------+      ", "     |                           |                                       |      ", "     +---------------------------+                                       |      ", "                                             +--\\                        |      ", "                                                 +-----------------------+      ", "                       +-------------------------+                              ", "                      /                          |                              ", "                     +                           +                              ", "                                                                                ", "                                                                                "],
    hds: ["                                                                                ", "                                                                                ", "    +       +      +  +  +           + + + + +                                  ", "                                                                                ", "    +       +      +       +       +                                            ", "                                                                                ", "    +       +      +         +     +                                            ", "                                                                                ", "    + + + + +      +         +       + + + +                                    ", "                                                                                ", "    +       +      +         +               +                                  ", "                                                                                ", "    +       +      +       +                 +                                  ", "                                                                                ", "    +       +      +  +  +         + + + + +                                    ", "                                                                                "]
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
})();
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
            zSize: 10
        };
        //addSvgMap(doc, container, grid.relays, grid.junctions, gs);
        var svgContainer = container.getElementsByClassName("map-display")[0];
        buildSvgFunc(doc, svgContainer, grid, gs);
    }
    PowerGridWidgetHelper.newInst = newInst;
    function relayToSvgPointsAttr(relay, pg, gs) {
        var pointToPx = function pointToPx(p) {
            return gs.xSize * (p.x + 0.5) + ',' + gs.zSize * (p.z + 0.5);
        };
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
            } else {
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
        function getPowerRating() {
            return { maxPower: 271, safeOperatePower: 139, standbyPower: 43 };
        }
        PowerRating.getPowerRating = getPowerRating;
    })(PowerRating = PowerRelay.PowerRating || (PowerRelay.PowerRating = {}));
    var Pwr;
    (function (Pwr) {
        function fromElectric(volts, amps) {
            return volts * amps;
        }
        Pwr.fromElectric = fromElectric;
    })(Pwr = PowerRelay.Pwr || (PowerRelay.Pwr = {}));
    var JunctionId;
    (function (JunctionId) {
        function fromDb(id) {
            return id;
        }
        JunctionId.fromDb = fromDb;
    })(JunctionId = PowerRelay.JunctionId || (PowerRelay.JunctionId = {}));
    var RelayId;
    (function (RelayId) {
        function fromDb(id) {
            return id;
        }
        RelayId.fromDb = fromDb;
    })(RelayId = PowerRelay.RelayId || (PowerRelay.RelayId = {}));
    var Junction;
    (function (Junction) {
        function toMap(jns) {
            return jns.reduce(function (r, n) {
                var id = getJunctionId(n);
                r[id] = {
                    junctionId: JunctionId.fromDb(id),
                    location: n.location
                };
                return r;
            }, {});
        }
        Junction.toMap = toMap;
        function getJunctionId(jnc) {
            return "Junction{" + jnc.location.x + "," + jnc.location.y + "," + jnc.location.z + "}";
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
                    dstJunctionId: JunctionId.fromDb(n.dstJunctionId)
                };
                return r;
            }, {});
        }
        Relay.toMap = toMap;
        function getRelayId(rly) {
            return "Relay{" + rly.srcJunctionId + "-to-" + rly.dstJunctionId + "}";
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
        var mapLines = lines.map(function (ln) {
            return ln.split("");
        }); // [z][x]
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
            var _a = jn.location,
                x = _a.x,
                z = _a.z;
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
                path: jncPath.points.map(function (p) {
                    return { x: p.x, y: 0, z: p.z };
                }),
                srcJunctionId: Junction.getJunctionId({ location: { x: x, y: 0, z: z } }),
                dstJunctionId: Junction.getJunctionId({ location: jncPath.junction })
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
            topLeft: createRelayPath
        });
        return relays;
    }
    /** given a starting point on a path, walk to the end
     * @return the path, including the ending junction, the points along the path, and the direction
     */
    function walkToJunction(x, z, xCount, zCount, board, endChar, xStartJunc, zStartJunc, ignorePointsBehind) {
        // initialize with the current point
        var dst = [{ x: x, z: z }];
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
            points: dst
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
            } else if (notExpect === ch) {} else if (ch === endChar) {
                return { x: xx, z: zz };
            }
            return null;
        }
        var res = ForEachUtil.forEachDirection(x, z, xCount, zCount, {
            top: function top(x, z) {
                return checkAdjacent('|', '/', '\\', x, z, '-');
            },
            topRight: function topRight(x, z) {
                return checkAdjacent('/', '|', '-', x, z, '\\');
            },
            right: function right(x, z) {
                return checkAdjacent('-', '/', '\\', x, z, '|');
            },
            bottomRight: function bottomRight(x, z) {
                return checkAdjacent('\\', '|', '-', x, z, '/');
            },
            bottom: function bottom(x, z) {
                return checkAdjacent('|', '/', '\\', x, z, '-');
            },
            bottomLeft: function bottomLeft(x, z) {
                return checkAdjacent('/', '|', '-', x, z, '\\');
            },
            left: function left(x, z) {
                return checkAdjacent('-', '/', '\\', x, z, '|');
            },
            topLeft: function topLeft(x, z) {
                return checkAdjacent('\\', '|', '-', x, z, '//');
            }
        }, ignorePointsBehind, xPrev, zPrev);
        return res;
    }
    function invalidSymbolAt(x, z, ary, expected) {
        return new Error("invalid symbol '" + ary[z][x] + "' at x=" + x + ", z=" + z + (expected ? ", '" + expected : "'"));
    }
    PowerRelay.invalidSymbolAt = invalidSymbolAt;
})(PowerRelay || (PowerRelay = {}));
module.exports = PowerRelay;

},{"../ForEachUtil":1,"assert":6}],6:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"util/":10}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],9:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],10:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":9,"_process":7,"inherits":8}]},{},[3])
//# sourceMappingURL=app-babel-babelify.js.map
