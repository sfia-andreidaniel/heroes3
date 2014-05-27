class Faction extends Events {

	public loaded = false;

	public resources: IResources = null;/* {
		"gold"    : 0,
		"wood"    : 0,
		"ore"     : 0,
		"crystals": 0,
		"mercury" : 0,
		"sulfur"  : 0,
		"gems"    : 0,
		"mithril" : 0
	} */

	public heroesList: Objects_Entity_Hero[] = [];

	constructor( public id: number, public name: string ) {
		super();
	}

	public load(): Faction {

		if ( this.loaded ) {
			this.emit( 'load' );
			return this;
		}

		if ( typeof window != 'undefined' ) {

			( function( me ) {

				$$.ajax({
				    "url": 'resources/tools/faction.php',
					"type": "GET",
					"data": {
						"do": "load-faction",
						"id": me.id
					},
					"success": function( response ) {
						if ( !response || response.error ) {
							me.emit( 'error', 'Unknown server response' );
						} else {
							me.resources = {
								"gold"     : response.gold     || 0,
								"wood"     : response.wood     || 0,
								"ore"      : response.ore      || 0,
								"crystals" : response.crystals || 0,
								"mercury"  : response.mercury  || 0,
								"sulfur"   : response.sulfur   || 0,
								"gems"     : response.gems     || 0,
								"mithril"  : response.mithril  || 0
							};

							me.loaded = true;

							me.emit( 'load' );
							me.emit( 'estates-changed' );
						}
					},
					"error": function() {
						me.emit( 'error', 'server error' );
					}
				});

			})( this );

		} else {
			this.emit( 'error', 'Not loadable under node js - not implemented' );
		}

		return this;
	}

	public addResource( resource: string, amount: number, callback: any ) {

		if ( !this.loaded )
			throw "Failed to add resource: Faction not loaded!";

		if ( [ "gold", "wood", "ore", "crystals", "mercury", "sulfur", "gems", "mithril" ].indexOf( resource ) == -1 )
			throw "Invalid resource";

		callback = callback || function( error: string = null ) { if ( error ) console.log( error ); };

		if ( typeof window != 'undefined' && window['$'] ) {
			( function( me ) {

				$$.ajax( {
				        "url": 'resources/tools/faction.php',
					"type": "GET",
					"data": {
						"do": "add-resource",
						"id": me.id,
						"resource": resource,
						"amount": amount
					},
					"success": function( rsp ) {
						if ( !rsp || !rsp.ok )
							callback( rsp.error || 'unknown error' );
						else {

							me.resources[ resource ] += amount;
							me.emit( 'estates-changed', resource, me.resources[ resource ] );

							callback();
						}
					},
					"error": function() {
						callback("server error");
					}
				} );

			})( this );

		} else {
			callback( "not implemented under node.");
		}

	}

	// used after loading a map.
	public reset() {
		this.heroesList = [];
		this.emit( 'heroes-list-changed' );
	}

	public addHero( hero: Objects_Entity_Hero ) {

		if ( this.heroesList.indexOf( hero ) == -1 ) {
			this.heroesList.push( hero );
			this.emit( 'heroes-list-changed' );
		}

	}

	public removeHero( hero: Objects_Entity_Hero ) {

		if ( this.heroesList.indexOf( hero ) >= 0 ) {
			this.heroesList.splice( this.heroesList.indexOf( hero ), 1 );
			this.emit( 'heroes-list-changed' );
		}

	}

}