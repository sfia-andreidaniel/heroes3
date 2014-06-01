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

					tpl.parse('');
					
					var dlg: any = null;

					$(tpl.text)[ 'dialog' ]( {
						"width": 870,
						"height": 550,
						"title": castle.name,
						"modal": true,
						"open": function() {
							dlg = this;
							$(dlg).find( 'div.castle-' + castle.castleType + '-tabs' )[ 'tabs' ]();
						},
						"close": function() {
							$(this).remove();
						},
						"buttons": {
							"Ok": function() {
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