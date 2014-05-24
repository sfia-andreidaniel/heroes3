/// <reference path="Skill/IValue.ts" />

class Hero_Skill extends Events {

	public levelIncrement: number = 0; // 0 - 'bae', 1 - 'numeric'. Bae stands for "Basic Advanced Expert"
	public name: string;               // the name of the skill


	public construct( public hero: Objects_Entity_Hero, public name: string, public _value: IHero_Skill_Value ) {
		super();
	}

	// return the skill value
	get value(): number {
		switch ( this.levelIncrement ) {
			case 0: // bae
				return this._value.native * 33 + ( this._value.borrowed < 0 ? 0 : this._value.borrowed );
				break;

			case 1: // numeric
				return this._value.native + ( this._value.borrowed < 0 ? 0 : this._value.borrowed );
				break;

			default:
				return 0;
		}
	}

	/* Increments this skill 
	 */

	public inc( type: number, value: number ) {
		switch ( type ) {
			case 0: // native
				
				if ( this.levelIncrement == 0 ) { // increment native bae
					if ( value < 1 )
						throw "Native skill increment should be gte 1";
					
					this._value.native = ( this._value.native + value ) > 3 ? 3 : this._value.native + value;
				
				} else { // increment native numeric

					if ( value < 1 )
						throw "Native skill increment should be gte 1";

					this._value.native += value;
				
				}

				break;

			case 1: // borrowed

				if ( this.levelIncrement == 0 ) { // increment numeric borrowed

					this._value.borrowed += value;

				}

				break;
		}
	}

}