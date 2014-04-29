class AdvMap extends Events {
    
    public tilesets     : AdvMap_Tileset[] = [];        // Array of AdvMap_Tileset
    public fs           : FS            = new FS();
    
    public cols         : number        = 0;
    public rows         : number        = 0;

    public layers       : Layer[]       = [];
    public cells        : Cell[]        = [];

    public _iniLayers   : any           = null;

    public viewports    : Viewport[]    = [];

    private _activeCell : Cell          = null;

    constructor(  public _iniCols: number = 0, public _iniRows: number = 0, mapFile: string = null ) {
            
        super();
        
        ( function( me ) {
            me.fs.on( 'ready', function() {
                me._onFSReady();
            } );
        } )( this );

        if ( mapFile === null ) {
        
            this._loadFS();
        
        } else {

            console.log( "Loading map file: ", 'resources/maps/' + mapFile );

            this._iniCols = 0;
            this._iniRows = 0;

            var load = new FS_File( 'resources/maps/' + mapFile, 'json' );

            ( function( me ) {

                load.once( 'ready', function() {

                    console.log( "Loaded map: " + this.data.width + "x" + this.data.height );

                    me._iniCols = this.data.width;
                    me._iniRows = this.data.height;
                    me._iniLayers = this.data.layers;

                    me._loadFS();
                } );

                load.once( 'error', function() {
                    throw "Failed to initialize map! Map file " + mapFile + " failed to load!";
                } );

                load.open();

            })( this );

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

    public _loadFS() {
        /* Load filesystem data */
        this.fs.add( 'tilesets/terrains.json',     'resources/tilesets/terrains.tsx.json', 'json' );
        this.fs.add( 'tilesets/roads-rivers.json', 'resources/tilesets/roads-rivers.tsx.json', 'json' );
    }

    public _onFSReady() {
        
        ( function( me ) {

            me.addTileset( new AdvMap_Tileset_Terrains( me.fs.open( 'tilesets/terrains.json' ).data ) )
                .on('load', function( tileset ) {
                    me.layers.terrains = this;
                    me._onTilesetsReady();
                });
        
            me.addTileset( new AdvMap_Tileset_RoadsRivers( me.fs.open( 'tilesets/roads-rivers.json' ).data ) )
                .on('load', function( tileset ) {
                    me.layers.roads = this;
                    me._onTilesetsReady();
                });

        })(this);

        this.emit( 'filesystem-ready' );

    }

    public _onTilesetsReady() {
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
        this.emit( 'load' );
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
            "layers": [
            ]
        };

        for ( var i=0, len = this.layers.length; i<len; i++ ) {
            data.layers.push( this.layers[i].getData() );
        }

        return data;

    }

    public save( fname: string, callback ) {

        var data = this.getData();

        // saves the map to disk.
        if ( typeof global != 'undefined' ) {

            var fs = require( 'fs' );

            fs.writeFile( 'resources/maps/' + fname, JSON.stringify( data ), function( err ) {
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
        return vp;
    }
}