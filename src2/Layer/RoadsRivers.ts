class Layer_RoadsRivers extends Layer {
	
	public tileset: AdvMap_Tileset_Terrains = null;
	private _interactive: boolean = null;

	private _tiles = [];
	private _bits  = [];

	//      2
	//  16  1   4  
	//      8

	private _indexes = [
		[], // road pavement
		[], // road stone
		[],	// river
		[],	// river icy
		[],	// river lava
		[]	// river mud
	];

	constructor( public map: AdvMap, public index: number ) {

		super( map, index );

		this.tileset = this.map.tilesets[ 1 ];

		this._onInit();

	}

	private computeHash( x, y, recursive = true ) {

		if ( x < 0 || y < 0 || x > this.map.cols - 1 || y > this.map.rows - 1 )
			return;

		console.log( 'chash: ', x, y );

		// we-re computing hash depending on neighbours data

		var my = y * this.map.rows + x;

		var n = [ x, y - 1 ],
		    s = [ x, y + 1 ],
		    w = [ x - 1, y ],
		    e = [ x + 1, y ],
		    
		    bits = [ n, e, s, w ],
		    
		    nbit = 2,
		    ebit = 4,
		    sbit = 8,
		    wbit = 16,

		    bitv = [ nbit, ebit, sbit, wbit ],

		    hash = 1;

		for ( var i=0; i<4; i++ ) {
			if ( bits[i][ 0 ] >= 0 && 
				 bits[i][ 1 ] >= 0 && 
				 bits[i][ 0 ] < this.map.cols && 
				 bits[i][ 1 ] < this.map.rows &&
				 this._tiles[  bits[i][1] * this.map.rows + bits[i][0] ] === this._tiles[ my ]
			) {
				hash += bitv[ i ];
				if ( recursive )
					this.computeHash( bits[i][0], bits[i][1], false );
			}
		}

		this._bits[ my ] = hash;
	}

	private _onInit() {

		( function( me ) {

			me.map.on( 'resize', function( cols, rows ) {
				me._tiles = [];
				me._bits  = [];
				for ( var i=0, len = cols * rows; i<len; i++ ) {
					me._tiles.push( null );
					me._bits.push( null );
				}
			});

		})( this );

		this.on( 'change', function( x, y, data ) {

			if ( !this._interactive )
				return;

			this._tiles[  y * this.map.rows + x ] = data;

			this.computeHash( x, y );

		});

	}

	get interactive(): boolean {
		return this._interactive;
	}

	set interactive( value: boolean ) {
		if ( this._interactive != value ) {
			this._interactive = value;
			this.emit( 'interactive', value );
		}
	}

	public getData() {
		return null;
	}

	public setData( data ) {
		// not implemented
	}

}