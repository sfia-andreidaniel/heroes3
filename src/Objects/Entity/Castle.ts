class Objects_Entity_Castle extends Objects_Entity {

	public _castleType: Castle = null;
	public _faction: Faction = null;

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
			? this.layer.map.tm.getCastleTypeById( castleTypeId )
			: null;
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
			"castleType": this.castleType
		};
		
		return out;
	}

	public unserialize( data: any ) {

		if ( data ) {

			this.faction = data.faction;
			this.castleType = data.castleType;

		}

	}

	public $sinchronizable(): boolean {
		return true;
	}

}