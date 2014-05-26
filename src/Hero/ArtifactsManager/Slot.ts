class Hero_ArtifactsManager_Slot {

	// public manager: Hero_ArtifactsManager;
	// public maxItems: number
	// public acceptItemType: string = '';
	// public slotName: string

	public items: Artifact[] = [];

	constructor( public manager: Hero_ArtifactsManager, public maxItems: number, public acceptItemType: string = null, public slotName: string = '' ) {
		if ( maxItems > 0 ) {
			for ( var i=0; i<maxItems; i++ ) {
				this.items[i] = null;
			}
		}
	}

	public equip( artifact: Artifact, position: number = -1 ) {
		
		// Test if the slot is compatible with the artifact
		if ( this.acceptItemType !== null ) {

			if ( artifact.slots.indexOf( this.acceptItemType ) == -1 ) {
				throw artifact.name + " cannot be placed on " + this.slotName;
			}

		}

		switch ( true ) {

			// we append the artifact at the end.
			case position == -1:
				

				if ( this.maxItems > this.items.length ) {
					this.items.push( artifact );
				} else {
					throw "Artifact stack is full";
				}

				break;

			// we place the artifact on a specific position
			case position >= 0:

				if ( position > this.maxItems - 1 && this.maxItems >= 0 )
					throw "Invalid slot position " + position;

				// If there is an artifact at position @position, we move it in backpack first
				if ( this.items[ position ] ) {

					// unequip artifact
					if ( this.slotName != 'backPack' )
						artifact.emit( 'unequip', this.manager.hero );

					this.manager.backPack.equip( this.items[ position ], -1 );
					this.items[ position ] = null;

				}

				// Finally, place the item @position
				this.items[ position ] = artifact;

				break;

			default:
				throw "Failed to equip artifact (don't know why)";
				break;
		}

		if ( this.slotName != 'backPack' )
			artifact.emit( 'equip', this.manager.hero );

		this.manager.hero.emit( 'artifacts-changed', this.slotName );
	}

}