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
	public castlesList: Objects_Entity_Castle[] = [];

	constructor( public id: number, public name: string ) {
		super();
	}

	/* Test if the faction can support a cost
	 */
	public hasEnoughResources( cost: IResource ): boolean {
		for ( var k in cost ) {
			if ( this.resources[ k ] < 0 )
				return false;
		}
		return true;
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

	public addResources( resources: IResource, callback: any ) {

		if ( !this.loaded )
			throw "Failed to add resource: Faction not loaded!";

		callback = callback || function( error: string = null ) { if ( error ) console.log( error ); };

		if ( typeof window != 'undefined' && window['$'] ) {
			( function( me ) {

				$$.ajax( {
				    "url": 'resources/tools/faction.php?do=add-resources',
					"type": "POST",
					"data": {
						"id": me.id,
						"resources": JSON.stringify( resources )
					},
					"success": function( rsp ) {

						var k: string;

						if ( !rsp || !rsp.ok )
							callback( rsp.error || 'unknown error' );
						else {

							for ( k in resources ) {
								me.resources[ k ] += resources[ k ];
							}

							for ( k in resources ) {
								me.emit( 'estates-changed', k, me.resources[ k ] );
							}

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

	public taxResources( resources: IResource, success: any = null, failure: any = null ) {

		var k         : string,
		    negs      : IResource = {},
		    notHaving : string[] = [];

		for ( k in resources ) {
			
			if ( resources[k] < 0 ) {

				throw "Invalid negative resource value in resources[" + k + "] argument!";

			}

			negs[ k ] = -resources[ k ];

			if ( this.resources[ k ] < resources[ k ] ) {
				notHaving.push( "* You need more " + k + " (have: " + this.resources[k] + ", need: " + ( Math.abs( this.resources[k] - resources[k] ) ) + ")" );
			}

		}

		if ( notHaving.length ) {

			Dialogs.alert( 'You don\'t have enough resources to complete this operation:\n' + notHaving.join( '\n' ), 'Not enough resources', function() {
				
				if ( failure )
					failure();

			});

			return;
		
		}

		this.addResources( negs, function( error: string ) {

			if ( error ) {

				Dialogs.alert( error, 'Error paying resources', function() {
					if ( failure )
						failure();
				});

			} else {

				if ( success )
					success();

			}

		} );


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

	public addCastle( castle: Objects_Entity_Castle ) {

		if ( this.castlesList.indexOf( castle ) == -1 ) {
			this.castlesList.push( castle );
			this.emit( 'castles-list-changed' );
		}

	}

	public removeCastle( castle: Objects_Entity_Castle ) {

		if ( this.castlesList.indexOf( castle ) >= 0 ) {
			this.castlesList.splice( this.castlesList.indexOf( castle ), 1 );
			this.emit( 'castles-list-changed' );
		}

	}

}