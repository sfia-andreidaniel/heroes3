class Objects_Entity_Hero extends Objects_Entity {

	public _faction  : Faction = null;
	public _heroType : Hero    = null;

	// public rw faction  : number
	// public rw heroType : number
	// public r  name     : string
	// public r  icon     : string

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	public $sinchronizable(): boolean {
		return true;
	}

	public $focusable():boolean {
		return true;
	}

	get heroType(): number {
		return this._heroType ? this._heroType.id : null;
	}

	set heroType( heroTypeId: number ) {
		this._heroType = heroTypeId ? this.layer.map.hm.getHeroTypeById( heroTypeId ) : null;
		
		if ( this._faction )
			this._faction.emit( 'heroes-list-changed' );
	}

	get faction(): number {
		return this._faction ? this._faction.id : null;
	}

	set faction( factionId: number ) {
		
		if ( this._faction )
			this._faction.removeHero( this );

		this._faction = factionId ? this.layer.map.fm.getFactionById( factionId ) : null;
		
		if ( this._faction )
			this._faction.load();

		this._faction.addHero( this );

	}

	get name(): string {
		return this._heroType !== null
			? this._heroType.name
			: '';
	}

	get icon(): string {
		return this._heroType !== null
			? this._heroType.icon
			: '';
	}

	public serialize(): any {
		var out = super.serialize();

		out.data = {
			"faction"  : this.faction,
			"heroType" : this.heroType
		};

		return out;
	}

	public unserialize( data: any ) {
		
		if ( data ) {

			this.faction = data.faction;
			this.heroType = data.heroType;
		}

	}


}