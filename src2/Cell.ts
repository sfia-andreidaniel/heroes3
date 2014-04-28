class Cell {

	public map   : AdvMap = null;
	public index : number = 0;
	public layers         = {};

	private _neighbours: CellNeighbours = null;

	constructor( cellIndex: number, numLayers: number, map: AdvMap ) {

	    this.index = cellIndex;
	    this.map   = map;

	    for ( var i=0; i < numLayers; i++ ) {
	    	// define getters and setters for the layer data
	    	( function ( cell, index ) {

	    		var nowVal = null;

	    		Object.defineProperty( cell.layers, index, {
	    			"get": function( ) {
	    				return nowVal;
	    			},
	    			"set": function( data: any ) {
	    				nowVal = data;
	   					cell.map.layers[ index ].emit( 'change', cell.x, cell.y, data );
	    			}
	    		} );

	    	})( this, i );
	    }

	}

	get x(): number {
		return this.index % this.map.cols;
	}

	get y(): number {
		return ~~( this.index / this.map.rows );
	}

	get neighbours(): CellNeighbours {
		return this._neighbours;
	}

	public _computeNeighbours() {
		var x = this.x,
		    y = this.y;
		
		this._neighbours = { 
			"n": this.map.cellAt( x, y - 1, false ),
			"s": this.map.cellAt( x, y + 1, false ), 
			"w": this.map.cellAt( x - 1, y, false ), 
			"e": this.map.cellAt( x + 1, y, false ), 

			"nw": this.map.cellAt( x - 1, y - 1, false ), 
			"ne": this.map.cellAt( x + 1, y - 1, false ), 
			"sw": this.map.cellAt( x - 1, y + 1, false ), 
			"se": this.map.cellAt( x + 1, y + 1, false )
		};
	}

	public paintAt( x, y, ctx ) {
		var _x = this.x,
		    _y = this.y;

		for ( var i=0, len = this.map.layers.length; i<len; i++ ) {
			this.map.layers[i].paint( _x, _y, x, y, ctx );
		}

		if ( this == this.map.activeCell ) {
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#f00';
			ctx.strokeRect( x + 1, y + 1, this.map.tilesets[0].tileWidth - 3, this.map.tilesets[0].tileHeight - 3 );
		}
	}
}