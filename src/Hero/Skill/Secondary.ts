class Hero_Skill_Secondary extends Hero_Skill {

	constructor( public hero: Objects_Entity_Hero, public name: string, public _value: IHero_Skill_Value ) {
		super( hero, name, _value );
	}


}