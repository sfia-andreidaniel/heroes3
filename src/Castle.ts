class Castle extends Events {

	// public manager: Castles_Manager

	public id: number;                // = 0;
	public name: string;              // Stronghold | Dungeon | Castle | etc.
	public castleTypeId: number;      // 1 .. 9
	public hasFort: boolean;
	public upgradesToCastleId: number; // allows null. null means not upgradable anymore


	public objectTypeId: number; // Mapping to animation

	constructor( conf, public manager: Castles_Manager ) {
	    super();

	    this.id = conf.id || 0;
	    this.name = conf.name || '';
	    this.castleTypeId = conf.castleTypeId || null;
	    this.hasFort = conf.hasFort || false;
	    this.upgradesToCastleId = conf.upgradesToCastleId || null;

	    this.objectTypeId = conf.objectTypeId || null;
	}

	public getMapObject() {
		return this.manager.map.objects.getObjectById( this.objectTypeId );
	}

}