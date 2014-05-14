class Layer_RoadsRivers extends Layer {
	
	public tileset: AdvMap_Tileset_Terrains = null;

	private _tiles    : number[] = []; // road or water type
	private _bits     : number[] = []; // computed bits
	private _computed : number[] = []; // computed tile ID's from the tileset

	//      2
	//  16  1   4  
	//      8

	/* There are 16 possible cases for the tiles of this layer.
	   Each case is determined by summing a mask of bits:

	   center: 1, north: 2, east: 4, south: 8, west: 16

	   In the _indexes, we're assigning tiles that match this bits
	   combinations
	*/

	private _indexes = [
		{
			"3":  [ 59, 64 ], "5":  [ 58, 60 ], "17": [ 43, 65 ], "9":  [ 42, 61 ], "11": [ 34, 36, 39, 41, 51, 53, 54, 56 ], "21": [ 35, 37, 38, 40, 50, 52, 55, 57 ],
			"31": [ 62, 63, 66, 67 ], "15": [ 12, 28, 46, 48 ], "29": [ 13, 29, 32 ], "23": [ 26, 44, 47 ], "27": [ 27, 31, 33, 45 ],
			"19": [ 15, 17, 19, 21, 23, 25 ], "7":  [ 14, 16, 18, 20, 22, 24 ], "13": [  0,  2,  4,  6,  8, 10 ], "25": [  1,  3,  5,  7,  9, 11 ]
		}, // road pavement
		{
			"3":  [ 63, 64 ], "5":  [ 58, 62 ], "17": [ 57, 65 ], "9":  [ 56, 59 ], "11": [ 32, 34, 37, 39, 49, 51, 52, 54 ], "21": [ 35, 36, 38, 50, 53, 55 ],
			"31": [ 60, 61, 66, 67 ], "15": [ 24, 26, 44, 46 ], "29": [ 25, 27, 28, 30 ], "23": [ 40, 42, 45, 47 ], "27": [ 29, 31, 41, 43 ], "19": [ 13, 15, 17, 19, 21, 23 ],
			"7":  [ 12, 14, 16, 18, 20, 22 ], "13": [  0,  2,  4,  6,  8, 10 ], "25": [  1,  3,  5,  7,  9, 11 ]
		}, // road stone
		{
			"3":  [ 45 ],
			"5":  [ 46 ],
			"17": [ 46 ],
			"9":  [ 48 ],

			"11": [ 30, 32, 35, 37, 38, 45, 47, 48, 50 ],
			"21": [ 31, 33, 34, 36, 44, 46, 49, 51 ],

			"31": [ 8, 9, 20, 21 ],

			"15": [ 22, 26, 28 ], 
			"29": [ 10, 27, 29 ],
			"23": [ 23, 40, 42 ],
			"27": [ 11, 41, 43 ],

			"19": [ 13, 15, 17, 19 ],
			"7":  [ 12, 14, 18, 16 ],
			"13": [  0,  2,  4,  6 ],
			"25": [  1,  3,  5,  7 ]
		},	// river
		{
			"3":  [ 50, 48 ],
			"5":  [ 44, 46, 49, 51 ],
			"17": [ 44, 46, 49, 51 ],
			"9":  [ 50, 48 ],

			"11": [ 28, 30, 33, 35, 45, 47, 48, 50 ],
			"21": [ 29, 31, 32, 34, 44, 46, 49, 51 ],

			"31": [ 8, 9, 18, 19 ],

			"15": [ 24, 26, 36, 38 ],
			"29": [ 20, 22, 25, 27 ],
			"23": [ 37, 39, 40, 42 ],
			"27": [ 21, 23, 41, 43 ],

			"19": [ 11, 13, 15, 17 ],
			"7":  [ 10, 12, 14, 16 ],
			"13": [  0,  2,  4,  6 ],
			"25": [  1,  3,  5,  7 ]
		},	// river icy
		{
			"3":  [ 36, 41, 45 ],
			"5":  [ 40, 44, 46, 51 ],
			"17": [ 40, 44, 46, 51 ],
			"9":  [ 36, 41, 45 ],

			"11": [ 34, 36, 39, 41, 45, 47, 48, 50 ],
			"21": [ 35, 37, 40, 44, 46, 49, 51 ],

			"31": [ 8, 9, 24, 25 ],

			"15": [ 26, 28, 32 ],
			"29": [ 10, 12, 33 ],
			"23": [ 27, 29, 42 ],
			"27": [ 11, 13, 31, 43 ],

			"19": [ 17, 19, 23 ],
			"7":  [ 16, 18, 22 ],
			"13": [  0,  2,  4,  6 ],
			"25": [  1,  3,  5,  7 ]
		},	// river lava
		{
			"3":  [ 24, 41, 47 ],
			"5":  [ 40, 46, 51 ],
			"17": [ 40, 46, 51 ],
			"9":  [ 24, 41, 47 ],

			"11": [ 24, 41, 45, 47, 48, 50 ],
			"21": [ 25, 27, 40, 42, 44, 46, 49, 51 ],

			"31": [ 14, 15, 30, 31 ],

			"15": [ 20, 22 ],
			"29": [ 18, 21, 23 ],
			"23": [ 33, 35, 36, 38 ],
			"27": [ 19, 37, 39 ],

			"19": [ 7, 9, 11, 29 ],
			"7":  [ 6, 8, 10, 28 ],
			"13": [ 0, 2, 4,  12 ],
			"25": [ 1, 3, 5,  13 ]
		}	// river mud
	];

	constructor( public map: AdvMap, public index: number ) {

		super( map, index );

		this.tileset = this.map.tilesets[ 1 ];

		this._onInit();

	}

	private computeHash( x, y, recursive = true ) {

		if ( x < 0 || y < 0 || x > this.map.cols - 1 || y > this.map.rows - 1 )
			return;

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
		this._computed[ my ] = this._computeTile( x, y );
	}

	private _onInit() {

		( function( me ) {

			me.map.on( 'resize', function( cols, rows ) {
				me._tiles = [];
				me._bits  = [];
				me._computed = [];
				for ( var i=0, len = cols * rows; i<len; i++ ) {
					me._tiles.push( null );
					me._bits.push( null );
					me._computed.push( null );
				}
			});

		})( this );

		this.on( 'change', function( x, y, data ) {

			this.map.emit( 'movement-type-changed', this.map._movementType );

			if ( !this._interactive )
				return;

			this._tiles[  y * this.map.rows + x ] = data;

			this.computeHash( x, y );

		});

	}

	private _getLayerData() {
		var out = [];
		for ( var i=0, len = this.map.cells.length; i<len; i++ ) {
			out.push( this.map.cells[i].getData( this.index ) );
		}
		return out;
	}

	public getData() {
		return {
			"bits": this._bits,
			"tiles": this._tiles,
			"computed": this._computed,
			"data": this._getLayerData()
		};
	}

	public setData( data ) {
		var old_interactive = this._interactive;
		this._interactive = false;

		if ( data ) {

			this._bits = data.bits;
			this._tiles = data.tiles;
			this._computed = data.computed;

			for ( var i=0, len = this.map.cells.length; i<len; i++ ) {
				this.map.cells[ i ].setData( this.index, data.data[ i ] );
			}

		}

		this._interactive = old_interactive;
	}

	private _computeTile( cellCol, cellRow ) {

		var index     = cellRow * this.map.rows + cellCol,
		    tileData  = this._tiles[ index ],
		    bits      = this._bits[ index ],
		    
		    tileCollectionInTerrain = null,
		    len: number = 0,
		    tileOrderInTerrain: number,
		    tileId: number;

		if ( ~~tileData !== tileData || ~~bits !== bits )
			return null;

		tileCollectionInTerrain = this._indexes[ tileData ][ bits ];

		if ( !tileCollectionInTerrain || !( len = tileCollectionInTerrain.length ) )
			return null;

		tileOrderInTerrain = ~~( Math.random() * len );

		tileId = this.tileset.terrains[ tileData ].tiles[ tileCollectionInTerrain[ tileOrderInTerrain ] ];

		return tileId === ~~tileId ? tileId : null;

	}

	public paint( cellCol, cellRow, x, y, ctx ) {

		if ( this.visible ) {
			var index     = cellRow * this.map.rows + cellCol,
			    tileId    = this._computed[ index ];

			if ( ~~tileId === tileId ) {
				this.tileset.paintTile( tileId, ctx, x, y );
			}
		}

	}

	/* The name of the layer */
	get name() {
		return "Roads and Rivers";
	}

}