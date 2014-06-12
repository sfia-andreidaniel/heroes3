class Dialogs {

	public static _d: any = document.createElement( 'div' );

	public static htmlentities( str: string ): string {
		
		Dialogs._d.innerHTML = '';

		var t: any = document.createTextNode( str || '' );

		Dialogs._d.appendChild( t );

		return Dialogs._d.innerHTML;
	}

	/* Basic alert dialog */

	public static alert( content: string, title: string = 'Alert', ok: any = null ) {

		$$.ajax( {
			"url": "tools/game/dialogs/alert.tpl",
			"type": "GET",
			"success": function( data ) {
				
				var tpl = new XTemplate( data );
				
				tpl.assign( 'message', Dialogs.htmlentities( content ).replace( /[\n\r]+/g, '<br />' ) );

				tpl.parse('');

				$( tpl.text )[ 'dialog' ]({
					"width": 400,
					"modal": true,
					"buttons": {
						"Ok": function() {
							
							$(this).remove();

							if ( ok )
								ok();

						}
					},
					"close": function() {
						$(this).remove();

						if ( ok )
							ok();
					},
					"title": title
				});

			},
			"error": function() {
				alert( "Dialogs.alert: Failed to create modal window!" );
			}
		} )

	}

	/* Basic Yes / No decision dialog */

	public static decision( question: string, title: string = 'Question', yes: any = null, no: any = null ) {

		$$.ajax( {

			"url": "tools/game/dialogs/decision.tpl",
			"type": "GET",
			"success": function( data ) {

				var tpl = new XTemplate( data );

				tpl.assign( 'message', Dialogs.htmlentities( question ).replace( /[\n\r]+/g, '<br />' ) );

				tpl.parse('');

				$( tpl.text )[ 'dialog' ]({
					"width": 400,
					"modal": true,
					"buttons": {
						"Yes": function() {
							$(this).remove();
							if ( yes )
								yes();
						},
						"No": function() {
							$(this).remove();
							if ( no )
								no();
						}
					},
					"close": function() {
						$(this).remove();
						if ( no )
							no();
					},
					"title": title
				});

			},
			"error": function() {
				
				alert( "Dialogs.decision: Failed to create modal window" );
				
				if ( no )
					no();
			}

		} );

	}

}