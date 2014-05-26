class Objects_Entity_Artifact extends Objects_Entity {

	public _artifactType: Artifact = null;

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );
	}

	public $sinchronizable(): boolean {
		return true;
	}

	get artifactType(): number {
		return this._artifactType ? this._artifactType.id : null;
	}

	set artifactType( type: number ) {
		this._artifactType = type === null
			? null
			: this.layer.map.am.getArtifactTypeById( type );
	}

	get name(): string {
		return this._artifactType !== null
			? this._artifactType.name
			: 'Artifact';
	}

	public serialize(): any {
		
		var out = super.serialize();

		out.data = {
			"artifactType": this.artifactType
		};

		return out;
	}

	public unserialize( data: any ) {
		if ( data ) {
			this.artifactType = data.artifactType;
		}
	}

}