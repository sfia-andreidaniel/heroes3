class Layer_Entities extends Layer {

	// public map: AdvMap
	// public index: number

	public _objects: Objects_Entity[] = null;

	constructor( public map: AdvMap, public index: number, private _name: string ) {
		super( map, index );
		this._onInit();
	}

	private _onInit() {
		( function( me ) {

			me.map.on( 'resize', function( cols, rows ) {
				me._objects = [];
				for ( var i=0, len = cols * rows; i<len; i++ ) {
					me._objects.push( null );
				}
			});

		})( this );

		this.on( 'change', function( x, y, data ) {

			if ( !this._interactive )
				return;

			var index: number;

			if ( this._objects[  index = ( y * this.map.rows + x ) ] ) {
				this._objects[ index ].destroy();
			}

			this._objects[  index ] = data !== null
				? new Objects_Entity( data, x, y, this )
				: null;

		});

	}

	public getData() {
		var out = [];
		
		for ( var i=0, len = this.map.cells.length; i<len; i++ ) {
			out.push( this.map.cells[i].getData( this.index ) );
		}

		return {
			"objects": out
		};

	}

	public setData( data: any ) {
		
		var old_interactive = this._interactive;
		this._interactive   = true;

		for ( var i=0, len = this.map.cells.length; i<len; i++ ) {
			this.map.cells[ i ].setData( this.index, data.objects[ i ] );
		}

		this._interactive = old_interactive;

	}

	public paint( cellCol, cellRow, x, y, ctx2d ) {
		
		if ( this.visible ) {
			
			var index = cellRow * this.map.rows + cellCol,
			    o     = this._objects[ index ];

			if ( o )
				o.paintRelative( ctx2d, x, y );
		
		}

	}

	get name() {
		return this._name + " ( objects layer )";
	}

}