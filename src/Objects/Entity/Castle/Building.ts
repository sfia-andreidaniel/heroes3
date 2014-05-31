class Objects_Entity_Castle_Building {

	// public manager: Objects_Entity_Castle_BuildingsManager

	public id: number;
	public name: string;
	public description: string;
	public costs: IResource;
	public built: boolean;
	public requirements: number[];

	constructor( public manager: Objects_Entity_Castle_BuildingsManager, conf: ICastles_Building ) {

		this.id = conf.id || null;
		this.name = conf.name || null;
		this.description = conf.description || 'No description for this building yet';
		this.costs = conf.costs || {};
		this.built = conf.built || false;
		this.requirements = conf.requirements || null;

	}

	// returns an array with the names of buildings which shoud be built before
	// this building can be built, or absolute NULL if all building requirements
	// are met.

	public unmetRequirements(): string[] {
		
		if ( this.built )
			return null;

		if ( this.requirements ) {

			var bld: Objects_Entity_Castle_Building,
			    names: string[] = [];

			for ( var i=0, len = this.requirements.length; i<len; i++ ) {
				
				bld = this.manager.getBuildingById( this.requirements[i] );
				
				if ( !bld )
					throw "Assert failed: Reference building " + this.requirements[i] + " not found (referred by building: " + this.id + ")";
				
				if ( bld.built == false )
					names.push( bld.name );

			}

			return names.length === 0
				? null
				: names;

		} else return null;

	}

	/* Returns a string value in case of failure,
	   or absolute NULL value in case of success
	 */
	public canotBeBuiltReason(): string {

		if ( this.built ) // cannot be built more than one time
			return "The " + this.name + " has been allready built";

		// cannot be built if castle is not assigned to a faction
		if ( !this.manager.castle._faction )
			return "The castle don't have a faction assigned";

		var unmetBuildings: string[] = this.unmetRequirements();

		if ( unmetBuildings !== null ) {
			return "In order to build the " + this.name + ", you must first build: " + unmetBuildings.join( ", " );
		}

		// cannot be built if the castle's faction don't have enough resources
		if ( !this.manager.castle._faction.hasEnoughResources(this.costs) )
			return "Not enough resources to build this building";

		return null;
	}

	public getPopulation(): number {
		return 0;
	}

	public setPopulation( howMany: number ) {
		// nothing
	}

}