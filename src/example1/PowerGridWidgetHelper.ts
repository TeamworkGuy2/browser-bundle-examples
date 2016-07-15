import PowerGrid = require("./PowerGrid");
import PowerRelay = require("./PowerRelay");

module PowerGridWidgetHelper {

    export interface BuildSvgFunc {
        (doc: Document, container: Element, relays: PowerRelay.Relay[], junctions: PowerRelay.Junction[], gs: Grid): void;
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
        var grid = new PowerGrid();
        var map: string[] = PowerGrid.maps[settings.mapName];
        //var size = grid.createPowerGrid(map);
        var size = { width: map[0].length, height: map.length };
        var gs: Grid = {
            xCount: size.width,
            zCount: size.height,
            xSize: 10,
            zSize: 10,
        };
        //addSvgMap(doc, container, grid.relays, grid.junctions, gs);
        var jncs = map.reduce((m, ln, z) => {
            ln.split("").forEach((s, x) => { if (s === "+") { m.push({ junctionId: null, location: { x, y: 0, z } }); } });
            return m;
        }, [] as PowerRelay.Junction[]);

        var svgContainer = container.getElementsByClassName("map-display")[0];
        buildSvgFunc(doc, svgContainer, [], jncs, gs);
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