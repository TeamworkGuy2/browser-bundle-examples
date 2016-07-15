"use strict";
var PowerGrid = require("./PowerGrid");
var PowerGridWidgetHelper;
(function (PowerGridWidgetHelper) {
    function newInst(doc, container, settings, buildSvgFunc) {
        var grid = new PowerGrid();
        var map = PowerGrid.maps[settings.mapName];
        //var size = grid.createPowerGrid(map);
        var size = { width: map[0].length, height: map.length };
        var gs = {
            xCount: size.width,
            zCount: size.height,
            xSize: 10,
            zSize: 10,
        };
        //addSvgMap(doc, container, grid.relays, grid.junctions, gs);
        var jncs = map.reduce(function (m, ln, z) {
            ln.split("").forEach(function (s, x) { if (s === "+") {
                m.push({ junctionId: null, location: { x: x, y: 0, z: z } });
            } });
            return m;
        }, []);
        var svgContainer = container.getElementsByClassName("map-display")[0];
        buildSvgFunc(doc, svgContainer, [], jncs, gs);
    }
    PowerGridWidgetHelper.newInst = newInst;
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
