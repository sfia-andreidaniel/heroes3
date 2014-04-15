/// <reference path="Events.ts" />
/// <reference path="FS/File.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameFS = (function (_super) {
    __extends(GameFS, _super);
    function GameFS(filesLoader) {
        if (typeof filesLoader === "undefined") { filesLoader = 'gamefs.json'; }
        _super.call(this);
        this.pending = 0;
        this.count = 0;
        // Content
    }
    GameFS.prototype.add = function (localFS, realPath, loadAs) {
        if (typeof loadAs === "undefined") { loadAs = 'text'; }
        if (typeof this.files[localFS] != 'undefined')
            throw "GameFS: File " + localFS + " is allready added!";

        this.files[localFS] = new FS_File(realPath, loadAs);

        this.pending++;
        this.count++;

        (function (me) {
            me.files[localFS].on('ready', function () {
                me.pending--;
                me.emit('log', 'File: ' + localFS + " loaded");

                if (me.pending == 0)
                    me.emit('available');
            });

            me.files[localFS].on('error', function (reason) {
                me.pending--;
                me.emit('log', 'ERROR: ' + localFS + ": " + reason);

                me.files[localFS] = null;

                if (me.pending == 0)
                    me.emit('available');
            });
        })(this);
    };
    return GameFS;
})(Events);
