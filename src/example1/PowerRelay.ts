import assert = require("assert");

module PowerRelay {

    // IDs
    export type JunctionId = string;
    export module JunctionId {
        export function fromDb(id: string): JunctionId { return <JunctionId>id; }
    }


    export type RelayId = string;
    export module RelayId {
        export function fromDb(id: string): RelayId { return <RelayId>id; }
    }


    // Data models
    export interface Junction {
        junctionId: JunctionId;
        location: Point3;
    }
    export interface JunctionRaw {
        location: Point3;
    }
    export module Junction {
        export function toMap(jns: JunctionRaw[]): { [junctionId: string]: Junction } {
            return jns.reduce((r, n) => {
                var id = getJunctionId(n);
                r[id] = { junctionId: JunctionId.fromDb(id), location: n.location, };
                return r;
            }, <{ [junctionId: string]: Junction }>{});
        }

        export function getJunctionId(jnc: JunctionRaw) {
            return <JunctionId>"Junction{" + jnc.location.x + "," + jnc.location.y + "," + jnc.location.z + "}";
        }
    }


    export interface Point3 {
        x: number;
        y: number;
        z: number;
    }


    export interface PointXZ {
        x: number;
        z: number;
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


    export interface Relay {
        relayId: RelayId;
        powerRating: PowerRating;
        path: Point3[];
        srcJunctionId: JunctionId;
        dstJunctionId: JunctionId;
    }
    export interface RelayRaw {
        powerRating: PowerRating;
        path: Point3[];
        srcJunctionId: string;
        dstJunctionId: string;
    }
    export module Relay {
        export function toMap(rls: RelayRaw[]): { [relayId: string]: Relay } {
            return rls.reduce((r, n) => {
                var id = getRelayId(n);
                r[id] = { relayId: RelayId.fromDb(id), powerRating: n.powerRating, path: n.path, srcJunctionId: JunctionId.fromDb(n.srcJunctionId), dstJunctionId: JunctionId.fromDb(n.dstJunctionId), };
                return r;
            }, <{ [relayId: string]: Relay }>{});
        }

        export function getRelayId(rly: RelayRaw) {
            return <RelayId>"Relay{" + rly.srcJunctionId + "-to-" + rly.dstJunctionId + "}";
        }
    }


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

        var rlys: RelayRaw[] = [];
        var jncs: JunctionRaw[] = [];

        var mapLines = lines.map((ln) => ln.split("")); // [z][x]
        var zCount = mapLines.length;
        var xCount = mapLines[0].length;

        forEach2d(mapLines, (ch, z, x, chs) => {
            assert(chs.length === xCount, "all lines must be equal length");

            if (isJunction(ch, z, x, chs)) {
                jncs.push(newJunction(x, y, z, mapLines));
            }
        });

        var takenJncConns: [number/*z*/, number/*x*/][] = []; // [z, x]

        jncs.forEach((jn) => {
            var { x, z } = jn.location;

            walkConnections(x, z, xCount, zCount, mapLines, takenJncConns);
        });

        return { junctions: jncs, relays: rlys, size: { width: xCount, height: zCount } };
    }


    function isJunction(ch: string, z: number, x: number, lines: string[]) {
        return ch === "+";
    }


    function newJunction(x: number, y: number, z: number, ary: string[][]) {
        return <JunctionRaw>{
            location: { x, y, z }
        };
    }


    // given a junction, start looking down each path
    function walkConnections(x: number, z: number, xCount: number, zCount: number, ary: string[][], jncConnsUsed: [number/*z*/, number/*x*/][]) {
        // TODO keep track of already used junction connections and don't re-walk them
        for (var i = 0, size = jncConnsUsed.length; i < size; i++) {
            var jnc = jncConnsUsed[i];
            if (jnc[0] === z && jnc[1] === x) {
                return;
            }
        }
        jncConnsUsed.push([z, x]);

        function toRelayRaw(jncPath: { points: PointXZ[]; junction?: Point3; connectionDirection?: Point3 }): RelayRaw {
            return {
                powerRating: PowerRating.getPowerRating(),
                path: jncPath.points.map((p) => { return { x: p.x, y: 0, z: p.z }; }),
                srcJunctionId: Junction.getJunctionId({ location: { x, y: 0, z } }),
                dstJunctionId: Junction.getJunctionId({ location: jncPath.junction }),
            };
        }

        var xOrig = x;
        var zOrig = z;
        var res: RelayRaw[] = [];

        function createJunction(x: number, z: number) {
            res.push(toRelayRaw(walkToJunction(x, z, xCount, zCount, ary, '+', xOrig, zOrig)));
        }

        forEachValidDirection<void>(x, z, xCount, zCount, {
            top:         createJunction,
            topRight:    createJunction,
            right:       createJunction,
            bottomRight: createJunction,
            bottom:      createJunction,
            bottomLeft:  createJunction,
            left:        createJunction,
            topLeft:     createJunction,
        });

        return res;
    }


    /** given a starting point on a path, walk to the end
     * @return the exclusive end [x, z] coordinate
     */
    function walkToJunction(x: number, z: number, xCount: number, zCount: number, ary: string[][], endChar: string, xSrcJunc: number, zSrcJunc: number): { points: PointXZ[]; junction?: Point3; connectionDirection?: Point3 } {
        var xPrev = xSrcJunc;
        var zPrev = zSrcJunc;
        var dst: PointXZ[] = [];

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
    function pipeFrom(x: number, z: number, xCount: number, zCount: number, ary: string[][], endChar: string, xPrev: number, zPrev: number, dst: PointXZ[]): PointXZ {
        var notExp = {
            '-': ['|', '/', '\\'],
            '|': ['-', '/', '\\'],
            '/': ['-', '|', '\\'],
            '\\': ['-', '|', '/'],
        };

        function checkAdjacent(expect: string, xx: number, zz: number, ary: string[][], notExpect: string[]) {
            if (xx === xPrev && zz === zPrev) { return null; }
            var ch = ary[zz][xx];
            if (ch === expect) { dst.push({ x: xx, z: zz }); }
            else if (notExpect.indexOf(ch) > -1) { throw invalidSymbolAt(xx, zz, ary, expect); }
            else if (ch === endChar) { return { x: xx, z: zz }; }
            return null;
        }

        var res = forEachValidDirection(x, z, xCount, zCount, {
            top:         (x, z) => checkAdjacent('|',  x, z, ary, notExp['|']),
            topRight:    (x, z) => checkAdjacent('/',  x, z, ary, notExp['/']),
            right:       (x, z) => checkAdjacent('-',  x, z, ary, notExp['-']),
            bottomRight: (x, z) => checkAdjacent('\\', x, z, ary, notExp['\\']),
            bottom:      (x, z) => checkAdjacent('|',  x, z, ary, notExp['|']),
            bottomLeft:  (x, z) => checkAdjacent('/',  x, z, ary, notExp['/']),
            left:        (x, z) => checkAdjacent('-',  x, z, ary, notExp['-']),
            topLeft:     (x, z) => checkAdjacent('\\', x, z, ary, notExp['\\']),
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
    export function forEachValidDirection<T>(x: number, z: number, xCount: number, zCount: number,
            dirHandlers: {
                top: (x: number, z: number) => T,
                topRight: (x: number, z: number) => T,
                right: (x: number, z: number) => T,
                bottomRight: (x: number, z: number) => T,
                bottom: (x: number, z: number) => T,
                bottomLeft: (x: number, z: number) => T,
                left: (x: number, z: number) => T,
                topLeft: (x: number, z: number) => T,
            }): T {

        if (x > 0) {
            if (z > 0) {
                // = = .
                // = + .
                // . . .
                var res = dirHandlers.left(x - 1, z);
                if (res !== undefined) { return res; }
                var res = dirHandlers.topLeft(x - 1, z - 1);
                if (res !== undefined) { return res; }
                var res = dirHandlers.top(x, z - 1);
                if (res !== undefined) { return res; }
            }
            if (z < zCount - 1) {
                // . = =
                // . + =
                // . . .
                var res = dirHandlers.top(x, z - 1);
                if (res !== undefined) { return res; }
                var res = dirHandlers.topRight(x + 1, z - 1);
                if (res !== undefined) { return res; }
                var res = dirHandlers.right(x + 1, z);
                if (res !== undefined) { return res; }
            }
        }
        if (x < xCount - 1) {
            if (z > 0) {
                // . . .
                // = + .
                // = = .
                var res = dirHandlers.bottom(x, z + 1);
                if (res !== undefined) { return res; }
                var res = dirHandlers.bottomLeft(x - 1, z + 1);
                if (res !== undefined) { return res; }
                var res = dirHandlers.left(x - 1, z);
                if (res !== undefined) { return res; }
            }
            if (z < zCount - 1) {
                // . . .
                // . + =
                // . = =
                var res = dirHandlers.bottom(x, z + 1);
                if (res !== undefined) { return res; }
                var res = dirHandlers.bottomRight(x + 1, z + 1);
                if (res !== undefined) { return res; }
                var res = dirHandlers.right(x + 1, z);
                if (res !== undefined) { return res; }
            }
        }
        return undefined;
    }


    export function forEach2d<T>(tArys: T[][], func: (value: T, i1: number, i2: number, array1: T[], array: T[][]) => void) {
        for (var i1 = 0, size1 = tArys.length; i1 < size1; i1++) {
            var ts = tArys[i1];
            for (var i2 = 0, size2 = ts.length; i2 < size2; i2++) {
                func(ts[i2], i1, i2, ts, tArys);
            }
        }
    }


    export function invalidSymbolAt(x: number, z: number, ary: string[][], expected?: string) {
        return new Error("invalid symbol [" + ary[z][x] + " at x=" + x + ", z=" + z + (expected ? ", " + expected : ""));
    }

}

export = PowerRelay;