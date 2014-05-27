class Hero_ArmiesManager {

	// public hero: Objects_Entity_Hero
	public stacks: Creatures_Stack[] = [ null, null, null, null, null, null, null, null ];

	constructor( public hero: Objects_Entity_Hero ) { }

	public serialize() {
		var out = [];
		for ( var i=0, len = this.stacks.length; i<len; i++ ) {
			
			out.push( this.stacks[ i ] ? this.stacks[i].serialize() : null );

		}
		return out;
	}

	public unserialize( data: any ) {

		if ( data ) {

			for ( var i=0, len = data.length; i<len; i++ ) {
				
				this.stacks[ i ] = data[i]
					? Creatures_Stack.unserialize( data[i], this.hero.layer.map.cm )
					: null;
			}

		}

	}

	public dismissStackByIndex( stackIndex: number ) {
		if ( stackIndex >= 0 && stackIndex < 8 ) {

			this.stacks[ stackIndex ] = null;

			this.hero.emit( 'armies-changed' );
		} else {

			throw "Invalid stack index: " + stackIndex;

		}
	}

	public swapStacks( srcStackIndex: number, destStackIndex: number ) {
		if ( srcStackIndex < 0 || srcStackIndex > 7 )
			throw "Invalid source stack index: " + srcStackIndex;

		if ( destStackIndex < 0 || destStackIndex > 7 )
			throw "Invalid destination stack index: " + destStackIndex;

		if ( srcStackIndex == destStackIndex )
			return; // stack index override

		var tmp: Creatures_Stack = this.stacks[ srcStackIndex ];
		this.stacks[ srcStackIndex ] = this.stacks[ destStackIndex ];
		this.stacks[ destStackIndex ] = tmp;

		this.hero.emit( 'armies-changed' );
	}

	public placeStackToSlot( stack: Creatures_Stack, slotIndex: number ) {

		if ( slotIndex < 0 || slotIndex > 7 )
			throw "Invalid slot index!";

		this.stacks[ slotIndex ] = stack;
		
		this.hero.emit( 'armies-changed' );

	}

	public autoAddStack( stack: Creatures_Stack ): boolean {
		for ( var i=0, len = this.stacks.length; i<len; i++ ) {
			if ( this.stacks[ i ] === null ) {
				this.stacks[i] = stack;
				this.hero.emit( 'armies-changed' );
				return true;
			}
		}
		return false;
	}

}