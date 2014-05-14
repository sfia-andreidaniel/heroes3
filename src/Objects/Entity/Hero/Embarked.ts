class Objects_Entity_Hero_Embarked extends Objects_Entity_Hero {

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

}