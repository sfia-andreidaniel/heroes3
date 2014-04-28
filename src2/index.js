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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FS = (function (_super) {
    __extends(FS, _super);
    function FS() {
        _super.call(this);
        this.files = {};
        this.pending = 0;
        this.count = 0;
        this.cache = {};
    }
    FS.prototype.add = function (localFS, realPath, loadAs) {
        if (typeof loadAs === "undefined") { loadAs = 'text'; }
        if (this.files[localFS])
            throw "GameFS: File " + localFS + " is allready added!";

        this.files[localFS] = new FS_File(realPath, loadAs);

        this.pending++;
        this.count++;

        (function (me) {
            me.files[localFS].on('ready', function () {
                me.pending--;
                me.emit('log', 'File: ' + localFS + " loaded");

                if (me.pending == 0)
                    me.emit('ready');
            });

            me.files[localFS].on('error', function (reason) {
                me.pending--;
                me.emit('log', 'ERROR: ' + localFS + ": " + reason);

                me.files[localFS] = null;

                if (me.pending == 0)
                    me.emit('ready');
            });
        })(this);

        this.files[localFS].open();

        return this.files[localFS];
    };

    FS.prototype.open = function (filePath) {
        if (!this.files[filePath])
            throw "File " + filePath + " not found!";

        return this.files[filePath];
    };

    FS.prototype.unpackResource = function (href) {
        var fragment = /\#([^\#]+)$/.exec(href), path = /^([^#]+)(\#|$)/.exec(href), decodedFragment = '', decodedPath = '', f, data, src = '';

        decodedFragment = fragment ? fragment[1] : null;
        decodedPath = path ? path[1] : '';

        f = this.open(decodedPath);

        if (decodedFragment) {
            if (f.readAs != 'json')
                throw "The resource: " + decodedPath + " was not read as json in order to support fragment!";

            decodedFragment = decodedFragment.split('.');

            data = f.data;

            while (decodedFragment.length) {
                if (typeof data[decodedFragment[0]] == 'undefined')
                    throw "In resource: " + decodedPath + ", cannot resolve fragment: ..." + decodedFragment.join('.');

                data = data[decodedFragment[0]];

                decodedFragment = decodedFragment.slice(1);
            }

            src = data;
        } else
            src = f.data;

        return src;
    };
    return FS;
})(Events);
if (typeof global != 'undefined') {
    var NodeImage = (function () {
        var canvas = require('canvas'), Image = canvas.Image;

        return Image;
    })();
}

var Picture = (function (_super) {
    __extends(Picture, _super);
    function Picture(src) {
        _super.call(this);
        this.loaded = false;
        this.error = null;
        this.width = 0;
        this.height = 0;

        // Content
        if (typeof global == 'undefined') {
            this.node = new Image();

            (function (self) {
                self.node.onload = function () {
                    self.loaded = true;
                    self.width = self.node.width;
                    self.height = self.node.height;
                    self.emit('load');
                };

                self.node.onerror = function () {
                    self.error = 'Error loading image';
                    self.emit('error');
                };
            })(this);

            this.node.src = src;
        } else {
            var buffer = new Buffer(src.split('base64,')[1], 'base64');

            this.node = new NodeImage();

            this.node.src = buffer;

            this.width = this.node.width;
            this.height = this.node.height;

            this.loaded = true;

            (function (me) {
                setTimeout(function () {
                    me.emit('load');
                }, 30);
            })(this);
        }
    }
    return Picture;
})(Events);
/// <reference path="../Events.ts" />
/// <reference path="../declare/std/jquery.d.ts" />
/// <reference path="../declare/node/node.d.ts" />
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
        if (typeof global !== 'undefined') {
            (function (f) {
                var fs = require('fs');

                fs.readFile(f.name, function (err, data) {
                    if (err) {
                        f.emit('error', 'Failed to open file: ' + f.name);
                    } else {
                        if (f.readAs == 'json') {
                            try  {
                                f.data = JSON.parse(data.toString('utf8'));

                                f.emit('ready');
                            } catch (error) {
                                f.data = null;

                                f.emit('error', 'Failed to decode file contents as json!: ' + error);
                                // console.log( data.toString( 'utf8' ) );
                            }
                        } else {
                            f.data = data.toString('utf8');
                            f.emit('ready');
                        }
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
var AdvMap = (function (_super) {
    __extends(AdvMap, _super);
    function AdvMap(_iniCols, _iniRows, mapFile) {
        if (typeof _iniCols === "undefined") { _iniCols = 0; }
        if (typeof _iniRows === "undefined") { _iniRows = 0; }
        if (typeof mapFile === "undefined") { mapFile = null; }
        _super.call(this);
        this._iniCols = _iniCols;
        this._iniRows = _iniRows;
        this.tilesets = [];
        this.fs = new FS();
        this.cols = 0;
        this.rows = 0;
        this.layers = [];
        this.cells = [];
        this._iniLayers = null;
        this.viewports = [];
        this._activeCell = null;

        (function (me) {
            me.fs.on('ready', function () {
                me._onFSReady();
            });
        })(this);

        if (mapFile === null) {
            this._loadFS();
        } else {
            console.log("Loading map file: ", 'resources/maps/' + mapFile);

            this._iniCols = 0;
            this._iniRows = 0;

            var load = new FS_File('resources/maps/' + mapFile, 'json');

            (function (me) {
                load.once('ready', function () {
                    console.log("Loaded map: " + this.data.width + "x" + this.data.height);

                    me._iniCols = this.data.width;
                    me._iniRows = this.data.height;
                    me._iniLayers = this.data.layers;

                    me._loadFS();
                });

                load.once('error', function () {
                    throw "Failed to initialize map! Map file " + mapFile + " failed to load!";
                });

                load.open();
            })(this);
        }
    }
    Object.defineProperty(AdvMap.prototype, "activeCell", {
        get: function () {
            return this._activeCell;
        },
        set: function (c) {
            if (c != this._activeCell) {
                this._activeCell = c;
                this.emit('selection-changed', c);
            }
        },
        enumerable: true,
        configurable: true
    });


    AdvMap.prototype._loadFS = function () {
        /* Load filesystem data */
        this.fs.add('tilesets/terrains.json', 'resources/tilesets/terrains.tsx.json', 'json');
        this.fs.add('tilesets/roads-rivers.json', 'resources/tilesets/roads-rivers.tsx.json', 'json');
    };

    AdvMap.prototype._onFSReady = function () {
        (function (me) {
            me.addTileset(new AdvMap_Tileset_Terrains(me.fs.open('tilesets/terrains.json').data)).on('load', function (tileset) {
                me.layers.terrains = this;
                me._onTilesetsReady();
            });

            me.addTileset(new AdvMap_Tileset_RoadsRivers(me.fs.open('tilesets/roads-rivers.json').data)).on('load', function (tileset) {
                me.layers.roads = this;
                me._onTilesetsReady();
            });
        })(this);

        this.emit('filesystem-ready');
    };

    AdvMap.prototype._onTilesetsReady = function () {
        for (var i = 0, len = this.tilesets.length; i < len; i++) {
            if (!this.tilesets[i].loaded)
                return;
        }

        this.emit('tilesets-ready');

        /* Initialize layers */
        (function (me) {
            me.layers.push((new Layer_Terrain(me, 0)).on('load', function () {
                me._onLayersReady();
            }));

            me.layers.push((new Layer_RoadsRivers(me, 1)).on('load', function () {
                me._onLayersReady();
            }));
        })(this);
    };

    AdvMap.prototype._onLayersReady = function () {
        var len, i;

        for (i = 0, len = this.layers.length; i < len; i++) {
            if (!this.layers[i].loaded)
                return;
        }

        this.emit('layers-ready');

        /* Initialize cells for the first time */
        this.setSize(this._iniCols, this._iniRows);

        /* Load layers */
        if (this._iniLayers) {
            for (i = 0, len = this._iniLayers.length; i < len; i++) {
                this.layers[i].setData(this._iniLayers[i]);
                this.layers[i].interactive = true;
            }
        }
    };

    AdvMap.prototype.setSize = function (columns, rows) {
        console.log("SetSize::begin");

        this.cols = columns;
        this.rows = rows;

        var needLen = columns * rows, len = this.cells.length * 1, numLayers = this.layers.length * 1;

        console.log("SetSize::resize begin");

        while (len != needLen) {
            if (len < needLen) {
                this.cells.push(new Cell(len, numLayers, this));
                len++;
            } else {
                this.cells.splice(len - 1, 1);
                len--;
            }
        }

        console.log("SetSize::compute neighbours");

        for (var i = 0; i < needLen; i++) {
            this.cells[i]._computeNeighbours();
        }

        console.log("SetSize:: emit resize");

        this.emit('resize', columns, rows);

        console.log("SetSize:: emit load");
        this.emit('load');

        console.log("SetSize:: END");
    };

    AdvMap.prototype.cellAt = function (column, row, strict) {
        if (typeof strict === "undefined") { strict = true; }
        if (column < 0 || column > this.cols - 1 || row < 0 || row > this.rows - 1) {
            if (!strict)
                return null;
            throw "Index " + column + "x" + row + " out of bounds (mapsize: " + this.cols + "x" + this.rows + ")";
        }

        return this.cells[row * this.cols + column];
    };

    AdvMap.prototype.dump = function () {
        var out = ["\n\nMAP.dump()"], line = [];

        for (var layer = 0, layers = this.layers.length; layer < layers; layer++) {
            out.push('Layer[' + layer + ']');

            for (var col = 0; col < this.cols; col++) {
                line = [];

                for (var row = 0; row < this.rows; row++) {
                    line.push(this.layers[layer].get(col, row));
                }

                out.push(JSON.stringify(line));
            }

            out.push("\n");
        }

        console.log(out.join("\n"));
    };

    AdvMap.prototype.getData = function () {
        var data = {
            "width": this.cols,
            "height": this.rows,
            "layers": []
        };

        for (var i = 0, len = this.layers.length; i < len; i++) {
            data.layers.push(this.layers[i].getData());
        }

        return data;
    };

    AdvMap.prototype.save = function (fname, callback) {
        var data = this.getData();

        // saves the map to disk.
        if (typeof global != 'undefined') {
            var fs = require('fs');

            fs.writeFile('resources/maps/' + fname, JSON.stringify(data), function (err) {
                callback(err);
            });
        } else {
            // JQuery submit to server
            $.ajax('tools/save-map.php', {
                'type': 'POST',
                'data': {
                    "data": JSON.stringify(data),
                    "file": fname
                },
                "success": function (result) {
                    if (!result.ok)
                        callback(result.error || "Unknown server side error");
                    else
                        callback();
                },
                "error": function () {
                    callback("Failed to save file (server error)!");
                }
            });
        }
    };

    AdvMap.prototype.addTileset = function (t) {
        this.tilesets.push(t);

        this.emit('tileset-added', {
            "data": t
        });

        return t;
    };

    AdvMap.prototype.addViewport = function (vp) {
        this.viewports.push(vp);
        return vp;
    };
    return AdvMap;
})(Events);
var Layer = (function (_super) {
    __extends(Layer, _super);
    function Layer(map, index) {
        _super.call(this);
        this.map = map;
        this.index = index;
        this.loaded = false;

        (function (me) {
            setTimeout(function () {
                me.loaded = true;
                me.emit('load');
            }, 10);
        })(this);
    }
    Layer.prototype.get = function (column, row) {
        return this.map.cellAt(column, row).layers[this.index];
    };

    Layer.prototype.set = function (column, row, data) {
        this.map.cellAt(column, row).layers[this.index] = data;
    };

    Layer.prototype.getData = function () {
        // not implemented
    };

    Layer.prototype.setData = function (data) {
        // not implemented
    };

    Layer.prototype.paint = function (cellCol, cellRow, x, y, ctx) {
    };
    return Layer;
})(Events);
var Layer_Terrain = (function (_super) {
    __extends(Layer_Terrain, _super);
    function Layer_Terrain(map, index) {
        _super.call(this, map, index);
        this.map = map;
        this.index = index;
        this.tiles = [];
        this.CT_SAND = 1;
        this.CT_DIRT = 0;
        this.CT_ABYSS = 4;
        this.bitsorder = [0, 1, 2, 3];
        // matrix correction bits
        this.mcb = [
            [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1],
            [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2],
            [1, 3], [2, 3], [7, 3], [8, 3],
            [1, 4], [2, 4], [7, 4], [8, 4],
            [1, 5], [2, 5], [7, 5], [8, 5],
            [1, 6], [2, 6], [7, 6], [8, 6],
            [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7],
            [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8]
        ];
        // matrix write bits
        this.mwb = [
            [3, 3], [4, 3], [5, 3], [6, 3],
            [3, 4], [4, 4], [5, 4], [6, 4],
            [3, 5], [4, 5], [5, 5], [6, 5],
            [3, 6], [4, 6], [5, 6], [6, 6]
        ];
        this._interactive = false;
        this._tilesList = [];

        this.tileset = this.map.tilesets[0];

        this._onInit();
    }
    Layer_Terrain.prototype.bits2hash = function (bits) {
        return bits[0] + ',' + bits[2] + ',' + bits[1] + ',' + bits[3];
    };

    Layer_Terrain.prototype.setBits = function (x, y, bits) {
        var tileIndex;
        if (x >= 0 && x < this.map.cols && y >= 0 && y < this.map.rows) {
            this.tiles[tileIndex = (y * this.map.rows + x)] = bits;

            this._tilesList[tileIndex] = bits ? this.tileset.getTileIdByHash(this.bits2hash(bits)) : null;
        }
    };

    Layer_Terrain.prototype.getBits = function (x, y, defaultBits) {
        if (x >= 0 && x < this.map.cols && y >= 0 && y < this.map.rows) {
            return this.tiles[y * this.map.rows + x] || [
                this.CT_SAND, this.CT_SAND, this.CT_SAND, this.CT_SAND
            ];
        } else
            return defaultBits === null ? [
                this.CT_SAND, this.CT_SAND, this.CT_SAND, this.CT_SAND
            ] : defaultBits;
    };

    Layer_Terrain.prototype.getMatrix = function (x, y, defaultBits) {
        var matrix = [
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null]
        ], bits;

        for (var row1 = -2, row = 0; row1 <= 2; row1++, row++) {
            for (var col1 = -2, col = 0; col1 <= 2; col1++, col++) {
                bits = this.getBits(x + col1, y + row1, defaultBits);

                matrix[col * 2][row * 2] = bits[0];
                matrix[col * 2][row * 2 + 1] = bits[1];
                matrix[col * 2 + 1][row * 2] = bits[2];
                matrix[col * 2 + 1][row * 2 + 1] = bits[3];
            }
        }

        return matrix;
    };

    Layer_Terrain.prototype.writeMatrix = function (x, y, matrix) {
        var bits;

        for (var row1 = -2, row = 0; row1 <= 2; row1++, row++) {
            for (var col1 = -2, col = 0; col1 <= 2; col1++, col++) {
                bits = [
                    matrix[col * 2][row * 2],
                    matrix[col * 2][row * 2 + 1],
                    matrix[col * 2 + 1][row * 2],
                    matrix[col * 2 + 1][row * 2 + 1]
                ];

                this.setBits(x + col1, y + row1, bits);
            }
        }
    };

    Layer_Terrain.prototype._onInit = function () {
        (function (me) {
            me.map.on('resize', function (cols, rows) {
                me.tiles = [];
                me.tilesList = [];

                for (var i = 0, len = cols * rows; i < len; i++) {
                    me.tiles.push(null);
                    me.tilesList.push(null);
                }
            });
        })(this);

        // @data is a tileset terrain id
        this.on('change', function (x, y, data) {
            if (!this._interactive)
                return;

            console.log('change: ', x, y);

            var matrix = this.getMatrix(x, y, [data, data, data, data]);

            for (var i = 0; i < 16; i++) {
                // console.log( "mwb: ", this.mwb[i][1], this.mwb[i][0] );
                matrix[this.mwb[i][1]][this.mwb[i][0]] = data;
            }

            for (var i = 0; i < 48; i++) {
                // console.log( "mcb: ", this.mcb[i][1], this.mcb[i][0] );
                matrix[this.mcb[i][1]][this.mcb[i][0]] = matrix[this.mcb[i][1]][this.mcb[i][0]] == data ? data : this.CT_SAND;
            }

            // write matrix
            this.writeMatrix(x, y, matrix);
        });
    };

    Layer_Terrain.prototype._getTerrain = function () {
        var out = [];
        for (var i = 0, len = this.map.cells.length; i < len; i++)
            out.push(this.map.cells[i].layers[this.index]);
        return out;
    };

    Layer_Terrain.prototype.getData = function () {
        return {
            "tiles": this.tiles,
            "terrain": this._getTerrain()
        };
    };

    Layer_Terrain.prototype.setData = function (data) {
        console.log("Terrain layer: begin set data");

        var old_interactive = this._interactive, i = 0, len = 0;

        this._interactive = false;

        if (data) {
            this.tiles = data.tiles;

            for (i = 0, len = this.tiles.length; i < len; i++) {
                this._tilesList[i] = this.tiles[i] ? this.tileset.getTileIdByHash(this.bits2hash(this.tiles[i])) : null;
            }

            for (i = 0, len = this.map.cells.length; i < len; i++) {
                this.map.cells[i].layers[this.index] = data.terrain[i];
            }
        }

        this._interactive = old_interactive;

        console.log("Terrain layer: end set data");
    };

    Object.defineProperty(Layer_Terrain.prototype, "interactive", {
        get: function () {
            return this._interactive;
        },
        set: function (value) {
            if (this._interactive != value) {
                this._interactive = value;
                this.emit('interactive', value);
            }
        },
        enumerable: true,
        configurable: true
    });


    Layer_Terrain.prototype.paint = function (cellCol, cellRow, x, y, ctx) {
        var tileId = this._tilesList[cellRow * this.map.rows + cellCol];
        if (tileId) {
            this.tileset.paintTile(tileId, ctx, x, y);
        }
    };
    return Layer_Terrain;
})(Layer);
var Layer_RoadsRivers = (function (_super) {
    __extends(Layer_RoadsRivers, _super);
    function Layer_RoadsRivers(map, index) {
        _super.call(this, map, index);
        this.map = map;
        this.index = index;
        this.tileset = null;
        this._interactive = null;

        this.tileset = this.map.tilesets[1];

        this._onInit();
    }
    Layer_RoadsRivers.prototype._onInit = function () {
        this.on('change', function (x, y, data) {
            if (!this._interactive)
                return;
        });
    };

    Object.defineProperty(Layer_RoadsRivers.prototype, "interactive", {
        get: function () {
            return this._interactive;
        },
        set: function (value) {
            if (this._interactive != value) {
                this._interactive = value;
                this.emit('interactive', value);
            }
        },
        enumerable: true,
        configurable: true
    });


    Layer_RoadsRivers.prototype.getData = function () {
        return null;
    };

    Layer_RoadsRivers.prototype.setData = function (data) {
        // not implemented
    };
    return Layer_RoadsRivers;
})(Layer);
var Cell = (function () {
    function Cell(cellIndex, numLayers, map) {
        this.map = null;
        this.index = 0;
        this.layers = {};
        this._neighbours = null;
        this.index = cellIndex;
        this.map = map;

        for (var i = 0; i < numLayers; i++) {
            // define getters and setters for the layer data
            (function (cell, index) {
                var nowVal = null;

                Object.defineProperty(cell.layers, index, {
                    "get": function () {
                        return nowVal;
                    },
                    "set": function (data) {
                        nowVal = data;
                        cell.map.layers[index].emit('change', cell.x, cell.y, data);
                    }
                });
            })(this, i);
        }
    }
    Object.defineProperty(Cell.prototype, "x", {
        get: function () {
            return this.index % this.map.cols;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Cell.prototype, "y", {
        get: function () {
            return ~~(this.index / this.map.rows);
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Cell.prototype, "neighbours", {
        get: function () {
            return this._neighbours;
        },
        enumerable: true,
        configurable: true
    });

    Cell.prototype._computeNeighbours = function () {
        var x = this.x, y = this.y;

        this._neighbours = {
            "n": this.map.cellAt(x, y - 1, false),
            "s": this.map.cellAt(x, y + 1, false),
            "w": this.map.cellAt(x - 1, y, false),
            "e": this.map.cellAt(x + 1, y, false),
            "nw": this.map.cellAt(x - 1, y - 1, false),
            "ne": this.map.cellAt(x + 1, y - 1, false),
            "sw": this.map.cellAt(x - 1, y + 1, false),
            "se": this.map.cellAt(x + 1, y + 1, false)
        };
    };

    Cell.prototype.paintAt = function (x, y, ctx) {
        var _x = this.x, _y = this.y;

        for (var i = 0, len = this.map.layers.length; i < len; i++) {
            this.map.layers[i].paint(_x, _y, x, y, ctx);
        }

        if (this == this.map.activeCell) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#f00';
            ctx.strokeRect(x + 1, y + 1, this.map.tilesets[0].tileWidth - 3, this.map.tilesets[0].tileHeight - 3);
        }
    };
    return Cell;
})();
var AdvMap_Tileset = (function (_super) {
    __extends(AdvMap_Tileset, _super);
    function AdvMap_Tileset(data) {
        _super.call(this);
        this.name = '';
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.loaded = false;
        this.terrains = [];
        this.tiles = {};
        this.hashes = {};
        this.sprite = null;
        this.tileRows = 0;
        this.tileCols = 0;
        this._canvas = null;
        this._ctxWriter = null;

        var len, i;

        if (data) {
            this.name = data.name;

            this.tileWidth = data.tilewidth;
            this.tileHeight = data.tileheight;

            this.tileCols = data.width / this.tileWidth;
            this.tileRows = data.height / this.tileHeight;

            this.sprite = new Picture(data.src);

            /* Build the internal canvas writer */
            if (typeof global == 'undefined') {
                this._canvas = document.createElement('canvas');
            } else {
                this._canvas = new (require('canvas'));
            }

            this._canvas.width = this.tileWidth;
            this._canvas.height = this.tileHeight;

            this._ctxWriter = this._canvas.getContext('2d');

            (function (me) {
                me.sprite.once('load', function () {
                    me.loaded = true;

                    me.emit('load', me);
                });
                me.sprite.once('error', function () {
                    me.emit('error');
                });
            })(this);

            this.tiles = data.tiles;
            this.hashes = data.hashes;

            for (i = 0, len = data.types.length; i < len; i++) {
                this.terrains.push(new AdvMap_TilesetTerrain(data.types[i], this));
            }

            for (i = 0, len = this.terrains.length; i < len; i++) {
                this.terrains[i]._computeAllowedNeighboursTerrains();
            }
            //console.log( 'loaded terrain: ', this.name, ': ', this.tileCols + 'x' + this.tileRows, " terrains: ", this.terrains.join( ", " ) );
        }
    }
    AdvMap_Tileset.prototype.getTileIdByHash = function (hash) {
        var len;

        if (this.hashes[hash] && (len = this.hashes[hash].length)) {
            return this.hashes[hash][~~(Math.random() * len)];
        } else
            return null;
    };

    AdvMap_Tileset.prototype.paintTile = function (tileId, ctx2d /*: CanvasRenderingContext2D */ , x, y) {
        if (this.loaded) {
            var sx, sy, sw, sh;

            sx = ~~(tileId % this.tileCols) * this.tileWidth;
            sy = ~~(tileId / this.tileCols) * this.tileHeight;

            /*
            console.log( "paintTile: ", tileId, "ctx2d.drawImage( ... ",
            sx,
            sy,
            sw = this.tileWidth,
            sh = this.tileHeight,
            x,
            y,
            sw,
            sh, ")" );
            */
            ctx2d.drawImage(this.sprite.node, sx, sy, sw = this.tileWidth, sh = this.tileHeight, x, y, sw, sh);
        }
    };

    AdvMap_Tileset.prototype.getTerrainById = function (terrainId) {
        return this.terrains[terrainId];
    };

    AdvMap_Tileset.prototype.getTileBase64Src = function (tileId) {
        if (this._ctxWriter) {
            this._ctxWriter.clearRect(0, 0, this.tileWidth, this.tileHeight);

            this.paintTile(tileId, this._ctxWriter, 0, 0);

            return this._canvas.toDataURL('image/png');
        } else
            return null;
    };
    return AdvMap_Tileset;
})(Events);
var AdvMap_TilesetTerrain = (function () {
    function AdvMap_TilesetTerrain(config, tileset) {
        this.tileset = tileset;
        this._validNeighbours = [];
        this.name = config.name;
        this.defaultTile = config.defaultTile;
        this.id = config.id;
        this.hash = config.hash;
    }
    AdvMap_TilesetTerrain.prototype.toString = function () {
        return this.id.toString();
    };

    AdvMap_TilesetTerrain.prototype._computeAllowedNeighboursTerrains = function () {
        var out = [], terrains = [];

        var tid;

        for (var tid in this.tileset.tiles) {
            terrains = this.tileset.tiles[tid].hash.split(',');

            terrains[0] = ~~terrains[0];
            terrains[1] = ~~terrains[1];
            terrains[2] = ~~terrains[2];
            terrains[3] = ~~terrains[3];

            if (terrains.indexOf(this.id) >= 0) {
                for (var k = 0; k < 4; k++) {
                    if (out.indexOf(terrains[k]) == -1) {
                        out.push(terrains[k]);
                    }
                }
            }
        }

        out.sort();

        for (var i = 0, len = out.length; i < len; i++) {
            out[i] = this.tileset.getTerrainById(out[i]);
        }

        this._validNeighbours = out;
    };

    Object.defineProperty(AdvMap_TilesetTerrain.prototype, "validNeighbours", {
        get: function () {
            return this._validNeighbours;
        },
        enumerable: true,
        configurable: true
    });
    return AdvMap_TilesetTerrain;
})();
var AdvMap_Tileset_Terrains = (function (_super) {
    __extends(AdvMap_Tileset_Terrains, _super);
    function AdvMap_Tileset_Terrains(data) {
        _super.call(this, data);
    }
    return AdvMap_Tileset_Terrains;
})(AdvMap_Tileset);
var AdvMap_Tileset_RoadsRivers = (function (_super) {
    __extends(AdvMap_Tileset_RoadsRivers, _super);
    function AdvMap_Tileset_RoadsRivers(data) {
        _super.call(this, data);
    }
    return AdvMap_Tileset_RoadsRivers;
})(AdvMap_Tileset);
var Viewport = (function (_super) {
    __extends(Viewport, _super);
    function Viewport(width, height, map) {
        _super.call(this);
        this.canvas = null;
        this.ctx = null;
        this.map = null;
        this._width = 0;
        this._height = 0;
        this.cols = 0;
        this.rows = 0;
        this.x = 0;
        this.y = 0;
        this.tileWidth = 0;
        this.tileHeight = 0;
        this.paintables = [];
        this._joystick = 0;
        this.loopPaint = function () {
            (function (me) {
                window.requestAnimationFrame(function () {
                    me.loopPaint();
                });
            })(this);

            this.ctx.fillStyle = 'rgb(255,255,255)';
            this.ctx.fillRect(0, 0, this._width, this._height);

            var x, y;

            for (var i = 0, len = this.paintables.length; i < len; i++) {
                x = (this.paintables[i].x - this.x) * this.tileWidth;
                y = (this.paintables[i].y - this.y) * this.tileHeight;
                this.paintables[i].paintAt(x, y, this.ctx);
            }
        };

        this.map = map;

        if (typeof global == 'undefined') {
            this.canvas = document.createElement('canvas');
        } else {
            var canvas = require('canvas');
            this.canvas = new canvas;
        }

        this.resize(width, height);

        this._setupMouseEvents();

        this.loopPaint();
    }
    Viewport.prototype.updatePaintables = function () {
        // determine the paintables objects
        var cx = this.x, cy = this.y, cx1 = this.x + this.cols, cy1 = this.y + this.rows;

        this.paintables = [];

        for (var x = cx; x <= cx1; x++)
            for (var y = cy; y < cy1; y++) {
                if (x >= 0 && y >= 0 && x < this.map.cols && y < this.map.rows)
                    this.paintables.push(this.map.cellAt(x, y));
            }
    };

    Viewport.prototype.resize = function (width, height) {
        this._width = width;
        this._height = height;

        this.canvas.width = this._width;
        this.canvas.height = this._height;

        this.ctx = this.canvas.getContext('2d');

        this.tileWidth = this.map.tilesets[0].tileWidth;
        this.tileHeight = this.map.tilesets[0].tileHeight;

        this.cols = ~~(this._width / this.map.tilesets[0].tileWidth);
        this.rows = ~~(this._height / this.map.tilesets[0].tileHeight);

        this.updatePaintables();

        console.log("resized viewport to: " + this._width + "x" + this._height + "px, cols=" + this.cols + ", rows=" + this.rows + ", " + this.paintables.length + " paintables in paint loop");
    };

    Viewport.prototype._setupMouseEvents = function () {
        if (typeof global != 'undefined')
            return;

        (function (me) {
            $(me.canvas).on('mousemove', function (evt) {
                var x = evt.offsetX, y = evt.offsetY, col = ~~(x / me.tileWidth) + me.x, row = ~~(y / me.tileHeight) + me.y, cell = me.map.cellAt(col, row, false);

                if (cell != me.map.activeCell)
                    me.map.activeCell = cell;
            });

            $(me.canvas).on('mouseout', function () {
                me.map.activeCell = null;
            });

            me.canvas.addEventListener('mousewheel', function (evt) {
                var delta = evt.wheelDelta || -evt.detail;

                delta = Math.abs(delta) >= 40 ? -(~~(delta / 40)) : delta;

                delta = delta > 0 ? 1 : (delta < 0 ? -1 : 0);

                if (delta == 0)
                    return;

                if (evt.shiftKey) {
                    me.x += delta;

                    if (me.x + me.cols >= me.map.cols - 1)
                        me.x = me.map.cols - me.cols - 1;

                    if (me.x < 0)
                        me.x = 0;
                } else {
                    me.y += delta;

                    if (me.y + me.rows >= me.map.rows)
                        me.y = me.map.rows - me.rows - 1;

                    if (me.y < 0)
                        me.y = 0;
                }

                me.updatePaintables();
            }, true);
        })(this);
    };
    return Viewport;
})(Events);
///<reference path="Events.ts" />
///<reference path="FS.ts" />
///<reference path="Picture.ts" />
///<reference path="FS/File.ts" />
///<reference path="AdvMap.ts" />
///<reference path="Layer.ts" />
///<reference path="Layer/Terrain.ts" />
///<reference path="Layer/RoadsRivers.ts" />
///<reference path="ICellNeighbours.ts" />
///<reference path="Cell.ts" />
///<reference path="AdvMap/Tileset.ts" />
///<reference path="AdvMap/TilesetTerrain.ts" />
///<reference path="AdvMap/Tileset/Terrains.ts" />
///<reference path="AdvMap/Tileset/RoadsRivers.ts" />
///<reference path="Viewport.ts" />
var map = new AdvMap(32, 32, 'test.map');

if (typeof window !== 'undefined')
    window['map'] = map;

map.on('tileset-added', function (e) {
    console.log("MAP:", "Tileset: ", e.data.name);
});

map.on('filesystem-ready', function () {
    console.log("FS :", "all files loaded successfully");
});

map.on('tilesets-ready', function () {
    console.log("MAP:", "tilesets operational");
});

map.on('layers-ready', function () {
    console.log("MAP:", "layers ready");
});

map.on('resize', function (width, height) {
    console.log("MAP: ", "resize to: " + width + "x" + height);
});

map.on('load', function () {
    console.log("map loaded");
});

map.fs.on('log', function (data) {
    console.log("FS :", data);
});
