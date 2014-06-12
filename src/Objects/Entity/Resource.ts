class Objects_Entity_Resource extends Objects_Entity {

	public _resourceType: Resource = null;

	// public rw resourceType: number
	// public r  name: string

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	get resourceType(): number {
		return this._resourceType == null
			? null
			: this._resourceType.id;
	}

	set resourceType( resourceTypeId: number ) {
		this._resourceType = resourceTypeId === null
			? null
			: this.layer.map.rm.getResourceTypeById( resourceTypeId );
	}

	get name(): string {
		return this._resourceType === null
			? 'Resource'
			: this._resourceType.name;
	}

	public serialize(): any {
		var out = super.serialize();

		out.data = {
			"resourceType": this.resourceType
		};

		return out
	}

	public unserialize( data: any ) {

		if ( data ) {
			this.resourceType = data.resourceType;
		}

	}

	public $sinchronizable(): boolean {
		return true;
	}

	public interractWith( obj: Objects_Entity_Hero ) {

		if ( this._resourceType && obj.faction ) {
			
			/* Determine a random quantity of the resource */
			var quantity: number = 0,
			    min     : number = 1,
			    max     : number = 1;

			switch ( this._resourceType.type ) {
				case 'gold':
					min = 500;
					max = 1500;
					break;

				case 'ore':
				case 'wood':
					min = 5;
					max = 10;
					break;

				case 'sulfur':
				case 'gems':
				case 'crystals':
				case 'mercury':
				case 'mithril':
				default:
					min = 1;
					max = 5;
					break;
			}

			quantity = min + ~~( ( max - min + 1 ) * Math.random(  ) );

			( function( me ) {

				var give = {};

				give[ me._resourceType.type ] = quantity;

				obj._faction.addResources( give, function( err ) {

					if ( !err ) {

						Dialogs.alert( "You find " + quantity + " " + me._resourceType.type, "Resource", function() {
							me.remove();
						} );

					} else {

						Dialogs.alert( err, "Error" );

					}

				} );

			})( this );

		}
	}

}