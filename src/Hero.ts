class Hero extends Events {

	// public manager: Hero_Manager

	public id           : number = 0;
	public name         : string = '';
	public sex          : string = '';
	public race         : string = '';
	public icon         : string = '';
	public typeId       : number = 0;
	public typeName		: string = '';
	public castleTypeId : number = 0;

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
	
	}

}