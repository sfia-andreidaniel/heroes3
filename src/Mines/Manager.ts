class Mines_Manager extends Events {

	// public map: AdvMap
	public loaded: boolean = false;
	public items: Mine[] = [];

	constructor( public map: AdvMap ) {

		super();

		var f: FS_File = new FS_File( 'resources/tools/mines-list.json', 'json' );

		( function( me ) {

			f.on( 'ready', function() {
				
				for ( var i=0, len = this.data.length; i<len; i++ ) {
					me.items.push( new Mine( this.data[i], me ) );
				}

				me.loaded = true;

				me.emit( 'load' );
			} );

		})( this );

		f.open();

	}

	public getMineTypeById( mineTypeId: number ): Mine {

		for ( var i=0, len = this.items.length; i<len; i++ ) {
			if ( this.items[i].id == mineTypeId )
				return this.items[i];
		}
		
		return null;
	}


}