class Castles_Manager extends Events {

	public loaded: boolean = false;
	public items: Castle[] = [];


	constructor( public map: AdvMap ) {
		super();

		var f: FS_File = new FS_File( 'resources/tools/castles-list.json', 'json' );

		( function( me ) {

			f.on( 'ready', function() {
				
				for ( var i=0, len = this.data.length; i<len; i++ ) {
					me.items.push( new Castle( this.data[i], me ) );
				}

				me.loaded = true;

				me.emit( 'load' );
			} );

		})( this );

		f.open();

	}

	public getCastleTypeById(  castleTypeId: number ) {

		for ( var i=0, len = this.items.length; i<len; i++ ) {
			if ( this.items[i].id == castleTypeId )
				return this.items[i];
		}
		
		return null;
	}


}