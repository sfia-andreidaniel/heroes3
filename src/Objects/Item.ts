class Objects_Item extends Events {

	public readyState: number = 0;     // the object loading state: 0: not loaded, 1: loading, 2: loaded, 3: error
	public loaded : boolean = false;   // weather the object is loaded or not

	// public store: Objects = null;   // reference to map.objects

	public id               : number = 0;      // the unique id of the object type
	public name             : string = '';     // the name of the object
	public caption          : string = '';     // the human visible name of the object
	public keywords			: string[] = null; // keywords in this object
	
	public cols             : number = 0;      // # of tiles widh occupying on the map
	public rows             : number = 0;      // # of tiles height occupying on the map

	public width            : number = 0;      // the width in pixels of the object
	public height           : number = 0;      // the height in pixels of the object

	public tileWidth        : number   = 0;    // the width in pixels of a tile of the object
	public tileHeight       : number   = 0;    // the height in pixels of a tile of the object

	public collision        : any      = null; // [ [ 0, 1 ], [ 1, 0 ], ..., [ 0, 0 ] ]

	public animated         : boolean  = null; // weather the object is or not animated
	public animationGroups             = [];   // animation groups

	public frames           : number   = 0;    // number of total frames in the object
	
	public hsx              : number   = 0;    // placeable hotspot x, needed for relative drawing
	public hsy              : number   = 0;    // placeable hotspot y, needed for relative drawing
	
	public epx              : number   = 0;    // entry point X, used when hero is visiting the object
	public epy				: number   = 0;    // entry point Y, used when hero is visiting the object

	public type             : number   = 0;    // object type
	public objectClass      : string   = null; // the class of the object

	public sprite           : Picture  = null; // object sprite, containing all frames

	public dynamics         = { "walk": false, "swim": false, "fly": false };

	constructor( data: any, public store: Objects ) {

		super();

		this.id = data.id;
		this.name = data.name;
		this.cols = data.cols;
		this.rows = data.rows;
		this.width = data.width;
		this.height = data.height;
		this.type = data.type;
		this.caption = data.caption;
		this.keywords = data.keywords;
		this.objectClass = data.objectClass;
		this['dynamics'] = data.dynamics;
	}

	public load() {
		
		if ( this.readyState != 0 )
			return this;

		this.readyState = 1;

		var f: FS_File = new FS_File( 'resources/tools/object.php', 'json', { "id": this.id } );

		( function( me ) {
			
			f.once( 'ready', function() {
				
				/* Setup additional fields */
				me.collision = this.data.collision  || null; // object does not support collision
				
				me.animated        = this.data.animated   || false;
				me.frames          = this.data.frames     || 0;
				me.tileWidth       = this.data.tileWidth  || 0;
				me.tileHeight      = this.data.tileHeight || 0;
				me.animationGroups = this.data.animationGroups || [ [ 0 ] ];
				me.epx             = this.data.epx        || 0;
				me.epy             = this.data.epy        || 0;
				me.hsx 			   = this.data.hsx		  || 0;
				me.hsy			   = this.data.hsy		  || 0;


				me.sprite = new Picture( 
					this.data.pixmap ? this.data.pixmap : this.data.frame, 
					[ "Hero", "Hero_Embarked" ].indexOf( me.objectClass ) >= 0
				);

				me.sprite.once( 'load', function() {
					me.readyState = 2;
					me.loaded = true;
					me.emit( 'load' );
				});

				me.sprite.once( 'error', function() {
					me.readyState = 3;
					me.emit( 'error', 'The object has been loaded, but it\'s sprite not' );
				});

				try {
					<Layer_Movement> (me.store.map.layers[ 5 ])._throttlerCompute();
				} catch ( none ) {}

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

	/* Returns the layer on which this object can be placed */
	public getDestinationLayerIndex(): number {

		switch(  this.objectClass ) {

			case 'Tileset':
				return 2;
				break;

			case 'Hero_Embarked':
			case 'Hero':
			case 'AdventureItem':
			case 'Artifact':
			case 'Castle':
			case 'Dwelling':
			case 'Mine':
			case 'Resource':
				return 3;
				break;

			default:
				return 3;

		}

		switch ( this.type ) {
			case 4: // adventure map item
				return 3; // moveable objects
				break;
			case 3:
				return 2; // static objects
				break;
			default:
				return null;
				break;
		}
	}

}