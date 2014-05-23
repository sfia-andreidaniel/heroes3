class Objects_Entity extends Events {

	// public itemTypeId: number = 0;
	// public col: number = 0;
	// public row: number = 0;
	// public layer: Layer_Entities;

	public instance: Objects_Item = null;		// pointer to animation object
	public frameIndex: number = 0;				// current animation frame index
	
	public $id = null; 							// server side entity ID

	private _animationIndex = null;
	private _animationFrames: number[] = [ 0 ];
	private _animationNumFrames: number = 0;

	public  mirrored: boolean = false;
	public  shiftX:   number = 0; // for shifted painting
	public  shiftY:   number = 0;

	constructor ( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super();

		this.instance = this.layer.map.objects.getObjectById( this.itemTypeId );

		if ( this.instance.loaded ) {
			if ( this.instance.animated ) {
				this.setAnimationIndex( this.instance.animationGroups[0] ? 0 : null );
			}
		} else {

			(function( me ) {

				me.instance.once( 'load', function() {
					if ( me.instance.animated ) {
						me.setAnimationIndex( me.instance.animationGroups[0] ? 0 : null );
					}
				});

			})( this );

			this.instance.load();
		}

		

		this.layer.map.emit( 'entity-create', this );

	}

	public $sinchronizable(): boolean {
		return false;
	}

	public $focusable(): boolean {
		return false;
	}

	public setServerInstanceId( instanceId: number = null ) {
		
		if ( instanceId === null ) {

			this.layer.map.uniqueId++;
			this.$id = this.layer.map.uniqueId;

		} else {

			this.$id = instanceId;

		}
	}

	public unserialize( data: any ) {
		// this method is necesarry for loading data from a map
		// serialized structure, and should be implemented on ancestors.
	}

	/* Serialize the entity in order to be able to store it on server */
	public serialize(): any {
		return this.$sinchronizable() ? {
			'typeId': this.itemTypeId,
			'id': this.$id
		} : this.itemTypeId;
	}

	public paint( ctx2d, x: number, y: number ) {
		if ( this.instance.loaded ) {
			
			var sx: number = ( 
					this.mirrored ? ( this.instance.frames - 1 ) - this._animationFrames[ this.frameIndex ] 
							      : this._animationFrames[ this.frameIndex ]
				) * this.instance.width,
			    sy: number = 0,
			    sw: number = this.instance.width,
			    sh: number = this.instance.height;

			ctx2d.drawImage( 
				this.mirrored
					? this.instance.sprite.nodeX
					: this.instance.sprite.node,
				sx,
				sy,
				sw,
				sh,
				x + this.shiftX,
				y + this.shiftY,
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

	public remove() {
		
		// remove from map
		this.destroy();
		
		// remove from layer
		if ( this.layer ) {
			this.layer.map.cellAt( this.col, this.row ).setData( this.layer.index, null );
		}

	}

	public destroy() {
		this.layer.map.emit( 'entity-destroy', this );
	}

	public moveTo( x: number, y: number ) {

		if ( x < 0 || y < 0 || x >= this.layer.map.cols || y >= this.layer.map.rows )
			throw "Invalid destination (out of bounds)!";

		var actualIndex: number =  this.row * this.layer.map.cols + this.col,
		    newIndex:    number =  y * this.layer.map.cols + x,
		    viewports : Viewport[] = this.getVisibleViewports(),
			cell: Cell,
			tmp: any;

		if ( actualIndex == newIndex )
			return;

		if ( this.layer._objects[ newIndex ] )
			throw "Destination allready contains an object!";

		for ( var i=0, len = viewports.length; i<len; i++ ) {
			if ( !viewports[i].shouldRenderCell( cell = this.getOwnerCell() ) )
				viewports[i].removeFromPaintables( cell );
		}


		this.layer._objects[ newIndex ] = this;
		this.layer._objects[ actualIndex ] = null;

		tmp = this.layer.map.cellAt( this.col, this.row ).getData( this.layer.index );

		this.layer.map.cellAt( this.col, this.row ).setData( this.layer.index, null, true );

		this.col = x;
		this.row = y;

		this.layer.map.cellAt( this.col, this.row ).setData( this.layer.index, tmp, true );

		viewports = this.getVisibleViewports();

		for ( var i=0, len = viewports.length; i<len; i++ ){
			viewports[i].addToPaintables( cell = this.getOwnerCell() );
		}

		for ( var i=0, len = this.layer.map.viewports.length; i<len; i++ ) {
			if ( this.layer.map.viewports[i].shouldRenderCell( cell ) )
				this.layer.map.viewports[i].addToPaintables( cell );
		}

	}

	public moveBy( x: number, y: number ) {

		this.moveTo( this.col + x, this.row + y );

	}

	/* We must determine if the entity's cell is outside
	   the viewport, but paintable on it.
	 */
	public inViewport( vp: Viewport ): boolean {
		
		if ( this.instance.cols < 2 || this.instance.rows < 2 )
			return false;

		var x1: number = this.col - this.instance.hsx,
		    y1: number = this.row - this.instance.hsy,
		    x2: number = x1 + this.instance.cols,
		    y2: number = y1 + this.instance.rows;

		return ( x2 < vp.x ||
		       x1 > vp.x + vp.cols ||
		       y2 < vp.y ||
		       y1 > vp.y + vp.rows ) 
			? false : true;

	}

	public getOwnerCell(): Cell {
		return this.layer.map.cellAt( this.col, this.row, false );
	}

	public getVisibleViewports(): Viewport[] {
		var out = [];
		
		for ( var i=0, len = this.layer.map.viewports.length; i<len; i++ ) {
			if ( this.inViewport( this.layer.map.viewports[i] ) )
				out.push( this.layer.map.viewports[i] );
		}

		return out;
	}

	public getAnimationIndex() {
		return this._animationIndex;
	}

	public setAnimationIndex( animationIndex: number ) {
		
		this._animationFrames = [];

		if ( animationIndex === null ) {
			if ( this.instance.animated ) {
				for ( var i=0; i<this.instance.frames; i++ ) {
					this._animationFrames.push( i );
				}
				this._animationNumFrames = this.instance.frames;
			} else {
				this._animationFrames.push( 0 );
				this._animationNumFrames = 1;
			}
		} else {
			if ( this.instance.animationGroups[ animationIndex ] ) {
				this._animationFrames = this.instance.animationGroups[ animationIndex ];
				this._animationNumFrames = this._animationFrames.length;
			} else throw "Invalid animation index: " + JSON.stringify( animationIndex );
		}

		this._animationIndex = animationIndex;

		this.frameIndex = 0;
	}

	public tick() {

		if ( this._animationNumFrames ) {

			this.frameIndex = ++this.frameIndex == this._animationNumFrames 
				? 0
				: this.frameIndex;
		}

	}

	public scrollIntoView() {

		for ( var i = 0, len = this.layer.map.viewports.length; i<len; i++ ) {

			this.layer.map.viewports[i].scrollToXY(

				this.col - ~~( this.layer.map.viewports[i].cols / 2 ),
				this.row - ~~( this.layer.map.viewports[i].rows / 2 )

			);

		}

	}

	/* The role of this function is to "make" the param @obj
	   to "move" in the front ( hsx, hsy + 1 ) position of
	   this object.
	 */

	public callObjectAtMyself( obj: Objects_Entity ) {

		if ( obj == this )
			return;

		// test if the movement layer allows movement @pos hsx, hsy + 1
		var targetX = this.col,
		    targetY = this.row + 1,
		    index   = this.layer.map.cols * targetY + targetX;

		if ( targetX < 0 || targetY < 0 || targetX >= this.layer.map.cols || targetY >= this.layer.map.rows )
			return; // target call position outside map.
		

		switch ( true ) {

			case obj instanceof Objects_Entity_Hero:

				obj.setDestinationCell( this.layer.map.cellAt( targetX, targetY ), this );

				break;

		}

	}

	public interractWith( obj: Objects_Entity_Hero ) {
		console.log( this, "Interract with: ", obj );
	}

	/* Tries to make the object to "move" to the target cell
	 */
	public setDestinationCell( cell: Cell, whenReachInterractWith: Objects_Entity = null ) {
		// should be overrided by children ( Heroes for now )
	}

	/* Move tick function, that animates movement
	 */
	public move() {
		// should be overrided by capable moving objects
	}

	/* Not implemented for now
	 */
	public edit() {
		// should be overrided by ancestors.
	}

}