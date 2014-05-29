class Resource {

	// public manager: Resource_Manager

	public id: number;
	public name: string;
	public type: string;

	public objectTypeId: number;

	constructor( conf, public manager: Resource_Manager ) {

		this.id           = conf.id || null;
		this.name         = conf.name || '';
		this.type         = conf.resourceType || '';
		this.objectTypeId = conf.objectTypeId || null;

	}

	public getMapObject() {
		return this.manager.map.objects.getObjectById( this.objectTypeId );
	}

}