class Objects_Entity_Castle extends Objects_Entity {

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	public $sinchronizable(): boolean {
		return true;
	}

}