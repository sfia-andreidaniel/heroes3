class Hero_Skill {

	// public  hero : Objects_Entity_Hero
	// public  name : string; // e.g: Attack
	// public _value: IHero_Skill_Value = { "native": 0, "borrowed": 0 }

	constructor( public hero: Objects_Entity_Hero, public name: string, public _value: IHero_Skill_Value ) {
	}

	get value(): number {
		return this._value.native + this._value.borrowed;
	}

	public learn( native: boolean = true, value: number = 1 ): Hero_Skill {
		this._value[ native ? 'native' : 'borrowed' ] += value;
		return this;
	}

}