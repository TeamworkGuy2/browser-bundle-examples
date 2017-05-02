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
