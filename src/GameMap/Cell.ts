/// <reference path="../GameMap.ts" />
/// <reference path="Terrain.ts" />
/// <reference path="Image.ts" />

class GameMap_Cell extends Events {

	// public x       : number
	// public y       : number
	//        map     : GameMap
	//        terrain : GameMap_Terrain

	public hash = '';

	public _nwCell: GameMap_Cell = null;
	public _nCell : GameMap_Cell = null;
	public _neCell: GameMap_Cell = null;
	public _wCell : GameMap_Cell = null;
	public _eCell : GameMap_Cell = null;
	public _swCell: GameMap_Cell = null;
	public _sCell : GameMap_Cell = null;
	public _seCell: GameMap_Cell = null;

	public background: GameMap_Image = null;
	public isHovered: boolean = false;
	
	constructor( private map: GameMap, public x: number, public y: number, public terrain: GameMap_Terrain ) {
	    super();
	}

	public __computeCells( ) {
		this._nwCell = this.x > 0 && this.y > 0
			? this.map.cells[ this.y - 1 ][ this.x - 1 ]
			: null;
		this._nCell  = this.y > 0
			? this.map.cells[ this.y - 1 ][ this.x ]
			: null;
		this._neCell = this.x < this.map.width - 1 && this.y > 0
			? this.map.cells[ this.y - 1 ][ this.x + 1 ]
			: null;
		this._wCell  = this.x > 0
			? this.map.cells[ this.y ][ this.x - 1 ]
			: null;
		this._eCell  = this.x < this.map.width - 1
			? this.map.cells[ this.y ][ this.x + 1 ]
			: null;
		this._swCell = this.x > 0 && this.y < this.map.height - 1
			? this.map.cells[ this.y + 1 ][ this.x - 1 ]
			: null;
		this._sCell  = this.y < this.map.height - 1
			? this.map.cells[ this.y + 1 ][ this.x ]
			: null;
		this._seCell  = this.x < this.map.width - 1 && this.y < this.map.height - 1
			? this.map.cells[ this.y + 1 ][ this.x + 1 ]
			: null;
	}

	public predominantNeighbourTerrain() {
		var terrains = [];

		if ( this._nwCell )
			terrains [this._nwCell.terrain.charCode ] = ( terrains[ this._nwCell.terrain.charCode ] || 0 ) + 1;
		
		if ( this._nCell )
			terrains [this._nCell.terrain.charCode ]  = ( terrains[ this._nCell.terrain.charCode  ] || 0 ) + 1;

		if ( this._neCell )
			terrains[ this._neCell.terrain.charCode ] = ( terrains[ this._neCell.terrain.charCode ] || 0 ) + 1;

		if ( this._sCell )
			terrains[ this._sCell.terrain.charCode ]  = ( terrains[ this._sCell.terrain.charCode ] || 0 ) + 1;

		if ( this._wCell )
			terrains[ this._wCell.terrain.charCode ]  = ( terrains[ this._wCell.terrain.charCode ] || 0 ) + 1;

		if ( this._swCell )
			terrains[ this._swCell.terrain.charCode ] = ( terrains[ this._swCell.terrain.charCode ] || 0 ) + 1;

		if ( this._eCell )
			terrains[ this._eCell.terrain.charCode ]  = ( terrains[ this._eCell.terrain.charCode ] || 0 ) + 1;

		if ( this._seCell )
			terrains[ this._seCell.terrain.charCode ] = ( terrains[ this._seCell.terrain.charCode ] || 0 ) + 1;

		var max = 0,
		    ret = this.terrain;

		for ( var t in terrains )
			if ( terrains[t] > max ) {
				max = terrains[t];
				ret = this.map.getTerrainByCharCode( t );
			}

		return ret;

	}

	public hasInvalidTerrain() {
		return ( !this.cellTerrainIs( this._nwCell, this.terrain ) && 
			 	 !this.cellTerrainIs( this._nCell, this.terrain ) &&
				 !this.cellTerrainIs( this._neCell, this.terrain ) &&
				 !this.cellTerrainIs( this._eCell, this.terrain ) &&
				 !this.cellTerrainIs( this._seCell, this.terrain ) &&
				 !this.cellTerrainIs( this._sCell, this.terrain ) &&
				 !this.cellTerrainIs( this._swCell, this.terrain ) &&
				 !this.cellTerrainIs( this._wCell, this.terrain )
		);
	}

	public cellTerrainIs( cell: GameMap_Cell, terrain: GameMap_Terrain ) {
		return !cell ? true : cell.terrain == terrain;
	}

	public __buildHash( ) {
		
		var bgTiles = [];

		this.hash = '';

		this.hash += ( this._nwCell === null ? '_' : this._nwCell.terrain.charCode );
		this.hash += ( this._nCell  === null ? '_' :  this._nCell.terrain.charCode );
		this.hash += ( this._neCell === null ? '_' : this._neCell.terrain.charCode );
		this.hash += ( this._wCell  === null ? '_' :  this._wCell.terrain.charCode );
		this.hash += ( this.terrain.charCode );
		this.hash += ( this._eCell  === null ? '_' :  this._eCell.terrain.charCode );
		this.hash += ( this._swCell === null ? '_' : this._swCell.terrain.charCode );
		this.hash += ( this._sCell  === null ? '_' :  this._sCell.terrain.charCode );
		this.hash += ( this._seCell === null ? '_' : this._seCell.terrain.charCode );

		// compute the resource tileset to be placed on the map
		this.background = null;

		bgTiles = this.map.styles.land.querySelector( this.hash );

		this.background = this.map.FS.createImage( 
			bgTiles === null 
			? this.terrain.defaultTile 
			: bgTiles[ ~~( Math.random() * bgTiles.length ) ] 
		);

	}

	public paintAt( viewport: GameMap_Viewport, ctxX: number, ctxY: number ) {

		// paint the cell on a canvas context

		if ( this.background ) {
			if ( this.background.loaded )
				viewport.ctx.drawImage( this.background.node, ctxX, ctxY );
		}
	}

}