class Hero_ArtifactsManager {

	public ammoCart     : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'ammoCart'    , 'ammoCart'     );
	public backPack     : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this, -1,  null         , 'backPack'     ); // the backpack has infinite storage and accepts anything
	public ballista     : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'ballista'    , 'ballista'     );
	public catapult     : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'catapult'    , 'catapult'     );
	public feet         : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'feet'        , 'feet'         );
	public finger       : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  2, 'finger'      , 'finger'       );
	public firstAidTent : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'firstAidTent', 'firstAidTent' );
	public head         : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'head'        , 'head'         );
	public leftHand     : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'leftHand'    , 'leftHand'     );
	public rightHand    : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'rightHand'   , 'rightHand'    );
	public misc         : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  5, 'misc'        , 'misc'         );
	public neck         : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'neck'        , 'neck'         );
	public shoulders    : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'shoulders'   , 'shoulders'    );
	public spellBook    : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'spellBook'   , 'spellBook'    );
	public torso        : Hero_ArtifactsManager_Slot = new Hero_ArtifactsManager_Slot( this,  1, 'torso'       , 'torso'        );

	// public hero: Objects_Entity_Hero

	// slots names enumerator
	public static slots = [
		'ammoCart',
		'backPack',
		'ballista',
		'feet',
		'finger',
		'firstAidTent',
		'head',
		'leftHand',
		'rightHand',
		'misc',
		'neck',
		'shoulders',
		'spellBook',
		'torso',
		'catapult'
	];

	constructor( public hero: Objects_Entity_Hero ) {

	}

	public serialize() {
		var out = {};
		for ( var i=0, len = Hero_ArtifactsManager.slots.length; i<len; i++ ) {
			out[ Hero_ArtifactsManager.slots[i] ] = this[ Hero_ArtifactsManager.slots[i] ].serialize();
		}
		return out;
	}

	public unserialize( struc ) {

		if ( struc ) {

			for ( var i=0, len = Hero_ArtifactsManager.slots.length; i<len; i++ ) {
				this[ Hero_ArtifactsManager.slots[i] ].unserialize(
					struc[ Hero_ArtifactsManager.slots[i] ] || null
				);
			}

		}

	}

}