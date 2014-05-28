class Resource_Manager extends Events {

	public loaded: boolean = false;
	public items : Resource[] = [];

	constructor( public map: AdvMap ) {
		super();

		var f: FS_File = new FS_File( 'resources/tools/resources-list.json', 'json' );

		( function( me ) {

			f.on( 'ready', function() {
				
				for ( var i=0, len = this.data.length; i<len; i++ ) {
					me.items.push( new Resource( this.data[i], me ) );
				}

				me.loaded = true;

				me.emit( 'load' );
			} );

		})( this );

		f.open();

	}

	public getResourceTypeById(  resourceTypeId: number ): Resource {

		for ( var i=0, len = this.items.length; i<len; i++ ) {
			if ( this.items[i].id == resourceTypeId )
				return this.items[i];
		}
		
		return null;
	}

	public getResourceTypeByType(  resourceTypeType: string ): Resource {

		for ( var i=0, len = this.items.length; i<len; i++ ) {
			if ( this.items[i].type == resourceTypeType )
				return this.items[i];
		}
		
		return null;
	}


}