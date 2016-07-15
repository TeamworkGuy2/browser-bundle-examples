"use strict";
var React = require("react");
var ReactDom = require("react-dom");
var PowerGridWidgetHelper = require("./PowerGridWidgetHelper");
var PowerGridWidget;
(function (PowerGridWidget) {
    var dotColor = "#59A";
    function addSvgMap(doc, container, relays, junctions, gs) {
        var res = [];
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
    PowerGridWidget.addSvgMap = addSvgMap;
    function createJunctionUi(point, gs) {
        var x = gs.xSize * (point.x + 0.5);
        var z = gs.zSize * (point.z + 0.5);
        return <circle cx={x} cy={z} r="4" fill={dotColor} stroke="#555" strokeWidth="2"></circle>;
    }
    PowerGridWidget.createJunctionUi = createJunctionUi;
    function createRelayUi(points, gs) {
        var pointStr = points.map(function (p) { return (gs.xSize * (p.x + 0.5)) + ',' + (gs.zSize * (p.z + 0.5)); }).join(" ");
        return <polyline points={pointStr} stroke="#555" strokeWidth="2"></polyline>;
    }
    PowerGridWidget.createRelayUi = createRelayUi;
})(PowerGridWidget || (PowerGridWidget = {}));
// main - entry point
(function main() {
    var doc = window.document;
    PowerGridWidgetHelper.onReady(doc, function () {
        var gridUi = PowerGridWidgetHelper.newInst(doc, doc.getElementsByClassName("power-grid-widget")[0], { mapName: "defaultMap1" }, PowerGridWidget.addSvgMap);
    });
}());
module.exports = PowerGridWidget;
