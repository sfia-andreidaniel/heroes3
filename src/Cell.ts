class Cell {

	public map   : AdvMap = null;
	public index : number = 0;

	private _neighbours: CellNeighbours = null;

	private $layerData = {};

	constructor( cellIndex: number, map: AdvMap ) {

	    this.index = cellIndex;
	    this.map   = map;

	}

	get layers() {
		throw "Layers";
	}

	public getData( layerIndex: number ) {
		return typeof this.$layerData[ layerIndex ] == 'undefined'
			? null
			: this.$layerData[ layerIndex ];
	}

	public setData( layerIndex: number, data: any, noTriggers: boolean = false ) {
		this.$layerData[ layerIndex ] = data;

		if ( !noTriggers )
			this.map.layers[ layerIndex ].emit( 'change', this.x(), this.y(), data, noTriggers );
	}

	public x(): number {
		return this.index % this.map.cols;
	}

	public y(): number {
		return ~~( this.index / this.map.cols );
	}

	get neighbours(): CellNeighbours {
		return this._neighbours;
	}

	public _computeNeighbours() {
		var x = this.x(),
		    y = this.y();
		
		this._neighbours = { 
			"n": this.map.cellAt( x, y - 1, false ),
			"s": this.map.cellAt( x, y + 1, false ), 
			"w": this.map.cellAt( x - 1, y, false ), 
			"e": this.map.cellAt( x + 1, y, false ), 

			"nw": this.map.cellAt( x - 1, y - 1, false ), 
			"ne": this.map.cellAt( x + 1, y - 1, false ), 
			"sw": this.map.cellAt( x - 1, y + 1, false ), 
			"se": this.map.cellAt( x + 1, y + 1, false )
		};
	}

	public paintAt( x: number, y: number, ctx, phase: number ) {
		var _x = this.x(),
		    _y = this.y();

		 if ( phase == 0 ) {

			
			this.map.layers[0].paint( _x, _y, x, y, ctx );
			this.map.layers[1].paint( _x, _y, x, y, ctx );

		} else {

			for ( var i=2, len = this.map.layers.length; i<len; i++ ) {
				this.map.layers[i].paint( _x, _y, x, y, ctx );
			}

			if ( this == this.map.activeCell ) {
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#f00';
				ctx.strokeRect( x + 1, y + 1, this.map.tilesets[0].tileWidth - 3, this.map.tilesets[0].tileHeight - 3 );
			}

		}
	}

	public getTerrainTypeIndex() {
		var bits = this.map.layers[0]['tiles'][ this.index ];
		
		if ( bits === null )
			return 4; //Abyss. Sorry for hardcoding

		var o = {},
		    ret = [];

		for ( var i=0, len = bits.length; i<len; i++ ) {
			o[ bits[i] ] = o[ bits[i] ] || 1;
		}

		for ( var k in o ) {
			ret.push( {
				"t": k,
				"v": o[k]
			} );
		}

		ret.sort( function(a,b){
			return a.v - b.v;
		});

		return ret[0].t;
	
	}
}