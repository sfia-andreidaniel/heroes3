class Objects_Entity_Dwelling extends Objects_Entity {

	public _dwellingType: Dwelling = null;
	public _upgradeLevel: number = 0;

	public population: number = 0;

	//rw    dwellingType: number = null
	//r     name: string
	//rw    upgradeLevel: number = null

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	get dwellingType(): number {
		return this._dwellingType === null
			? null
			: this._dwellingType.id;
	}

	set dwellingType( dwellingTypeId: number ) {
		this._dwellingType = dwellingTypeId === null
			? null
			: this.layer.map.dm.getDwellingTypeById( dwellingTypeId );

		this._upgradeLevel = !!!this._dwellingType
			? 0
			: (	this._upgradeLevel >= this._dwellingType.maxUpgradeLevel
					? this._dwellingType.maxUpgradeLevel - 1
					: this._upgradeLevel
			);
	}

	get name(): string {
		return this._dwellingType === null
			? 'Dwelling'
			: this._dwellingType.levels[ this._upgradeLevel ].name;
	}

	get upgradeLevel(): number {
		return this._upgradeLevel;
	}

	set upgradeLevel( level: number ) {
		this._upgradeLevel = ~~level;
		this._upgradeLevel = !!!this._dwellingType
			? 0
			: (	this._upgradeLevel >= this._dwellingType.maxUpgradeLevel
					? this._dwellingType.maxUpgradeLevel - 1
					: this._upgradeLevel
			);
	}

	public serialize(): any {
		
		var out = super.serialize();

		out.data = {
			"dwellingType" : this.dwellingType,
			"upgradeLevel" : this._upgradeLevel,
			"population"   : this.population
		};

		return out;
	}

	public unserialize( data: any ) {

		if ( data ) {

			this.dwellingType = data.dwellingType || null;
			this._upgradeLevel = data.upgradeLevel || 0;
			this.population = data.population || 0;

		}

	}

	public $sinchronizable():boolean {
		return true;
	}

	public interractWith( obj: Objects_Entity_Hero ) {
		if ( this._dwellingType ) {
			
			console.log( obj.name + " is visiting: " + this.name );

		}
	}

}