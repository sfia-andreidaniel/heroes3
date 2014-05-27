class Artifacts_Manager extends Events {
	
	public loaded: boolean = false;
	public items: Artifact[] = [];

	constructor( public map: AdvMap ) {
		super();

		var f: FS_File = new FS_File( 'resources/tools/artifacts-list.json', 'json' );

		( function( me ) {

			f.on( 'ready', function() {
				
				for ( var i=0, len = this.data.length; i<len; i++ ) {
					me.items.push( new Artifact( this.data[i], me ) );
				}

				me.loaded = true;

				me.emit( 'load' );
			} );

		})( this );

		f.open();

	}

	public getArtifactTypeById(  artifactTypeId: number ) {

		for ( var i=0, len = this.items.length; i<len; i++ ) {
			if ( this.items[i].id == artifactTypeId )
				return this.items[i];
		}
		
		return null;
	}

}