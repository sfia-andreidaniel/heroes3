/// <reference path="../Events.ts" />

class Matrix_StyleSheet extends Events {
	
	public rules = {};

	constructor( public map: GameMap, fileData, public selectorLength: number, name: string = "unnamed" ) {

	    super();
	    
	    var lines = fileData.split( "\n" ),
	        selector: string,
	        value: string,
	        matches;

	    for ( var i=0, len = lines.length; i<len; i++ ) {

	    	if ( matches = /^([\s]+)?([a-z\d_\*]+)[\s]+([\S]+)([\s]+)?$/i.exec( lines[i] ) ) {

	    		selector = matches[2];
	    		value = matches[3];

	    		this.addSelector( selector, value, false );

	    	}

	    }

	    console.log( "Loaded matrix stylesheet: " + name + ", selectorLength: " + this.selectorLength );

	}

	public querySelector( hash: string ) {

		return this.rules[ hash ] || null;

	}

	public addSelector( rule: string, value: string, triggerMapUpdate: boolean = true ) {
		
		if ( rule.length != this.selectorLength )
			throw "Failed to add selector, selector value is ne with this matrix stylesheet selector length.";

		if ( this.rules[ rule ] ) {
			if ( this.rules[rule].indexOf( value ) == -1 )
				this.rules[ rule ].push( value );
		} else {
			this.rules[ rule ] = [ value ];
		}

		if ( triggerMapUpdate )
			this.map.emit( 'mss-changed', rule );

	}

	public removeSelector( rule: string, value: string ) {

		if ( this.rules[ rule ] ) {

			for ( var i=0, len = this.rules[ rule ].length; i<len; i++ )
				
				if ( this.rules[ rule ][i] == value ) {
					this.rules[ rule ].splice( i, 1 );

					if ( this.rules[ rule ].length == 0 )
						delete this.rules[rule];

					this.map.emit( 'mss-changed', rule );
					return;
				}

		}

	}

	public getStyleSheet() {

		var out = [];

		for ( var k in this.rules ) {

			if ( this.rules.propertyIsEnumerable( k ) ) {
				for ( var i=0, len = this.rules[k].length; i<len; i++ )
					out.push( k + ' ' + this.rules[k][i] );
			}

		}

		return out.join( '\n' );

	}

}