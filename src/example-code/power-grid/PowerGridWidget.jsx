"use strict";
var React = require("react");
var ReactDom = require("react-dom");
var PowerGridWidgetHelper = require("./PowerGridWidgetHelper");
var PowerGridWidget;
(function (PowerGridWidget) {
    var dotColor = "#5C4";
    function addSvgMap(doc, container, grid, gs) {
        var junctions = grid.junctions || [];
        var relays = grid.relays || [];
        var res = [];
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
    PowerGridWidget.addSvgMap = addSvgMap;
    function createJunctionUi(point, pg, gs) {
        var x = gs.xSize * (point.x + 0.5);
        var z = gs.zSize * (point.z + 0.5);
        return <circle cx={x} cy={z} r="4" fill={dotColor} stroke="#555" strokeWidth="2"></circle>;
    }
    PowerGridWidget.createJunctionUi = createJunctionUi;
    function createRelayUi(relay, pg, gs) {
        var pointsAttr = PowerGridWidgetHelper.relayToSvgPointsAttr(relay, pg, gs);
        return <polyline points={pointsAttr} stroke="#555" fill="none" strokeWidth="2"></polyline>;
    }
    PowerGridWidget.createRelayUi = createRelayUi;
})(PowerGridWidget || (PowerGridWidget = {}));
// main - entry point
(function main() {
    var doc = window.document;
    PowerGridWidgetHelper.onReady(doc, function () {
        var gridUi = PowerGridWidgetHelper.newInst(doc, doc.getElementsByClassName("power-grid-widget")[0], { mapName: "hds" }, PowerGridWidget.addSvgMap);
    });
}());
module.exports = PowerGridWidget;
