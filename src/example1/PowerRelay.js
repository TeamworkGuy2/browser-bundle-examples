"use strict";
var assert = require("assert");
var PowerRelay;
(function (PowerRelay) {
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
                r[id] = { junctionId: JunctionId.fromDb(id), location: n.location, };
                return r;
            }, {});
        }
        Junction.toMap = toMap;
        function getJunctionId(jnc) {
            return "Junction{" + jnc.location.x + "," + jnc.location.y + "," + jnc.location.z + "}";
        }
        Junction.getJunctionId = getJunctionId;
    })(Junction = PowerRelay.Junction || (PowerRelay.Junction = {}));
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
    var Relay;
    (function (Relay) {
        function toMap(rls) {
            return rls.reduce(function (r, n) {
                var id = getRelayId(n);
                r[id] = { relayId: RelayId.fromDb(id), powerRating: n.powerRating, path: n.path, srcJunctionId: JunctionId.fromDb(n.srcJunctionId), dstJunctionId: JunctionId.fromDb(n.dstJunctionId), };
                return r;
            }, {});
        }
        Relay.toMap = toMap;
        function getRelayId(rly) {
            return "Relay{" + rly.srcJunctionId + "-to-" + rly.dstJunctionId + "}";
        }
        Relay.getRelayId = getRelayId;
    })(Relay = PowerRelay.Relay || (PowerRelay.Relay = {}));
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
        forEach2d(mapLines, function (ch, z, x, chs) {
            assert(chs.length === xCount, "all lines must be equal length");
            if (isJunction(ch, z, x, chs)) {
                jncs.push(newJunction(x, y, z, mapLines));
            }
        });
        var takenJncConns = []; // [z, x]
        jncs.forEach(function (jn) {
            var _a = jn.location, x = _a.x, z = _a.z;
            walkConnections(x, z, xCount, zCount, mapLines, takenJncConns);
        });
        return { junctions: jncs, relays: rlys, size: { width: xCount, height: zCount } };
    }
    PowerRelay.diagramToJunctionRelays = diagramToJunctionRelays;
    function isJunction(ch, z, x, lines) {
        return ch === "+";
    }
    function newJunction(x, y, z, ary) {
        return {
            location: { x: x, y: y, z: z }
        };
    }
    // given a junction, start looking down each path
    function walkConnections(x, z, xCount, zCount, ary, jncConnsUsed) {
        // TODO keep track of already used junction connections and don't re-walk them
        for (var i = 0, size = jncConnsUsed.length; i < size; i++) {
            var jnc = jncConnsUsed[i];
            if (jnc[0] === z && jnc[1] === x) {
                return;
            }
        }
        jncConnsUsed.push([z, x]);
        function toRelayRaw(jncPath) {
            return {
                powerRating: PowerRating.getPowerRating(),
                path: jncPath.points.map(function (p) { return { x: p.x, y: 0, z: p.z }; }),
                srcJunctionId: Junction.getJunctionId({ location: { x: x, y: 0, z: z } }),
                dstJunctionId: Junction.getJunctionId({ location: jncPath.junction }),
            };
        }
        var xOrig = x;
        var zOrig = z;
        var res = [];
        function createJunction(x, z) {
            res.push(toRelayRaw(walkToJunction(x, z, xCount, zCount, ary, '+', xOrig, zOrig)));
        }
        forEachValidDirection(x, z, xCount, zCount, {
            top: createJunction,
            topRight: createJunction,
            right: createJunction,
            bottomRight: createJunction,
            bottom: createJunction,
            bottomLeft: createJunction,
            left: createJunction,
            topLeft: createJunction,
        });
        return res;
    }
    /** given a starting point on a path, walk to the end
     * @return the exclusive end [x, z] coordinate
     */
    function walkToJunction(x, z, xCount, zCount, ary, endChar, xSrcJunc, zSrcJunc) {
        var xPrev = xSrcJunc;
        var zPrev = zSrcJunc;
        var dst = [];
        do {
            var dstLen = dst.length;
            var res = pipeFrom(x, z, xCount, zCount, ary, endChar, xPrev, zPrev, dst);
            if (dstLen === (dstLen = dst.length)) {
                // dead-end, no new pipe found
                break;
            }
            xPrev = x;
            zPrev = z;
            x = dst[dstLen - 1].x;
            z = dst[dstLen - 1].z;
        } while (res == null && x > -1 && z > -1 && x < xCount && z < zCount);
        // TODO res may be null
        return {
            connectionDirection: { x: xSrcJunc - x, y: 0, z: zSrcJunc - z },
            junction: { x: res.x, y: 0, z: res.z },
            points: dst,
        };
    }
    /** fill 'dst' array with x,z pairs
     * @return whether a endChar was found
     */
    function pipeFrom(x, z, xCount, zCount, ary, endChar, xPrev, zPrev, dst) {
        var notExp = {
            '-': ['|', '/', '\\'],
            '|': ['-', '/', '\\'],
            '/': ['-', '|', '\\'],
            '\\': ['-', '|', '/'],
        };
        function checkAdjacent(expect, xx, zz, ary, notExpect) {
            if (xx === xPrev && zz === zPrev) {
                return null;
            }
            var ch = ary[zz][xx];
            if (ch === expect) {
                dst.push({ x: xx, z: zz });
            }
            else if (notExpect.indexOf(ch) > -1) {
                throw invalidSymbolAt(xx, zz, ary, expect);
            }
            else if (ch === endChar) {
                return { x: xx, z: zz };
            }
            return null;
        }
        var res = forEachValidDirection(x, z, xCount, zCount, {
            top: function (x, z) { return checkAdjacent('|', x, z, ary, notExp['|']); },
            topRight: function (x, z) { return checkAdjacent('/', x, z, ary, notExp['/']); },
            right: function (x, z) { return checkAdjacent('-', x, z, ary, notExp['-']); },
            bottomRight: function (x, z) { return checkAdjacent('\\', x, z, ary, notExp['\\']); },
            bottom: function (x, z) { return checkAdjacent('|', x, z, ary, notExp['|']); },
            bottomLeft: function (x, z) { return checkAdjacent('/', x, z, ary, notExp['/']); },
            left: function (x, z) { return checkAdjacent('-', x, z, ary, notExp['-']); },
            topLeft: function (x, z) { return checkAdjacent('\\', x, z, ary, notExp['\\']); },
        });
        return res;
    }
    /** Given a point on a grid of given size and handlers for 8 directions (horizontal, vertical, diagonal),
     * call the directional handlers for adjacent cells which are still within grid bounds.
     * @param x the 0-based X position of the point being checked
     * @param z the 0-based Z position of the point being checked
     * @param xCount the exclusive width (X) size of the grid
     * @param zCount the exclusive depth (Z) size of the grid
     * @param dirHandlers the map associating directions with handler functions (all properties must not be null)
     * @return the first handler return value other than undefined (handlers are called based on the above described criteria)
     */
    function forEachValidDirection(x, z, xCount, zCount, dirHandlers) {
        if (x > 0) {
            if (z > 0) {
                // = = .
                // = + .
                // . . .
                var res = dirHandlers.left(x - 1, z);
                if (res !== undefined) {
                    return res;
                }
                var res = dirHandlers.topLeft(x - 1, z - 1);
                if (res !== undefined) {
                    return res;
                }
                var res = dirHandlers.top(x, z - 1);
                if (res !== undefined) {
                    return res;
                }
            }
            if (z < zCount - 1) {
                // . = =
                // . + =
                // . . .
                var res = dirHandlers.top(x, z - 1);
                if (res !== undefined) {
                    return res;
                }
                var res = dirHandlers.topRight(x + 1, z - 1);
                if (res !== undefined) {
                    return res;
                }
                var res = dirHandlers.right(x + 1, z);
                if (res !== undefined) {
                    return res;
                }
            }
        }
        if (x < xCount - 1) {
            if (z > 0) {
                // . . .
                // = + .
                // = = .
                var res = dirHandlers.bottom(x, z + 1);
                if (res !== undefined) {
                    return res;
                }
                var res = dirHandlers.bottomLeft(x - 1, z + 1);
                if (res !== undefined) {
                    return res;
                }
                var res = dirHandlers.left(x - 1, z);
                if (res !== undefined) {
                    return res;
                }
            }
            if (z < zCount - 1) {
                // . . .
                // . + =
                // . = =
                var res = dirHandlers.bottom(x, z + 1);
                if (res !== undefined) {
                    return res;
                }
                var res = dirHandlers.bottomRight(x + 1, z + 1);
                if (res !== undefined) {
                    return res;
                }
                var res = dirHandlers.right(x + 1, z);
                if (res !== undefined) {
                    return res;
                }
            }
        }
        return undefined;
    }
    PowerRelay.forEachValidDirection = forEachValidDirection;
    function forEach2d(tArys, func) {
        for (var i1 = 0, size1 = tArys.length; i1 < size1; i1++) {
            var ts = tArys[i1];
            for (var i2 = 0, size2 = ts.length; i2 < size2; i2++) {
                func(ts[i2], i1, i2, ts, tArys);
            }
        }
    }
    PowerRelay.forEach2d = forEach2d;
    function invalidSymbolAt(x, z, ary, expected) {
        return new Error("invalid symbol [" + ary[z][x] + " at x=" + x + ", z=" + z + (expected ? ", " + expected : ""));
    }
    PowerRelay.invalidSymbolAt = invalidSymbolAt;
})(PowerRelay || (PowerRelay = {}));
module.exports = PowerRelay;
