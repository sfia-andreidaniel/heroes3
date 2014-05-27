class Creatures_Manager extends Events {
	// public map: AdvMap
	public items: Creature[] = [];

	constructor ( public map: AdvMap ) {

		super();

		var f: FS_File = new FS_File( 'resources/tools/creatures-list.json', 'json' );

		( function( me ) {

			f.on( 'ready', function() {
				
				for ( var i=0, len = this.data.length; i<len; i++ ) {
					me.items.push( new Creature( this.data[i], me ) );
				}

				me.loaded = true;

				me.emit( 'load' );
			} );

		})( this );

		f.open()

	}

	public getCreatureTypeById( creatureTypeId: number ) {
		
		for ( var i=0, len = this.items.length; i<len; i++ ) {
			if ( this.items[i].id == creatureTypeId )
				return this.items[i];
		}

		return null;
	}

}