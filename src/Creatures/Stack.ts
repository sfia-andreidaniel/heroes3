class Creatures_Stack extends Events {

	// public stackSize       : number
	// public creatureType    : Creature

	constructor( public creatureType: Creature, public stackSize: number ) {
		super();
	}

	public serialize(): any {
		return {
			"size": this.stackSize,
			"type": this.creatureType.id
		};
	}

	public static unserialize( data: any, manager: Creatures_Manager ): Creatures_Stack {

		if ( !data )
			return null;
		else {

			var pCtype: Creature = manager.getCreatureTypeById( data.type || null );

			if ( pCtype === null )
				throw "Failed to deserialize creature stack! Creature type " + data.type + " was not found.";

			return new Creatures_Stack( pCtype, data.size || 1 );

		}

	}

}