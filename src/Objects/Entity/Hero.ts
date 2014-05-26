class Objects_Entity_Hero extends Objects_Entity {

	public _faction  : Faction = null;
	public _heroType : Hero    = null;
	public _xp       : number  = 0;
	public _level    : number  = 1;

	public _isMoving : boolean = false;
	public _direction: string = "S";
	public _movePath : AStar_IPos[] = [];
	public speed     : number = 16;

	public skills    : Hero_SkillsManager;
	public artifacts : Hero_ArtifactsManager;

	private _interractWith: Objects_Entity = null;

	// public rw faction  : number
	// public rw heroType : number
	// public r  name     : string
	// public r  icon     : string
	// public rw moving   : boolean
	// public rw direction: number

	public static xp_levels: number[] = [
		45, 1000, 2000, 3200, 4500, 6000, 7700, 9000, 11000,
		13200, 15500, 18500, 22100, 26420, 31604, 37824, 45288,
		54244, 64991, 77887, 93362, 111932, 134216, 160956, 193044,
		231549, 277755, 333202, 399738, 479581, 575392, 690365, 828332,
		993892, 1192564, 1430970, 1717057, 2060361, 2472325, 2966681,
		3559908, 4271780, 5126026, 6151121, 7381235, 8857371, 10628734,
		12754369, 15305131, 18366045, 22039141, 26446856, 31736114,
		38083223, 45699753, 54839589, 65807395, 78968755, 94762390,
		113714752, 136457586, 163748986, 196498666, 235798282, 282957821,
		339549267, 407459002, 488950684, 586740702, 704088723, 844906348,
		1013887498, 1216664878, 1459997734, 1751997161
	];

	constructor( public itemTypeId: number, public col: number, public row: number, public layer: Layer_Entities ) {
		super( itemTypeId, col, row, layer );

		this.skills = new Hero_SkillsManager( this );
		this.artifacts = new Hero_ArtifactsManager( this );

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

	get level(): number {
		return this._level;
	}

	get xp(): number {
		return this._xp;
	}

	set xp( newVal: number ) {
		/* Determine if the actual level of the client
		   is "behind" the value of the actual XP.
		 */
		this._xp = newVal < 0 ? 0 : newVal;

		for ( var i=0, len = Objects_Entity_Hero.xp_levels.length; i<len; i++ ) {
			if ( this._xp >= Objects_Entity_Hero.xp_levels[i] ) {
				if ( this._level < ( i + 1 ) ) {
					this.onLevelUP( i + 1 );
					break;
				}
			} else break;
		}
	}

	public serialize(): any {
		var out = super.serialize();

		out.data = {
			"faction"  : this.faction,
			"heroType" : this.heroType,
			"isMoving" : this._isMoving,
			"direction": this._direction,
			"xp"       : this._xp,
			"level"    : this._level,
			"skills"   : this.skills.serialize()
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

			this.skills.unserialize( data.skills || null );
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

	public onLevelUP( newLevel: number ) {

		this._level = newLevel;

		var primarySkill = this.skills.purposePrimarySkillLevelUP();
		primarySkill.learn( true, 1 );

		var secondarySkills = this.skills.purposeSecondarySkillsLevelUP();
		
		if ( secondarySkills.length == 1 ) {
			secondarySkills[0].learn( true, 1 );
		}

		( function( hero ) {
			$$.ajax( { 
				"url": 'tools/game/hero/levelup.tpl',
				"type": "GET",
				"success": function( html ) {

					var tpl = new XTemplate( html );

					tpl.assign( 'hero_id', hero.$id + '' );
					tpl.assign( 'icon', hero.icon );
					tpl.assign( 'name', hero.name );
					tpl.assign( 'level', hero._level + '' );

					tpl.assign( 'primary_skill', primarySkill.name );

					switch ( true ) {

						case secondarySkills.length == 0:
							tpl.parse( 'no_skills' );
							break;

						case secondarySkills.length == 1:
							
							tpl.assign( 'secondary_skill', secondarySkills[0].name );

							switch ( secondarySkills[0]._value.native ) {
								case 1:
									tpl.assign( 'secondary_skill_level', 'basic' );
									break;
								case 2:
									tpl.assign( 'secondary_skill_level', 'advanced' );
									break;

								case 3:
									tpl.assign( 'secondary_skill_level', 'expert' );
									break;
							}

							tpl.parse( 'one_skill' );
							break;

						default:

							for ( var i=0; i<2; i++ ) {

								( function( skill ) {

									tpl.assign( 'secondary_skill', skill.name );
									tpl.assign( 'secondary_skill_prop_name', skill.getPropertyName() );

									switch ( skill._value.native ) {
										case 0:
											tpl.assign( 'secondary_skill_level', 'basic' );
											break;
										case 1:
											tpl.assign( 'secondary_skill_level', 'advanced' );
											break;
										default:
											tpl.assign( 'secondary_skill_level', 'expert' );
											break;
									}

									tpl.parse( 'two_skills.skill' );

								})( secondarySkills[i] );

							}

							tpl.parse( 'two_skills' );
							break;

							// two skills, player must choose which skill to upgrade


					}

					tpl.parse('');

					$( tpl.text + '' )[ 'dialog' ]({
						"title": hero.name + " has gained a new level",
						"width": 400,
						"height": 440,
						"buttons": {
							"Ok": function() {

								if ( !$(this).find( 'td.selectable-skill' ).length ) {

									$(this).remove();

									hero.xp = hero.xp;

									return;
								}

								var skillName = null;

								$(this).find( 'td.selectable-skill.selected' ).each( function() {
									skillName = $(this).find( 'div.g-sk' ).attr( 'data-skill-name' );
								});

								if ( skillName === null )
									return;

								hero.skills.get( skillName ).learn( true, 1 );

								$(this).remove();

								hero.xp = hero.xp;

							}
						},
						"open": function() {
							/* Remove the dialog close button */
							$(this).parent().find( 'button.ui-dialog-titlebar-close' ).remove();
							/* Make selectable skills "clickable" */
							$(this).find( 'td.selectable-skill').on( 'click', function() {
								$(this).parent().find( 'td.selectable-skill' ).removeClass( 'selected' );
								$(this).addClass( 'selected' );
							});
						},
						"modal": true,
						"resizable": false
					});

				}
			});
		})( this );
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
					tpl.assign( 'icon',    hero.icon );
					tpl.assign( 'name',    hero.name );
					tpl.assign( 'level',   hero._level + '' );
					tpl.assign( 'xp',      hero._xp + '' );
					tpl.assign( 'race',    hero._heroType ? hero._heroType.race : '' );

					tpl.assign( 'sk_attack', hero.skills.attack.value + '' );
					tpl.assign( 'sk_defense', hero.skills.defense.value + '' );
					tpl.assign( 'sk_spell_power', hero.skills.spellPower.value + '' );
					tpl.assign( 'sk_knowledge', hero.skills.knowledge.value + '' );

					var sk = hero.skills.getActiveSecondarySkills();

					for ( var i=0, len = sk.length; i<len; i++ ) {

						( function( skill ) {

							tpl.assign( 'skill_name', skill.name );
							tpl.assign( 'skill_level', ( 
								skill._value.native == 1
									? 'basic'
									: (
										skill._value.native == 2
											? 'advanced'
											: 'expert'
									)
							));

							tpl.parse( 'secondary_skill' );

						})( sk[i] );

					}

					tpl.parse('');

					$(tpl.text + '')['dialog']({
						"width": 400,
						"height": 500,
						"modal": true,
						"buttons": {

							"Dismiss": function() {
								hero.remove();
								$(this)['remove']();
							},

							"Ok": function() {
								$(this)['remove']();

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