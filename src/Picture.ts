if ( typeof global != 'undefined' ) {

	var NodeImage = ( function() {

		var canvas = require( 'canvas' ),
		    Image = canvas.Image;

		return Image;

	} )();

}

class Picture extends Events {

	public loaded : boolean = false;
	public error  : string = null;

	public node    : any; // should be of type DOM.Image or NodeJS.Image
	public nodeX   : any = null; // the flipped version of the image ( HTMLCanvasElement, under browser only )

	public width  : number = 0;
	public height : number = 0;

	constructor( src, allowFlippingX: boolean = false ) {

	    super();
	     // Content

	    if ( typeof global == 'undefined' ) {

	    	this.node = new Image();

		    ( function( self ) {
				
				self.node.onload = function() {
					self.width = self.node.width;
					self.height= self.node.height;

					if ( allowFlippingX ) {

						var canvas = document.createElement( 'canvas' );
						canvas.width = self.width;
						canvas.height= self.height;
						var context = canvas.getContext( '2d' );

						context.save();
						context.scale( -1, 1 );

						context.drawImage(
							self.node,
							-self.width, 0
						);

						context.restore();

						self.nodeX = canvas;

					} else self.nodeX = null;

					self.loaded = true;
					self.emit( 'load' );
		    	};

		    	self.node.onerror = function() {
		    		self.error = 'Error loading image';
		    		self.emit( 'error' );
		    	};

		    } )( this );

		    this.node.src = src;

		} else {

		    var buffer = new Buffer( src.split( 'base64,' )[1], 'base64' );

		    this.node = new NodeImage();

		    this.node.src = buffer;

		    this.width = this.node.width;
		    this.height= this.node.height;

		    this.loaded = true;
		    
		    this.nodeX = null; // we don't need this under node.

		    (function(me){
			    setTimeout( function() {me.emit( 'load' ); }, 1 );
 			})( this );
		}
	}

}