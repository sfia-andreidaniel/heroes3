/// <reference path="../Events.ts" />

class Matrix_StyleSheet extends Events {
	
	public rules = [];

	constructor( fileData, public selectorLength: number, name: string = "unnamed" ) {

	    super();
	    
	    var lines = fileData.split( "\n" ),
	        selector: string,
	        value: string,
	        matches;

	    for ( var i=0, len = lines.length; i<len; i++ ) {

	    	if ( matches = /^([\s]+)?([a-z\d_\*]+)[\s]+([\S]+)([\s]+)?$/i.exec( lines[i] ) ) {

	    		selector = matches[2];
	    		value = matches[3];

	    		if ( selector.length == this.selectorLength )
	    			this.rules.push({
	    				"rule": selector,
	    				"value": value
	    			});

	    	}

	    }

	    console.log( "Loaded matrix stylesheet: " + name + ", " + this.rules.length + " rules, selectorLength: " + this.selectorLength );

	}

	public querySelector( hash: string ) {

		var relevance: number,
		    out = [],
		    isMatch: boolean,
		    rule: string;

		if ( hash.length != this.selectorLength )
			return null;

		for ( var i=0, len = this.rules.length; i<len; i++ ) {

			rule = this.rules[i].rule;

			relevance = this.selectorLength;
			
			isMatch = true;

			for ( var j = 0; j < this.selectorLength; j++ ) {

				if ( hash[j] == '*' )
					continue;

				switch ( rule[j] ) {
					
					case '*':
						relevance--;
						break;

					case hash[j]:
						break;
					default:
						isMatch = false;
						break;
				}

				if ( !isMatch )
					break;
			}

			if ( isMatch )
				out.push( {
					"rule": rule,
					"relevance": relevance,
					"value": this.rules[i].value
				} );

		}

		return out.length ? out : null;

	}

}