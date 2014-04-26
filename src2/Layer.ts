class Layer extends Events {

	public loaded = false;

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
		return this.map.cellAt( column, row ).layers[ this.index ];
	}

	public set( column: number, row: number, data: any ) {
		this.map.cellAt( column, row ).layers[ this.index ] = data;
	}

}