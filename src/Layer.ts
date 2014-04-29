class Layer extends Events {

	public loaded = false;
	public _interactive: boolean = null;
	public visible: boolean = true;


	constructor( public map: AdvMap, public index: number ) {
	    super();

	    ( function( me ) {

	    	setTimeout( function() {
	    		me.loaded = true;
	    		me.emit( 'load' );
	    	}, 10 );

	    } )( this );
	}

	public get( column: number, row: number ) {
		return this.map.cellAt( column, row ).getData( this.index );
	}

	public set( column: number, row: number, data: any ) {
		this.map.cellAt( column, row ).setData( this.index, data );
	}

	public getData(): any {
		// not implemented
	}

	public setData( data: any ) {
		// not implemented
	}

	public paint( cellCol, cellRow, x, y, ctx ) {
		
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

	/* The name of the layer */
	get name(): string {
		return 'Unnamed Layer';
	}

}