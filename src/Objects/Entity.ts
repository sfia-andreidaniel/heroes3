class Objects_Entity extends Events {

	// public itemTypeId: number = 0;
	// public col: number = 0;
	// public row: number = 0;
	// public layer: Layer_Entities;

	public instance: Objects_Item = null;
	public frameIndex: number = 0;


	constructor ( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities  ) {
		super();

		this.instance = this.layer.map.objects.getObjectById( this.itemTypeId );

		this.instance.load();

		this.layer.map.emit( 'entity-create', this );

	}

	public paint( ctx2d, x: number, y: number ) {
		if ( this.instance.loaded ) {
			
			var sx: number = this.frameIndex * this.instance.width,
			    sy: number = 0,
			    sw: number = this.instance.width,
			    sh: number = this.instance.height;

			ctx2d.drawImage( 
				this.instance.sprite.node,
				sx,
				sy,
				sw,
				sh,
				x,
				y,
				sw,
				sh
			);

		}
	}

	public paintRelative( ctx2d, x: number, y: number ) {
		if ( this.instance.loaded ) {
			this.paint( ctx2d, x - ( this.instance.hsx * this.instance.tileWidth ), y - ( this.instance.hsy * this.instance.tileHeight ) );
		}
	}

	public destroy() {
		this.layer.map.emit( 'entity-destroy', this );
	}

	public moveTo( x: number, y: number ) {

		if ( x < 0 || y < 0 || x >= this.layer.map.cols || y >= this.layer.map.rows )
			throw "Invalid destination (out of bounds)!";

		var actualIndex: number =  this.row * this.layer.map.cols + this.col,
		    newIndex:    number =  y * this.layer.map.cols + x;

		if ( actualIndex == newIndex )
			return;

		if ( this.layer._objects[ newIndex ] )
			throw "Destination allready contains an object!";

		this.layer._objects[ newIndex ] = this;
		this.layer._objects[ actualIndex ] = null;

		this.col = x;
		this.row = y;
	}

	public moveBy( x: number, y: number ) {

		this.moveTo( this.col + x, this.row + y );

	}

}