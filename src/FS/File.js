/// <reference path="../Events.ts" />
/// <reference path="../declare/std/jquery.d.ts" />
/// <reference path="../declare/node/node.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FS_File = (function (_super) {
    __extends(FS_File, _super);
    function FS_File(name, readAs) {
        if (typeof readAs === "undefined") { readAs = 'text'; }
        _super.call(this);
        this.name = name;
        this.readAs = readAs;
        this.data = null;
        this.loaded = false;
    }
    FS_File.prototype.open = function () {
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

                                console.log( "File COntents: ", data );
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
    return FS_File;
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
