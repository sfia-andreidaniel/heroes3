class Hero_Manager extends Events {

	public loaded: boolean = false;
	public items: Hero[] = [];

	constructor( public map: AdvMap ) {
		super();

		var f: FS_File = new FS_File( 'resources/tools/heroes.php', 'json', {} );

		( function( me ) {

			f.on( 'ready', function() {

				for ( var i=0, len = this.data.length; i<len; i++ ) {
					me.items.push( new Hero( this.data[i], me ) );
				}

				me.loaded = true;

				me.emit( 'load' );

			} );

			f.open();

		})( this );
	}

	public getHeroTypeById( heroTypeId: number ) {

		for ( var i=0, len = this.items.length; i<len; i++ ) {
			if ( this.items[i].id == heroTypeId )
				return this.items[i];
		}

		return null;

	}

}