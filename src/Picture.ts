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
	public width  : number = 0;
	public height : number = 0;

	constructor( src ) {

	    super();
	     // Content

	    if ( typeof global == 'undefined' ) {

	    	this.node = new Image();

		    ( function( self ) {
				
				self.node.onload = function() {
					self.loaded = true;
					self.width = self.node.width;
					self.height= self.node.height;
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
		    
		    (function(me){
			    setTimeout( function() {me.emit( 'load' ); }, 30 );
 			})( this );
		}
	}

}