/// <reference path="../GameMap.ts" />

class GameMap_Viewport extends Events {

	// public map: GameMap
	// public width: number
	// public height: number


	// physical map dimensions
	public mapWidthPX = 0;
	public mapHeightPX = 0;
	
	public vpWidth = 0;   // viewport Width
	public vpHeight = 0;  // viewport Height
	public vpX = 0;       // viewport X
	public vpY = 0;       // viewport Y

	// the canvas and it's context
	public canvas = null;
	public ctx    = null;

	// here we store the elements that should be painted
	// on the game paint loop
	public renderables = [];

	// the joistick var is used to scroll the game when the mouse
	// enters the borders
	public joystick = 0; // 0 = center


	constructor( public map: GameMap, width: number, height: number ) {
	    
	    super();
	    
	    (function( viewport, map ) {

	    	map.on( 'map-loaded', function() {
	    		viewport.onMapLoaded();
	    	});

	    })( this, this.map );
	    

	}

	public viewportXYtoTile ( x: number, y: number ) {
		var col = ~~( ( this.vpX + x ) / 32 ),
		    row = ~~( ( this.vpY + y ) / 32 );
		
		if ( col < this.map.width && row < this.map.height )
			return this.map.cells[ row ][ col ];
		else
			return null;
	}

	// the onScroll function computes the renderable objects
	public onScroll( newVPx: number, newVPy: number ) {

		newVPx = newVPx < 0 ? 0 : newVPx;
		newVPy = newVPy < 0 ? 0 : newVPy;

		var mapTileX = ~~( newVPx / 32 ),
		    mapTileY = ~~( newVPy / 32 ); 
		
		mapTileX = mapTileX > this.map.width - 1 ? this.map.width - 1 : mapTileX;
		mapTileY = mapTileY > this.map.height - 1 ? this.map.height - 1 : mapTileY;

		var mapTileX1 = mapTileX + ~~( this.vpWidth / 32 ),
		    mapTileY1 = mapTileY + ~~( this.vpHeight / 32 );

		mapTileX1 = mapTileX1 > this.map.width - 1 ? this.map.width - 1 : mapTileX1;
		mapTileY1 = mapTileY1 > this.map.height - 1 ? this.map.height - 1 : mapTileY1;

		this.renderables = [];

		for ( var row = mapTileY; row < mapTileY1; row++ ) {

			for ( var col = mapTileX; col < mapTileX1; col++ ) {

				this.renderables.push( this.map.cells[ row ][ col ] );

			}

		}

		//console.log( "onScroll: " + this.renderables.length + " cells" );

		this.vpX = newVPx;
		this.vpY = newVPy;

	}

	public onMapLoaded() {
		
		this.mapWidthPX  = 32 * this.map.width;
		this.mapHeightPX = 32 * this.map.height;

		this.canvas = $('#game > canvas').get(0);
		this.ctx    = this.canvas.getContext( '2d' );

		this.vpWidth = this.canvas.offsetWidth;
		this.vpHeight = this.canvas.offsetHeight;

		this.emit( 'dom-initialization' );

		( function( viewport ) {

			$( viewport.canvas ).on( 'mousemove', function( event ) {
				
				var x = event.offsetX,
				    y = event.offsetY,
				    cell = viewport.viewportXYtoTile( x, y );

				if ( cell ) {

					viewport.map.emit( 'cell-mousemove', {
						"cell": cell
					} );

				}

			} );

			$( viewport.canvas ).on( 'click', function( event ) {

				var x = event.offsetX,
				    y = event.offsetY,
				    cell = viewport.viewportXYtoTile( x, y );

				if ( cell ) {

					viewport.map.emit( 'cell-click', {
						"cell": cell,
						"which": event.which
					} );

				}

			});

			$( viewport.canvas ).on( 'mousedown', function( event ) {
				
				var x = event.offsetX,
				    y = event.offsetY,
				    cell = viewport.viewportXYtoTile( x, y );

				if ( cell ) {

					viewport.map.emit( 'cell-mousedown', {
						"cell": cell,
						"which": event.which
					});

				}

			});

			$( viewport.canvas ).on( 'mouseup', function( event ){

				var x = event.offsetX,
				    y = event.offsetY,
				    cell = viewport.viewportXYtoTile( x, y );

				if ( cell ) {

					viewport.map.emit( 'cell-mouseup', {
						"cell": cell,
						"which": event.which
					});
				}

			} );

			$( viewport.canvas ).on( 'dblclick', function( event ){

				var x = event.offsetX,
				    y = event.offsetY,
				    cell = viewport.viewportXYtoTile( x, y );

				if ( cell ) {

					viewport.map.emit( 'cell-dblclick', {
						"cell": cell,
						"which": event.which
					});
				}

			} );

			$( '#game > .border.n').mouseenter(function(evt) {
				if ( !evt.shiftKey ) return;
				viewport.joystick = 1; // north
				console.log( 'joystick: north');
			});

			$( '#game > .border.e').mouseenter( function(evt) {
				if ( !evt.shiftKey ) return;
				viewport.joystick = 2; // east
				console.log( 'joystick: east');
			});

			$( '#game > .border.s').mouseenter( function(evt) {
				if ( !evt.shiftKey ) return;
				viewport.joystick = 3; //south
				console.log( 'joystick: south');
			});

			$( '#game > .border.w').mouseenter( function(evt) {
				if ( !evt.shiftKey ) return;
				viewport.joystick = 4; // west
				console.log( 'joystick: east');
			});

			$( '#game > .border.nw').mouseenter( function(evt) {
				if ( !evt.shiftKey ) return;
				viewport.joystick = 5; // north-west
				console.log( 'joystick: north-west');
			});

			$( '#game > .border.ne').mouseenter( function(evt) {
				if ( !evt.shiftKey ) return;
				viewport.joystick = 6; // north-east
				console.log( 'joystick: north-east');
			});

			$( '#game > .border.se').mouseenter( function(evt) {
				if ( !evt.shiftKey ) return;
				viewport.joystick = 7; //south-east
				console.log( 'joystick: south-east');
			});

			$( '#game > .border.sw').mouseenter( function(evt) {
				if ( !evt.shiftKey ) return;
				viewport.joystick = 8; // south-west
				console.log( 'joystick: south-west');
			});

			$('#game > canvas').mouseenter( function() {
				
				viewport.joystick = 0;
				console.log( 'joystick: normal');
			});

			setInterval( function() {
				viewport._joystick();
			}, 50 );

		})( this );

		this.onScroll( 0, 0 );
		
		this.paint();

		eval( 'window.gameVp = this;');
	}

	public paint() {

		this.ctx.fillStyle = "rgb(0,0,0)";

		this.ctx.fillRect( 0, 0, this.vpWidth, this.vpHeight );

		for ( var i = 0, len = this.renderables.length; i<len; i++ ) {

			this.renderables[i].paintAt(
				this,
				( this.renderables[i].x * 32 ) - this.vpX,
				( this.renderables[i].y * 32 ) - this.vpY
			);

		}

		var myself = this;
		
		requestAnimationFrame( function() { myself.paint.call( myself ); } );

	}

	public _joystick() {

		var relX: number = 0,
		    relY: number = 0;

		switch ( this.joystick ) {

			case 0: // center
				return;
				break;

			case 1: // north
				relY = -32;
				break;

			case 2: // east
				relX = 32;
				break;

			case 3: // south
				relY = 32;
				break;

			case 4: // west
				relX = -32;
				break;

			case 5: // north-west
				relX = -32;
				relY = -32;
				break;

			case 6: // north-east
				relX = 32;
				relY = -32;
				break;

			case 7: // south-east
				relX = 32;
				relY = 32;
				break;

			case 8: // south-west
				relX = -32;
				relY = 32;
				break;
		}

		//console.log( "Joystick: relativeX = ", relX, ' relativeY = ', relY );

		this.vpX += relX;
		this.vpY += relY;

		if ( this.vpX < 0 )
			this.vpX = 0;

		if ( this.vpX + this.vpWidth > this.mapWidthPX )
			this.vpX = this.mapWidthPX - this.vpWidth;

		if ( this.vpY + this.vpHeight > this.mapHeightPX )
			this.vpY = this.mapHeightPX - this.vpHeight;

		this.scrollToXY( this.vpX, this.vpY );

	}

	public scrollToXY( x: number, y: number ) {

		this.onScroll( x, y );
	}

}