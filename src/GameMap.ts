/// <reference path="GameMap/Terrain.ts" />
/// <reference path="Events.ts" />
/// <reference path="GameMap/Cell.ts" />
/// <reference path="GameMap/Viewport.ts" />
/// <reference path="Matrix/StyleSheet.ts" />

class GameMap extends Events {
	
	// public FS        : GameFS
	// public FSMapFile : string = 'map.json';

	public terrains = { }; // the list of terrains
	public styles:any = { }; // the list of matrix style sheets

	public cells    = [];

	public width    = 0;
	public height   = 0;

	public viewport = null;

	constructor( public FS: GameFS, FSMapFile: string ) {
	    
	    super();

	    ( function( myself ) {

		    myself.FS.on( 'available', function() {

		    	var cfg = this.open( 'cfg/map' );

		    	for ( var i = 0, len = cfg.data.terrains.length; i<len; i++ ) {

		    		console.log( "GameMap: Init terrain type: ", cfg.data.terrains[i].name );

		    		myself.terrains[ cfg.data.terrains[i].name ] = new GameMap_Terrain(
		    			myself,
		    			cfg.data.terrains[i].code,
		    			cfg.data.terrains[i].name
		    		);

		    	}

		    	for ( var i=0, len = cfg.data.styles.length; i<len; i++ ) {

		    		console.log( "GameMap: Init matrix stylesheet: ", cfg.data.styles[i].name );

		    		myself.styles[ cfg.data.styles[i].name ] = new Matrix_StyleSheet(
		    			this.open( cfg.data.styles[i].path ).data,
		    			cfg.data.styles[i].selectorLength,
		    			cfg.data.styles[i].name
		    		);
		    	}

		    	myself.loadMap( FSMapFile );

		    	console.log( "GameMap: initialized" );

		    });

	    })( this );

	}

	public loadStyles() {



	}

	public loadMap( FSMapFile: string ) {

		var data     = this.FS.open( FSMapFile ).data;
		var bindings = {}; // create a terrains charCode binding here
		var lines: string[];
		var cellsRow: GameMap_Cell[];

		this.width = data.width;
		this.height = data.height;

		// make charcode binding
		for ( var t in this.terrains )
			bindings[ this.terrains[t].charCode ] = this.terrains[t];

		lines = data.land.split( "\n" );

		for ( var row = 0; row < this.height; row++ ) {

			cellsRow = [];

			for ( var col = 0; col < this.width; col++ ) {

				cellsRow.push( new GameMap_Cell( 
					this, 
					col, row, 
					bindings[ lines[ row ].charAt( col ) ]
				) );

			}

			this.cells.push( cellsRow );
		}

		// initialize cells
		for ( var row = 0; row < this.height; row++ ) {
			for ( var col = 0; col < this.width; col++ ) {
				this.cells[ row ][ col ].__computeCells();
				this.cells[ row ][ col ].__buildHash( this.width, this.height );
			}
		}

		this.emit( 'map-loaded' );

	}

}