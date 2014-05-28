class Mine extends Events {

	// public manager: Mines_Manager
	public id: number; // = 0
	public name: string; // = 'Mine';
	public resourceType: string; // "gold", "wood", "ore", "gems", "crystals", "sulfur", "mercury", "mithril"

	public objectTypeId: number;

	constructor( conf, public manager: Mines_Manager ) {

		super();

		this.id = conf.id || null;
		this.name = conf.name || 'Mine';
		this.resourceType = conf.resourceType || null;

		this.objectTypeId = conf.objectTypeId || null;

	}

	public getMapObject() {
		return this.manager.map.objects.getObjectById( this.objectTypeId );
	}

}