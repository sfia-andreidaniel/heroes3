class Objects_Entity_Castle_BuildingsManager {
	// public castle: Objects_Entity_Castle

	public fort       : Objects_Entity_Castle_Building[] = [];
	public hall       : Objects_Entity_Castle_Building[] = [];
	public market     : Objects_Entity_Castle_Building[] = [];
	public blacksmith : Objects_Entity_Castle_Building[] = [];
	public tavern     : Objects_Entity_Castle_Building[] = [];
	public mageGuild  : Objects_Entity_Castle_Building[] = [];
	public dwelling   : Objects_Entity_Castle_Building_Dwelling[] = [];
	public other      : Objects_Entity_Castle_Building[] = [];

	public castleTypeId: number = null;

	public static slots = [ 'fort', 'hall', 'market', 'blacksmith', 'tavern', 'mageGuild', 'dwelling', 'other' ];

	constructor( public castle: Objects_Entity_Castle ) { }

	public loadInitialConfig( buildings: ICastles_Buildings ) {
		
		if ( this.castleTypeId != buildings.id ) {

			// Clear previous buildings if any
			this.fort       = [];
			this.hall       = [];
			this.market     = [];
			this.blacksmith = [];
			this.tavern     = [];
			this.mageGuild  = [];
			this.dwelling   = [];
			this.other      = [];

			this.castleTypeId = buildings.id;

			var i: number,
			    len: number,
			    j: number,
			    n: number;

			for ( i=0, len = Objects_Entity_Castle_BuildingsManager.slots.length; i<len; i++ ) {
				for ( j = 0, n = buildings[ Objects_Entity_Castle_BuildingsManager.slots[i] ].length; j<n; j++ ) {
					
					this[ Objects_Entity_Castle_BuildingsManager.slots[i] ].push( 
						
						Objects_Entity_Castle_BuildingsManager.slots[i] != 'dwelling'
							? new Objects_Entity_Castle_Building(
									this,
									buildings[ Objects_Entity_Castle_BuildingsManager.slots[i] ][ j ]
								)
							: new Objects_Entity_Castle_Building_Dwelling(
									this,
									buildings[ Objects_Entity_Castle_BuildingsManager.slots[i] ][ j ]
								)
					);
				}
			}
		}

		this.castle.emit( 'buildings-changed' );

	}

	public getBuildingById( buildingTypeId: number ): Objects_Entity_Castle_Building {
		var props = [ 'fort', 'hall', 'market', 'blacksmith', 'tavern', 'mageGuild', 'other', 'dwelling' ],
			i: number,
			len: number,
			j: number,
			n: number;		

		for ( i=0, len = Objects_Entity_Castle_BuildingsManager.slots.length; i<len; i++ ) {
			for ( j = 0, n = this[ Objects_Entity_Castle_BuildingsManager.slots[i] ].length; j<n; j++ ) {
				
				if ( this[ Objects_Entity_Castle_BuildingsManager.slots[i] ][ j ].id ==
					 buildingTypeId
				) return this[ Objects_Entity_Castle_BuildingsManager.slots[i] ][ j ];
			}
		}

		return null;
	}

	public allBuildings(): Objects_Entity_Castle_Building[] {
		var props = [ 'fort', 'hall', 'market', 'blacksmith', 'tavern', 'mageGuild', 'other', 'dwelling' ],
			i: number,
			len: number,
			j: number,
			n: number,
			result: Objects_Entity_Castle_Building[] = [];		

		for ( i=0, len = Objects_Entity_Castle_BuildingsManager.slots.length; i<len; i++ ) {
			for ( j = 0, n = this[ Objects_Entity_Castle_BuildingsManager.slots[i] ].length; j<n; j++ ) {
				result.push( this[ Objects_Entity_Castle_BuildingsManager.slots[i] ][ j ] );
			}
		}

		return result;	
	}

	/* Returns the list of buildings that can be built.
	   The list doesn't take in consideration if the faction
	   has enough resources or not.
	 */
	public buildableBuildings(): Objects_Entity_Castle_Building[] {
		var result: Objects_Entity_Castle_Building[] = [],
		    all: Objects_Entity_Castle_Building[] = [],
		    i: number,
		    len: number;

		for ( i=0, all = this.allBuildings(), len = all.length; i<len; i++ ) {
			if ( all[i].built == false && all[i].unmetRequirements() === null ) {
				result.push( all[i] );
			}
		}

		return result;
	}

	/* Returns the list with the built buildings */
	public allreadyBuiltBuildings(): Objects_Entity_Castle_Building[] {
		var result: Objects_Entity_Castle_Building[] = [],
		    all: Objects_Entity_Castle_Building[] = this.allBuildings(),
		    i: number,
		    len: number;
		
		for ( var i=0, len = all.length; i<len; i++ ) {
			if ( all[i].built == true )
				result.push( all[i] );
		}

		return result;
	}

	public serialize(): any {
		var all: Objects_Entity_Castle_Building[] = this.allBuildings(),
		    out: any[] = [];
		
		for ( var i=0, len = all.length; i<len; i++ ) {
			out.push( [
				all[i].built,
				all[i].getPopulation()
			] );
		}

		return out;
	}

	public unserialize( data: any ) {
		var all: Objects_Entity_Castle_Building[] = this.allBuildings();
		
		if ( data ) {

			for ( var i=0, len = data.length; i<len; i++ ) {
				all[i].built = data[i][0];
				all[i].setPopulation( data[i][1] );
			}

		}
	}

}