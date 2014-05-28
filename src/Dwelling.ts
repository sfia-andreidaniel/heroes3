/* Configuration type object for a Dwelling building */

class Dwelling extends Events {

	// public manager: Dwellings_Manager

	public id               : number; // = 0;
	public levels           : IDwellings_Config[];
	public castleTypeId     : number; // = 0
	public castleTypeName   : string; // = ''
	public maxUpgradeLevel  : number; // = 1. Note that maxUpgradeLevel should be eq with this.levels.length
	public creatureLevel    : number;
	public growth			: number; //basic growth

	public objectTypeId: number; // = 0;

	constructor( conf, public manager: Dwellings_Manager ) {

		super();

		this.id              = conf.id || 0;
		this.levels          = conf.levels || [];
		this.castleTypeId    = conf.castleTypeId || 10;
		this.castleTypeName  = conf.castleTypeName || 'Neutral';
		this.maxUpgradeLevel = conf.maxUpgradeLevel || this.levels.length;
		this.creatureLevel 	 = conf.dwellingLevel || 0;
		this.growth 		 = conf.growth || 0;

		this.objectTypeId    = conf.objectTypeId || null;

	}

	public getMapObject() {
		return this.manager.map.objects.getObjectById( this.objectTypeId );
	}
}