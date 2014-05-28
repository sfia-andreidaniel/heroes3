class Objects_Entity_Mine extends Objects_Entity {

	public _mineType: Mine    = null;
	public _faction : Faction = null;

	// public rw mineType : number
	// public r name      : string
	// public rw faction  : number

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	get mineType(): number {
		return this._mineType === null
			? null
			: this._mineType.id;
	}

	set mineType( mineTypeId: number ) {
		this._mineType = mineTypeId === null
			? null
			: this.layer.map.mm.getMineTypeById( mineTypeId );
	}

	get name(): string {
		return this._mineType
			? this._mineType.name
			: 'Mine';
	}

	get faction(): number {
		return this._faction ? this._faction.id : null;
	}

	set faction( factionId: number ) {
		
		this._faction = factionId ? this.layer.map.fm.getFactionById( factionId ) : null;
		
		if ( this._faction )
			this._faction.load();

	}


	public serialize(): any {
		
		var out = super.serialize();

		out.data = {
			"mineType": this.mineType,
			"faction" : this.faction
		};

		return out;
	}

	public unserialize( data: any ) {

		if ( data ) {
			this.mineType = data.mineType;
			this.faction  = data.faction;
		}
		
	}


	public $sinchronizable(): boolean {
		return true;
	}

	public interractWith( obj: Objects_Entity_Hero ) {
		if ( this._mineType ) {
			console.log("Hero " + obj.name + " is interracting with Mine: ", this );
		}
	}


}