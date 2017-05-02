"use strict";
var PowerGrid = require("./PowerGrid");
var PowerGridWidgetHelper;
(function (PowerGridWidgetHelper) {
    function newInst(doc, container, settings, buildSvgFunc) {
        var map = PowerGrid.maps[settings.mapName];
        var grid = new PowerGrid();
        var size = grid.createPowerGrid(map);
        //var size = grid.createJunctionsGrid(map);
        var gs = {
            xCount: size.width,
            zCount: size.height,
            xSize: 10,
            zSize: 10,
        };
        //addSvgMap(doc, container, grid.relays, grid.junctions, gs);
        var svgContainer = container.getElementsByClassName("map-display")[0];
        buildSvgFunc(doc, svgContainer, grid, gs);
    }
    PowerGridWidgetHelper.newInst = newInst;
    function relayToSvgPointsAttr(relay, pg, gs) {
        var pointToPx = function (p) { return (gs.xSize * (p.x + 0.5)) + ',' + (gs.zSize * (p.z + 0.5)); };
        var points = relay.path.map(pointToPx);
        var srcJnc = pg.getJunction(relay.srcJunctionId);
        points.unshift(pointToPx(srcJnc.location));
        var dstJnc = pg.getJunction(relay.dstJunctionId);
        points.push(pointToPx(dstJnc.location));
        return points.join(" ");
    }
    PowerGridWidgetHelper.relayToSvgPointsAttr = relayToSvgPointsAttr;
    function onReady(document, func) {
        if (typeof document === "function") {
            func = document;
            document = undefined;
        }
        var doc = document || window.document;
        function ready(func) {
            if (doc.readyState !== "loading") {
                func();
            }
            else {
                doc.addEventListener("DOMContentLoaded", func);
            }
        }
        ready(func);
    }
    PowerGridWidgetHelper.onReady = onReady;
})(PowerGridWidgetHelper || (PowerGridWidgetHelper = {}));
module.exports = PowerGridWidgetHelper;
