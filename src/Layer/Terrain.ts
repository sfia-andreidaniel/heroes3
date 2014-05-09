class Layer_Terrain extends Layer {

	public   tileset: AdvMap_Tileset_Terrains;
	public   tiles = [];						// array of terrain bits
	private _tilesList = [];					// array of tileset id of sprites


	public CT_SAND  = 1;
	public CT_DIRT  = 0;
	public CT_ABYSS = 4;
	public CT_WATER = 9;

	public bitsorder = [ 0, 1, 2, 3 ];

	// matrix correction bits
	private mcb = [
		[ 1,1 ], [ 2,1 ], [ 3,1 ], [ 4,1 ], [ 5,1 ], [ 6,1 ], [ 7,1 ], [ 8,1 ],
		[ 1,2 ], [ 2,2 ], [ 3,2 ], [ 4,2 ], [ 5,2 ], [ 6,2 ], [ 7,2 ], [ 8,2 ],
		[ 1,3 ], [ 2,3 ],                                     [ 7,3 ], [ 8,3 ],
		[ 1,4 ], [ 2,4 ],                                     [ 7,4 ], [ 8,4 ],
		[ 1,5 ], [ 2,5 ],                                     [ 7,5 ], [ 8,5 ],
		[ 1,6 ], [ 2,6 ],                                     [ 7,6 ], [ 8,6 ],
		[ 1,7 ], [ 2,7 ], [ 3,7 ], [ 4,7 ], [ 5,7 ], [ 6,7 ], [ 7,7 ], [ 8,7 ],
		[ 1,8 ], [ 2,8 ], [ 3,8 ], [ 4,8 ], [ 5,8 ], [ 6,8 ], [ 7,8 ], [ 8,8 ]
	];

	// matrix write bits
	private mwb = [
	    [ 3,3 ], [ 4,3 ], [ 5,3 ], [ 6,3 ],
	    [ 3,4 ], [ 4,4 ], [ 5,4 ], [ 6,4 ],
	    [ 3,5 ], [ 4,5 ], [ 5,5 ], [ 6,5 ],
	    [ 3,6 ], [ 4,6 ], [ 5,6 ], [ 6,6 ]
	];

	constructor( public map: AdvMap, public index: number ) {
	    
	    super( map, index );

	    this.tileset = this.map.tilesets[ 0 ];

	    this._onInit();

	}

	public bits2hash( bits ): string {
		return bits[ 0 ] + ',' + bits[ 2 ] + ',' + bits[ 1 ] + ',' + bits[ 3 ];
	}

	private setBits( x, y, bits ) {
		
		var tileIndex;

		if ( x >= 0 && x < this.map.cols && y >= 0 && y < this.map.rows ) {
			this.tiles[ tileIndex = ( y * this.map.rows + x ) ] = bits;

			this._tilesList[ tileIndex ] = bits
				? this.tileset.getTileIdByHash( this.bits2hash( bits ) )
				: null;
		}
	}

	private getBits( x, y, defaultBits ) {
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

	private getMatrix( x, y, defaultBits ) {
		var matrix = [
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null, null, null ]
			],
			bits: any;

		for ( var row1 = -2, row = 0; row1 <= 2; row1++, row++ ) {
			for ( var col1 = -2, col = 0; col1 <= 2; col1++, col++ ) {
				
				bits = this.getBits( x + col1, y + row1, defaultBits );
				
				matrix[ col * 2     ][ row * 2     ] = bits[0];
				matrix[ col * 2     ][ row * 2 + 1 ] = bits[1];
				matrix[ col * 2 + 1 ][ row * 2     ] = bits[2];
				matrix[ col * 2 + 1 ][ row * 2 + 1 ] = bits[3];
			}
		}

		return matrix;
	}

	private writeMatrix( x, y, matrix ) {

		var bits: any;

		for ( var row1 = -2, row = 0; row1 <= 2; row1++, row++ ) {
			for ( var col1 = -2, col = 0; col1 <= 2; col1++, col++ ) {

				bits = [ 
					matrix[ col * 2     ][ row * 2     ], 
				    matrix[ col * 2     ][ row * 2 + 1 ], 
				    matrix[ col * 2 + 1 ][ row * 2     ], 
				    matrix[ col * 2 + 1 ][ row * 2 + 1 ]
				];

				this.setBits( x + col1, y + row1, bits );

			}
		}
	}

	private _onInit() {

		( function( me ) {

			me.map.on( 'resize', function( cols, rows ) {
				
				me.tiles = [];
				me._tilesList = [];

				// we keep a track of tiles ID's, depending on our map tileset data

				for ( var i=0, len = cols * rows; i<len; i++ ) {
					me.tiles.push( null );
					me._tilesList.push( null );
				}

			});

		} )( this );


		// @data is a tileset terrain id
		this.on( 'change', function( x, y, data ) {
			
			if ( !this._interactive )
				return;

			if ( data == null ) {

				this.setBits( x, y, null );

				return;
			}

			var matrix = this.getMatrix( x, y, [ data, data, data, data ] );

			// apply matrix write bits
			for ( var i=0; i<16; i++ ) {
				// console.log( "mwb: ", this.mwb[i][1], this.mwb[i][0] );
				matrix[ this.mwb[ i ][ 1 ] ][ this.mwb[ i ][ 0 ] ] = data;
			}


			// apply matrix correction bits
			for ( var i=0; i<48; i++ ) {
				// console.log( "mcb: ", this.mcb[i][1], this.mcb[i][0] );
				matrix[ this.mcb[ i ][ 1 ] ][ this.mcb[ i ][ 0 ] ] = 
					matrix[ this.mcb[ i ][ 1 ] ][ this.mcb[ i ][ 0 ] ] == data 
						? data
						: this.CT_SAND
			}

			// write matrix

			this.writeMatrix( x, y, matrix );

		});

	}

	private _getTerrain() {
		var out = [];
		for ( var i=0, len = this.map.cells.length; i<len; i++ )
			out.push( this.map.cells[i].getData( this.index ) );
		return out;
	}

	public getData(): any {
		return {
			"tiles": this.tiles,
			"terrain": this._getTerrain()
		};
	}

	public setData( data: any ) {
		
		var old_interactive = this._interactive,
		    i: number = 0,
		    len: number = 0;
		
		this._interactive = false;

		if ( data ) {
			this.tiles = data.tiles;

			for ( i=0, len = this.tiles.length; i<len; i++ ) {
				this._tilesList[i] = this.tiles[i]
					? this.tileset.getTileIdByHash( this.bits2hash( this.tiles[i] ) )
					: null;
			}

			for ( i=0, len = this.map.cells.length; i<len; i++ ) {
				this.map.cells[i].setData( this.index, data.terrain[ i ] );
			}

		}

		this._interactive = old_interactive;
	}

	public paint( cellCol, cellRow, x, y, ctx ) {

		if ( this.visible ) {
			var tileId = this._tilesList[ cellRow * this.map.rows + cellCol ] ;
				if ( tileId !== null ) {
					this.tileset.paintTile( tileId, ctx, x, y );
				}
		}

	}

	/* The name of the layer */
	get name(): string {
		return "Terrain";
	}

}