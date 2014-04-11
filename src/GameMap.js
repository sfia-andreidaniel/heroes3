/// <reference path="Terrains.ts" />
/// <reference path="Events.ts" />
/// <reference path="GameMap/Loader/Dummy.ts" />
/// <reference path="GameMap/Loader/File.ts" />
/// <reference path="GameMap/Loader/Url.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameMap = (function (_super) {
    __extends(GameMap, _super);
    function GameMap(width, height, localFile, urlFile) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        if (typeof localFile === "undefined") { localFile = null; }
        if (typeof urlFile === "undefined") { urlFile = null; }
        _super.call(this);
        this.data = [];
        this.width = 0;
        this.height = 0;

        if (urlFile === null) {
            if (localFile === null) {
                new GameMap_Loader_Dummy(this, width, height);
            } else {
                new GameMap_Loader_File(this, localFile);
            }
        } else {
            new GameMap_Loader_Url(this, urlFile);
        }
    }
    GameMap.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height;
    };
    return GameMap;
})(Events);
