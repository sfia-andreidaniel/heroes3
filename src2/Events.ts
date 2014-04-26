class Events {

		public _listeners = {};

		private _createListener( event: string ) {
			this._listeners[ event ] = this._listeners[ event ] || {
				"global": [],
				"once": [],
				"count": 0
			};

			return this._listeners[ event ];
		}

		addListener( event: string, listener ) {
			var grp = this._createListener( event );

			grp.global.push( listener );
			grp.count++;

			this.emit( 'newListener', event, listener );

			return this;
		}

		on( event: string, listener) {
			return this.addListener( event, listener );
		}

		once( event: string, listener ) {
			var grp = this._createListener( event );
			grp.once.push( listener );
		}

		removeListener( event: string, listener ) {
			var grp;
			
			if ( this._listeners[ event ] ) {
				grp = this._createListener( event );
				for ( var i=0, len = grp.global.length; i<len; i++ )
					if ( grp.global[i] == listener ) {
						grp.global.splice( i, 1 );
						this.emit( 'removeListener', event, listener );
						return this;
					}
				for ( var i=0, len = grp.once.length; i<len; i++ )
					if ( grp.once[i] == listener ) {
						grp.once.splice( i, 1 );
						this.emit( 'removeListener', event, listener );
						return this;
					}
			}
			
			return this;
		}

		removeAllListeners( event:string = null ) {
			if ( event !== null ) {
				if ( this._listeners[ event ] )
					delete this._listeners[ event ];
			} else {
				this._listeners = {};
			}
		}

		emit( event: string, ...args: any[] ) {

			var anyCalled = false;

			if ( this._listeners[ event ] ) {
				// Call first the "once", and set the array empty
				while ( this._listeners[ event ].once.length ) {
					this._listeners[ event ].once[0].apply( this, args );
					this._listeners[ event ].once.splice( 0, 1 );
					this._listeners[ event ].count--;
					anyCalled = true;
				}

				for ( var i=0, len = this._listeners[ event ].global.length; i<len; i++ ) {
					this._listeners[ event ].global[i].apply( this, args );
					anyCalled = true;
				}
			}

			return anyCalled;
		}

		static listenerCount( emitter: Events, event: string ) {

			return emitter._listeners[ event ]
				? emitter._listeners[ event ].count
				: 0;

		}

}