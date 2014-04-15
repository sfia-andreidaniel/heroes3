/// <reference path="Events.ts" />
/// <reference path="FS/File.ts" />

class GameFS extends Events {

	public files : {};
	public pending: number = 0;
	public count: number = 0;

	constructor( filesLoader: string = 'gamefs.json' ) {
	    
	    super();
	
	     // Content
	}

	public add( localFS: string, realPath: string, loadAs: string = 'text' ) {
		
		if ( typeof this.files[ localFS ] != 'undefined' )
			throw "GameFS: File " + localFS + " is allready added!";

		this.files[ localFS ] = new FS_File( realPath, loadAs );

		this.pending++;
		this.count++;

		( function( me ) {

			me.files[ localFS ].on( 'ready', function() {
				me.pending--;
				me.emit( 'log', 'File: ' + localFS + " loaded" );

				if ( me.pending == 0 )
					me.emit( 'available' );
			});

			me.files[ localFS ].on( 'error', function( reason: string ) {

				me.pending--;
				me.emit( 'log', 'ERROR: ' + localFS + ": " + reason );

				me.files[ localFS ] = null;

				if ( me.pending == 0 )
					me.emit( 'available' );

			});

		})( this );

	}

}