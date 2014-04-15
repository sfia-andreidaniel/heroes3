var Events = (function () {
    function Events() {
        this._listeners = {};
    }
    Events.prototype._createListener = function (event) {
        this._listeners[event] = this._listeners[event] || {
            "global": [],
            "once": [],
            "count": 0
        };

        return this._listeners[event];
    };

    Events.prototype.addListener = function (event, listener) {
        var grp = this._createListener(event);

        grp.global.push(listener);
        grp.count++;

        this.emit('newListener', event, listener);

        return this;
    };

    Events.prototype.on = function (event, listener) {
        return this.addListener(event, listener);
    };

    Events.prototype.once = function (event, listener) {
        var grp = this._createListener(event);
        grp.once.push(listener);
    };

    Events.prototype.removeListener = function (event, listener) {
        var grp;

        if (this._listeners[event]) {
            grp = this._createListener(event);
            for (var i = 0, len = grp.global.length; i < len; i++)
                if (grp.global[i] == listener) {
                    grp.global.splice(i, 1);
                    this.emit('removeListener', event, listener);
                    return this;
                }
            for (var i = 0, len = grp.once.length; i < len; i++)
                if (grp.once[i] == listener) {
                    grp.once.splice(i, 1);
                    this.emit('removeListener', event, listener);
                    return this;
                }
        }

        return this;
    };

    Events.prototype.removeAllListeners = function (event) {
        if (typeof event === "undefined") { event = null; }
        if (event !== null) {
            if (this._listeners[event])
                delete this._listeners[event];
        } else {
            this._listeners = {};
        }
    };

    Events.prototype.emit = function (event) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        var anyCalled = false;

        if (this._listeners[event]) {
            while (this._listeners[event].once.length) {
                this._listeners[event].once[0].apply(this, args);
                this._listeners[event].once.splice(0, 1);
                this._listeners[event].count--;
                anyCalled = true;
            }
            for (var i = 0, len = this._listeners[event].global.length; i < len; i++) {
                this._listeners[event].global[i].apply(this, args);
                anyCalled = true;
            }
        }

        return anyCalled;
    };

    Events.listenerCount = function (emitter, event) {
        return emitter._listeners[event] ? emitter._listeners[event].count : 0;
    };
    return Events;
})();
/// <reference path="Events.ts" />
/// <reference path="declare/std/jquery.d.ts" />
/// <reference path="declare/node/node.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FSFile = (function (_super) {
    __extends(FSFile, _super);
    function FSFile(name, readAs) {
        if (typeof readAs === "undefined") { readAs = 'text'; }
        _super.call(this);
        this.name = name;
        this.readAs = readAs;
        this.data = null;
        this.loaded = false;
    }
    FSFile.prototype.open = function () {
        // node wrapper
        if (typeof global != 'undefined') {
            (function (f) {
                var fs = require('fs');

                fs.readFile(f.name, function (err, data) {
                    if (err) {
                        f.emit('error', 'Failed to open file: ' + f.name);
                    } else {
                        f.data = data + '';

                        if (f.readAs == 'json') {
                            try  {
                                f.data = JSON.parse(f.data);

                                f.emit('ready');
                            } catch (error) {
                                f.data = null;

                                f.emit('error', 'Failed to decode file contents as json!');
                            }
                        } else
                            f.emit('ready');
                    }
                });
            })(this);
        } else {
            (function (f) {
                $.ajax(f.name, {
                    "success": function (data) {
                        f.data = data;
                        f.emit('ready');
                    },
                    "error": function (error) {
                        f.emit('error', 'Failed to load file: ' + f.name, error);
                    },
                    "dataType": f.readAs == 'json' ? 'json' : "text",
                    "cache": false
                });
            })(this);
        }

        return this;
    };
    return FSFile;
})(Events);
/*
var f = new FSFile( 'foo.json', 'json' );
f.on('error', function( reason ) {
console.log( reason );
});
f.on( 'ready', function() {
console.log( f.name, ": loaded" );
console.log( "Contents of ", this.name, ": ", this.data, " of type ", typeof this.data );
});
f.open();
*/
