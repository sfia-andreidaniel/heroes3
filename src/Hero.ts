class Hero extends Events {

	// public manager: Hero_Manager

	public id           : number    = 0;
	public name         : string    = '';
	public sex          : string    = '';
	public race         : string    = '';
	public icon         : string    = '';
	public typeId       : number    = 0;
	public typeName		: string    = '';
	public castleTypeId : number    = 0;

	public objectTypeId : number    = null;
	public mapItem      : Objects_Item = null;

	/* How this hero will advance through primary skills,
     * below and after it's 10th level.
     * indexes are representing the chances to gain 
     * "Attack", "Defence", "SpellPower", "Knowledge"
     * skills.
     */
	public primarySkillsAdvancement = {
		"lt10": [ 25, 25, 25, 25 ],
		"gte10": [ 25, 25, 25, 25 ]
	};

	constructor ( conf, public manager: Hero_Manager ) {
		super();

		this.id           = conf.id || 0;
		this.name         = conf.name || '';
		this.sex          = conf.sex || '';
		this.race         = conf.race || '';
		this.icon         = conf.icon || '';
		this.typeId       = conf.typeId || 0;
		this.typeName     = conf.typeName || '';
		this.castleTypeId = conf.castleTypeId || 0;
		
		this.primarySkillsAdvancement = conf.primarySkillsAdvancement || {
			"lt10": [ 25, 25, 25, 25 ],
			"gte10": [ 25, 25, 25, 25 ]
		};

		this.objectTypeId = conf.objectTypeId || 10;
	}

	public getMapObject() {

		return this.manager.map.objects.getObjectById( this.objectTypeId );
	}

}