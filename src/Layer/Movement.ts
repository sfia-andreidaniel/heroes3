class Layer_Movement extends Layer {

	public _cells = [];
	
	public _currentMode: string = '';
	public _throttlerCompute: any = null;
	public _graph: AStar_Graph = null;

	constructor ( public map: AdvMap, public index: number ) {
		super( map, index );

		(function( me ) {
			
			if ( window && window['$'] && window['$']['debounce'] ) {

				me._throttlerCompute = $['debounce']( 250, function() {
					me.doCompute( me._currentMode );
				} );

			} else {

				me._throttlerCompute = function() {
					// not implemented under nodeJS
				};

			}


			map.on( 'movement-type-changed', function( mtype ) {
				me.compute( mtype );
			});

		})( this );

		this._onInit();
	}

	private _onInit() {

		(function(me) {

			me.map.on( 'resize', function( cols, rows ) {
				me._cells = [];

				for ( var i=0, len = cols*rows; i<len; i++ ) {
					me._cells.push( 0 );
				}

				me._graph = new AStar_Graph( me );
			});

		})(this);

		/* This layer is not changeable

		this.on( "change", function( x, y, data ) {

		});

		*/

	}

	public getData(): any {
		// nothing, not exportable
		return null;
	}

	public setData( data: any ) {
		// nothing, not importable
	}

	public paint( cellCol, cellRow, x, y, ctx2d ) {

		if ( this.visible ) {
			ctx2d.font="10px Arial";
			ctx2d.fillStyle = 'yellow';
			ctx2d.fillText( JSON.stringify( this._cells[ cellRow * this.map.rows + cellCol ] ), x + 1, y + 10 );
		}

	}

	public get( x: number, y: number ): any {
		return this._cells[ y * this.map.rows + x ];
	}

	public set( x: number, y: number, data: any ) {
		this._cells[ y * this.map.rows + x ] = data;
	}

	public compute( mode: string ) {
		this._currentMode = mode;
		this._throttlerCompute();
	}

	/* @param mode: string, can be "walk", "swim", "fly"
	 */

	private yes( x, y ) {
	 	var index = y * this.map.cols + x;
	 	return !!(this._cells[ index ] && this._cells[ index ][0]);
	}

	private no( x, y ) {
	 	var index = y * this.map.cols + x;
	 	return !!( !this._cells[ index ] || !this._cells[index][0] );
	}

	private computeLayer( layer: Layer_Entities ) {

		var x1: number,
		    y1: number,
		    x2: number,
		    y2: number,
		    hsx: number,
		    hsy: number,

		    maxX: number = this.map.cols,
		    maxY: number = this.map.rows,

		    x: number,
		    y: number,
		    index: number;

		for ( var i=0, len = layer._objects.length; i<len; i++ ) {

			if ( layer._objects[i] && layer._objects[i] != this.map._activeObject ) {

				x1 = layer._objects[i].col - layer._objects[i].instance.hsx;
				y1 = layer._objects[i].row - layer._objects[i].instance.hsy;
				x2 = x1 + layer._objects[i].instance.cols - 1;
				y2 = y1 + layer._objects[i].instance.rows - 1;

				for ( y = y1; y <= y2; y++ ) {
					for ( x = x1; x <= x2; x++ ) {

						if ( x >= 0 && x < maxX && y >= 0 && y < maxY ) {
								
							index = ( y * maxX ) + x;

							this._cells[ index ] = null;
						}
					}
				}

			}

		}

	}

	public doCompute( mode: string ) {

		// build movement type matrixes
		var mat = [ [], [] ],
		    i, j, k, n, o, p: number,
		    len: number,

		    v: number;

		// reset all cells
		for ( i=0, len = this._cells.length; i<len; i++ )
			this._cells[i] = null;

		if ( !mode )
			return;

		try {

			// build matrix based on tilesets
			for ( i=0; i<2; i++ ) {

				for ( j=0, len = this.map.layers[ i ]['tileset'].terrains.length; j<len; j++ ) {
					
					mat[ i ].push( this.map.layers[i]['tileset'].terrains[ j ].movements[ mode ] || null );

				}

			}

			for ( i=0, len = Math.min( this.map.cells.length, this._cells.length ); i<len; i++ ) {

				for ( j = 0; j < 2; j++ ) {

					v = this.map.cells[ i ].getData( j );

					if ( j == 0 ) {

						this._cells[ i ] = ( v === null || !mat[ 0 ][ v ] )
							? null
							: [ mat[ 0 ][ v ][ 0 ], mat[ 0 ][ v ][ 1 ] ];

					} else {

						if ( this._cells[i] && v !== null ) {
							
							this._cells[ i ][ 0 ] += ( mat[ j ][ v ][ 0 ] || 0 );
							
							this._cells[ i ][ 1 ] = ( this._cells[i][1] == 0 || ( mat[j][v][1] || 0 ) ) == 0 ? 0 : 1;


						}

					}

				}

			}

			switch ( mode ) {

				case 'walk':
				case 'swim':

					/* L2 + L3 */

					this.computeLayer( <Layer_Entities> this.map.layers[2] );
					this.computeLayer( <Layer_Entities> this.map.layers[3] );

					break;

				case 'fly':

					/* L4 */
					this.computeLayer( <Layer_Entities> this.map.layers[4] );
					break;


			}


		} catch ( Exception ) {
			// nothing to do on exception, means that the map layers weren't loaded yet
		}

	}

	get name() {
		return 'Movement';
	}

}