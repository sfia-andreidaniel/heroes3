///<reference path="Events.ts" />
///<reference path="FS.ts" />
///<reference path="Picture.ts" />
///<reference path="FS/File.ts" />
///<reference path="AdvMap.ts" />
///<reference path="Layer.ts" />
///<reference path="Layer/Terrain.ts" />
///<reference path="ICellNeighbours.ts" />
///<reference path="Cell.ts" />
///<reference path="AdvMap/Tileset.ts" />
///<reference path="AdvMap/TilesetTerrain.ts" />
///<reference path="AdvMap/Tileset/Terrains.ts" />
///<reference path="AdvMap/Tileset/RoadsRivers.ts" />

var map = new AdvMap( 32, 32 /*, 'test.map' */ );

if ( typeof window !== 'undefined' )
	window[ 'map' ] = map;

map.on( 'tileset-added', function( e ) {
    console.log( "MAP:", "Tileset: ", e.data.name );
} );

map.on( 'filesystem-ready', function() {
    console.log( "FS :", "all files loaded successfully" );
});

map.on( 'tilesets-ready', function() {
	console.log( "MAP:", "tilesets operational");
} );

map.on( 'layers-ready', function() {
	console.log( "MAP:", "layers ready" );
});

map.on( 'resize', function( width: number, height: number ) {
	console.log( "MAP: ", "resize to: " + width + "x" + height );
});

map.on( 'load', function() {
	
	console.log( "map loaded");

});

map.fs.on( 'log', function( data ) {
    console.log( "FS :", data );
} );
