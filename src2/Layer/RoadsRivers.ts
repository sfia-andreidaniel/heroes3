class Layer_RoadsRivers extends Layer {
	
	public tileset: AdvMap_Tileset_Terrains = null;
	private _interactive: boolean = null;

	constructor( public map: AdvMap, public index: number ) {

		super( map, index );

		this.tileset = this.map.tilesets[ 1 ];

		this._onInit();

	}

	private _onInit() {

		this.on( 'change', function( x, y, data ) {

			if ( !this._interactive )
				return;

		});

	}

	get interactive(): boolean {
		return this._interactive;
	}

	set interactive( value: boolean ) {
		if ( this._interactive != value ) {
			this._interactive = value;
			this.emit( 'interactive', value );
		}
	}

	public getData() {
		return null;
	}

	public setData( data ) {
		// not implemented
	}

}