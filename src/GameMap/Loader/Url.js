var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameMap_Loader_Url = (function (_super) {
    __extends(GameMap_Loader_Url, _super);
    function GameMap_Loader_Url(map, urlFile) {
        _super.call(this);

        throw "Map loader url: not implemented";

        map.emit('loaded');
    }
    return GameMap_Loader_Url;
})(Events);
