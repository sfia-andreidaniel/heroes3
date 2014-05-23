class Viewport extends Events {

	public canvas: any    = null; // Canvas
	public ctx:    any    = null; // Canvas context
	public map:    AdvMap = null; // AdvMap

	public _width: number = 0; // Physical viewport dimensions in pixels
	public _height: number = 0;

	public cols: number = 0; // number of tiles horizontaly
	public rows: number = 0; // number of tiles verticaly
	public x   : number = 0; // tile start x
	public y   : number = 0; // tile start y

	public tileWidth: number = 0;
	public tileHeight: number = 0;

	public paintables: Cell[] = [];

	private _joystick = 0;

	public disabled: boolean = false; // if the viewport is disabled, it doesn't render
	public minimaps: Viewport_Minimap[] = [];
	private vpTickPaint: number = 0;

	/* Weather a click on the viewport determine selection
	   of the object under mouse cursor on the map or
	   not 
	*/
	private _interactive: boolean = false;

	constructor( width: number, height: number, map: AdvMap ) {
	    super();
	    
	    this.map     = map;

	    if ( typeof global == 'undefined' ) {
	    	this.canvas = document.createElement( 'canvas' );
	    } else {
	    	var canvas = require( 'canvas' );
	    	this.canvas = new canvas;
	    }

	    this.resize( width, height );

	    this._setupMouseEvents();

	    this.loopPaint();

	}

	public get interactive():boolean {
		return this._interactive;
	}

	public set interactive( value: boolean ) {
		this._interactive = !!value;
	}

	/* Adds the cell to the paint loop */
	public addToPaintables( cell: Cell ): Cell {
		if ( this.paintables.indexOf( cell ) == -1 ) {
			this.paintables.push( cell );
		}

		return cell;
	}

	/* Removes the cell from the paint loop */
	public removeFromPaintables( cell: Cell ): Cell {
		var index = this.paintables.indexOf( cell );

		if ( index >= 0 ) {
			this.paintables.splice( index, 1 );
		}

		return cell;
	}

	/* Weather the cell is inside the paint loop */
	public isInPaintables( cell: Cell ): boolean {
		return this.paintables.indexOf( cell ) != -1;
	}

	/* Weather the cell is inside the viewport region. Doesn't test
	   if the cell is outside but still needs to be painted
	 */
	public shouldRenderCell( cell: Cell ): boolean {
		if ( cell ) {
			return cell.x() >= this.x && cell.x() <= this.x + this.cols &&
				   cell.y() >= this.y && cell.y() <= this.y + this.rows;
		} else return false;
	}

	public updatePaintables() {
		// determine the paintables objects
		var cx = this.x,
		    cy = this.y,
		    cx1 = this.x + this.cols + ( this._width % 32 != 0 ? 1 : 0 ),
		    cy1 = this.y + this.rows + ( this._height % 32 != 0 ? 1 : 0 ),
		    c: Cell = null;

		this.paintables = [];

		for ( var x = cx; x <= cx1; x++ )
			for ( var y = cy; y < cy1; y++ ) {
				if ( x >= 0 && y >= 0 && x < this.map.cols && y < this.map.rows )
					this.paintables.push( this.map.cellAt( x, y ) );

			}

		for ( var i=0, len = this.map.mapObjects.length; i<len; i++ ) {
			if ( this.map.mapObjects[i].inViewport( this ) ) {
				c = this.map.mapObjects[i].getOwnerCell();
				if ( c )
					this.paintables.push( c );
			}
		}

		this.emit( 'update' );

	}

	public resize( width: number, height: number ) {
		this._width = width;
		this._height= height;

		this.canvas.width = this._width;
		this.canvas.height = this._height;

		this.ctx = this.canvas.getContext( '2d' );

		this.tileWidth = this.map.tilesets[0].tileWidth;
		this.tileHeight = this.map.tilesets[0].tileHeight;

		this.cols = ~~( this._width / this.map.tilesets[0].tileWidth );
		this.rows = ~~( this._height / this.map.tilesets[0].tileHeight );

		this.updatePaintables();

		console.log( "resized viewport to: " 
				+ this._width + "x" + this._height + "px, cols=" 
				+ this.cols + ", rows=" + this.rows
				+ ", " + this.paintables.length + " paintables in paint loop" );

	}

	public scrollToXY( x: number, y: number ) {
		this.x = x < 0 ? 0 : x;
		this.y = y < 0 ? 0 : y;

		if ( this.x + this.cols > this.map.cols - 1)
			this.x = this.map.cols - this.cols - 1;

		if ( this.x < 0 )
			this.x = 0;

		if ( this.y + this.rows > this.map.rows - 1)
			this.y = this.map.rows - this.rows - 1;

		if ( this.y < 0 )
			this.y = 0;

		this.updatePaintables();

	}

	public _setupMouseEvents() {

		if ( typeof global != 'undefined' )
			return;

		( function( me ) {

			$(me.canvas).on( 'mousemove', function( evt ) {

				if ( me.disabled )
					return;

				var x = evt.offsetX,
				    y = evt.offsetY,
				    col = ~~( x / me.tileWidth ) + me.x,
				    row = ~~( y / me.tileHeight ) + me.y,
				    cell = me.map.cellAt( col, row, false );

				if ( cell != me.map.activeCell )
					me.map.activeCell = cell;
			});

			$(me.canvas).on( 'mouseout', function() {
				if ( me.disabled )
					return;
				me.map.activeCell = null;
			});

			me.canvas.addEventListener( 'mousewheel', function(evt ) {

				if ( me.disabled )
					return;

				var delta = evt.wheelDelta || -evt.detail;

				delta = Math.abs( delta ) >= 40 ? -( ~~(delta / 40) ) : delta;

				delta = delta > 0 ? 1 : (
					delta < 0 ? -1 : 0
				);

				if ( delta == 0 )
					return;

				if ( evt.shiftKey ) {

					me.scrollToXY( me.x+delta, me.y );

				} else {

					me.scrollToXY( me.x, me.y + delta );
				}

			}, true);

			me.canvas.oncontextmenu = function( evt ) {
				evt.preventDefault();
				evt.stopPropagation();
				
			}

			$(me.canvas).on( 'mousedown', function( evt ) {
				
				if ( !me.interactive )
					return;

				evt.preventDefault();
				evt.stopPropagation();

				var clickX = evt.offsetX,
				    clickY = evt.offsetY,
				    obj: Objects_Entity = null,
				    i: number,
				    j: number,
				    len: number,
				    o: any,
				    obj1: Objects_Entity,
				    x1: number,
				    y1: number,
				    x2: number,
				    y2: number,
				    x: number,
				    y: number,
				    vx: number = me.x + ~~( clickX / me.tileWidth ),
				    vy: number = me.y + ~~( clickY / me.tileHeight ),
				    noObjects = false,
				    deferredEmitters = [];

				/* Determine the object on which the click was triggered */
				for ( i=0, len = me.paintables.length; i<len; i++ ) {

					for ( j = 4; j >= 2; j-- ) {
						
						o = me.paintables[ i ].getData( j );

						if ( o ) {

							obj1 = me.map.layers[ j ][ '_objects' ][
								me.paintables[ i ].y() * me.map.cols + me.paintables[ i ].x()
							];

							if ( !obj1 ) {
								throw "Inconsistency!";
							}

							x = obj1.col;
							y = obj1.row;

							x1 = x - obj1.instance.hsx;
							y1 = y - obj1.instance.hsy;

							x2 = x1 + obj1.instance.cols - 1;
							y2 = y1 + obj1.instance.rows - 1;

							if ( vx >= x1 && vx <= x2 && vy >= y1 && vy <= y2 ) {
								
								deferredEmitters.push({
									"object": obj1,
									"which":  evt.which,
									"isHotSpot": ( x == vx && y == vy ),
									"vx": x,
									"vy": y
								});

								//me.map.emit( 'object-click', obj1, evt.which, ( x == vx && y == vy ) );
								
								// noObjects = true;
								// break;

							}

						}

						// if ( noObjects )
						//	break;

					}

					// if ( noObjects )
					//	break;

				}

				
				if ( deferredEmitters.length ) {

					deferredEmitters.sort( function( a,b ) {
						return ( a.isHotSpot ? 1 : 0 ) - ( b.isHotSpot ? 1 : 0 );
					});
					// console.log( deferredEmitters );

					me.map.emit( "object-click", deferredEmitters[0].object, deferredEmitters[0].which, deferredEmitters[0].isHotSpot );
				} else {
					me.map.emit( 'cell-click', me.map.cellAt( vx, vy ), evt.which );
				}

			} );

		})( this );

	}

	public loopPaint = function() {

		( function( me ) {
			window.requestAnimationFrame( function() {
				me.loopPaint();
			} );
		})( this );

		if ( this.disabled )
			return;

		this.vpTickPaint++;

		if ( this.vpTickPaint != 3 )
			return;
		else this.vpTickPaint = 0;

		this.ctx.fillStyle = 'rgb(255,255,255)';
		this.ctx.fillRect( 0, 0, this._width, this._height );

		var x, y, x1, y1, oh, ac;

		/* Paint */
		for ( var i=0, len = this.paintables.length; i<len; i++ ) {
			x = ( this.paintables[i].x() - this.x ) * this.tileWidth;
			y = ( this.paintables[i].y() - this.y ) * this.tileHeight;
			this.paintables[i].paintAt( x, y, this.ctx, 0 );
		}

		for ( var i=0, len = this.paintables.length; i<len; i++ ) {
			x = ( this.paintables[i].x() - this.x ) * this.tileWidth;
			y = ( this.paintables[i].y() - this.y ) * this.tileHeight;
			this.paintables[i].paintAt( x, y, this.ctx, 1, !this._interactive );
		}


		/* Paint the objectHandle if is set */
		if ( ( oh = this.map.objectHandle ) && ( ac = this.map.activeCell ) && !this._interactive )  {
			
			x = ( ac.x() - this.x );
			y = ( ac.y() - this.y );
			
			x1 = x - oh.hsx;
			y1 = y - oh.hsy;

			if ( oh.bitmap && oh.bitmap.loaded ) {

				this.ctx.drawImage( 
					oh.bitmap.node,
					0, 							// sx
					0, 							// sy
					this.tileWidth * oh.cols,	// sw
					this.tileHeight * oh.rows,	// sh
					x1 * this.tileWidth,		// dx
					y1 * this.tileHeight,		// dy
					oh.cols * this.tileWidth,	// dw
					oh.rows * this.tileHeight	// dh
				);

			}

			this.ctx.fillStyle = 'rgba(' + ( oh.supported ? '0,255,0' : '255,0,0' ) + ',.3)';
			this.ctx.fillRect( x1 * this.tileWidth, y1 * this.tileHeight, oh.cols * this.tileWidth, oh.rows * this.tileHeight );

		}
	}

	public addMiniMap( width: number, height: number ) {

		var mini = new Viewport_Minimap( width, height, this );
		this.minimaps.push( mini );
		return mini;

	}

}