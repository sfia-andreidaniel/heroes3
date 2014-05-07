class Viewport extends Events {

	public canvas: any    = null; // Canvas
	public ctx:    any    = null; // Canvas context
	public map:    AdvMap = null; // AdvMap

	private _width: number = 0;
	private _height: number = 0;

	public cols: number = 0; // number of tiles horizontaly
	public rows: number = 0; // number of tiles verticaly
	public x   : number = 0; // tile start x
	public y   : number = 0; // tile start y

	public tileWidth: number = 0;
	public tileHeight: number = 0;

	public paintables: Cell[] = [];

	private _joystick = 0;

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
		return cell.x() >= this.x && cell.x() <= this.x + this.cols &&
			   cell.y() >= this.y && cell.y() <= this.y + this.rows;
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

	public _setupMouseEvents() {

		if ( typeof global != 'undefined' )
			return;

		( function( me ) {

			$(me.canvas).on( 'mousemove', function( evt ) {
				var x = evt.offsetX,
				    y = evt.offsetY,
				    col = ~~( x / me.tileWidth ) + me.x,
				    row = ~~( y / me.tileHeight ) + me.y,
				    cell = me.map.cellAt( col, row, false );

				if ( cell != me.map.activeCell )
					me.map.activeCell = cell;
			});

			$(me.canvas).on( 'mouseout', function() {
				me.map.activeCell = null;
			});

			me.canvas.addEventListener( 'mousewheel', function(evt ) {
				var delta = evt.wheelDelta || -evt.detail;

				delta = Math.abs( delta ) >= 40 ? -( ~~(delta / 40) ) : delta;

				delta = delta > 0 ? 1 : (
					delta < 0 ? -1 : 0
				);

				if ( delta == 0 )
					return;

				if ( evt.shiftKey ) {

					me.x += delta;

					if ( me.x + me.cols >= me.map.cols - 1 )
						me.x = me.map.cols - me.cols - 1;

					if ( me.x < 0 )
						me.x = 0;

				} else {

					me.y += delta;

					if ( me.y + me.rows >= me.map.rows )
						me.y = me.map.rows - me.rows - 1;

					if ( me.y < 0 )
						me.y = 0;

				}

				me.updatePaintables();

			}, true);

		})( this );

	}

	public loopPaint = function() {

		( function( me ) {
			window.requestAnimationFrame( function() {
				me.loopPaint();
			} );
		})( this );

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
			this.paintables[i].paintAt( x, y, this.ctx, 1 );
		}


		/* Paint the objectHandle if is set */
		if ( ( oh = this.map.objectHandle ) && ( ac = this.map.activeCell ) )  {
			
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

}