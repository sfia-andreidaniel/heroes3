class Objects_Item extends Events {

	public readyState: number = 0;     // the object loading state: 0: not loaded, 1: loading, 2: loaded, 3: error
	public loaded : boolean = false;   // weather the object is loaded or not

	// public store: Objects = null;   // reference to map.objects

	public id     : number = 0;        // the unique id of the object type
	public name   : string = '';       // the name of the object
	
	public cols   : number = 0;        // # of tiles widh occupying on the map
	public rows   : number = 0;        // # of tiles height occupying on the map

	public width  : number = 0;
	public height : number = 0;

	public tileWidth: number = 0;
	public tileHeight: number = 0;

	public collision: any = null;      // [ [ 0, 1 ], [ 1, 0 ], ..., [ 0, 0 ] ]
	public animated: boolean = null;   // weather the object is or not animated
	public frames: number = 0;
	
	public hsx: number = 0;
	public hsy: number = 0;

	public sprite: Picture = null;

	constructor( data: any, public store: Objects ) {

		super();

		this.id = data.id;
		this.name = data.name;
		this.cols = data.cols;
		this.rows = data.rows;
		this.width = data.width;
		this.height = data.height;

	}

	public load() {
		
		if ( this.readyState != 0 )
			return this;

		this.readyState = 1;

		var f: FS_File = new FS_File( 'resources/objects/' + this.name + '.json', 'json' );

		( function( me ) {
			
			f.once( 'ready', function() {
				
				/* Setup additional fields */
				me.collision = this.data.collision  || null; // object does not support collision
				
				me.animated  = this.data.animated   || false;
				me.frames    = this.data.frames     || 0;
				me.tileWidth = this.data.tileWidth  || 0;
				me.tileHeight= this.data.tileHeight || 0;

				if ( !this.data.pixmap ) {
					
					me.readyState = 2;
					me.loaded = true;
					me.emit( 'load' );

				} else {

					me.sprite = new Picture( this.data.pixmap );

					me.sprite.once( 'load', function() {
						me.readyState = 2;
						me.loaded = true;
						me.emit( 'load' );
					});

					me.sprite.once( 'error', function() {
						me.readyState = 3;
						me.emit( 'error', 'The object has been loaded, but it\'s sprite not' );
					})
				}


			} );

			f.once( 'error', function() {
				me.readyState = 3;
				me.emit( 'error', "Failed to load object!" );
			} );

		})( this );
		
		f.open();

		return this;
	}

	public saveProperties( properties: string[] ) {
		throw "Not implemented";
	}

}