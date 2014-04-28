/// <reference path="../Events.ts" />
/// <reference path="../declare/std/jquery.d.ts" />
/// <reference path="../declare/node/node.d.ts" />

class FS_File extends Events {
    
    public data   : any   = null;
    public loaded : boolean = false;

	constructor( public name: string, public readAs: string = 'text' ) {
	    super();
	}

    public open() {
	    
	    // node wrapper
	    
	    if ( typeof global !== 'undefined' ) {
                
                ( function( f ) {

		                var fs = require('fs');
	                
	    	            fs.readFile( f.name, function( err, data ) {

	    	            	if ( err ) {

	    	            		f.emit( 'error', 'Failed to open file: ' + f.name );

	    	            	} else {

	    	            		if ( f.readAs == 'json' ) {

	    	            			try {

	    	            				f.data = JSON.parse( data.toString( 'utf8' ) );

	    	            				f.emit( 'ready' );

	    	            			} catch ( error ) {

	    	            				f.data = null;

	    	            				f.emit( 'error', 'Failed to decode file contents as json!: ' + error );

	    	            				// console.log( data.toString( 'utf8' ) );

	    	            			}

	    	            		} else {
	    	            			f.data = data.toString( 'utf8' );
	    	            			f.emit( 'ready' );
	    	            		}

	    	            	}

	                	} );

            	} )( this );
                
	    } else {

	    	( function( f ) {

	    		$.ajax( f.name, {
	    			"success": function( data: string ) {
	    				f.data = data;
	    				f.emit( 'ready' );
	    			},
	    			"error": function( error ) {
	    				f.emit( 'error', 'Failed to load file: ' + f.name, error );
	    			},
	    			"dataType": f.readAs == 'json' ? 'json' : "text",
	    			"cache": false
	    		} );

	    	} )( this );

	    }

	    return this;

    }

}

/*
var f = new FSFile( 'foo.json', 'json' );

f.on('error', function( reason ) {
	console.log( reason );
});

f.on( 'ready', function() {
	console.log( f.name, ": loaded" );
	console.log( "Contents of ", this.name, ": ", this.data, " of type ", typeof this.data );
});

f.open();
*/