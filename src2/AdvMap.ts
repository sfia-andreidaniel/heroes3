class AdvMap extends Events {
    
    public tilesets = [];        // Array of AdvMap_Tileset
    public fs: FS   = new FS();
    
    public cols: number = 0;
    public rows: number = 0;

    public layers = [];
    public cells  = [];

    constructor( public _iniCols: number, public _iniRows: number ) {
        
        super();
        
        ( function( me ) {
            me.fs.on( 'ready', function() {
                me._onFSReady();
            } );
        } )( this );
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

        } )( this );
    }

    public _onLayersReady( ) {

        for ( var i=0, len = this.layers.length; i<len; i++ ) {
            if ( !this.layers[i].loaded )
                return;
        }

        this.emit( 'layers-ready' );

        /* Initialize cells for the first time */
        this.setSize( this._iniCols, this._iniRows )

    }
    
    public setSize( columns: number, rows: number ) {
        this.cols = columns;
        this.rows = rows;

        var needLen = columns * rows,
            len = this.cells.length,
            numLayers = this.layers.length;

        while ( len != needLen ) {
            if ( len < needLen ) {
                this.cells.push( new Cell( len, numLayers, this ) );
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

    public addTileset ( t: AdvMap_Tileset ) {
        this.tilesets.push( t );
        
        this.emit( 'tileset-added', {
            "data": t
        } );

        return t;
    }
}