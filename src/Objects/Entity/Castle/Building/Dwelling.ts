class Objects_Entity_Castle_Building_Dwelling extends Objects_Entity_Castle_Building {

	public dwellingTypeId    : number;
	public dwellingTypeLevel : number;
	public dwellingGrowth    : number;
	private _population      : number;

	constructor( manager: Objects_Entity_Castle_BuildingsManager, conf: ICastles_Building ) {
		super( manager, conf );

		if ( conf.dwelling ) {
			this.dwellingTypeId = conf.dwelling.id || null;
			this.dwellingTypeLevel = conf.dwelling.level || 0;
			this.dwellingGrowth = conf.dwelling.growth || 1;
			this._population = conf.dwelling.growth || 1;
		} else {
			throw "The Objects_Entity_Castle_Building_Dwelling expects a configuration which has dwelling type data";
		}
	}

	public getPopulation(): number {
		return this._population;
	}

	public setPopulation( howMany: number ) {
		this._population = ~~howMany;
		if ( this._population < 0 )
			this._population = 0;
	}

}