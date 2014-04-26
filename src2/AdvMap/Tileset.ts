class AdvMap_Tileset extends Events {
    
    public name       : string = '';

    public tileWidth  : number = 0;
    public tileHeight : number = 0;

    public loaded     : boolean = false;
    
    public terrains = [];
    public tiles    = {};

    private sprite    : Picture = null;

    public tileRows  : number = 0;
    public tileCols  : number = 0;

    constructor( data: any ) {
        
        super();

        if ( data ) {

	        this.name = data.name;
	        
	        this.tileWidth = data.tilewidth;
	        this.tileHeight = data.tileheight;

       		this.tileCols = data.width / this.tileWidth;
       		this.tileRows = data.height / this.tileHeight;

	        this.sprite = new Picture( data.src );

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

	        for ( var i=0, len = data.types.length; i<len; i++ ) {
	        	this.terrains.push( new AdvMap_TilesetTerrain( data.types[i], this ) );
	        }

       		//console.log( 'loaded terrain: ', this.name, ': ', this.tileCols + 'x' + this.tileRows, " terrains: ", this.terrains.join( ", " ) );

	    }
    }

    public paintTile( tileId: number, ctx2d /*: CanvasRenderingContext2D */, x: number, y: number ) {

    	if ( this.loaded && this.tiles[ tileId ] ) {

	    	var sx, sy, sw, sh;

	    	sx = ( this.tileCols % tileId ) * this.tileWidth;
			sy = ~~( this.tileRows / tileId ) * this.tileHeight;

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

    public 6
    
}