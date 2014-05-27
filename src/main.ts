///<reference path="Events.ts" />

///<reference path="ICellNeighbours.ts" />
///<reference path="IObjectHandle.ts" />
///<reference path="IResources.ts" />
///<reference path="IDirection.ts" />
///<reference path="Canvas2dContextHelper.ts" />
///<reference path="XTemplate.ts" />
///<reference path="Loader.ts" />

///<reference path="FS.ts" />
///<reference path="Picture.ts" />
///<reference path="FS/File.ts" />
///<reference path="Faction.ts" />
///<reference path="Faction/Manager.ts" />

///<reference path="AdvMap.ts" />

///<reference path="Layer.ts" />
///<reference path="Objects.ts" />
///<reference path="Objects/Item.ts" />
///<reference path="Objects/Entity.ts" />
///<reference path="Objects/Entity/Hero.ts" />
///<reference path="Objects/Entity/Hero/Embarked.ts" />

///<reference path="Hero.ts" />
///<reference path="Hero/Manager.ts" />

///<reference path="Hero/Skill/IValue.ts" />
///<reference path="Hero/Skill.ts" />
///<reference path="Hero/Skill/Secondary.ts" />
///<reference path="Hero/SkillsManager.ts" />


///<reference path="Objects/Entity/AdventureItem.ts" />
///<reference path="Objects/Entity/Artifact.ts" />

///<reference path="Artifact.ts" />
///<reference path="Artifacts/Manager.ts" />
///<reference path="Hero/ArtifactsManager.ts" />
///<reference path="Hero/ArtifactsManager/Slot.ts" />

///<reference path="Objects/Entity/Castle.ts" />
///<reference path="Objects/Entity/Tileset.ts" />
///<reference path="Objects/Entity/Mine.ts" />
///<reference path="Objects/Entity/Resource.ts" />
///<reference path="Objects/Entity/Creature/Adventure.ts" />

///<reference path="Creature.ts" />
///<reference path="Creatures/Manager.ts" />
///<reference path="Creatures/IDamage.ts" />
///<reference path="Creatures/IResource.ts" />

///<reference path="Objects/Entity/Dwelling.ts" />
///<reference path="Layer/Terrain.ts" />
///<reference path="Layer/RoadsRivers.ts" />
///<reference path="Layer/Entities.ts" />
///<reference path="Layer/Movement.ts" />
///<reference path="AStar/Algorithm.ts" />
///<reference path="Cell.ts" />
///<reference path="AdvMap/Tileset.ts" />
///<reference path="AdvMap/TilesetTerrain.ts" />
///<reference path="AdvMap/Tileset/Terrains.ts" />
///<reference path="AdvMap/Tileset/RoadsRivers.ts" />
///<reference path="Viewport.ts" />
///<reference path="Viewport/Minimap.ts" />

var map = new AdvMap( 1, null, null );

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
