class Viewport_Minimap extends Events {

	public canvas: any = null; // Canvas
	public ctx   : any = null; // CanvasRenderingContext2D

	public $node: any = null;   // The Root div element in which the minimap is placed
	public $nodeIn: any = null; // $node > div
	public $nodeVp: any = null; // $node > div > div

	private x : number = 0;
	private y : number = 0;
	public realWidth: number = 0;
	public realHeight: number= 0;

	constructor( public width: number, public height: number, public parent: Viewport ) {
	    
	    super();
	    
	    this.canvas = typeof document != 'undefined'
	    	? document.createElement( 'canvas' )
	    	: ( function() {
	    		var Canvas = require( 'canvas' );
	    		return new Canvas();
	    	} )();

	    this.canvas.width = this.width;
	    this.canvas.height= this.height;

	    this.ctx = this.canvas.getContext( '2d' );

	    ( function( me ) {

	    	me.parent.on( 'update', function() {
	    		me.update();
	    	});

	    } )( this );

	    this.realWidth = width;
	    this.realHeight = height;

	    if ( typeof document != 'undefined' ) {

	    	this.$node = document.createElement( 'div' );

	    	$(this.$node).css({
	    		"width": this.width + "px",
	    		"height": this.height + "px",
	    		"position": "relative"
	    	});

	    	$(this.$node).addClass( 'minimap-dom' );

	    	this.$nodeIn = this.$node.appendChild( 
	    		document.createElement( 'div' ) 
	    	);

	    	$(this.$nodeIn).css({
	    		"display": "block",
	    		"margin": "0",
	    		"position": "relative",
	    		"width": this.width + "px",
	    		"height": this.height + "px",
	    		"overflow": "hidden",
	    		"background-color": "#111"
	    	});

	    	this.$nodeIn.appendChild( this.canvas );

	    	$(this.canvas).css({
	    		"position": "absolute",
	    		"left": "0px",
	    		"right": "0px",
	    		"top": "0px",
	    		"bottom": "0px",
	    		"display": "block",
	    		"z-index": "1"
	    	});

	    	this.$nodeVp = this.$nodeIn.appendChild(
	    		document.createElement( 'div' )
	    	);

	    	$(this.$nodeVp).css({
	    		"z-index": "3",
	    		"cursor": "move",
	    		"outline": "2px solid red",
	    		"display": "block",
	    		"width": "10px",
	    		"height": "10px",
	    		"position": "absolute",
	    		"top": "0px",
	    		"left": "0px"
	    	});

	    	( function( me ) {
		    	$(me.$nodeVp)['draggable']({
		    		"containment": "parent",
		    		"drag": function() {

		    			var y = ~~( me.parent.map.rows * me.$nodeVp.offsetTop / me.realHeight ),
		    			    x = ~~( me.parent.map.cols * me.$nodeVp.offsetLeft / me.realWidth );

		    			me.parent.scrollToXY( x, y );
		    		}
		    	});
	    	})( this );

	    }

    	this.computeSizes();
	}

	// on computeSizes method, we're determining the
	// dimensions of the canvas and $node* elements
	public computeSizes() {
		var mapPxWidth = this.parent.map.cols * this.parent.tileWidth,
		    mapPxHeight= this.parent.map.rows * this.parent.tileHeight,
		    scale: number = 0,
		    placeX: number = 0,
		    placeY: number = 0;

		if ( mapPxWidth < this.width && mapPxHeight < this.height ) {
			scale = 1;
		} else {
			scale = Math.min( this.width, this.height ) / Math.max( mapPxWidth, mapPxHeight );
		}

		this.realWidth = mapPxWidth * scale;
		this.realHeight = mapPxHeight * scale;

		placeX = ~~( ( this.width - this.realWidth ) / 2 );
		placeY = ~~( ( this.height- this.realHeight ) / 2 );

		if ( this.$nodeIn ) {
			$( this.$nodeIn ).css({
				"width": ~~this.realWidth + "px",
				"height": ~~this.realHeight + "px",
				"marginLeft": placeX + "px",
				"marginTop": placeY + "px"
			});
		}

		this.canvas.width = ~~this.realWidth;
		this.canvas.height= ~~this.realHeight;

		this.update();

	}

	public update() {
		// Basically, we're triggering this event when
		// the viewport changes it's paintables.

		if ( !this.$nodeVp )
			return;

		var mapPxWidth = this.parent.map.cols * this.parent.tileWidth,
		    mapPxHeight= this.parent.map.rows * this.parent.tileHeight;

		this.$nodeVp.style.width = ~~( this.realWidth / ( mapPxWidth / this.parent._width ) ) + "px";
		this.$nodeVp.style.height= ~~( this.realHeight / ( mapPxHeight / this.parent._height ) ) + "px";
		
		this.$nodeVp.style.top   = ~~( 
			this.realHeight / ( 
					( mapPxHeight / this.parent.tileHeight )
			)  * this.parent.y
		) + "px";
		
		this.$nodeVp.style.left  = ~~(
			this.realWidth / (
					( mapPxWidth / this.parent.tileWidth )
			) * this.parent.x
		) + "px";
	}

	public paint() {

		/* The paint method paints the surface of the canvas
		   according to the map terrain */

		var mapPxWidth = this.parent.map.cols * this.parent.tileWidth,
		    mapPxHeight= this.parent.map.rows * this.parent.tileHeight,
		    localTileWidth = this.realWidth / mapPxWidth,
		    localTileHeight= this.realHeight / mapPxHeight,
		    cell: Cell,
		    layers = [],
		    colors = [],

		    col, cols, row, rows, i, len, k, n, index,

		    shouldAddTileset: boolean = false,

		    x: number,
		    y: number,
		    x1: number = Math.round( -localTileWidth ),
		    y1: number = Math.round( -localTileHeight );

		    x1 = x1 == 0 ? -1 : x1;
		    y1 = y1 == 0 ? -1 : y1;

		    var
		    x2: number = -x1,
		    y2: number = -y1;

		for ( i=0, len = this.parent.map.layers.length; i<len; i++ ) {
			if ( this.parent.map.layers[i]['tileset'] ) {
				
				shouldAddTileset = true;
				colors = [];

				for ( k=0, n = this.parent.map.layers[i]['tileset'].terrains.length; k<n; k++ ) {
					if ( !this.parent.map.layers[i]['tileset'].terrains[k].color ) {
						shouldAddTileset = false;
						break;
					} else {
						colors.push( this.parent.map.layers[i]['tileset'].terrains[k].color );
					}
				}

				if ( shouldAddTileset )
				layers.push( {
					"t": this.parent.map.layers[i]['tileset'],
					"i": i,
					"colors": colors
				} );
			}
		}

		this.ctx.fillStyle = '#000';
		this.ctx.fillRect( 0, 0, this.realWidth, this.realHeight );

		n = layers.length - 1;

		console.log( localTileWidth, localTileHeight );

		for ( col = 0, cols = this.parent.map.cols; col < cols; col++ ) {
			for ( row = 0, rows = this.parent.map.rows; row < rows; row++ ) {

				cell = this.parent.map.cellAt( col, row );

				for ( k = n; k>=0; k-- ) {
					index = cell.getData( layers[n].i );

					if ( index !== null ) {
						// draw rectangle on minimap
						
						this.ctx.fillStyle = layers[n].colors[index];

						x = ~~( col * localTileWidth );
						y = ~~( col * localTileHeight );

						this.ctx.fillRect( x - x1, y - y1, x2 * 2, y2 * 2 );


						break;
					}
				}

			}
		}

	}

}