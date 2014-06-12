class DOMUtils {

	public static ResourceToHTML( resource: IResource ): string {
		
		var out = [],
		    k: string;

		for ( k in resource ) {

			switch ( k ) {
				case 'gold':
					out.push( '<nobr><div class="g-res id-1"></div> ' + resource[k] + "</nobr>" );
					break;

				case 'wood':
					out.push( '<nobr><div class="g-res id-2"></div> ' + resource[k] + '</nobr>' );
					break;

				case 'ore':
					out.push( '<nobr><div class="g-res id-3"></div> ' + resource[k] + '</nobr>' );
					break;

				case 'sulfur':
					out.push( '<nobr><div class="g-res id-4"></div> ' + resource[k] + '</nobr>' );
					break;

				case 'crystals':
					out.push( '<nobr><div class="g-res id-5"></div> ' + resource[k] + '</nobr>' );
					break;

				case 'gems':
					out.push( '<nobr><div class="g-res id-6"></div> ' + resource[k] + '</nobr>' );
					break;

				case 'mercury':
					out.push( '<nobr><div class="g-res id-7"></div> ' + resource[k] + '</nobr>' );
					break;

				case 'mithril':
					out.push( '<nobr><div class="g-res id-8"></div> ' + resource[k] + '</nobr>' );
					break;
			}

		}

		return out.join( ' ' );
	}

}