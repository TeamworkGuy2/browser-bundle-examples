
/** Utilities for 2-dimensional array iteration */
module ForEachUtil {
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
    export function forEachDirection<T>(x: number, z: number, xCount: number, zCount: number,
            dirHandlers: Directions<(x: number, z: number) => T>, ignoreBehindPoints?: boolean, xPrev?: number, zPrev?: number): T {
        if (x === xPrev && z === zPrev) {
            throw new Error("cannot determine direction since x,z and xPrev,zPrev are the same");
        }

        var dir = z === zPrev ? (x < xPrev ? dirLeft : dirRight/*left or right*/) :
            (z > zPrev ?
            (x > xPrev ? dirDownRight : (x === xPrev ? dirDown : dirDownLeft))/*down-ish*/ :
            (x > xPrev ? dirUpRight   : (x === xPrev ? dirUp   : dirUpLeft))/*up-ish*/);

        var ignore = ignoreBehindPoints;
        var ignoreTop =         ignore ? (dir === dirDownRight || dir === dirDown      || dir === dirDownLeft) : false;
        var ignoreTopRight =    ignore ? (dir === dirDown      || dir === dirDownLeft  || dir === dirLeft) : false;
        var ignoreRight =       ignore ? (dir === dirDownLeft  || dir === dirLeft      || dir === dirUpLeft) : false;
        var ignoreBottomRight = ignore ? (dir === dirLeft      || dir === dirUpLeft    || dir === dirUp) : false;
        var ignoreBottom =      ignore ? (dir === dirUpLeft    || dir === dirUp        || dir === dirUpRight) : false;
        var ignoreBottomLeft =  ignore ? (dir === dirUp        || dir === dirUpRight   || dir === dirRight) : false;
        var ignoreLeft =        ignore ? (dir === dirUpRight   || dir === dirRight     || dir === dirDownRight) : false;
        var ignoreTopLeft =     ignore ? (dir === dirRight     || dir === dirDownRight || dir === dirDown) : false;

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
                    if (res != null) { return res; }
                }
                if (!ignoreTopLeft) {
                    var res = dirHandlers.topLeft(x - 1, z - 1);
                    if (res != null) { return res; }
                }
                if (!ignoreTop) {
                    var res = dirHandlers.top(x, z - 1);
                    if (res != null) { return res; }
                }
                topLeftRan = true;
            }
            if (z < zCount - 1) {
                // . = =
                // . + =
                // . . .
                if (!ignoreTop && !topLeftRan) {
                    var res = dirHandlers.top(x, z - 1);
                    if (res != null) { return res; }
                }
                if (!ignoreTopRight) {
                    var res = dirHandlers.topRight(x + 1, z - 1);
                    if (res != null) { return res; }
                }
                if (!ignoreRight) {
                    var res = dirHandlers.right(x + 1, z);
                    if (res != null) { return res; }
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
                    if (res != null) { return res; }
                }
                if (!ignoreBottomLeft) {
                    var res = dirHandlers.bottomLeft(x - 1, z + 1);
                    if (res != null) { return res; }
                }
                if (!ignoreLeft && !topLeftRan) {
                    var res = dirHandlers.left(x - 1, z);
                    if (res != null) { return res; }
                }
                bottomLeftRan = true;
            }
            if (z < zCount - 1) {
                // . . .
                // . + =
                // . = =
                if (!ignoreBottom && !bottomLeftRan) {
                    var res = dirHandlers.bottom(x, z + 1);
                    if (res != null) { return res; }
                }
                if (!ignoreBottomRight) {
                    var res = dirHandlers.bottomRight(x + 1, z + 1);
                    if (res != null) { return res; }
                }
                if (!ignoreRight && !topRightRan) {
                    var res = dirHandlers.right(x + 1, z);
                    if (res != null) { return res; }
                }
                bottomRightRan = true;
            }
        }
        return undefined;
    }


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
    export function forEachDirectionConsume<T>(x: number, z: number, xCount: number, zCount: number,
            dirHandler: (x: number, z: number) => T, ignoreBehindPoints?: boolean, xPrev?: number, zPrev?: number): T {
        if (x === xPrev && z === zPrev) {
            throw new Error("cannot determine direction since x,z and xPrev,zPrev are the same");
        }

        var dir = z === zPrev ? (x < xPrev ? dirLeft : dirRight/*left or right*/) :
            (z > zPrev ?
            (x > xPrev ? dirDownRight : (x === xPrev ? dirDown : dirDownLeft))/*down-ish*/ :
            (x > xPrev ? dirUpRight   : (x === xPrev ? dirUp   : dirUpLeft))/*up-ish*/);

        var ignore = ignoreBehindPoints;
        var ignoreTop =         ignore ? (dir === dirDownRight || dir === dirDown      || dir === dirDownLeft) : false;
        var ignoreTopRight =    ignore ? (dir === dirDown      || dir === dirDownLeft  || dir === dirLeft) : false;
        var ignoreRight =       ignore ? (dir === dirDownLeft  || dir === dirLeft      || dir === dirUpLeft) : false;
        var ignoreBottomRight = ignore ? (dir === dirLeft      || dir === dirUpLeft    || dir === dirUp) : false;
        var ignoreBottom =      ignore ? (dir === dirUpLeft    || dir === dirUp        || dir === dirUpRight) : false;
        var ignoreBottomLeft =  ignore ? (dir === dirUp        || dir === dirUpRight   || dir === dirRight) : false;
        var ignoreLeft =        ignore ? (dir === dirUpRight   || dir === dirRight     || dir === dirDownRight) : false;
        var ignoreTopLeft =     ignore ? (dir === dirRight     || dir === dirDownRight || dir === dirDown) : false;

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
                    if (res != null) { return res; }
                }
                if (!ignoreTopLeft) {
                    var res = dirHandler(x - 1, z - 1);
                    if (res != null) { return res; }
                }
                if (!ignoreTop) {
                    var res = dirHandler(x, z - 1);
                    if (res != null) { return res; }
                }
                topLeftRan = true;
            }
            if (z < zCount - 1) {
                // . = =
                // . + =
                // . . .
                if (!ignoreTop && !topLeftRan) {
                    var res = dirHandler(x, z - 1);
                    if (res != null) { return res; }
                }
                if (!ignoreTopRight) {
                    var res = dirHandler(x + 1, z - 1);
                    if (res != null) { return res; }
                }
                if (!ignoreRight) {
                    var res = dirHandler(x + 1, z);
                    if (res != null) { return res; }
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
                    if (res != null) { return res; }
                }
                if (!ignoreBottomLeft) {
                    var res = dirHandler(x - 1, z + 1);
                    if (res != null) { return res; }
                }
                if (!ignoreLeft && !topLeftRan) {
                    var res = dirHandler(x - 1, z);
                    if (res != null) { return res; }
                }
                bottomLeftRan = true;
            }
            if (z < zCount - 1) {
                // . . .
                // . + =
                // . = =
                if (!ignoreBottom && !bottomLeftRan) {
                    var res = dirHandler(x, z + 1);
                    if (res != null) { return res; }
                }
                if (!ignoreBottomRight) {
                    var res = dirHandler(x + 1, z + 1);
                    if (res != null) { return res; }
                }
                if (!ignoreRight && !topRightRan) {
                    var res = dirHandler(x + 1, z);
                    if (res != null) { return res; }
                }
                bottomRightRan = true;
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

}

export = ForEachUtil;