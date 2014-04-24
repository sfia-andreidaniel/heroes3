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
		    			cfg.data.terrains[i].name,
		    			cfg.data.terrains[i].defaultTile
		    		);

		    	}

		    	for ( var i=0, len = cfg.data.styles.length; i<len; i++ ) {

		    		console.log( "GameMap: Init matrix stylesheet: ", cfg.data.styles[i].name );

		    		myself.styles[ cfg.data.styles[i].name ] = new Matrix_StyleSheet(
		    			myself,
		    			this.open( cfg.data.styles[i].path ).data,
		    			cfg.data.styles[i].selectorLength,
		    			cfg.data.styles[i].name
		    		);
		    	}

		    	myself.loadMap( FSMapFile );

		    	console.log( "GameMap: initialized" );

		    });

	    })( this );

	    this.on( 'mss-changed', function( mssSelector ) {
	    	this.onMSSChanged( mssSelector, true );
	    });

	    this.on( 'cells-changed', function() {
	    	this.onCellsChanged();
	    });

	}

	// triggered when a matrix stylesheet chages
	public onMSSChanged( selector: string ) {

		for ( var col=0; col<this.width; col++ ) {
			for ( var row = 0; row < this.height; row++ ) {
				if ( this.cells[row][col].hash == selector )
					this.cells[row][col].__buildHash( this.width, this.height );
			}
		}

	}

	public getTerrainByCharCode( terrainCharCode: string ) {
		for ( var t in this.terrains )
			if ( this.terrains[ t ].charCode == terrainCharCode )
				return this.terrains[t];

		return null;
	}

	public onCellsChanged( xCenter: number = null, yCenter: number = null, radius: number = 4 ) {
		
		var colStart : number,
		    colEnd   : number,
		    rowStart : number,
		    rowEnd   : number,
		    badTerrain: boolean = false;

		do {

			badTerrain = false;

			if ( xCenter === null || yCenter == null ) {

				for ( var row = 0; row < this.height; row++ ) {
					for ( var col = 0; col < this.width; col++ ) {
						if ( this.cells[ row ][ col ].hasInvalidTerrain() ) {
							badTerrain = true;
							this.cells[ row ][ col ].terrain = this.cells[ row ][ col ].predominantNeighbourTerrain();
							break;
						}
						this.cells[ row ][ col ].__buildHash( this.width, this.height );
					}
					if ( badTerrain )
						break;
				}

			} else {

				colStart = ( xCenter - radius > 0 ) ? xCenter - radius : 0;
				rowStart = ( yCenter - radius > 0 ) ? yCenter - radius : 0;

				colEnd   = ( xCenter + radius ) < this.width  ? xCenter + radius : this.width - 1;
				rowEnd   = ( yCenter + radius ) < this.height ? yCenter + radius : this.height - 1;

				for ( var row = rowStart; row <= rowEnd; row++ ) {
					for (var col = colStart; col <= colEnd; col++ ) {
						if ( this.cells[ row ][ col ].hasInvalidTerrain() ) {
							badTerrain = true;
							this.cells[ row ][ col ].terrain = this.cells[ row ][ col ].predominantNeighbourTerrain();
							break;
						}
						this.cells[ row ][ col ].__buildHash( this.width, this.height );
					}

					if ( badTerrain )
						break;
				}

			}

		} while ( badTerrain );

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
			}
		}

		this.onCellsChanged();

		this.emit( 'map-loaded' );

	}

}