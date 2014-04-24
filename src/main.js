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
var GameMap_Image = (function (_super) {
    __extends(GameMap_Image, _super);
    function GameMap_Image(src) {
        _super.call(this);
        this.loaded = false;
        this.error = null;

        // Content
        this.node = document.createElement('img');

        (function (self) {
            self.node.onload = function () {
                self.loaded = true;
            };

            self.node.onerror = function () {
                self.error = 'Error loading image';
            };
        })(this);

        this.node.src = src;
    }
    return GameMap_Image;
})(Events);
/// <reference path="Events.ts" />
/// <reference path="FS/File.ts" />
/// <reference path="GameMap/Image.ts" />
var GameFS = (function (_super) {
    __extends(GameFS, _super);
    function GameFS() {
        _super.call(this);
        this.files = {};
        this.pending = 0;
        this.count = 0;
        this.cache = {};
        // Content
    }
    GameFS.prototype.add = function (localFS, realPath, loadAs) {
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

        this.files[localFS].open();

        return this.files[localFS];
    };

    GameFS.prototype.open = function (filePath) {
        console.log("GameFS: OpenFile: ", filePath);

        if (!this.files[filePath])
            throw "GameFS: File: " + filePath + " not found!";
        return this.files[filePath];
    };

    GameFS.prototype.unpackResource = function (href) {
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

    GameFS.prototype.createImage = function (packedResourceURL) {
        if (this.cache[packedResourceURL])
            return this.cache[packedResourceURL];

        var data = this.unpackResource(packedResourceURL), img = new GameMap_Image(data);

        return this.cache[packedResourceURL] = img;
    };
    return GameFS;
})(Events);
/// <reference path="../Events.ts" />
/// <reference path="../FS/File.ts" />
var GameMap_Terrain = (function (_super) {
    __extends(GameMap_Terrain, _super);
    function GameMap_Terrain(ownerMap, charCode, name, defaultTile) {
        _super.call(this);
        this.charCode = charCode;
        this.name = name;
        this.defaultTile = defaultTile;

        console.log("Terrain: ", this.name, " default tile: \"" + this.defaultTile, +"\"");
    }
    return GameMap_Terrain;
})(Events);
/// <reference path="../GameMap.ts" />
/// <reference path="Terrain.ts" />
/// <reference path="Image.ts" />
var GameMap_Cell = (function (_super) {
    __extends(GameMap_Cell, _super);
    function GameMap_Cell(map, x, y, terrain) {
        _super.call(this);
        this.map = map;
        this.x = x;
        this.y = y;
        this.terrain = terrain;
        // public x       : number
        // public y       : number
        //        map     : GameMap
        //        terrain : GameMap_Terrain
        this.hash = '';
        this._nwCell = null;
        this._nCell = null;
        this._neCell = null;
        this._wCell = null;
        this._eCell = null;
        this._swCell = null;
        this._sCell = null;
        this._seCell = null;
        this.background = null;
        this.isHovered = false;
    }
    GameMap_Cell.prototype.__computeCells = function () {
        this._nwCell = this.x > 0 && this.y > 0 ? this.map.cells[this.y - 1][this.x - 1] : null;
        this._nCell = this.y > 0 ? this.map.cells[this.y - 1][this.x] : null;
        this._neCell = this.x < this.map.width - 1 && this.y > 0 ? this.map.cells[this.y - 1][this.x + 1] : null;
        this._wCell = this.x > 0 ? this.map.cells[this.y][this.x - 1] : null;
        this._eCell = this.x < this.map.width - 1 ? this.map.cells[this.y][this.x + 1] : null;
        this._swCell = this.x > 0 && this.y < this.map.height - 1 ? this.map.cells[this.y + 1][this.x - 1] : null;
        this._sCell = this.y < this.map.height - 1 ? this.map.cells[this.y + 1][this.x] : null;
        this._seCell = this.x < this.map.width - 1 && this.y < this.map.height - 1 ? this.map.cells[this.y + 1][this.x + 1] : null;
    };

    GameMap_Cell.prototype.predominantNeighbourTerrain = function () {
        var terrains = [];

        if (this._nwCell)
            terrains[this._nwCell.terrain.charCode] = (terrains[this._nwCell.terrain.charCode] || 0) + 1;

        if (this._nCell)
            terrains[this._nCell.terrain.charCode] = (terrains[this._nCell.terrain.charCode] || 0) + 1;

        if (this._neCell)
            terrains[this._neCell.terrain.charCode] = (terrains[this._neCell.terrain.charCode] || 0) + 1;

        if (this._sCell)
            terrains[this._sCell.terrain.charCode] = (terrains[this._sCell.terrain.charCode] || 0) + 1;

        if (this._wCell)
            terrains[this._wCell.terrain.charCode] = (terrains[this._wCell.terrain.charCode] || 0) + 1;

        if (this._swCell)
            terrains[this._swCell.terrain.charCode] = (terrains[this._swCell.terrain.charCode] || 0) + 1;

        if (this._eCell)
            terrains[this._eCell.terrain.charCode] = (terrains[this._eCell.terrain.charCode] || 0) + 1;

        if (this._seCell)
            terrains[this._seCell.terrain.charCode] = (terrains[this._seCell.terrain.charCode] || 0) + 1;

        var max = 0, ret = this.terrain;

        for (var t in terrains)
            if (terrains[t] > max) {
                max = terrains[t];
                ret = this.map.getTerrainByCharCode(t);
            }

        return ret;
    };

    GameMap_Cell.prototype.hasInvalidTerrain = function () {
        return (!this.cellTerrainIs(this._nwCell, this.terrain) && !this.cellTerrainIs(this._nCell, this.terrain) && !this.cellTerrainIs(this._neCell, this.terrain) && !this.cellTerrainIs(this._eCell, this.terrain) && !this.cellTerrainIs(this._seCell, this.terrain) && !this.cellTerrainIs(this._sCell, this.terrain) && !this.cellTerrainIs(this._swCell, this.terrain) && !this.cellTerrainIs(this._wCell, this.terrain));
    };

    GameMap_Cell.prototype.cellTerrainIs = function (cell, terrain) {
        return !cell ? true : cell.terrain == terrain;
    };

    GameMap_Cell.prototype.__buildHash = function () {
        var bgTiles = [];

        this.hash = '';

        this.hash += (this._nwCell === null ? '_' : this._nwCell.terrain.charCode);
        this.hash += (this._nCell === null ? '_' : this._nCell.terrain.charCode);
        this.hash += (this._neCell === null ? '_' : this._neCell.terrain.charCode);
        this.hash += (this._wCell === null ? '_' : this._wCell.terrain.charCode);
        this.hash += (this.terrain.charCode);
        this.hash += (this._eCell === null ? '_' : this._eCell.terrain.charCode);
        this.hash += (this._swCell === null ? '_' : this._swCell.terrain.charCode);
        this.hash += (this._sCell === null ? '_' : this._sCell.terrain.charCode);
        this.hash += (this._seCell === null ? '_' : this._seCell.terrain.charCode);

        // compute the resource tileset to be placed on the map
        this.background = null;

        bgTiles = this.map.styles.land.querySelector(this.hash);

        this.background = this.map.FS.createImage(bgTiles === null ? this.terrain.defaultTile : bgTiles[~~(Math.random() * bgTiles.length)]);
    };

    GameMap_Cell.prototype.paintAt = function (viewport, ctxX, ctxY) {
        // paint the cell on a canvas context
        if (this.background) {
            if (this.background.loaded)
                viewport.ctx.drawImage(this.background.node, ctxX, ctxY);
        }
    };
    return GameMap_Cell;
})(Events);
/// <reference path="../GameMap.ts" />
var GameMap_Viewport = (function (_super) {
    __extends(GameMap_Viewport, _super);
    function GameMap_Viewport(map, width, height) {
        _super.call(this);
        this.map = map;
        // public map: GameMap
        // public width: number
        // public height: number
        // physical map dimensions
        this.mapWidthPX = 0;
        this.mapHeightPX = 0;
        this.vpWidth = 0;
        this.vpHeight = 0;
        this.vpX = 0;
        this.vpY = 0;
        // the canvas and it's context
        this.canvas = null;
        this.ctx = null;
        // here we store the elements that should be painted
        // on the game paint loop
        this.renderables = [];
        // the joistick var is used to scroll the game when the mouse
        // enters the borders
        this.joystick = 0;

        (function (viewport, map) {
            map.on('map-loaded', function () {
                viewport.onMapLoaded();
            });
        })(this, this.map);
    }
    GameMap_Viewport.prototype.viewportXYtoTile = function (x, y) {
        var col = ~~((this.vpX + x) / 32), row = ~~((this.vpY + y) / 32);

        if (col < this.map.width && row < this.map.height)
            return this.map.cells[row][col];
        else
            return null;
    };

    // the onScroll function computes the renderable objects
    GameMap_Viewport.prototype.onScroll = function (newVPx, newVPy) {
        newVPx = newVPx < 0 ? 0 : newVPx;
        newVPy = newVPy < 0 ? 0 : newVPy;

        var mapTileX = ~~(newVPx / 32), mapTileY = ~~(newVPy / 32);

        mapTileX = mapTileX > this.map.width - 1 ? this.map.width - 1 : mapTileX;
        mapTileY = mapTileY > this.map.height - 1 ? this.map.height - 1 : mapTileY;

        var mapTileX1 = mapTileX + ~~(this.vpWidth / 32), mapTileY1 = mapTileY + ~~(this.vpHeight / 32);

        mapTileX1 = mapTileX1 > this.map.width - 1 ? this.map.width - 1 : mapTileX1;
        mapTileY1 = mapTileY1 > this.map.height - 1 ? this.map.height - 1 : mapTileY1;

        this.renderables = [];

        for (var row = mapTileY; row < mapTileY1; row++) {
            for (var col = mapTileX; col < mapTileX1; col++) {
                this.renderables.push(this.map.cells[row][col]);
            }
        }

        //console.log( "onScroll: " + this.renderables.length + " cells" );
        this.vpX = newVPx;
        this.vpY = newVPy;
    };

    GameMap_Viewport.prototype.onMapLoaded = function () {
        this.mapWidthPX = 32 * this.map.width;
        this.mapHeightPX = 32 * this.map.height;

        this.canvas = $('#game > canvas').get(0);
        this.ctx = this.canvas.getContext('2d');

        this.vpWidth = this.canvas.offsetWidth;
        this.vpHeight = this.canvas.offsetHeight;

        this.emit('dom-initialization');

        (function (viewport) {
            $(viewport.canvas).on('mousemove', function (event) {
                var x = event.offsetX, y = event.offsetY, cell = viewport.viewportXYtoTile(x, y);

                if (cell) {
                    viewport.map.emit('cell-mousemove', {
                        "cell": cell
                    });
                }
            });

            $(viewport.canvas).on('click', function (event) {
                var x = event.offsetX, y = event.offsetY, cell = viewport.viewportXYtoTile(x, y);

                if (cell) {
                    viewport.map.emit('cell-click', {
                        "cell": cell,
                        "which": event.which
                    });
                }
            });

            $(viewport.canvas).on('mousedown', function (event) {
                var x = event.offsetX, y = event.offsetY, cell = viewport.viewportXYtoTile(x, y);

                if (cell) {
                    viewport.map.emit('cell-mousedown', {
                        "cell": cell,
                        "which": event.which
                    });
                }
            });

            $(viewport.canvas).on('mouseup', function (event) {
                var x = event.offsetX, y = event.offsetY, cell = viewport.viewportXYtoTile(x, y);

                if (cell) {
                    viewport.map.emit('cell-mouseup', {
                        "cell": cell,
                        "which": event.which
                    });
                }
            });

            $(viewport.canvas).on('dblclick', function (event) {
                var x = event.offsetX, y = event.offsetY, cell = viewport.viewportXYtoTile(x, y);

                if (cell) {
                    viewport.map.emit('cell-dblclick', {
                        "cell": cell,
                        "which": event.which
                    });
                }
            });

            $('#game > .border.n').mouseenter(function (evt) {
                if (!evt.shiftKey)
                    return;
                viewport.joystick = 1; // north
                console.log('joystick: north');
            });

            $('#game > .border.e').mouseenter(function (evt) {
                if (!evt.shiftKey)
                    return;
                viewport.joystick = 2; // east
                console.log('joystick: east');
            });

            $('#game > .border.s').mouseenter(function (evt) {
                if (!evt.shiftKey)
                    return;
                viewport.joystick = 3; //south
                console.log('joystick: south');
            });

            $('#game > .border.w').mouseenter(function (evt) {
                if (!evt.shiftKey)
                    return;
                viewport.joystick = 4; // west
                console.log('joystick: east');
            });

            $('#game > .border.nw').mouseenter(function (evt) {
                if (!evt.shiftKey)
                    return;
                viewport.joystick = 5; // north-west
                console.log('joystick: north-west');
            });

            $('#game > .border.ne').mouseenter(function (evt) {
                if (!evt.shiftKey)
                    return;
                viewport.joystick = 6; // north-east
                console.log('joystick: north-east');
            });

            $('#game > .border.se').mouseenter(function (evt) {
                if (!evt.shiftKey)
                    return;
                viewport.joystick = 7; //south-east
                console.log('joystick: south-east');
            });

            $('#game > .border.sw').mouseenter(function (evt) {
                if (!evt.shiftKey)
                    return;
                viewport.joystick = 8; // south-west
                console.log('joystick: south-west');
            });

            $('#game > canvas').mouseenter(function () {
                viewport.joystick = 0;
                console.log('joystick: normal');
            });

            setInterval(function () {
                viewport._joystick();
            }, 50);
        })(this);

        this.onScroll(0, 0);

        this.paint();

        eval('window.gameVp = this;');
    };

    GameMap_Viewport.prototype.paint = function () {
        this.ctx.fillStyle = "rgb(0,0,0)";

        this.ctx.fillRect(0, 0, this.vpWidth, this.vpHeight);

        for (var i = 0, len = this.renderables.length; i < len; i++) {
            this.renderables[i].paintAt(this, (this.renderables[i].x * 32) - this.vpX, (this.renderables[i].y * 32) - this.vpY);
        }

        var myself = this;

        requestAnimationFrame(function () {
            myself.paint.call(myself);
        });
    };

    GameMap_Viewport.prototype._joystick = function () {
        var relX = 0, relY = 0;

        switch (this.joystick) {
            case 0:
                return;
                break;

            case 1:
                relY = -32;
                break;

            case 2:
                relX = 32;
                break;

            case 3:
                relY = 32;
                break;

            case 4:
                relX = -32;
                break;

            case 5:
                relX = -32;
                relY = -32;
                break;

            case 6:
                relX = 32;
                relY = -32;
                break;

            case 7:
                relX = 32;
                relY = 32;
                break;

            case 8:
                relX = -32;
                relY = 32;
                break;
        }

        //console.log( "Joystick: relativeX = ", relX, ' relativeY = ', relY );
        this.vpX += relX;
        this.vpY += relY;

        if (this.vpX < 0)
            this.vpX = 0;

        if (this.vpX + this.vpWidth > this.mapWidthPX)
            this.vpX = this.mapWidthPX - this.vpWidth;

        if (this.vpY + this.vpHeight > this.mapHeightPX)
            this.vpY = this.mapHeightPX - this.vpHeight;

        this.scrollToXY(this.vpX, this.vpY);
    };

    GameMap_Viewport.prototype.scrollToXY = function (x, y) {
        this.onScroll(x, y);
    };
    return GameMap_Viewport;
})(Events);
/// <reference path="../Events.ts" />
var Matrix_StyleSheet = (function (_super) {
    __extends(Matrix_StyleSheet, _super);
    function Matrix_StyleSheet(map, fileData, selectorLength, name) {
        if (typeof name === "undefined") { name = "unnamed"; }
        _super.call(this);
        this.map = map;
        this.selectorLength = selectorLength;
        this.rules = {};

        var lines = fileData.split("\n"), selector, value, matches;

        for (var i = 0, len = lines.length; i < len; i++) {
            if (matches = /^([\s]+)?([a-z\d_\*]+)[\s]+([\S]+)([\s]+)?$/i.exec(lines[i])) {
                selector = matches[2];
                value = matches[3];

                this.addSelector(selector, value, false);
            }
        }

        console.log("Loaded matrix stylesheet: " + name + ", selectorLength: " + this.selectorLength);
    }
    Matrix_StyleSheet.prototype.querySelector = function (hash) {
        return this.rules[hash] || null;
    };

    Matrix_StyleSheet.prototype.addSelector = function (rule, value, triggerMapUpdate) {
        if (typeof triggerMapUpdate === "undefined") { triggerMapUpdate = true; }
        if (rule.length != this.selectorLength)
            throw "Failed to add selector, selector value is ne with this matrix stylesheet selector length.";

        if (this.rules[rule]) {
            if (this.rules[rule].indexOf(value) == -1)
                this.rules[rule].push(value);
        } else {
            this.rules[rule] = [value];
        }

        if (triggerMapUpdate)
            this.map.emit('mss-changed', rule);
    };

    Matrix_StyleSheet.prototype.removeSelector = function (rule, value) {
        if (this.rules[rule]) {
            for (var i = 0, len = this.rules[rule].length; i < len; i++)
                if (this.rules[rule][i] == value) {
                    this.rules[rule].splice(i, 1);

                    if (this.rules[rule].length == 0)
                        delete this.rules[rule];

                    this.map.emit('mss-changed', rule);
                    return;
                }
        }
    };

    Matrix_StyleSheet.prototype.getStyleSheet = function () {
        var out = [];

        for (var k in this.rules) {
            if (this.rules.propertyIsEnumerable(k)) {
                for (var i = 0, len = this.rules[k].length; i < len; i++)
                    out.push(k + ' ' + this.rules[k][i]);
            }
        }

        return out.join('\n');
    };
    return Matrix_StyleSheet;
})(Events);
/// <reference path="GameMap/Terrain.ts" />
/// <reference path="Events.ts" />
/// <reference path="GameMap/Cell.ts" />
/// <reference path="GameMap/Viewport.ts" />
/// <reference path="Matrix/StyleSheet.ts" />
var GameMap = (function (_super) {
    __extends(GameMap, _super);
    function GameMap(FS, FSMapFile) {
        _super.call(this);
        this.FS = FS;
        // public FS        : GameFS
        // public FSMapFile : string = 'map.json';
        this.terrains = {};
        this.styles = {};
        this.cells = [];
        this.width = 0;
        this.height = 0;
        this.viewport = null;

        (function (myself) {
            myself.FS.on('available', function () {
                var cfg = this.open('cfg/map');

                for (var i = 0, len = cfg.data.terrains.length; i < len; i++) {
                    console.log("GameMap: Init terrain type: ", cfg.data.terrains[i].name);

                    myself.terrains[cfg.data.terrains[i].name] = new GameMap_Terrain(myself, cfg.data.terrains[i].code, cfg.data.terrains[i].name, cfg.data.terrains[i].defaultTile);
                }

                for (var i = 0, len = cfg.data.styles.length; i < len; i++) {
                    console.log("GameMap: Init matrix stylesheet: ", cfg.data.styles[i].name);

                    myself.styles[cfg.data.styles[i].name] = new Matrix_StyleSheet(myself, this.open(cfg.data.styles[i].path).data, cfg.data.styles[i].selectorLength, cfg.data.styles[i].name);
                }

                myself.loadMap(FSMapFile);

                console.log("GameMap: initialized");
            });
        })(this);

        this.on('mss-changed', function (mssSelector) {
            this.onMSSChanged(mssSelector, true);
        });

        this.on('cells-changed', function () {
            this.onCellsChanged();
        });
    }
    // triggered when a matrix stylesheet chages
    GameMap.prototype.onMSSChanged = function (selector) {
        for (var col = 0; col < this.width; col++) {
            for (var row = 0; row < this.height; row++) {
                if (this.cells[row][col].hash == selector)
                    this.cells[row][col].__buildHash(this.width, this.height);
            }
        }
    };

    GameMap.prototype.getTerrainByCharCode = function (terrainCharCode) {
        for (var t in this.terrains)
            if (this.terrains[t].charCode == terrainCharCode)
                return this.terrains[t];

        return null;
    };

    GameMap.prototype.onCellsChanged = function (xCenter, yCenter, radius) {
        if (typeof xCenter === "undefined") { xCenter = null; }
        if (typeof yCenter === "undefined") { yCenter = null; }
        if (typeof radius === "undefined") { radius = 4; }
        var colStart, colEnd, rowStart, rowEnd, badTerrain = false;

        do {
            badTerrain = false;

            if (xCenter === null || yCenter == null) {
                for (var row = 0; row < this.height; row++) {
                    for (var col = 0; col < this.width; col++) {
                        if (this.cells[row][col].hasInvalidTerrain()) {
                            badTerrain = true;
                            this.cells[row][col].terrain = this.cells[row][col].predominantNeighbourTerrain();
                            break;
                        }
                        this.cells[row][col].__buildHash(this.width, this.height);
                    }
                    if (badTerrain)
                        break;
                }
            } else {
                colStart = (xCenter - radius > 0) ? xCenter - radius : 0;
                rowStart = (yCenter - radius > 0) ? yCenter - radius : 0;

                colEnd = (xCenter + radius) < this.width ? xCenter + radius : this.width - 1;
                rowEnd = (yCenter + radius) < this.height ? yCenter + radius : this.height - 1;

                for (var row = rowStart; row <= rowEnd; row++) {
                    for (var col = colStart; col <= colEnd; col++) {
                        if (this.cells[row][col].hasInvalidTerrain()) {
                            badTerrain = true;
                            this.cells[row][col].terrain = this.cells[row][col].predominantNeighbourTerrain();
                            break;
                        }
                        this.cells[row][col].__buildHash(this.width, this.height);
                    }

                    if (badTerrain)
                        break;
                }
            }
        } while(badTerrain);
    };

    GameMap.prototype.loadMap = function (FSMapFile) {
        var data = this.FS.open(FSMapFile).data;
        var bindings = {};
        var lines;
        var cellsRow;

        this.width = data.width;
        this.height = data.height;

        for (var t in this.terrains)
            bindings[this.terrains[t].charCode] = this.terrains[t];

        lines = data.land.split("\n");

        for (var row = 0; row < this.height; row++) {
            cellsRow = [];

            for (var col = 0; col < this.width; col++) {
                cellsRow.push(new GameMap_Cell(this, col, row, bindings[lines[row].charAt(col)]));
            }

            this.cells.push(cellsRow);
        }

        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                this.cells[row][col].__computeCells();
            }
        }

        this.onCellsChanged();

        this.emit('map-loaded');
    };
    return GameMap;
})(Events);
/// <reference path="GameFS.ts" />
/// <reference path="GameMap.ts" />
var fs = new GameFS(), map = new GameMap(fs, 'maps/rnd01');

if (typeof document != 'undefined')
    map.viewport = new GameMap_Viewport(map, 800, 600);

fs.on('log', function (msg) {
    console.log(msg);
});

fs.on('available', function () {
    console.log('GameFS is available');
});

map.on('map-loaded', function () {
    console.log('map was loaded: ', this.width, this.height);
});

fs.add('cfg/map', 'resources/cfg/map.json', 'json');

fs.add('terrains/dirt', 'resources/terrains/_build/dirt.json', 'json');
fs.add('terrains/lava', 'resources/terrains/_build/lava.json', 'json');
fs.add('terrains/grass', 'resources/terrains/_build/grass.json', 'json');
fs.add('terrains/rockie', 'resources/terrains/_build/rockie.json', 'json');
fs.add('terrains/rough', 'resources/terrains/_build/rough.json', 'json');
fs.add('terrains/sand', 'resources/terrains/_build/sand.json', 'json');
fs.add('terrains/snow', 'resources/terrains/_build/snow.json', 'json');
fs.add('terrains/subteranean', 'resources/terrains/_build/subteranean.json', 'json');
fs.add('terrains/swamp', 'resources/terrains/_build/swamp.json', 'json');
fs.add('terrains/water', 'resources/terrains/_build/water.json', 'json');

fs.add('styles/land', 'resources/styles/land.mss', 'text');

fs.add('maps/rnd01', 'resources/maps/rnd01.json', 'json');
