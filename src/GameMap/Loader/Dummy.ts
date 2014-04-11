class GameMap_Loader_Dummy extends Events {
	constructor( map: GameMap, width: number, height: number ) {
	    super();
	
	    map.setSize( width, height );

	    map.emit( 'loaded' );
	}
}