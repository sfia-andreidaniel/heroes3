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
				

				if ( this.maxItems > this.items.length || this.maxItems == -1 ) {
					this.items.push( artifact );
				} else {
					throw "Artifact stack is full";
				}

				break;

			// we place the artifact on a specific position.
			// exception is made only if this is the backPack, when we
			// splice the this.index array @pos position
			case position >= 0:

				if ( position > this.maxItems - 1 && this.maxItems >= 0 )
					throw "Invalid slot position " + position;

				if ( this.slotName == 'backPack' ) {

					this.items.splice( position, 0, artifact );

				} else {

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

				}


				break;

			default:
				throw "Failed to equip artifact (don't know why)";
				break;
		}

		if ( this.slotName != 'backPack' )
			artifact.emit( 'equip', this.manager.hero );

		( function( me ) {
			setTimeout( function() {
				// emit an artifacts-changed for this slot
				me.manager.hero.emit( 'artifacts-changed', me.slotName );
			}, 10 );
		})( this );
	}

	public serialize(): number[] {
		var out = [];

		for ( var i=0, len = this.items.length; i<len; i++ ) {
			out.push( this.items[i] ? this.items[i].id : null );
		}

		return out;
	}

	public unserialize( items: number[] ) {

		if ( items ) {

			for ( var i=0, len = items.length; i<len; i++ ) {
				this.items[ i ] = items[i] 
					? this.manager.hero.layer.map.am.getArtifactTypeById( items[i] ) 
					: null;
			}

		}

	}

	public swapArtifacts( srcIndex: number, destinationIndex: number ) {
		if ( srcIndex == destinationIndex ) {
			// attempting to move an artifact in itself
			return;
		}

		if ( typeof this.items[ srcIndex ] == 'undefined' || typeof this.items[ destinationIndex ] == 'undefined' )
			throw "Failed to swap artifacts. At least one index is undefined.";

		var tmp = this.items[ srcIndex ];
		this.items[ srcIndex ] = this.items[ destinationIndex ];
		this.items[ destinationIndex ] = tmp;

		( function( me ) {
			setTimeout( function() {
				// emit an artifacts-changed for this slot
				me.manager.hero.emit( 'artifacts-changed', me.slotName );
			}, 10 );
		})( this );

	}

	public transferArtifactToAnotherSlot( artifactSlotIndex: number, targetSlotName: string, targetSlotIndex: number ) {

		if ( targetSlotName == this.slotName ) {
			this.swapArtifacts( artifactSlotIndex, targetSlotIndex );
			return;
		}

		console.log( "Transfer from: ", this.slotName + "@" + artifactSlotIndex + " to: ", targetSlotName + "@" + targetSlotIndex );

		var theArtifact: Artifact = this.items[ artifactSlotIndex ];

		if ( !theArtifact )
			throw "Invalid source artifact @index: " + artifactSlotIndex;

		try {
			// see if the target slot accepts the artifact
			this.manager[ targetSlotName ].equip( theArtifact, targetSlotIndex );

			// if this is not the backPack slot, unequip artifact
			if ( this.slotName != 'backPack' )
				theArtifact.emit( 'unequip', this.manager.hero );

			( function( me ) {
				setTimeout( function() {
					// emit an artifacts-changed for this slot
					me.manager.hero.emit( 'artifacts-changed', me.slotName );
				}, 10 );
			})( this );

			// set the slot corresponding to artifactSlotIndex equal to NULL
			this.items[ artifactSlotIndex ] = null;


		} catch ( equipError ) {
			// no, the target slot doesn't accept the artifact
			alert( equipError );
			return;
		}

	}

	// direction: -1: right to left
	// direction:  1: left to right
	public scrollArtifacts( direction: number ) {

		var numNullsAtEnd = 0;

		/* Filter the array for nulls */
		this.items = this.items.filter( function( item ) {
			if ( !!!item ) {
				numNullsAtEnd++;
			}

			return !!item;
		});

		if ( this.items.length < 2 ) {
	
			for ( var i=0, len = numNullsAtEnd; i < len; i++ )
				this.items.push( null );

			return;
		}

		switch ( direction ) {
			case -1:

				var removed = this.items.splice( 0, 1 )[ 0 ];
				this.items.push( removed );

				break;
			case  1:
				var removed = this.items.splice( this.items.length - 1, 1 )[ 0 ];
				this.items.splice( 0, 0, removed );
				break;
		}

		// Push nulls @end
		for ( var i=0, len = numNullsAtEnd; i < len; i++ )
			this.items.push( null );

		( function( me ) {
			setTimeout( function() {
				// emit an artifacts-changed for this slot
				me.manager.hero.emit( 'artifacts-changed', me.slotName );
			}, 10 );
		})( this );

	}

}