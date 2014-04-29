class AdvMap_Tileset extends Events {
    
    public name       : string = '';

    public tileWidth  : number = 0;
    public tileHeight : number = 0;

    public loaded     : boolean = false;
    
    public terrains = [];
    public tiles    = {}; // tileID to hash mappings
    public hashes   = {}; // hash to tiles id's mappings

    private sprite    : Picture = null;

    public tileRows  : number = 0;
    public tileCols  : number = 0;

    private _canvas    = null;
    private _ctxWriter = null;

    constructor( data: any ) {
        
        super();

        var len: number, 
            i: number;

        if ( data ) {

	        this.name = data.name;
	        
	        this.tileWidth = data.tilewidth;
	        this.tileHeight = data.tileheight;

       		this.tileCols = data.width / this.tileWidth;
       		this.tileRows = data.height / this.tileHeight;

	        this.sprite = new Picture( data.src );

	        /* Build the internal canvas writer */
	        if ( typeof global == 'undefined' ) {
	        	this._canvas = document.createElement( 'canvas' );
	        } else {
	        	this._canvas = new ( require( 'canvas' ) );
	        }

	        this._canvas.width = this.tileWidth;
	        this._canvas.height= this.tileHeight;

	        this._ctxWriter = this._canvas.getContext( '2d' );

	        ( function( me ) {
	        	me.sprite.once( 'load', function() {
	        		me.loaded = true;

	        		me.emit( 'load', me );
	        	});
	        	me.sprite.once( 'error', function() {
	        		me.emit( 'error' );
	        	});
	        } )( this );

	        this.tiles = data.tiles;
	        this.hashes = data.hashes;

	        for ( i=0, len = data.types.length; i<len; i++ ) {
	        	this.terrains.push( new AdvMap_TilesetTerrain( data.types[i], this ) );
	        }

	        // compute allowed terrain neighbours
	        for ( i=0, len = this.terrains.length; i<len; i++ ) {
	        	this.terrains[i]._computeAllowedNeighboursTerrains();
	        	this.terrains[i]._computeTilesWhereThisTerrainIsSet();
	        }

       		//console.log( 'loaded terrain: ', this.name, ': ', this.tileCols + 'x' + this.tileRows, " terrains: ", this.terrains.join( ", " ) );

	    }
    }

    public getTileIdByHash( hash: string ) {

    	var len;

    	if ( this.hashes[ hash ] && ( len = this.hashes[ hash ].length )  ) {
    		return this.hashes[ hash ][ ~~( Math.random() * len ) ];
    	} else return null;

    }

    public paintTile( tileId: number, ctx2d /*: CanvasRenderingContext2D */, x: number, y: number ) {

    	if ( this.loaded ) {

	    	var sx, sy, sw, sh;

	    	sx = ~~( tileId % this.tileCols ) * this.tileWidth;
			sy = ~~( tileId / this.tileCols ) * this.tileHeight;

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

			ctx2d.drawImage( 
				this.sprite.node,
				sx,
				sy,
				sw = this.tileWidth,
				sh = this.tileHeight,
				x,
				y,
				sw,
				sh
			);
		}
    }

    public getTerrainById( terrainId: number ) {

		return this.terrains[terrainId];

    }

    public getTileBase64Src( tileId ) {

    	if ( this._ctxWriter ) {

    		this._ctxWriter.clearRect ( 0 , 0 , this.tileWidth , this.tileHeight );

    		this.paintTile( tileId, this._ctxWriter, 0, 0 );

    		return this._canvas.toDataURL( 'image/png' );

    	} else return null;

    }

}