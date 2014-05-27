class Objects_Entity_Creature_Adventure extends Objects_Entity {

	public _creatureType : Creature = null;
	public _stackSize    : number   = 1;

	// public rw creatureType: number
	// public r  name        : string
	// public r  stack       : Creatures_Stack


	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	get creatureType(): number {
		return this._creatureType
			? this._creatureType.id
			: null;
	}

	set creatureType( creatureTypeId: number ) {
		this._creatureType = creatureTypeId === null
			? null
			: this.layer.map.cm.getCreatureTypeById( creatureTypeId );
	}

	get name(): string {
		return this._creatureType
			? this._creatureType.name
			: 'Creature';
	}

	get stackSize(): number {
		return this._stackSize;
	}

	set stackSize( howMany: number ) {
		howMany = ~~howMany;
		
		if ( howMany < 1 )
			throw "Objects_Entity_Creature_Adventure: Invalid stack size. Should be lte 1";
		
		this._stackSize = howMany;
	}

	get stack(): Creatures_Stack {
		return this._creatureType === null
			? null
			: new Creatures_Stack( this._creatureType, this._stackSize );
	}

	public serialize(): any {
		var out = super.serialize();
		
		out.data = {
			"creatureType": this.creatureType,
			"stackSize"   : this._stackSize
		};

		return out;
	}

	public unserialize( data: any ) {

		if ( data ) {
			this.creatureType = data.creatureType || null;
			this._stackSize   = data.stackSize || 1;
		}

	}

	public $sinchronizable(): boolean {
		return true;
	}

	public interractWith( obj: Objects_Entity_Hero ) {
		if ( this._creatureType ) {
			
			if ( obj.armies.autoAddStack( this.stack ) ) {
				this.remove();
			}

		}
	}

}