class Artifact extends Events {

	// public manager: Artifacts_Manager

	public id: number = 0;
	public name: string = '';
	public enabled: boolean = false;
	public slots: string[] = [];
	public rank: string = 'other';

	public objectTypeId: number = null;

	constructor( conf, public manager: Artifacts_Manager ) {

		super();

		this.id = conf.id || 0;
		this.name = conf.name || 0;
		this.enabled = conf.enabled || false;
		this.slots = ( conf.slot || '' ).split( ',' );
		this.rank = conf.rank || 'other';

		this.objectTypeId = conf.objectTypeId || 0;

	}

	public getMapObject() {
		return this.manager.map.objects.getObjectById( this.objectTypeId );
	}

}