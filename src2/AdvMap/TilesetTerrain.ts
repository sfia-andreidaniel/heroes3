class AdvMap_TilesetTerrain {

	public name: string;
	public defaultTile: number;
	public id: number;
	public hash: number; //bitmask constant


	constructor ( config, public tileset: AdvMap_Tileset ) {

		this.name        = config.name;
		this.defaultTile = config.defaultTile;
		this.id          = config.id;
		this.hash        = config.hash;

	}

	public toString() {
		return this.name;
	}

}