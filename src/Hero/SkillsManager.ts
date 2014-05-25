class Hero_SkillsManager {

	// public hero            : Objects_Entity_Hero;

	public attack		: Hero_Skill = null;
	public defense		: Hero_Skill = null;
	public spellPower	: Hero_Skill = null;
	public knowledge	: Hero_Skill = null;

	public archery 		: Hero_Skill_Secondary = null;
	public balistics 	: Hero_Skill_Secondary = null;
	public diplomacy 	: Hero_Skill_Secondary = null;
	public eagleEye 	: Hero_Skill_Secondary = null;
	public estates 		: Hero_Skill_Secondary = null;
	public leadership 	: Hero_Skill_Secondary = null;
	public logistics 	: Hero_Skill_Secondary = null;
	public luck 		: Hero_Skill_Secondary = null;
	public mysticism 	: Hero_Skill_Secondary = null;
	public navigation 	: Hero_Skill_Secondary = null;
	public necromancy 	: Hero_Skill_Secondary = null;
	public pathFinding 	: Hero_Skill_Secondary = null;
	public scouting 	: Hero_Skill_Secondary = null;
	public wisdom 		: Hero_Skill_Secondary = null;
	public fireMagic	: Hero_Skill_Secondary = null;
	public airMagic		: Hero_Skill_Secondary = null;
	public waterMagic	: Hero_Skill_Secondary = null;
	public earthMagic	: Hero_Skill_Secondary = null;
	public scholar		: Hero_Skill_Secondary = null;
	public tactics		: Hero_Skill_Secondary = null;
	public artilery		: Hero_Skill_Secondary = null;
	public learning		: Hero_Skill_Secondary = null;
	public offense		: Hero_Skill_Secondary = null;
	public armourer		: Hero_Skill_Secondary = null;
	public intelligence	: Hero_Skill_Secondary = null;
	public sorcery		: Hero_Skill_Secondary = null;
	public resistence	: Hero_Skill_Secondary = null;
	public firstAid		: Hero_Skill_Secondary = null;

	public static cssMappings = {
		"attack": "attack",
		"defense": "defense",
		"spellPower": "spell-power",
		"knowledge": "knowledge",

		"archery": "archery",
		"balistics": "balistics",
		"diplomacy": "diplomacy",
		"eagleEye": "eagle-eye",
		"estates": "estates",
		"leadership": "leadership",
		"logistics": "logistics",
		"luck": "luck",
		"mysticism": "mysticism",
		"navigation": "navigation",
		"necromancy": "necromancy",
		"pathFinding": "path-finding",
		"scouting": "scouting",
		"wisdom": "wisdom",
		"fireMagic": "fire-magic",
		"airMagic": "air-magic",
		"waterMagic": "water-magic",
		"scholar": "scholar",
		"tactics": "tactics",
		"artilery": "artilery",
		"learning": "learning",
		"offense": "offense",
		"armourer": "armourer",
		"intelligence": "intelligence",
		"sorcery": "sorcery",
		"resistence": "resistence",
		"firstAid": "first-aid"
	}

	constructor( public hero: Objects_Entity_Hero ) {
		
		this.attack     = new Hero_Skill( hero, "attack", { "native": 1, "borrowed": 0 } );
		this.defense    = new Hero_Skill( hero, "defense", { "native": 1, "borrowed": 0 } );
		this.spellPower = new Hero_Skill( hero, "spell-power", { "native": 1, "borrowed": 0 } );
		this.knowledge  = new Hero_Skill( hero, "knowledge", { "native": 1, "borrowed": 0 } );
		
	}

	public get( skillName: string, allowNull: boolean = false ): Hero_Skill {
		
		if ([ 'attack', 'defense', 'spellPower', 'knowledge' ].indexOf( skillName ) >= 0)
			return this[ skillName ];

		if ( typeof Hero_SkillsManager.cssMappings[ skillName ] != 'undefined' ) {

			if ( allowNull )
				return this[ skillName ];
			else {

				if ( this[ skillName ] === null ) {
					this[ skillName ] = new Hero_Skill_Secondary( this.hero, Hero_SkillsManager.cssMappings[ skillName ], { "native": 0, "borrowed": 0 } );
				}

				return this[ skillName ];

			}

		} else throw "Illegal skill: " + skillName + "!";

	}

	public hasSkill( skillName: string ): boolean {
		try {

			return typeof Hero_SkillsManager.cssMappings[ skillName ] != 'undefined' &&
				this[ skillName ] &&
				this[ skillName ].value;

		} catch (e) {
			return false;
		}
	}

	/* @param: level: 0: any, 1: primary, 2: advanced, 3: expert */
	public hasSkillLevel( skillName: string, level: number ): boolean {
		return level <= 0 || level > 3
			? this.hasSkill( skillName )
			: (
				this.hasSkill( skillName )
					? this.get( skillName )._value.native >= level
					: false
			);
	}

	public getActiveSecondarySkills(): Hero_Skill_Secondary[] {
		var out = [];
		for ( var k in Hero_SkillsManager.cssMappings ) {
			if ( [ 'attack', 'defense', 'spellPower', 'knowledge' ].indexOf( k ) == -1 &&
				 this[ k ] != null && this[ k ]._value.native > 0
			) out.push( this[k] );
		}
		return out;
	}

	public purposePrimarySkillLevelUP(): Hero_Skill {

		var chooser = this.hero.level < 10
			? this.hero._heroType.primarySkillsAdvancement.lt10
			: this.hero._heroType.primarySkillsAdvancement.gte10;
		var random: number = ~~( Math.random() * 100 ) + 1,
		    i: number,
		    index: number = 0;

		console.log( chooser, random );

		for ( i=0; i<4; i++ ) {
			if ( random <= chooser[i] ) {
				index = i;
				break;
			} else {
				random -= chooser[i];
			}
		}

		switch ( index ) {
			case 0:
				return this.attack;
				break;
			case 1:
				return this.defense;
				break;
			case 2:
				return this.spellPower;
				break;
			default:
				return this.knowledge;
				break;
		}

	}

	// returns maximum 2 skills.
	// first skill should be an upgrade to a secondary existing skills
	// second skill should be a new skill if maximum number of skills
	// has not been reached, or another existing skill, if maximum number
	// of skills ( 10 ) has been reached.
	public purposeSecondarySkillsLevelUP(): Hero_Skill_Secondary[] {
		var out = [],
		    sk  = this.getActiveSecondarySkills(),
		    roulette = [],
		    max = 0,
		    k, l: string,
		    random: number = 0,
		    i: number = 0,
		    len: number = 0,
		    index1: number = 0,
		    skill1Name: string = null,
		    skill2Name: string = null;
		
		if ( sk.length <=  10 && ( function(): number {
			// and all skills are NOT at level expert

			var lt10 = 0;

			for ( var i=0, len = sk.length; i<len; i++ ) {
				if ( sk[i]._value.native == 3 )
					lt10++;
			}

			return lt10;

		} )() < sk.length ) {

			console.log( 'sk1 ' );

			// has skills, so choose only from existing non-fully-upgraded skills
			for ( k in Hero_SkillsManager.cssMappings ) {
				
				if ( [ 'attack', 'defense', 'spellPower', 'knowledge' ].indexOf( k ) >= 0 )
					continue;

				if ( !this[ k ] || !this[ k ]._value.native || this[ k ]._value.native == 3 )
					continue;

				roulette.push({
					"name": k,
					"chance": this.hero._heroType.secondarySkillsAdvancement[ k ]
				});

				max += this.hero._heroType.secondarySkillsAdvancement[ k ];

			}

		} else {

			console.log( 'sk2 ');

			if ( sk.length < 10 ) {

				// no skills, so it's safe to choose from all skills
				for ( k in this.hero._heroType.secondarySkillsAdvancement ) {

					// skip existing skills which are at expert level
					if ( this[ k ] && this[ k ]._value.native == 3 )
						continue;

					roulette.push({
						"name": k,
						"chance": this.hero._heroType.secondarySkillsAdvancement[ k ]
					});

					max += this.hero._heroType.secondarySkillsAdvancement[ k ];
				}

			}

			
		}

		if ( !roulette.length ) {
			// all skills are fully upgraded, return no skills
			return [];
		}

		random = ~~( Math.random() * max ) + 1;

		for ( i=0, len = roulette.length; i<len; i++ ) {
			
			if ( roulette[i].chance == 0 )
				continue;

			if ( random <= roulette[i].chance ) {
				index1 = i;
				break;
			} else {
				random -= roulette[i].chance;
			}

		}

		skill1Name = roulette[ index1 ].name;

		// rebuild roulette, but this time, don't take in consideration
		// existing skills, and skill1Name.

		roulette = [];
		max = 0;
		index1 = 0;

		// second skill returned only if hero has less than 10 secondary skills
		if ( sk.length < 10 ) {
			for ( k in this.hero._heroType.secondarySkillsAdvancement ) {

				if ( k == skill1Name )
					continue; // ignore allready purposed skill name

				if ( this[ k ] && this[k]._value.native )
					continue;

				roulette.push( {
					"name": k,
					"chance": this.hero._heroType.secondarySkillsAdvancement[ k ]
				} );

				max += this.hero._heroType.secondarySkillsAdvancement[ k ];

			}
		}

		if ( roulette.length ) {

			random = ~~( Math.random() * max ) + 1;

			for ( i=0, len = roulette.length; i<len; i++ ) {
				
				if ( roulette[i].chance == 0 )
					continue;

				if ( random <= roulette[i].chance ) {
					index1 = i;
					break;
				} else {
					random -= roulette[i].chance;
				}

			}

			skill2Name = roulette[index1].name;

			// decrement chance for specific skill for the future
			this.hero._heroType.secondarySkillsAdvancement[ skill2Name ] -= 1;

		}

		var out = [];

		if ( skill1Name )
			out.push( this.get( skill1Name ) );

		if ( skill2Name )
			out.push( this.get( skill2Name ) );

		return out;

	}

	public serialize() {
		var out = {};

		for ( var k in Hero_SkillsManager.cssMappings ) {
			if ( this[ k ] && ( this[ k ]._value.native || this[ k ]._value.borrowed ) )
				out[ k ] = [ this[ k ]._value.native, this[ k ]._value.borrowed ];
		}

		return out;
	}

	public unserialize( obj ) {
		if ( !obj )
			return;

		var sk: Hero_Skill;

		for ( var k in obj ) {
			sk = this.get( k );
			sk._value.native = obj[k][0];
			sk._value.borrowed = obj[k][1];
		}
	}

}