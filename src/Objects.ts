class Objects extends Events {

	public loaded = false;

	public sprite: Picture = null;
	
	public cols: number = 0;
	public rows: number = 0;

	public width: number = 0;
	public height: number = 0;
	public tileWidth: number = 0;
	public tileHeight: number = 0;

	public store = [];

	private _ctx   = null; // Canvas 2d Context
	private _canvas = null; // Canvas
	private _indexes = {};

	constructor( data: any, public map: AdvMap ) {
	    super();

	    this.width = data.width;
	    this.height= data.height;

	    this.tileWidth = data.tileWidth;
	    this.tileHeight= data.tileHeight;

	    this.cols = data.cols;
	    this.rows = data.rows;

	    this.store = []; //data.objects;

	    this.sprite = new Picture( data.sprite );

	    ( function( me ) {

	    	me.sprite.on( 'load', function() {

	    		/* Load all objects */
	    		for ( var i=0, len = data.objects.length; i<len; i++ ) {
	    			
	    			me._indexes[ data.objects[i].id ] = i;
	    			
	    			me.store.push( new Objects_Item( data.objects[i] , me) );
	    		}

	    		me.loaded = true;
	    		me.emit( 'load' );

	    	});

	    })( this );

	    this._canvas = typeof global != 'undefined'
	    	? ( function() {

	    		var Canvas = require( 'canvas' );

	    		return new Canvas();

	    	} )()
	    	: document.createElement( 'canvas' );

	    this._canvas.width = this.tileWidth;
	    this._canvas.height = this.tileHeight;

	    this._ctx = this._canvas.getContext( '2d' );
	}

	public getObjectById( id: number ) {
		return typeof this._indexes[id] != 'undefined'
			? this.store[ this._indexes[id] ]
			: null;
	}

	public getObjectBase64Src( objectId: number ) {

		if ( !this._ctx || !this.loaded || !this.sprite || typeof this._indexes[ objectId ] == 'undefined' )
			return null;

		var sx: number,
		    sy: number,
		    sw: number,
		    sh: number,
		    index = this._indexes[ objectId ];

		sx = ( index % this.cols ) * this.tileWidth;
		sy = ~~( index / this.cols ) * this.tileHeight;

		this._canvas.width = this._canvas.width;

		this._ctx.drawImage(
			this.sprite.node,
			sx,
			sy,
			sw = this.tileWidth,
			sh = this.tileHeight,
			0,
			0,
			sw,
			sh
		);

		return this._canvas.toDataURL();

	}

}