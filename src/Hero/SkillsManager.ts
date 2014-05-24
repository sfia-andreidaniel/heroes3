class Hero_SkillsManager {

	// public hero            : Objects_Entity_Hero;

	public attack		: Hero_Skill = null;
	public defence		: Hero_Skill = null;
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
	public offence		: Hero_Skill_Secondary = null;
	public armourer		: Hero_Skill_Secondary = null;
	public intelligence	: Hero_Skill_Secondary = null;
	public sorcery		: Hero_Skill_Secondary = null;
	public resistence	: Hero_Skill_Secondary = null;
	public healing		: Hero_Skill_Secondary = null;

	public static cssMappings = {
		"attack": "attack",
		"defence": "defence",
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
		"offence": "offence",
		"armourer": "armourer",
		"intelligence": "intelligence",
		"sorcery": "sorcery",
		"resistence": "resistence",
		"healing": "healing"
	}

	constructor( public hero: Objects_Entity_Hero ) {
		
		this.attack     = new Hero_Skill( hero, "attack", { "native": 0, "borrowed": 0 } );
		this.defence    = new Hero_Skill( hero, "defence", { "native": 0, "borrowed": 0 } );
		this.spellPower = new Hero_Skill( hero, "spell-power", { "native": 0, "borrowed": 0 } );
		this.knowledge  = new Hero_Skill( hero, "knowledge", { "native": 0, "borrowed": 0 } );
		
	}

	public get( skillName: string, allowNull: boolean = false ): Hero_Skill {
		
		if ([ 'attack', 'defence', 'spellPower', 'knowledge' ].indexOf( skillName ) >= 0)
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
			if ( [ 'attack', 'defence', 'spellPower', 'knowledge' ].indexOf( k ) == -1 &&
				 this[ k ] != null
			) out.push( this[k] );
		}
		return out;
	}

}