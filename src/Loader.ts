/// <reference path="Loader/IAjaxConfig" />

class Loader {

	public numRequests     : number = 0;
	public activeRequests  : number = 0;
	public pendingRequests : number = 0;

	public chain: Loader_IAjaxConfig[] = [];

	public  node: any = null;
	private inner: any = null;
	private bar: any = null;

	private _id = 0;

	constructor() {

		this.node  = document.createElement( 'div' );
		this.inner = this.node.appendChild( document.createElement( 'div' ) );
		this.bar   = this.inner.appendChild( document.createElement( 'div' ) );

		this.node.id = 'game-loader';

		( function( me: Loader ) {

			setInterval( function() {

				if ( me.pendingRequests > 0 && me.activeRequests == 0 )
					me.next();

			}, 250 );

		} )( this );

		this.update();

	}

	public ajax( config: Loader_IAjaxConfig ) {

		this.numRequests++;
		this.pendingRequests++;

		this._id++;

		config.__requestID__ = this._id;

		this.chain.push( config );

		this.update();

	}

	public next() {

		var data = [];

		for ( var i=0, len = this.chain.length; i<len; i++ ) {

			data.push( {
				'url': this.chain[i].url,
				'data': this.chain[i].data || null,
				'type': this.chain[i].type || 'GET',
				'id': this.chain[i].__requestID__,
				'dataType': this.chain[i].dataType || null
			} );

		}

		this.activeRequests = data.length;
		this.pendingRequests -= data.length;
		this.update();


		( function( me ) {
	
			var onError = function( reason: string = '' ) {
				
				console.log( me );

				for ( var i=0, len = data.length; i<len; i++ ) {

					for ( var k=0, n = me.chain.length; k < n; k++ ) {

						if ( me.chain[k].__requestID__ != data[i].id )
							continue;

						try {

							console.error( "Request \"" + me.chain[k].url + "\" failed: ", reason );

							if ( me.chain[k].error )
								me.chain[k].error();

						} catch ( err ) {

						}

						me.chain.splice( k, 1 );
						me.activeRequests -= 1;

						break;

					}

				}

				me.update();

			};

			var onSuccess = function( multiResponse ) {

				for ( var i=0, len = multiResponse.length; i<len; i++ ) {

					for ( var k = 0, n = me.chain.length; k<n; k++ ) {

						if ( me.chain[ k ].__requestID__ != multiResponse[i].id )
							continue;

					}

				}

				me.update();
			};

			$.ajax( 'resources/tools/multi-request.php', {
				"type": "POST",
				"data": {
					"data": JSON.stringify( data ) 
				},
				"success": function( response ) {

					if ( !response ) {
						
						onError( null );
					
					} else {
						
						if ( response.error || !response.ok || !response.data ) {
							
							onError( response.error || 'Unknown server error' );
						
						} else {

							onSuccess( response.data );

						}
					}	


				},
				"error": function( ) {
					onError();
				}
			} );


		})( this );


		/*
		this.activeRequests++;
		this.pendingRequests--;

		var cfg: any = this.chain.splice( 0, 1 )[0],
		    success: any = cfg.success || function( data: any ) {},
		    error  : any = cfg.error   || function() {};

		(function( me ) {

			cfg.success = function( data: any ) {

				me.activeRequests--;
				
				try {

					setTimeout( function() {
						if ( success )
						success( data );
					}, 10 );

					me.update();

				} catch ( e ) {

					me.update();

					throw e;

				}

			};

			cfg.error = function( ) {

				me.activeRequests--;

				try {

					setTimeout( function() {
						if ( error )
							error;	
					}, 10 );
					

					me.update();

				} catch ( e ) {

					me.update();

					throw e;

				}

				

			}

		})( this );

		$.ajax( cfg.url, cfg );

		*/

	}

	public update() {

		if ( this.activeRequests == 0 && this.pendingRequests == 0 )
			this.numRequests = 0;

		var remaining = this.numRequests - this.activeRequests - this.pendingRequests,
		    progress  = this.numRequests == 0 ? 0 : ( remaining / ( this.numRequests / 100 ) );

		this.bar.style.width = progress.toFixed( 2 ) + '%';

		this.bar.innerHTML = progress.toFixed( 2 ) + '%';

		this.node.style.display = ( progress ? 'block' : 'none' );

	}

}

var $$ = new Loader();