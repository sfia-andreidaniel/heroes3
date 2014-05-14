class AdvMap extends Events {
    
    public tilesets     : AdvMap_Tileset[] = [];        // Array of AdvMap_Tileset
    public objects      : Objects       = null;
    public fs           : FS            = new FS();
    
    public cols         : number        = 0;
    public rows         : number        = 0;

    public layers       : Layer[]       = [];
    public cells        : Cell[]        = [];

    public _iniLayers   : any           = null;

    public viewports    : Viewport[]    = [];

    private _activeCell : Cell          = null;
    private _objectHandle : IObjectHandle = null;

    public  mapObjects  : Objects_Entity[] = [];

    public id           : number = 0;  // the id of the map on the server
    public name         : string = ''; // the name of the map on the server

    private _loadedOnce : boolean = false;

    private minimapsPaintDebouncer = null;

    public uniqueId: number = 0;

    public _activeObject: Objects_Entity = null;
    public _movementType: string = 'walk';


    constructor(  mapId: number = null, public _iniCols: number = 0, public _iniRows: number = 0 ) {
            
        super();
        
        ( function( me ) {
            

            me.fs.on( 'ready', function() {
                me._onFSReady();
            } );

            if ( window && window['$'] && window['$']['debounce'] ) {


                me.minimapsPaintDebouncer = $['debounce']( 250, function() {

                    for ( var i=0, len = me.viewports.length; i<len; i++ ) {
                        for ( var j = 0, n = me.viewports[i].minimaps.length; j < n; j++ ) {
                            me.viewports[i].minimaps[j].paint();
                        }
                    }

                });

            }

        } )( this );

        if ( mapId === null ) {
        
            this._loadFS();

            (function( me ) {
                setInterval( function() { me.tick(); }, 200 );    
            })( this );
            

        } else {

            console.log( "Loading map file: #" + mapId );

            this._iniCols = 0;
            this._iniRows = 0;

            var load = new FS_File( 'resources/tools/get-map.php?id=' + mapId, 'json' );

            ( function( me ) {

                load.once( 'ready', function() {

                    console.log( "Loaded map: " + this.data.width + "x" + this.data.height );

                    me._iniCols = this.data.width;
                    me._iniRows = this.data.height;
                    me._iniLayers = this.data.layers;

                    me.id = this.data.id || 0;
                    me.name = this.data.name || '';

                    me._loadFS();
                } );

                load.once( 'error', function() {
                    throw "Failed to initialize map! Map id " + mapId + " failed to load!";
                } );

                load.open();

                setInterval( function() { me.tick(); }, 200);

            })( this );

        }

        this.on( 'entity-create', function( entity ) {
            if ( entity )
            map.mapObjects.push( entity );
        });

        this.on( 'entity-destroy', function( entity ) {
            if ( entity )
            map.mapObjects.splice( map.mapObjects.indexOf( entity ), 1 );
        });

    }

    get movementType(): string {
        return this._movementType;
    }

    set movementType( mType: string ) {
        this._movementType = mType;
        this.emit( 'movement-type-changed', mType );
    }

    get activeObject(): Objects_Entity {
        return this._activeObject;
    }

    set activeObject( obj: Objects_Entity ) {
        this._activeObject = obj;
        this.emit( 'object-focus', obj );
    }

    /* Method where the animations are hooked */
    public tick() {
        for ( var i=0, len = this.mapObjects.length; i<len; i++ ) {
            if ( this.mapObjects[i].instance.animated )
                this.mapObjects[i].tick();
        }
    }

    get activeCell(): Cell {
        return this._activeCell;
    }

    set activeCell( c: Cell ) {
        if ( c != this._activeCell ) {
            this._activeCell = c;
            this.emit( 'selection-changed', c );
        }
    }

    get objectHandle(): IObjectHandle {
        return this._objectHandle;
    }

    set objectHandle( data: IObjectHandle ) {
        this._objectHandle = data || null;
    }

    public _loadFS() {
        /* Load filesystem data */
        this.fs.add( 'tilesets/terrains.json',     'resources/tilesets/terrains.tsx.json',     'json' );
        this.fs.add( 'tilesets/roads-rivers.json', 'resources/tilesets/roads-rivers.tsx.json', 'json' );
        this.fs.add( 'objects/all',                'resources/tools/objects.php',              'json', {});
    }

    public _onFSReady() {
        
        ( function( me ) {

            me.addTileset( new AdvMap_Tileset_Terrains( me.fs.open( 'tilesets/terrains.json' ).data ) )
                .once('load', function( tileset ) {
                    me.layers.terrains = this;
                    me._onTilesetsReady();
                });
        
            me.addTileset( new AdvMap_Tileset_RoadsRivers( me.fs.open( 'tilesets/roads-rivers.json' ).data ) )
                .once('load', function( tileset ) {
                    me.layers.roads = this;
                    me._onTilesetsReady();
                });

            ( new Objects( me.fs.open( 'objects/all' ).data ) )
                .once( 'load', function(){
                    me.objects = this;
                    me._onTilesetsReady();
                });

        })(this);

        this.emit( 'filesystem-ready' );

    }

    public _onTilesetsReady() {

        if ( !this.objects || !this.objects.loaded )
            return;

        for ( var i=0, len = this.tilesets.length; i<len; i++ ) {
            if ( !this.tilesets[i].loaded )
                return;
        }

        this.emit( 'tilesets-ready' );

        /* Initialize layers */
        ( function( me ) {

            me.layers.push( ( new Layer_Terrain( me, 0 ) ).on( 'load', function() {
                me._onLayersReady();
            } ));

            me.layers.push( ( new Layer_RoadsRivers( me, 1 ) ).on( 'load', function() {
                me._onLayersReady();
            } ));

            me.layers.push( ( new Layer_Entities( me, 2, 'Tileset objects' ) ).on( 'load', function() {
                me._onLayersReady();
            } ));

            me.layers.push( ( new Layer_Entities( me, 3, 'Moving objects' ) ).on( 'load', function() {
                me._onLayersReady();
            } ));

            me.layers.push( ( new Layer_Entities( me, 4, 'Flying objects' ) ).on( 'load', function() {
                me._onLayersReady();
            }) )

            me.layers.push( ( new Layer_Movement( me, 5 ) ).on( 'load', function() {
                me._onLayersReady();
                me.emit( 'movement-type-changed', me.movementType );
            } ));

        } )( this );
    }

    public _onLayersReady( ) {

        var len: number,
            i: number;

        for ( i=0, len = this.layers.length; i<len; i++ ) {
            if ( !this.layers[i].loaded )
                return;
        }

        this.emit( 'layers-ready' );

        /* Initialize cells for the first time */
        this.setSize( this._iniCols, this._iniRows );

        /* Load layers */
        if ( this._iniLayers ) {
            for ( i=0, len = this._iniLayers.length; i<len; i++ ) {
                this.layers[i].setData( this._iniLayers[i] );
                this.layers[i].interactive = true;
            }
        }

    }

    public loadMap( mapId: number, callback ) {

        if ( !this._loadedOnce )
            throw "The loadMap method should be used only after the first 'load' event occurs!";

        if ( !mapId || mapId < 0 )
            throw "Please specify a number gt 0";

        var f: FS_File = new FS_File( 'resources/tools/get-map.php?id=' + mapId, 'json' );

        ( function( me ) {

            f.once( 'ready', function() {
                
                var i: number,
                    len: number;

                // Setup all viewports to disabled, and clear their renderables
                for ( i=0, len = me.viewports.length; i<len; i++ ) {

                    me.viewports[i].disabled = true;
                    me.viewports[i].renderables = []; // empty the renderables of the viewports

                }

                // Re-load all the map data

                me.id = this.data.id || null;
                me.name = this.data.name || null;

                // Clear all existing objects
                me.mapObjects = [];

                me.setSize( me._iniCols = this.data.width, me._iniRows = this.data.height );

                /* Restore auto increment id */
                me.uniqueId = this.data.uniqueId || 0;

                /* Reset layers data */
                me._iniLayers = this.data.layers || [];

                for ( i=0, len = me.layers.length; i<len; i++ ) {
                    me.layers[i].interactive = false;
                    me.layers[i].setData( me._iniLayers[i] || null );
                    me.layers[i].interactive = true;
                }

                for ( i=0, len = me.viewports.length; i<len; i++ ) {

                    me.viewports[i].x = 0;
                    me.viewports[i].y = 0;
                    me.viewports[i].updatePaintables();
                    me.viewports[i].disabled = false;

                }

                ( callback || function() { console.log( "Map loaded" ); } )();

                me.renderMinimaps();

            });

        } )( this );

        f.once( 'error', function( reason ) {

            ( callback || function( reason ) {
                console.log( "Failed to load map: " + ( reason || "Unknown reason" ) );
            } )( reason );

        });

        f.open();

    }
    
    public setSize( columns: number, rows: number ) {
        this.cols = columns;
        this.rows = rows;

        var needLen = columns * rows,
            len = this.cells.length;

        while ( len != needLen ) {
            if ( len < needLen ) {
                this.cells.push( new Cell( len, this ) );
                len++;
            } else {
                this.cells.splice( len - 1, 1 );
                len--;
            }
        }


        for ( var i=0; i<needLen; i++ ) {
            this.cells[i]._computeNeighbours();
        }

        this.emit( 'resize', columns, rows );
        
        if ( !this._loadedOnce ){
            this.emit( 'load' );
            this._loadedOnce = true;    
        }
        
    }

    public cellAt( column: number, row: number, strict: boolean = true ): Cell {
        if ( column < 0 || column > this.cols - 1 || row < 0 || row > this.rows - 1 ) {
            if ( !strict ) return null;
            throw "Index " + column + "x" + row + " out of bounds (mapsize: " + this.cols + "x" + this.rows + ")";
        }

        return this.cells[ row * this.cols + column ];
    }

    public dump() {
        var out = [ "\n\nMAP.dump()"],
            line = [];

        for ( var layer=0, layers=this.layers.length; layer<layers; layer++ ) {
            
            out.push( 'Layer[' + layer + ']' );
            
            for ( var col=0; col<this.cols; col++ ) {
                
                line = [];

                for ( var row = 0; row < this.rows; row++ ) {
                    line.push( this.layers[layer].get( col, row ) );
                }

                out.push( JSON.stringify( line ) );
            }

            out.push( "\n" );
        }

        console.log( out.join( "\n" ) );
    }

    public getData() {

        var data = {
            "width": this.cols,
            "height": this.rows,
            "uniqueId": this.uniqueId,
            "layers": [
            ]
        };

        if ( this.name ) {
            data['name'] = this.name;
        }

        if ( this.id )
            data['id'] = this.id;

        for ( var i=0, len = this.layers.length; i<len; i++ ) {
            data.layers.push( this.layers[i].getData() );
        }

        return data;

    }

    public save( callback, id: number = null ) {

        callback = callback || function( reason ) {
            if ( reason ) {
                console.log( "Failed to save map: " + reason );
            } else {
                console.log( "Map saved" );
            }
        }

        this.id = id;

        if ( id === null ) {

                /* Invalidate all map objects */
                for ( var i=0, len = this.mapObjects.length; i < len; i++ )
                    this.mapObjects[i].setServerInstanceId( null );

                /* Generate a random file name, save it to disk. Import the
                   random file.
                 */

                var fname: string = 'resources/maps/' + ( 
                    this.name = ( 'map-' + ( new Date() ).getTime() + ".map" )
                );

                console.log( "About to save the map to disk as: ", fname );

                ( function( me ) {

                    me.saveToDisk( me.name, function( err ) {
                        if ( err ) {
                            callback( err );
                            return;
                        }

                        var f = new FS_File( 'resources/tools/load-map.php?file=' + ( 
                            typeof global == 'undefined'
                                ? '../../'
                                : ''
                        ) + fname, 'json' );

                        f.once( 'ready', function() {

                            if ( this.data.error || !this.data.ok || !this.data.id )
                                callback( this.data.error || 'unknown save error' );
                            else {
                                console.log( "Map saved as id: " + this.data.id );
                                me.id = this.data.id;
                                callback();
                            }

                        });

                        f.once( 'error', function( reason ) {
                            callback( 'Error saving file: ' + ( reason || 'unknown filesystem reason' ) );
                        });

                        f.open();

                    }, true );

                })( this );

        } else {

            if ( typeof global != 'undefined' ) {
            
                throw "Saving maps by id under node environments is not implemented!";
            
            } else {

                $.ajax( 'resources/tools/save-map-by-id.php', {
                    "type": "POST",
                    "data": {
                        "id": this.id,
                        "data": JSON.stringify( this.getData() )
                    },
                    "success": function( response ) {
                        if ( !response.ok ) {
                            callback( response.error || "Unknown save error" );
                        } else callback();
                    },
                    "error": function() {
                        callback( "Unknown map save error!" );
                    }
                } )

            }

        }

    }

    public saveToDisk( fname: string, callback, absolutePath: boolean = false ) {

        var data = this.getData();

        // saves the map to disk.
        if ( typeof global != 'undefined' ) {

            var fs = require( 'fs' );

            fs.writeFile( ( absolutePath ? '' : 'resources/maps/' ) + fname, JSON.stringify( data ), function( err ) {
                callback( err );
            });

        } else {

            // JQuery submit to server
            $.ajax( 'tools/save-map.php', {
                'type': 'POST',
                'data': {
                    "data": JSON.stringify( data ),
                    "file": fname
                },
                "success": function( result ) {
                    if ( !result.ok )
                        callback( result.error || "Unknown server side error" );
                    else
                        callback();
                },
                "error": function() {
                    callback( "Failed to save file (server error)!" );
                }
            } )
        }
    }

    public addTileset ( t: AdvMap_Tileset ) {
        this.tilesets.push( t );
        
        this.emit( 'tileset-added', {
            "data": t
        } );

        return t;
    }

    public addViewport( vp: Viewport ) /*: HTMLCanvasObject */ {
        this.viewports.push( vp );
        this.emit( 'add-viewport', vp );
        return vp;
    }

    public renderMinimaps() {
        if ( this.minimapsPaintDebouncer )
            this.minimapsPaintDebouncer();
    }
}