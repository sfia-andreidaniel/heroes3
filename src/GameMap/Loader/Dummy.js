var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameMap_Loader_Dummy = (function (_super) {
    __extends(GameMap_Loader_Dummy, _super);
    function GameMap_Loader_Dummy(map, width, height) {
        _super.call(this);

        map.setSize(width, height);

        map.emit('loaded');
    }
    return GameMap_Loader_Dummy;
})(Events);
