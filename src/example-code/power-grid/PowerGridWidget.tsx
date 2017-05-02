import React = require("react");
import ReactDom = require("react-dom");
import PowerGrid = require("./PowerGrid");
import PowerRelay = require("./PowerRelay");
import PowerGridWidgetHelper = require("./PowerGridWidgetHelper");

type Grid = PowerGridWidgetHelper.Grid;


module PowerGridWidget {
    var dotColor = "#5C4";


    export function addSvgMap(doc: Document, container: Element, grid: PowerGrid, gs: Grid) {
        var junctions = grid.junctions || [];
        var relays = grid.relays || [];

        var res: JSX.Element[] = [];
        for (var i = 0, size = junctions.length; i < size; i++) {
            var junctionElem = createJunctionUi(junctions[i].location, grid, gs);
            res.push(junctionElem);
        }

        for (var i = 0, size = relays.length; i < size; i++) {
            var relayElem = createRelayUi(relays[i], grid, gs);
            res.push(relayElem);
        }

        var rootElem = React.createElement("svg:svg", { className: "map-display", width: "800", height: "160" }, res);
        ReactDom.render(rootElem, container);
    }


    export function createJunctionUi(point: PowerRelay.PointXZ, pg: PowerGrid, gs: Grid) {
        var x = gs.xSize * (point.x + 0.5);
        var z = gs.zSize * (point.z + 0.5);
        return <circle cx={x} cy={z} r="4" fill={dotColor} stroke="#555" strokeWidth="2" ></circle>;
    }


    export function createRelayUi(relay: PowerRelay.Relay, pg: PowerGrid, gs: Grid) {
        var pointsAttr = PowerGridWidgetHelper.relayToSvgPointsAttr(relay, pg, gs);
        return <polyline points={pointsAttr} stroke="#555" fill="none" strokeWidth="2" ></polyline>;
    }

}


// main - entry point
(function main() {
    var doc = window.document;

    PowerGridWidgetHelper.onReady(doc, () => {
        var gridUi = PowerGridWidgetHelper.newInst(doc, doc.getElementsByClassName("power-grid-widget")[0], { mapName: "hds" }, PowerGridWidget.addSvgMap);
    });
} ());


export = PowerGridWidget;