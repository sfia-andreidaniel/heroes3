class FS extends Events {

	public files = {};
	public pending: number = 0;
	public count: number = 0;

    public cache = {};

	constructor( ) {
	    super();
	}

	public add( localFS: string, realPath: string, loadAs: string = 'text', data: {} = null ): FS_File {
		
		if ( this.files[ localFS ] )
			throw "GameFS: File " + localFS + " is allready added!";

		this.files[ localFS ] = new FS_File( realPath, loadAs, data );

		this.pending++;
		this.count++;

		( function( me ) {

			me.files[ localFS ].on( 'ready', function() {
				me.pending--;
				me.emit( 'log', 'File: ' + localFS + " loaded" );

				if ( me.pending == 0 )
					me.emit( 'ready' );
			});

			me.files[ localFS ].on( 'error', function( reason: string ) {

				me.pending--;
				me.emit( 'log', 'ERROR: ' + localFS + ": " + reason );

				me.files[ localFS ] = null;

				if ( me.pending == 0 )
					me.emit( 'ready' );

			});

		})( this );

        this.files[ localFS ].open();

        return this.files[ localFS ];
	}

    public open( filePath: string ) {

        if ( !this.files[ filePath ] )
            throw "File " + filePath + " not found!";

        return this.files[ filePath ];
    }


    public unpackResource( href: string ) {

        var fragment = /\#([^\#]+)$/.exec( href ),
            path     = /^([^#]+)(\#|$)/.exec( href ),
            decodedFragment: any = '',
            decodedPath: string     = '',
            f: FS_File,
            data: any,

            src = '';

        decodedFragment = fragment ? fragment[1] : null;
        decodedPath     = path ? path[1] : '';

        f = this.open( decodedPath );

        if ( decodedFragment ) {

            if ( f.readAs != 'json' )
                throw "The resource: " + decodedPath + " was not read as json in order to support fragment!";

            decodedFragment = decodedFragment.split( '.' );

            data = f.data;

            while ( decodedFragment.length ) {
                
                if ( typeof data[ decodedFragment[0] ] == 'undefined' )
                    throw "In resource: " + decodedPath + ", cannot resolve fragment: ..." + decodedFragment.join( '.' );
                
                data = data[ decodedFragment[0] ];

                decodedFragment = decodedFragment.slice( 1 );

            }

            src = data;

        } else src = f.data;

        return src;

    }

}