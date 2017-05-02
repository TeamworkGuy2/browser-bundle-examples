import PowerGrid = require("./PowerGrid");
import PowerRelay = require("./PowerRelay");

module PowerGridWidgetHelper {

    export interface BuildSvgFunc {
        (doc: Document, container: Element, powerGrid: PowerGrid, gs: Grid): void;
    }


    export interface Options {
        mapName: string;
    }


    export interface Grid {
        xCount: number;
        zCount: number;
        xSize: number;
        zSize: number;
    }


    export function newInst(doc: Document, container: Element, settings: Options, buildSvgFunc: BuildSvgFunc) {
        var map: string[] = PowerGrid.maps[settings.mapName];
        var grid = new PowerGrid();
        var size = grid.createPowerGrid(map);
        //var size = grid.createJunctionsGrid(map);
        var gs: Grid = {
            xCount: size.width,
            zCount: size.height,
            xSize: 10,
            zSize: 10,
        };
        //addSvgMap(doc, container, grid.relays, grid.junctions, gs);

        var svgContainer = container.getElementsByClassName("map-display")[0];
        buildSvgFunc(doc, svgContainer, grid, gs);
    }


    export function relayToSvgPointsAttr(relay: PowerRelay.Relay, pg: PowerGrid, gs: Grid) {
        var pointToPx = (p: PowerRelay.Point3) => (gs.xSize * (p.x + 0.5)) + ',' + (gs.zSize * (p.z + 0.5));
        var points = relay.path.map(pointToPx);

        var srcJnc = pg.getJunction(relay.srcJunctionId);
        points.unshift(pointToPx(srcJnc.location));

        var dstJnc = pg.getJunction(relay.dstJunctionId);
        points.push(pointToPx(dstJnc.location));

        return points.join(" ");
    }


    export function onReady(func: () => void)
    export function onReady(document: Document, func: () => void);
    export function onReady(document: Document | (() => void), func?: () => void) {
        if (typeof document === "function") { func = <() => void>document; document = undefined; }
        var doc = <Document>document || window.document;

        function ready(func: () => void) {
            if (doc.readyState !== "loading") {
                func();
            }
            else {
                doc.addEventListener("DOMContentLoaded", func);
            }
        }

        ready(func);

    }

}

export = PowerGridWidgetHelper;