class GameMap_Image extends Events {

	public loaded : boolean = false;
	public error  : string = null;

	public node    : any; // should be of type DOM.Image or NodeJS.Image

	constructor( src ) {

	    super();
	     // Content

	    this.node = document.createElement( 'img' );

	    ( function( self ) {
			
			self.node.onload = function() {
				this.loaded = true;
	    	}

	    	self.node.onerror = function() {
	    		this.error = 'Error loading image';
	    	}

	    } )( this );
	    
	    this.node.src = src;
	}

}