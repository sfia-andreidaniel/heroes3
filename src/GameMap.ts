/// <reference path="Terrains.ts" />
/// <reference path="Events.ts" />
/// <reference path="GameMap/Loader/Dummy.ts" />
/// <reference path="GameMap/Loader/File.ts" />
/// <reference path="GameMap/Loader/Url.ts" />

class GameMap extends Events {
	
	public data = [];
	public width = 0;
	public height = 0;

	constructor( width: number = 0, height: number = 0, localFile: string = null , urlFile: string = null ) {
	    
	    super();

	    if ( urlFile === null ) {

	    	if ( localFile === null ) {

	    		new GameMap_Loader_Dummy( this, width, height );

	    	} else {

	    		new GameMap_Loader_File( this, localFile );

	    	}

	    } else  {
	    	
	    	new GameMap_Loader_Url ( this, urlFile );

	    }

	}

	public setSize( width: number, height: number ) {
		this.width = width;
		this.height = height;
	}

}