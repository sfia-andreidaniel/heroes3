class Faction_Manager extends Events {

	public loaded  : boolean = false;
	public items   : Faction[] = [];

	constructor() {

		super();

		if ( typeof window != 'undefined' ) {

			(function( me ) {
				
				$.ajax( 'resources/tools/faction.php', {
					"type": "GET",
					"data": {
						"do": "list"
					},
					"success": function( data ) {
						if ( !data || data.error || !data.length )
							me.emit( 'error', 'Bad response from server' );
						else {

							for ( var i=0, len = data.length; i<len; i++ ) {
								me.items.push( new Faction( data[i].id, data[i].name ) );
							}

							me.loaded = true;
							me.emit( 'load' );
						}
					},
					"error": function() {
						me.emit( 'error', 'server error' );
					}
				} );

			})( this );

		} else {
			this.emit( 'error', 'not implemented under node' );
		}

	}

	public getFactionById( id: number ): Faction {
		for ( var i=0, len = this.items.length; i<len; i++ ) {
			if ( this.items[i].id == id ) {
				return this.items[i];
			}
		}
		return null;
	}

}