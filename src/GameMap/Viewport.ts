/// <reference path="../GameMap.ts" />

class GameMap_Viewport extends Events {

	public mapWidthPX = 0;
	public mapHeightPX = 0;
	
	public vpWidth = 0;   // viewport Width
	public vpHeight = 0;  // viewport Height
	public vpX = 0;       // viewport X
	public vpY = 0;       // viewport Y

	// the canvas and it's context
	public canvas = null;
	public ctx    = null;

	public renderables = [];

	// matrix style systems

	constructor( public map: GameMap, public width: number, public height: number ) {
	    
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

		this.paint();
	}

	public onMapLoaded() {
		
		this.mapWidthPX  = 32 * this.map.width;
		this.mapHeightPX = 32 * this.map.height;

		this.canvas = document.getElementById( 'viewport' );
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


		})( this );

		this.onScroll( 0, 0 );

		eval( 'window.gameVp = this;');
	}

	public paint() {

		this.ctx.fillStyle = "rgb(0,0,0)";

		this.ctx.fillRect( 0, 0, this.vpWidth, this.vpHeight );

	}

}