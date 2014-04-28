class AdvMap_TilesetTerrain {

	public name: string;
	public defaultTile: number;
	public id: number;
	public hash: number; //bitmask constant

	private _validNeighbours = [];
	private _tiles = [];

	constructor ( config, public tileset: AdvMap_Tileset ) {

		this.name        = config.name;
		this.defaultTile = config.defaultTile;
		this.id          = config.id;
		this.hash        = config.hash;

	}

	public toString() {
		return this.id.toString();
	}

	public _computeAllowedNeighboursTerrains() {
		var out = [],
		    terrains = [];

		var tid: string;

		for ( var tid in this.tileset.tiles ) {
			
			terrains = this.tileset.tiles[tid].hash.split( ',' );

			terrains[0] = ~~terrains[0]; terrains[1] = ~~terrains[1];
			terrains[2] = ~~terrains[2]; terrains[3] = ~~terrains[3];

			if ( terrains.indexOf( this.id ) >= 0 ) {

				for ( var k=0; k<4; k++ ) {
					if ( out.indexOf( terrains[k] ) == -1 ) {
						out.push( terrains[k] );
					}
				}

			}
		}

		out.sort();

		for ( var i=0, len = out.length; i<len; i++ ) {
			out[i] = this.tileset.getTerrainById( out[i] );
		}

		this._validNeighbours = out;
	}

	public _computeTilesWhereThisTerrainIsSet() {

		var out = [],
		    terrains;

		for ( var tid in this.tileset.tiles ) {

			terrains = this.tileset.tiles[ tid ].hash.split( ',' );

			terrains[0] = ~~terrains[0]; terrains[1] = ~~terrains[1];
			terrains[2] = ~~terrains[2]; terrains[3] = ~~terrains[3];

			if ( terrains.indexOf( this.id ) >= 0 )
				out.push( ~~tid );

		}

		out.sort( function( a, b ) { return a - b; });

		this._tiles = out;

	}

	get validNeighbours(): AdvMap_TilesetTerrain[] {
		return this._validNeighbours;
	}

	get tiles() {
		return this._tiles;
	}
}