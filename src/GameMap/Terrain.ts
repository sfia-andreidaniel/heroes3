/// <reference path="../Events.ts" />
/// <reference path="../FS/File.ts" />

class GameMap_Terrain extends Events {

	constructor( ownerMap: GameMap, public charCode: string, public name: string, public defaultTile: string ) {

	    super();

	    console.log( "Terrain: ", this.name, " default tile: \"" + this.defaultTile, + "\"" );
	    
	}

}