class Objects_Entity_Castle extends Objects_Entity {

	public _castleType: Castle = null;
	public _faction: Faction = null;
	
	public buildings: Objects_Entity_Castle_BuildingsManager = new Objects_Entity_Castle_BuildingsManager( this );

	//public rw castleType: number
	//get    rw faction: number
	//public r  name: string

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	get castleType(): number {
		return this._castleType
			? this._castleType.id
			: null;
	}

	set castleType( castleTypeId: number ) {

		this._castleType = castleTypeId
			? ( this.layer.map.tm.getCastleTypeById( castleTypeId ) )
			: null;

		if ( this._castleType ) {
			this.buildings.loadInitialConfig( this._castleType.buildings );
		}
	}

	get faction(): number {
		return this._faction
			? this._faction.id
			: null;
	}

	set faction( factionId: number ) {

		if ( this._faction )
			this._faction.removeCastle( this );

		this._faction = factionId
			? this.layer.map.fm.getFactionById( factionId )
			: null;

		if ( this._faction ) {
			this._faction.load();
			this._faction.addCastle( this );
		}

	}

	get name(): string {
		return this._castleType
			? this._castleType.name
			: 'Town';
	}

	public serialize(): any {
		var out = super.serialize();
		
		out.data = {
			"faction": this.faction,
			"castleType": this.castleType,
			"buildings": this.buildings.serialize()
		};
		
		return out;
	}

	public unserialize( data: any ) {

		if ( data ) {

			this.faction = data.faction;
			this.castleType = data.castleType;

			this.buildings.unserialize( data.buildings );

		}

	}

	public $sinchronizable(): boolean {
		return true;
	}

	public edit() {
		(function( castle ) {

			$$.ajax( {
				"url": "tools/game/castle/editor.tpl",
				"type": "GET",
				"success": function( buffer: string ) {
					var tpl = new XTemplate( buffer );
					
					tpl.assign( 'castle_id', castle.castleType );
					tpl.assign( 'castle_type_id', castle._castleType
						? castle._castleType.castleTypeId + ''
						: '0' 
					);

					tpl.parse('');
					
					var dlg: any = null;

					var renderTown = function() {
						
						var out: string[] = [],
						    mageGuildLevel = 0,
						    fortLevel = 0,
						    hallLevel = 0,
						    blacksmithLevel = 0,
						    marketPlaceLevel = 0,
						    tavernLevel = 0,
						    i: number,
						    len: number,
						    setClasses: string[] = [];

						// find fort level
						for ( i=0, len = castle.buildings.fort.length; i<len; i++ )
							if ( castle.buildings.fort[i].built )
								fortLevel = i + 1;

						if ( fortLevel )
							out.push( '<div class="building fort level-' + fortLevel + '"></div>' );

						// find hall level
						for ( i=0, len = castle.buildings.hall.length; i<len; i++ )
							if ( castle.buildings.hall[i].built )
								hallLevel = i + 1;

						out.push( '<div class="building hall level-' + hallLevel + '"></div>' );

						// find mage guild level
						for ( i=0, len = castle.buildings.mageGuild.length; i<len; i++ )
							if ( castle.buildings.mageGuild[i].built )
								mageGuildLevel = i + 1;

						if ( mageGuildLevel )
							out.push( '<div class="building mage-guild level-' + mageGuildLevel + '"></div>' );

						// find blacksmith level
						for ( i=0, len = castle.buildings.blacksmith.length; i<len; i++ )
							if ( castle.buildings.blacksmith[i].built )
								blacksmithLevel = i + 1;

						// find tavern level
						for ( i=0, len = castle.buildings.tavern.length; i<len; i++ )
							if ( castle.buildings.tavern[i].built )
								tavernLevel = i + 1;

						// find market place level
						for ( i=0, len = castle.buildings.market.length; i<len; i++ )
							if ( castle.buildings.market[i].built )
								out.push( '<div class="building market level-' + ( i+1 ) + '"></div>' );

						// other buildings
						for ( i=0, len = castle.buildings.other.length; i<len; i++ )
							if ( castle.buildings.other[i].built ) {
								out.push( '<div class="building other id-' + castle.buildings.other[i].id + '"></div>' );
								setClasses.push( 'has-building-' + castle.buildings.other[i].id );
							}

						// dwellings buildings
						for ( i=0; i<7; i++ ) {

							if ( !castle.buildings.dwelling[i * 2] || !castle.buildings.dwelling[ i * 2 + 1 ] )
								continue;

							if ( castle.buildings.dwelling[ i * 2 + 1 ].built ) {
								out.push( '<div class="building dwelling level-' + ( i + 1 ) + ' upgraded"></div>' );
								setClasses.push( 'has-dwelling-level-' + ( i + 1 ) );
							} else {
								if ( castle.buildings.dwelling[ i * 2 ].built ) {
									out.push( '<div class="building dwelling level-' + ( i + 1 ) + '"></div>' );
									setClasses.push( 'has-dwelling-level-' + ( i + 1 ) );
								}
							}

						}

						if ( blacksmithLevel )
							out.push( '<div class="building blacksmith"></div>' );

						if ( tavernLevel )
							out.push( '<div class="building tavern"></div>');

						out.push( '<div class="building other aux" ></div>' );

						$(dlg).find( '.town-background' ).html( out.join( '\n' ) );

						$(dlg).find( '.town-background' ).each( function() {
							this.className = this.className.split( ' ' ).slice( 0, 2 ).join( ' ' ) + ' ' + setClasses.join( ' ' );
						});

					};

					var renderBuildables = function() {
						var out: string[] = [],
						    buildings = castle.buildings.buildableBuildings();

						for ( var i=0, len = buildings.length; i<len; i++ ) {
							out.push([

								'<div class="buildable" data-building-id="' + buildings[i].id + '">',
									'<div class="g-tbld id-' + buildings[i].id + '"></div>',
									'<div class="title">' + buildings[i].name + '</div>',
								'</div>'

							].join( '' ) );
						}

						$(dlg).find( '#castle-' + castle.castleType + '-build' ).html( out.join( '\n' ) );

						$(dlg).find( '#castle-' + castle.castleType + '-build > .buildable' ).on( 'click', function() {

							var buildingId = ~~$(this).attr('data-building-id'),
							    building   = castle.buildings.getBuildingById( buildingId );

							if ( !building )
								return;

							
							$(dlg).find( 'li[data-role=town] > a' ).click();

							setTimeout( function() {
								building.build();
							}, 300 );

						});

					};

					$(tpl.text)[ 'dialog' ]( {
						"width": 870,
						"height": 550,
						"title": castle.name,
						"modal": true,
						"open": function() {
							
							dlg = this;
							
							$(dlg).find( 'div.castle-' + castle.castleType + '-tabs' )[ 'tabs' ]();
							
							castle.on( 'buildings-changed', renderBuildables );
							castle.on( 'buildings-changed', renderTown );

							castle.emit( 'buildings-changed' );

						},
						"close": function() {
							castle.removeListener( 'buildings-changed', renderBuildables );
							castle.removeListener( 'buildings-changed', renderTown );
							$(this).remove();
						},
						"buttons": {
							"Ok": function() {
								castle.removeListener( 'buildings-changed', renderBuildables );
								castle.removeListener( 'buildings-changed', renderTown );
								$(this).remove();
							}
						}
					} );
				},
				"error": function() {
					alert( "Error editing castle" );
				}	

			} );

		} )( this );		
	}

}