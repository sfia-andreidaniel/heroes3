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

var map = new AdvMap( 10, 10 );

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
	map.cellAt(0,0).layers[0] = 2;
	console.log( map.layers[0].getBits( 0, 0 ) ); 
	console.log( map.layers[0].getBits( 1, 0 ) ); 
	console.log( map.layers[0].getBits( 0, 1 ) ); 
	console.log( map.layers[0].getBits( 1, 1 ) ); 
});

map.fs.on( 'log', function( data ) {
    console.log( "FS :", data );
} );

/* Load game files */

map.fs.add( 'tilesets/terrains.json',     'resources/tilesets/terrains.tsx.json', 'json' );
map.fs.add( 'tilesets/roads-rivers.json', 'resources/tilesets/roads-rivers.tsx.json', 'json' );

/* Setup Map Data*/