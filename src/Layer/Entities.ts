class Layer_Entities extends Layer {

	// public map: AdvMap
	// public index: number

	public _objects: Objects_Entity[] = null;

	constructor( public map: AdvMap, public index: number, private _name: string ) {
		super( map, index );
		this._onInit();
	}

	private _onInit() {
		( function( me ) {

			me.map.on( 'resize', function( cols, rows ) {
				me._objects = [];
				for ( var i=0, len = cols * rows; i<len; i++ ) {
					me._objects.push( null );
				}
			});

		})( this );

		this.on( 'change', function( x, y, data ) {

			if ( !this._interactive )
				return;

			var index		 : number,
			    obj 		 : Objects_Item = null,
			    dataTypeId 	 : number,
			    dataServerId : number = null;

			if ( this._objects[  index = ( y * this.map.rows + x ) ] ) {
				this._objects[ index ].destroy();
			}

			if ( data === null ) {
			
				this._objects[ index ] = null;
			
			} else {

				switch ( typeof data ) {
					case 'number':
						dataTypeId = data;
						break;
					case 'object':
						dataTypeId = data.typeId;
						dataServerId = data.id || null;
						break;
					default:
						throw "Invalid data type!";
						break;
				}

				obj = this.map.objects.getObjectById( dataTypeId );

				if ( !obj )
					throw "Failed to get object #" + data + " from map objects";

				switch ( obj.objectClass ) {

					case 'Hero':
						this._objects[ index ] = new Objects_Entity_Hero( data, x, y, this );
						break;

					case 'Hero_Embarked':
						this._objects[ index ] = new Objects_Entity_Hero_Embarked( data, x, y, this );
						break;

					case 'AventureItem':
						this._objects[ index ] = new Objects_Entity_AdventureItem( data, x, y, this );
						break;

					case 'Artifact':
						this._objects[ index ] = new Objects_Entity_Artifact( data, x, y, this );
						break;

					case 'Castle':
						this._objects[ index ] = new Objects_Entity_Castle( data, x, y, this );
						break;

					case 'Dwelling':
						this._objects[ index ] = new Objects_Entity_Dwelling( data, x, y, this );
						break;

					case 'Tileset':
						this._objects[ index ] = new Objects_Entity_Tileset( data, x, y, this );
						break;

					case 'Mine':
						this._objects[ index ] = new Objects_Entity_Mine( data, x, y, this );
						break;

					case 'Resource':
						this._objects[ index ] = new Objects_Entity_Resource( data, x, y, this );
						break;

					case 'Creature_Adventure':
						this._objects[ index ] = new Objects_Entity_Creature_Adventure( data, x, y, this );
						break;

					default:
						this._objects[ index ] = new Objects_Entity( data, x, y, this );
						break;

				}

				this._objects[ index ].setServerInstanceId( dataServerId );

			}

		});

	}

	public getData() {
		var out = [];
		
		for ( var i=0, len = this._objects.length; i<len; i++ ) {
			out.push( this._objects[i] ? this._objects[i].serialize() : null );
		}

		return {
			"objects": out
		};

	}

	public setData( data: any ) {
		
		var old_interactive = this._interactive;
		this._interactive   = true;

		for ( var i=0, len = this.map.cells.length; i<len; i++ ) {
			this.map.cells[ i ].setData( this.index, data.objects[ i ] );
		}

		this._interactive = old_interactive;

	}

	public paint( cellCol, cellRow, x, y, ctx2d ) {
		
		if ( this.visible ) {
			
			var index = cellRow * this.map.rows + cellCol,
			    o     = this._objects[ index ];

			if ( o )
				o.paintRelative( ctx2d, x, y );
		
		}

	}

	get name() {
		return this._name + " ( objects layer )";
	}

}