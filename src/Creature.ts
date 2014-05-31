class Creature extends Events {

	// public manager: Creatures_Manager

	public id          : number; // = 0;
	public name        : string; // = '';
	public upgradeToId : number; // = null;
	public castleTypeId: number; // = null;
	public level       : number; // = 0;
	public health      : number; // = 0;
	public attack      : number; // = 0;
	public shots       : number; // = 0;
	public movementType: string; //= '';
	public hexSize     : number; // = 1;
	public defense     : number; // = 0;
	public speed 	   : number; // = 0;
	public damage      : ICreatures_Damage; // = { "min": 0, "max": 0 };
	public resources   : IResource; // = {}; // Creature cost

	public objectTypeId: number; // = null;

	constructor ( conf: any, public manager: Creatures_Manager ) {
		super();

		this.id = conf.id || 0;
		this.name = conf.name || '';
		this.upgradeToId = conf.upgradeToId || null;
		this.castleTypeId = conf.castleTypeId || null;
		this.level = conf.level || 0;
		this.health = conf.health || 0;
		this.attack = conf.attack || 0;
		this.shots = conf.shots || 0;
		this.movementType = conf.movementType || '';
		this.hexSize = conf.hexSize || 1;
		this.defense = conf.defense || 0;
		this.speed = conf.speed || 0;
		this.damage = conf.damage || { "min": 0, "max": 0 };
		this.resources = conf.resources || {};
		this.objectTypeId = conf.objectTypeId || null;

	}

	public getMapObject() {
		return this.manager.map.objects.getObjectById( this.objectTypeId );
	}

}