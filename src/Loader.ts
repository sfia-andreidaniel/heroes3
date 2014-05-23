/// <reference path="Loader/IAjaxConfig" />

class Loader {

	public numRequests     : number = 0;
	public activeRequests  : number = 0;
	public pendingRequests : number = 0;

	public chain: Loader_IAjaxConfig[] = [];

	public  node: any = null;
	private inner: any = null;
	private bar: any = null;

	constructor() {

		this.node  = document.createElement( 'div' );
		this.inner = this.node.appendChild( document.createElement( 'div' ) );
		this.bar   = this.inner.appendChild( document.createElement( 'div' ) );

		this.node.id = 'game-loader';

		( function( me: Loader ) {

			setInterval( function() {

				if ( me.pendingRequests > 0 && me.activeRequests == 0 )
					me.next();

			}, 10 );

		} )( this );

		this.update();

	}

	public ajax( config: Loader_IAjaxConfig ) {

		this.numRequests++;
		this.pendingRequests++;

		this.chain.push( config );

		this.update();

	}

	public next() {

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