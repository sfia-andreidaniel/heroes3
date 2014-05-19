class Objects_Entity_Hero extends Objects_Entity {

	public _faction: Faction = null;

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	public $sinchronizable(): boolean {
		return true;
	}

	public $focusable():boolean {
		return true;
	}

	public serialize(): any {
		var out = super.serialize();

		out.data = {
			"faction": this._faction ? this._faction.id : null
		};

		return out;
	}

	get faction(): number {
		return this._faction ? this._faction.id : null;
	}

	set faction( factionId: number ) {
		this._faction = factionId ? this.layer.map.fm.getFactionById( factionId ) : null;
		
		if ( this._faction )
			this._faction.load();
	}

	public unserialize( data: any ) {
		
		if ( data ) {

			this.faction = data.faction;

		}

		console.log( "Hero.unserialize: ", data );
	}


}