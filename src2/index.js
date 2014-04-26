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
        if (typeof global != 'undefined') {
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
    function AdvMap(_iniCols, _iniRows) {
        _super.call(this);
        this._iniCols = _iniCols;
        this._iniRows = _iniRows;
        this.tilesets = [];
        this.fs = new FS();
        this.cols = 0;
        this.rows = 0;
        this.layers = [];
        this.cells = [];

        (function (me) {
            me.fs.on('ready', function () {
                me._onFSReady();
            });
        })(this);
    }
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
        })(this);
    };

    AdvMap.prototype._onLayersReady = function () {
        for (var i = 0, len = this.layers.length; i < len; i++) {
            if (!this.layers[i].loaded)
                return;
        }

        this.emit('layers-ready');

        /* Initialize cells for the first time */
        this.setSize(this._iniCols, this._iniRows);
    };

    AdvMap.prototype.setSize = function (columns, rows) {
        this.cols = columns;
        this.rows = rows;

        var needLen = columns * rows, len = this.cells.length, numLayers = this.layers.length;

        while (len != needLen) {
            if (len < needLen) {
                this.cells.push(new Cell(len, numLayers, this));
                len++;
            } else {
                this.cells.splice(len - 1, 1);
                len--;
            }
        }

        for (var i = 0; i < needLen; i++) {
            this.cells[i]._computeNeighbours();
        }

        this.emit('resize', columns, rows);
        this.emit('load');
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

    AdvMap.prototype.addTileset = function (t) {
        this.tilesets.push(t);

        this.emit('tileset-added', {
            "data": t
        });

        return t;
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

        this.tileset = this.map.tilesets[0];

        this._onInit();
    }
    Layer_Terrain.prototype.compute = function (x, y, radius) {
        if (typeof radius === "undefined") { radius = 4; }
        var x1 = x - radius, y1 = y - radius, x2 = x + radius, y2 = y + radius, bits, nBits, sBits, wBits, eBits, neBits, nwBits, seBits, swBits, computed = false;

        x1 = x1 < 0 ? 0 : (x1 >= this.map.cols ? this.map.cols - 1 : x1);
        y1 = y1 < 0 ? 0 : (y1 >= this.map.rows ? this.map.rows - 1 : y1);
        x2 = x2 < x1 ? x1 : (x2 >= this.map.cols ? this.map.cols - 1 : x2);
        y2 = y2 < y1 ? y1 : (y2 >= this.map.rows ? this.map.rows - 1 : y2);

        for (var col = x1; col <= x2; col++) {
            for (var row = y1; row <= y2; row++) {
                bits = this.getBits(col, row, null);

                nBits = this.getBits(col, row - 1, bits);
                sBits = this.getBits(col, row + 1, bits);
                wBits = this.getBits(col - 1, row, bits);
                eBits = this.getBits(col + 1, row, bits);

                neBits = this.getBits(col + 1, row - 1, bits);
                nwBits = this.getBits(col - 1, row - 1, bits);
                seBits = this.getBits(col + 1, row + 1, bits);
                swBits = this.getBits(col - 1, row + 1, bits);
            }
        }
    };

    Layer_Terrain.prototype.setBits = function (x, y, bits) {
        if (x >= 0 && x < this.map.cols && y >= 0 && y < this.map.rows)
            this.tiles[y * this.map.rows + x] = bits;
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

    Layer_Terrain.prototype._onInit = function () {
        (function (me) {
            me.map.on('resize', function (cols, rows) {
                for (var i = 0, len = cols * rows; i < len; i++)
                    me.tiles.push(null);

                // console.log( "Layer_Terrain: reinitialized tile data" );
                me.compute(0, 0, Math.max(this.cols, this.rows));
            });
        })(this);

        this.on('change', function (x, y, data) {
            console.log('change: ', x, y);

            var bits, bits1;

            this.setBits(x, y, bits = [data, data, data, data]);

            bits1 = this.getBits(x - 1, y - 1, bits);
            bits1[3] = bits[0];
            this.setBits(x - 1, y - 1, bits1);

            bits1 = this.getBits(x, y - 1, bits);
            bits1[2] = bits[0];
            bits1[3] = bits[1];
            this.setBits(x, y - 1, bits1);

            bits1 = this.getBits(x + 1, y - 1, bits);
            bits1[2] = bits[1];
            this.setBits(x + 1, y - 1, bits1);

            bits1 = this.getBits(x - 1, y, bits);
            bits1[1] = bits[0];
            bits1[3] = bits[2];
            this.setBits(x - 1, y, bits1);

            bits1 = this.getBits(x + 1, y, bits);
            bits1[0] = bits[1];
            bits1[2] = bits[3];
            this.setBits(x + 1, y, bits1);

            bits1 = this.getBits(x - 1, y + 1, bits);
            bits1[1] = bits[2];
            this.setBits(x - 1, y + 1, bits1);

            bits1 = this.getBits(x, y + 1, bits);
            bits1[0] = bits[2];
            bits1[1] = bits[3];
            this.setBits(x, y + 1, bits1);

            bits1 = this.getBits(x + 1, y + 1);
            bits1[0] = bits[3];
            this.setBits(x + 1, y + 1, bits);

            this.compute(x, y, 1);
        });
    };
    return Layer_Terrain;
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
        this.sprite = null;
        this.tileRows = 0;
        this.tileCols = 0;

        if (data) {
            this.name = data.name;

            this.tileWidth = data.tilewidth;
            this.tileHeight = data.tileheight;

            this.tileCols = data.width / this.tileWidth;
            this.tileRows = data.height / this.tileHeight;

            this.sprite = new Picture(data.src);

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

            for (var i = 0, len = data.types.length; i < len; i++) {
                this.terrains.push(new AdvMap_TilesetTerrain(data.types[i], this));
            }
            //console.log( 'loaded terrain: ', this.name, ': ', this.tileCols + 'x' + this.tileRows, " terrains: ", this.terrains.join( ", " ) );
        }
    }
    AdvMap_Tileset.prototype.paintTile = function (tileId, ctx2d /*: CanvasRenderingContext2D */ , x, y) {
        if (this.loaded && this.tiles[tileId]) {
            var sx, sy, sw, sh;

            sx = (this.tileCols % tileId) * this.tileWidth;
            sy = ~~(this.tileRows / tileId) * this.tileHeight;

            ctx2d.drawImage(this.sprite.node, sx, sy, sw = this.tileWidth, sh = this.tileHeight, x, y, sw, sh);
        }
    };
    return AdvMap_Tileset;
})(Events);
var AdvMap_TilesetTerrain = (function () {
    function AdvMap_TilesetTerrain(config, tileset) {
        this.tileset = tileset;
        this.name = config.name;
        this.defaultTile = config.defaultTile;
        this.id = config.id;
        this.hash = config.hash;
    }
    AdvMap_TilesetTerrain.prototype.toString = function () {
        return this.name;
    };
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
///<reference path="Events.ts" />
///<reference path="FS.ts" />
///<reference path="Picture.ts" />
///<reference path="FS/File.ts" />
///<reference path="AdvMap.ts" />
///<reference path="Layer.ts" />
///<reference path="Layer/Terrain.ts" />
///<reference path="ICellNeighbours.ts" />
///<reference path="Cell.ts" />
///<reference path="AdvMap/Tileset.ts" />
///<reference path="AdvMap/TilesetTerrain.ts" />
///<reference path="AdvMap/Tileset/Terrains.ts" />
///<reference path="AdvMap/Tileset/RoadsRivers.ts" />
var map = new AdvMap(10, 10);

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
    map.cellAt(0, 0).layers[0] = 2;
    console.log(map.layers[0].getBits(0, 0));
    console.log(map.layers[0].getBits(1, 0));
    console.log(map.layers[0].getBits(0, 1));
    console.log(map.layers[0].getBits(1, 1));
});

map.fs.on('log', function (data) {
    console.log("FS :", data);
});

/* Load game files */
map.fs.add('tilesets/terrains.json', 'resources/tilesets/terrains.tsx.json', 'json');
map.fs.add('tilesets/roads-rivers.json', 'resources/tilesets/roads-rivers.tsx.json', 'json');
/* Setup Map Data*/ 