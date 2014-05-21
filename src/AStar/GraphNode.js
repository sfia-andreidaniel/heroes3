/// <reference path="IPos.ts" />
var AStar_GraphNode = (function () {
    function AStar_GraphNode(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.pos = {
            "x": 0,
            "y": 0
        };
        this.data = {};
        // public type
        // public x
        // public y
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.parent = null;
        this.visited = false;
        this.cost = 0;
        this.closed = false;
        this.pos.x = x;
        this.pos.y = y;
    }
    AStar_GraphNode.prototype.toString = function () {
        return "[" + this.x + " " + this.y + "]";
    };

    AStar_GraphNode.prototype.isWall = function () {
        return this.type === 0;
    };
    return AStar_GraphNode;
})();
