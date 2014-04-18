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