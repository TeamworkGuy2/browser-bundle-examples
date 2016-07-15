import React = require("react");
import ReactDom = require("react-dom");
import PowerRelay = require("./PowerRelay");
import PowerGridWidgetHelper = require("./PowerGridWidgetHelper");

type Grid = PowerGridWidgetHelper.Grid;


module PowerGridWidget {
    var dotColor = "#59A";


    export function addSvgMap(doc: Document, container: Element, relays: PowerRelay.Relay[], junctions: PowerRelay.Junction[], gs: Grid) {
        var res: JSX.Element[] = [];
        for (var i = 0, size = relays.length; i < size; i++) {
            var relayElem = createRelayUi(relays[i].path, gs);
            res.push(relayElem);
        }

        for (var i = 0, size = junctions.length; i < size; i++) {
            var junctionElem = createJunctionUi(junctions[i].location, gs);
            res.push(junctionElem);
        }

        var rootElem = React.createElement("svg:svg", { className: "map-display", width: "800", height: "160" }, res);
        ReactDom.render(rootElem, container);
    }


    export function createJunctionUi(point: PowerRelay.PointXZ, gs: Grid) {
        var x = gs.xSize * (point.x + 0.5);
        var z = gs.zSize * (point.z + 0.5);
        return <circle cx={x} cy={z} r="4" fill={dotColor} stroke="#555" strokeWidth="2" ></circle>;
    }


    export function createRelayUi(points: PowerRelay.PointXZ[], gs: Grid) {
        var pointStr = points.map(p => (gs.xSize * (p.x + 0.5)) + ',' + (gs.zSize * (p.z + 0.5))).join(" ");
        return <polyline points={pointStr} stroke="#555" strokeWidth="2" ></polyline>;
    }

}


// main - entry point
(function main() {
    var doc = window.document;

    PowerGridWidgetHelper.onReady(doc, () => {
        var gridUi = PowerGridWidgetHelper.newInst(doc, doc.getElementsByClassName("power-grid-widget")[0], { mapName: "defaultMap1" }, PowerGridWidget.addSvgMap);
    });
} ());


export = PowerGridWidget;