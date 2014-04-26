class Layer_Terrain extends Layer {

	public tileset: AdvMap_Tileset_Terrains;
	public tiles = [];

	public CT_SAND  = 1;
	public CT_DIRT  = 0;
	public CT_ABYSS = 4;

	constructor( public map: AdvMap, public index: number ) {
	    
	    super( map, index );

	    this.tileset = this.map.tilesets[ 0 ];

	    this._onInit();

	}

	public compute( x: number, y: number, radius: number = 4 ) {

		var x1 = x - radius,
		    y1 = y - radius,
		    x2 = x + radius,
		    y2 = y + radius,
		    bits, nBits, sBits, wBits, eBits, neBits, nwBits, seBits, swBits, 
		    computed = false;

		x1 = x1 < 0 ? 0 : ( x1 >= this.map.cols ? this.map.cols - 1 : x1 );
		y1 = y1 < 0 ? 0 : ( y1 >= this.map.rows ? this.map.rows - 1 : y1 );
		x2 = x2 < x1 ? x1 : ( x2 >= this.map.cols ? this.map.cols - 1 : x2 );
		y2 = y2 < y1 ? y1 : ( y2 >= this.map.rows ? this.map.rows - 1 : y2 );

		for ( var col = x1; col <= x2; col++ ) {
			for ( var row = y1; row <= y2; row++ ) {
				
				bits = this.getBits( col, row, null );

				nBits  = this.getBits( col, row - 1, bits );
				sBits  = this.getBits( col, row + 1, bits );
				wBits  = this.getBits( col - 1, row, bits );
				eBits  = this.getBits( col + 1, row, bits );

				neBits = this.getBits( col + 1, row - 1, bits );
				nwBits = this.getBits( col - 1, row - 1, bits );
				seBits = this.getBits( col + 1, row + 1, bits );
				swBits = this.getBits( col - 1, row + 1, bits );

			}
		}

	}

	private setBits( x, y, bits ) {
		if ( x >= 0 && x < this.map.cols && y >= 0 && y < this.map.rows )
			this.tiles[ y * this.map.rows + x ] = bits;
	}

	public getBits( x, y, defaultBits ) {
		if ( x >= 0 && x < this.map.cols && y >= 0 && y < this.map.rows ) {
			return this.tiles[ y * this.map.rows + x ] || [
				this.CT_SAND, this.CT_SAND, this.CT_SAND, this.CT_SAND 
			];
		}
		else
			return defaultBits === null ? [ 
				this.CT_SAND, this.CT_SAND, this.CT_SAND, this.CT_SAND 
			] : defaultBits;
	}

	private _onInit() {

		( function( me ) {

			me.map.on( 'resize', function( cols, rows ) {
				// we keep a track of tiles ID's, depending on our map tileset data

				for ( var i=0, len = cols * rows; i<len; i++ )
					me.tiles.push( null );

				// console.log( "Layer_Terrain: reinitialized tile data" );
				me.compute( 0, 0, Math.max( this.cols, this.rows ) );
			});

		} )( this );


		this.on( 'change', function( x, y, data ) {
			
			console.log( 'change: ', x, y );

			var bits, bits1;
			
			this.setBits( x, y, bits = [ data, data, data, data ] );

			bits1 = this.getBits( x - 1, y - 1, bits );
			bits1[ 3 ] = bits[ 0 ];
			this.setBits( x - 1, y - 1, bits1 );

			bits1 = this.getBits( x, y - 1, bits );
			bits1[ 2 ] = bits[ 0 ];
			bits1[ 3 ] = bits[ 1 ];
			this.setBits( x, y - 1, bits1 );

			bits1 = this.getBits( x + 1, y - 1, bits );
			bits1[ 2 ] = bits[ 1 ];
			this.setBits( x + 1, y - 1, bits1 );

			bits1 = this.getBits( x - 1, y, bits );
			bits1[ 1 ] = bits[0];
			bits1[ 3 ] = bits[2];
			this.setBits( x - 1, y, bits1 );

			bits1 = this.getBits( x + 1, y, bits );
			bits1[ 0 ] = bits[1];
			bits1[ 2 ] = bits[3];
			this.setBits( x + 1, y, bits1 );

			bits1 = this.getBits( x - 1, y + 1, bits );
			bits1[ 1 ] = bits[ 2 ];
			this.setBits( x - 1, y + 1, bits1 );

			bits1 = this.getBits( x, y + 1, bits );
			bits1[ 0 ] = bits[ 2 ];
			bits1[ 1 ] = bits[ 3 ];
			this.setBits( x, y + 1, bits1 );

			bits1 = this.getBits( x + 1, y + 1 );
			bits1[ 0 ] = bits[3];
			this.setBits( x + 1, y + 1, bits );

			this.compute( x, y, 1 );

		});

	}

}