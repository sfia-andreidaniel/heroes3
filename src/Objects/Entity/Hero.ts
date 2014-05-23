class Objects_Entity_Hero extends Objects_Entity {

	public _faction  : Faction = null;
	public _heroType : Hero    = null;
	public _xp       : number  = 0;
	public _level    : number  = 1;

	public _isMoving : boolean = false;
	public _direction: string = "S";
	public _movePath : AStar_IPos[] = [];
	public speed     : number = 16;

	private _interractWith: Objects_Entity = null;

	// public rw faction  : number
	// public rw heroType : number
	// public r  name     : string
	// public r  icon     : string
	// public rw moving   : boolean
	// public rw direction: number

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );

		( function( me ) {

			me.instance.afterFire( 'load', function() {
				setTimeout( function() {
					me.direction = me.direction;
				}, 0);
			});

		})(this);
	}

	public $sinchronizable(): boolean {
		return true;
	}

	public $focusable():boolean {
		return true;
	}

	get direction(): string {
		return this._direction;
	}

	set direction( value: string ) {
		var ani = (this._isMoving ? HeroWalkingDirection : HeroStandingDirection)[ value ];

		if ( !ani )
			throw "Invalid direction";

		this.setAnimationIndex( ani.index );
		this.mirrored = ani.mirrored;

		this._direction = value;
	}

	get moving(): boolean {
		return this._isMoving;
	}

	set moving( itIs: boolean ) {

		var ani = (itIs ? HeroWalkingDirection : HeroStandingDirection)[ this._direction ];

		if ( !ani )
			throw "Invalid direction";

		this.setAnimationIndex( ani.index );
		this.mirrored = ani.mirrored;

		this._isMoving = itIs;

		if ( itIs )
			this.layer.map._activeMovingObject = this;
		else {
			try {
				(this.layer.map.layers[ 5 ])['_throttlerCompute']();
			} catch ( none ) {}
		}
	}

	get heroType(): number {
		return this._heroType ? this._heroType.id : null;
	}

	set heroType( heroTypeId: number ) {
		this._heroType = heroTypeId ? this.layer.map.hm.getHeroTypeById( heroTypeId ) : null;
		
		if ( this._faction )
			this._faction.emit( 'heroes-list-changed' );
	}

	get faction(): number {
		return this._faction ? this._faction.id : null;
	}

	set faction( factionId: number ) {
		
		if ( this._faction )
			this._faction.removeHero( this );

		this._faction = factionId ? this.layer.map.fm.getFactionById( factionId ) : null;
		
		if ( this._faction )
			this._faction.load();

		this._faction.addHero( this );

	}

	get name(): string {
		return this._heroType !== null
			? this._heroType.name
			: 'Hero';
	}

	get icon(): string {
		return this._heroType !== null
			? this._heroType.icon
			: '';
	}

	public serialize(): any {
		var out = super.serialize();

		out.data = {
			"faction"  : this.faction,
			"heroType" : this.heroType,
			"isMoving" : this._isMoving,
			"direction": this._direction,
			"xp"       : this._xp,
			"level"    : this._level
		};

		return out;
	}

	public unserialize( data: any ) {
		
		if ( data ) {

			this.faction    = data.faction;
			this.heroType   = data.heroType;
			this._isMoving  = !!data.isMoving;
			this._direction = data.direction || "S";
			this._xp        = data.xp || 0;
			this._level     = data.level || 1;
		}

	}

	public setDestinationCell( cell: Cell, whenReachInterractWith: Objects_Entity = null ) {

		this._interractWith = whenReachInterractWith === this ? null : whenReachInterractWith;

		if ( !( cell.x() == this.col && cell.y() == this.row ) ) {

			var dx = cell.x(),
			    dy = cell.y();

			var start = map.layers[5]['_graph'].get( this.col, this.row ),
			    stop  = map.layers[5]['_graph'].get( dx, dy ),
			    astar = new AStar_Algorithm(),
			    path  = astar.search( map.layers[5]['_graph'], start, stop, { "diagonal": true } );

			if ( !path.length ) {
				return; // Not moveable
			}

			this._movePath = [];

			for ( var i=0, len = path.length; i<len; i++ ) {
				this._movePath.push( path[i].pos );
			}

			this.moving = true;
		
		} else {
			this._onReachedDestination();
		}

	}

	/* Triggered when the hero reached it's movement destination
	 */
	public _onReachedDestination() {

		if ( !this._interractWith )
			return;

		this._interractWith.interractWith( this );
		this._interractWith = null;

	}

	public move() {
		if ( this._isMoving ) {

			if ( this._movePath.length == 0 ) {

				this.moving = false;

			} else {

				var dir = DirectionHelper.getDirection( {
					"x": this.col,
					"y": this.row
				}, this._movePath[0] );

				if ( dir === null ) {
					
					this.moving = false;
				
				} else {

					if ( this._direction != dir )
						this.direction = dir;

					switch ( dir ) {

						case 'N':
							this.shiftY -= this.speed;
							break;

						case 'NE':
							this.shiftY -= this.speed;
							this.shiftX += this.speed;
							break;

						case 'E':
							this.shiftX += this.speed;
							break;

						case 'SE':
							this.shiftX += this.speed;
							this.shiftY += this.speed;
							break;

						case 'S':
							this.shiftY += this.speed;
							break;

						case 'SW':
							this.shiftY += this.speed;
							this.shiftX -= this.speed;
							break;

						case 'W':
							this.shiftX -= this.speed;
							break;

						case 'NW':
							this.shiftX -= this.speed;
							this.shiftY -= this.speed;
							break;

					}

					if ( Math.abs( this.shiftX ) >= 32 || Math.abs( this.shiftY ) >= 32 ) {

						this.shiftX = 0;
						this.shiftY = 0;
						this.moveTo( this._movePath[0].x, this._movePath[0].y );
						this._movePath.splice( 0, 1 );

						if ( !this._movePath.length ) {
							this.moving = false;
							this._onReachedDestination();
						}

					}

				}

			}
		}
	}

	public paint( ctx2d, x: number, y: number ) {

		if ( this == this.layer.map._activeObject ) {

			ctx2d.setStrokeColor( '#0f0' );
			ctx2d.lineWidth = 3;
			
			Canvas2dContextHelper.drawEllipseByCenter(
				ctx2d, 
				x + this.instance.hsx * 32 + 16 + this.shiftX, 
				y + this.instance.hsy * 32 + 32 + this.shiftY, 
				48, 24 
			);

		}

		super.paint( ctx2d, x, y );
	}

	public remove() {

		// stop hero if it's moving
		if ( this.moving )
			this.moving = false;

		// if hero is active, blur it
		if ( this.layer.map._activeObject == this )
			this.layer.map.activeObject = null;

		// remove hero from it's faction
		if ( this._faction )
			this._faction.removeHero( this );


		super.remove();
	}

	public edit() {

		( function( hero ){

			$$.ajax( {
			    "url": 'tools/game/hero/editor.tpl',
				"type": "POST",
				"cache": false,
				"success": function( html ) {

					var tpl = new XTemplate( html );
					
					tpl.assign( 'hero_id', hero.$id + '' );

					tpl.parse('');

					$(tpl.text + '')['dialog']({
						"width": 400,
						"height": 400,
						"modal": true,
						"buttons": {

							"Ok": function() {

							}

						},
						"close": function() {

							$(this).remove();

						},
						"open": function() {
							$(this).find( ".tabs" )[ 'tabs' ]();
						},
						"title": hero.name
					});

				},
				"error": function() {

					alert( 'Error editing hero' );

				}

			} );

		})( this );

	}

}