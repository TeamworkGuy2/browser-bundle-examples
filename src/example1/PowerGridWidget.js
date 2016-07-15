"use strict";
var PowerGridWidgetHelper = require("./PowerGridWidgetHelper");
var PowerGridWidget;
(function (PowerGridWidget) {
    var dotColor = "#C44";
    function addSvgMap(doc, container, relays, junctions, gs) {
        for (var i = 0, size = relays.length; i < size; i++) {
            var relayElem = createRelayUi(doc, relays[i].path, gs);
            container.appendChild(relayElem);
        }
        for (var i = 0, size = junctions.length; i < size; i++) {
            var junctionElem = createJunctionUi(doc, junctions[i].location, gs);
            container.appendChild(junctionElem);
        }
    }
    PowerGridWidget.addSvgMap = addSvgMap;
    function createJunctionUi(doc, point, gs) {
        var x = gs.xSize * (point.x + 0.5);
        var z = gs.zSize * (point.z + 0.5);
        var elem = doc.createElementNS("http://www.w3.org/2000/svg", "circle");
        elem.setAttributeNS(null, "r", 4 + '');
        elem.setAttributeNS(null, "stroke", "#555");
        elem.setAttributeNS(null, "stroke-width", 2 + '');
        elem.setAttributeNS(null, "fill", dotColor);
        elem.setAttributeNS(null, "cx", x + '');
        elem.setAttributeNS(null, "cy", z + '');
        return elem;
    }
    PowerGridWidget.createJunctionUi = createJunctionUi;
    function createRelayUi(doc, points, gs) {
        var elem = doc.createElementNS("http://www.w3.org/2000/svg", "polyline");
        elem.setAttributeNS(null, "stroke", "#555");
        elem.setAttributeNS(null, "stroke-width", 2 + '');
        elem.setAttributeNS(null, "points", points.map(function (p) { return (gs.xSize * (p.x + 0.5)) + ',' + (gs.zSize * (p.z + 0.5)); }).join(" "));
        return elem;
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
