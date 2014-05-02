/// <reference path="../Events.ts" />
/// <reference path="../declare/std/jquery.d.ts" />
/// <reference path="../declare/node/node.d.ts" />

class FS_File extends Events {
    
    public data   : any   = null;
    public loaded : boolean = false;

	constructor( public name: string, public readAs: string = 'text', public fileData: {} = null ) {
	    super();
	}

    public open() {
	    
	    // node wrapper
	    
	    if ( typeof global !== 'undefined' ) {
                
                ( function( f ) {

                	if ( f.fileData === null ) {

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

	                } else {

	                	/* If the file name is not ending in .php, we don't allow
	                	   mounting the file */

	                	if ( !/\.php$/.test( f.name ) ) {
	                		console.log( 'Warning: File: ' + f.name + ' not ending in .php!' );
	                		f.data = null;
	                		f.emit( 'error', 'Failed to mount non-php file!' );
	                		return;
	                	}

	                	var spawn = require( 'child_process' ).spawn,
	                		args,
	                	    proc  = spawn( 'php', args = (function(args: {} ) {
	                	    	var out = [ f.name ];
	                	    	for ( var k in args ) {
	                	    		out.push( k + '=' + args[k] );
	                	    	}
	                	    	return out;
	                	    })( f.fileData ) );

	                	console.log( "FS.Process: " + f.name + ' ' + args.slice(1).join( ' ' ) );
	                	var out: string = '';

	                	proc.stdout.on( 'data', function( data ) {
	                		out += data.toString();
	                	});

	                	proc.on( 'close', function() {

	                		f.data = out;

	                		if ( f.readAs == 'json' ) {

	                			try {
	                				f.data = JSON.parse( f.data );
	                				f.emit( 'ready' );
	                			} catch ( Exception ) {
	                				f.data = null;
	                				f.emit( 'error', Exception + '' );
	                			}

	                		} else {

	                			f.emit( 'ready' );

	                		}

	                	});

	                }

            	} )( this );
                
	    } else {

	    	( function( f ) {

	    		var params = {
	    			"success": function( data: string ) {
	    				f.data = data;
	    				f.emit( 'ready' );
	    			},
	    			"error": function( error ) {
	    				f.emit( 'error', 'Failed to load file: ' + f.name, error );
	    			},
	    			"dataType": f.readAs == 'json' ? 'json' : "text",
	    			"cache": false
	    		};

	    		if ( f.fileData !== null ) {
	    			params['data'] = f.fileData;
	    		}

	    		$.ajax( f.name, params );

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