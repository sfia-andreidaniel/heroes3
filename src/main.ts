/// <reference path="GameFS.ts" />
/// <reference path="GameMap.ts" />

var fs  = new GameFS(),
    map = new GameMap( fs, 'maps/rnd01' );

    if ( typeof document != 'undefined' )
    	map.viewport = new GameMap_Viewport( map, 800, 600 );

fs.on( 'log', function( msg ) {
	console.log( msg );
});

fs.on( 'available', function() {
	console.log( 'GameFS is available' );
});


map.on( 'map-loaded', function() {
	console.log( 'map was loaded: ', this.width, this.height );
});



fs.add( 'cfg/map',               'resources/cfg/map.json',                     'json' );

fs.add( 'terrains/dirt',         'resources/terrains/_build/dirt.json',        'json' );
fs.add( 'terrains/lava',         'resources/terrains/_build/lava.json',        'json' );
fs.add( 'terrains/grass',        'resources/terrains/_build/grass.json',       'json' );
fs.add( 'terrains/rockie',       'resources/terrains/_build/rockie.json',      'json' );
fs.add( 'terrains/rough',        'resources/terrains/_build/rough.json',       'json' );
fs.add( 'terrains/sand',         'resources/terrains/_build/sand.json',        'json' );
fs.add( 'terrains/snow',         'resources/terrains/_build/snow.json',        'json' );
fs.add( 'terrains/subteranean',  'resources/terrains/_build/subteranean.json', 'json' );
fs.add( 'terrains/swamp',        'resources/terrains/_build/swamp.json',       'json' );
fs.add( 'terrains/water',        'resources/terrains/_build/water.json',       'json' );

fs.add( 'styles/land',           'resources/styles/land.mss',                  'text' );

fs.add( 'maps/rnd01',            'resources/maps/rnd01.json',                  'json' );