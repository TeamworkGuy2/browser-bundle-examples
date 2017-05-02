import assert = require("assert");
import ForEachUtil = require("../ForEachUtil");

module PowerRelay {


    export interface Point3 {
        x: number;
        y: number;
        z: number;
    }


    export interface PointXZ {
        x: number;
        z: number;
    }


    export interface JunctionPath {
        points: PointXZ[];
        junction?: Point3;
        connectionDirection?: Point3
    }


    export interface PowerRating {
        maxPower: Pwr;
        safeOperatePower: Pwr;
        standbyPower: Pwr;
    }
    export module PowerRating {
        export function getPowerRating(): PowerRating { return { maxPower: 271, safeOperatePower: 139, standbyPower: 43 }; }
    }


    export interface Pwr extends Number {
    }
    export module Pwr {
        export function fromElectric(volts: number, amps: number): Pwr { return <Pwr><Number>(volts * amps); }
    }


    // IDs
    export interface JunctionId extends String {
    }
    export module JunctionId {
        export function fromDb(id: string): JunctionId { return <JunctionId>id; }
    }




    export interface RelayId extends String {
    }
    export module RelayId {
        export function fromDb(id: string): RelayId { return <RelayId>id; }
    }




    // Data models
    export interface Junction {
        junctionId: JunctionId;
        location: Point3;
    }
    interface JunctionRaw {
        location: Point3;
    }
    export module Junction {

        export function toMap(jns: JunctionRaw[]): { [junctionId: string]: Junction } {
            return jns.reduce((r, n) => {
                var id = getJunctionId(n);
                r[<string>id] = {
                    junctionId: JunctionId.fromDb(<string>id),
                    location: n.location,
                };
                return r;
            }, <{ [junctionId: string]: Junction }>{});
        }


        export function getJunctionId(jnc: JunctionRaw): JunctionId {
            return <JunctionId>("Junction{" + jnc.location.x + "," + jnc.location.y + "," + jnc.location.z + "}");
        }

    }




    export interface Relay {
        relayId: RelayId;
        powerRating: PowerRating;
        path: Point3[];
        srcJunctionId: JunctionId;
        dstJunctionId: JunctionId;
    }
    interface RelayRaw {
        powerRating: PowerRating;
        path: Point3[];
        srcJunctionId: JunctionId | string;
        dstJunctionId: JunctionId | string;
    }
    export module Relay {

        export function toMap(rls: RelayRaw[]): { [relayId: string]: Relay } {
            return rls.reduce((r, n) => {
                var id = getRelayId(n);
                r[<string>id] = {
                    relayId: RelayId.fromDb(<string>id),
                    powerRating: n.powerRating,
                    path: n.path,
                    srcJunctionId: JunctionId.fromDb(<string>n.srcJunctionId),
                    dstJunctionId: JunctionId.fromDb(<string>n.dstJunctionId),
                };
                return r;
            }, <{ [relayId: string]: Relay }>{});
        }


        export function getRelayId(rly: RelayRaw): RelayId {
            return <RelayId>("Relay{" + rly.srcJunctionId + "-to-" + rly.dstJunctionId + "}");
        }

    }



    // map/board loading logic
    function shortestRelay(relays: Relay[]) {
        var min: Relay;
        var minDistance = Number.MAX_SAFE_INTEGER;
        var ds: number;
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
    export function diagramToJunctionRelays(y: number, lines: string[]) {
        assert(lines && lines.length > 0, "atleast 1 line required");

        var rlys: Relay[] = [];
        var jncs: Junction[] = [];

        var mapLines = lines.map((ln) => ln.split("")); // [z][x]
        var zCount = mapLines.length;
        var xCount = mapLines[0].length;

        ForEachUtil.forEach2d(mapLines, (ch, z, x, chs) => {
            assert(chs.length === xCount, "all lines must be equal length");

            if (isJunction(ch, z, x, chs)) {
                jncs.push(newJunction(x, y, z, mapLines));
            }
        });

        var takenJncConns: PointXZ[] = [];

        jncs.forEach((jn) => {
            var { x, z } = jn.location;

            var jncRelays = walkConnections(x, z, xCount, zCount, mapLines, takenJncConns);
            Array.prototype.push.apply(rlys, jncRelays);
        });

        return {
            junctions: jncs,
            relays: rlys,
            size: { width: xCount, height: zCount }
        };
    }


    function isJunction(ch: string, z: number, x: number, lines: string[]) {
        return ch === "+";
    }


    function newJunction(x: number, y: number, z: number, ary: string[][]) {
        var jnc: Junction = {
            junctionId: null,
            location: { x, y, z }
        };
        jnc.junctionId = Junction.getJunctionId(jnc);
        return jnc;
    }


    /** given a junction, start looking down each path */
    function walkConnections(x: number, z: number, xCount: number, zCount: number, board: string[][], jncConnsUsed: PointXZ[]): Relay[] {
        // TODO keep track of already used junction connections and don't re-walk them
        for (var i = 0, size = jncConnsUsed.length; i < size; i++) {
            var jnc = jncConnsUsed[i];
            if (jnc.x === x && jnc.z === z) {
                return;
            }
        }
        jncConnsUsed.push({ x, z });

        function toRelay(jncPath: JunctionPath): Relay {
            var relay = {
                relayId: null,
                powerRating: PowerRating.getPowerRating(),
                path: jncPath.points.map((p) => ({ x: p.x, y: 0, z: p.z })),
                srcJunctionId: Junction.getJunctionId({ location: { x, y: 0, z } }),
                dstJunctionId: Junction.getJunctionId({ location: jncPath.junction }),
            };
            relay.relayId = Relay.getRelayId(relay);
            return relay;
        }

        var xOrig = x;
        var zOrig = z;
        var relays: Relay[] = [];

        function createRelayPath(x: number, z: number) {
            if (board[z][x] !== " ") {
                var path = walkToJunction(x, z, xCount, zCount, board, '+', xOrig, zOrig, true);
                relays.push(toRelay(path));
            }
        }

        ForEachUtil.forEachDirection<void>(x, z, xCount, zCount, {
            top:         createRelayPath,
            topRight:    createRelayPath,
            right:       createRelayPath,
            bottomRight: createRelayPath,
            bottom:      createRelayPath,
            bottomLeft:  createRelayPath,
            left:        createRelayPath,
            topLeft:     createRelayPath,
        });

        return relays;
    }


    /** given a starting point on a path, walk to the end
     * @return the path, including the ending junction, the points along the path, and the direction
     */
    function walkToJunction(x: number, z: number, xCount: number, zCount: number, board: string[][], endChar: string, xStartJunc: number, zStartJunc: number, ignorePointsBehind: boolean): JunctionPath {
        // initialize with the current point
        var dst: PointXZ[] = [{ x, z, }];
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
    function nextStepPaths(x: number, z: number, xCount: number, zCount: number, board: string[][], endChar: string, xPrev: number, zPrev: number, ignorePointsBehind: boolean, dst: PointXZ[]): PointXZ {

        function checkAdjacent(expect: string, expect2: string, expect3: string, xx: number, zz: number, notExpect: string) {
            if (xx === xPrev && zz === zPrev) { return null; }
            var ch = board[zz][xx];
            if (ch === expect || ch === expect2 || ch === expect3) { dst.push({ x: xx, z: zz }); }
            else if (notExpect === ch) { /*throw invalidSymbolAt(xx, zz, board, expect);*/ /*sometimes this is valid, such as the end of a path leading into a junction which has other paths branching off in other directions*/ }
            else if (ch === endChar) { return { x: xx, z: zz }; }
            return null;
        }

        var res = ForEachUtil.forEachDirection(x, z, xCount, zCount, {
            top:         (x, z) => checkAdjacent('|', '/', '\\',  x, z, '-'),
            topRight:    (x, z) => checkAdjacent('/', '|', '-',  x, z, '\\'),
            right:       (x, z) => checkAdjacent('-', '/', '\\',  x, z, '|'),
            bottomRight: (x, z) => checkAdjacent('\\', '|', '-', x, z, '/'),
            bottom:      (x, z) => checkAdjacent('|', '/', '\\',  x, z, '-'),
            bottomLeft:  (x, z) => checkAdjacent('/', '|', '-',  x, z, '\\'),
            left:        (x, z) => checkAdjacent('-', '/', '\\',  x, z, '|'),
            topLeft:     (x, z) => checkAdjacent('\\', '|', '-', x, z, '//'),
        }, ignorePointsBehind, xPrev, zPrev);

        return res;
    }


    export function invalidSymbolAt(x: number, z: number, ary: string[][], expected?: string) {
        return new Error("invalid symbol '" + ary[z][x] + "' at x=" + x + ", z=" + z + (expected ? ", '" + expected : "'"));
    }

}

export = PowerRelay;