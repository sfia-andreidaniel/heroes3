/// <reference path="GraphNode.ts" />
/// <reference path="../Layer/Movement.ts" />

class AStar_Graph {
	
	public nodes: AStar_GraphNode[] = [];

	public cols: number = 0;
	public rows: number = 0;
	public length: number = 0;
	
	constructor( grid: Layer_Movement ) {
	    
	    this.cols = grid.map.cols;
	    this.rows = grid.map.rows;

	    this.length = this.cols * this.rows;

	    var x: number,
	        y: number,
	        index: number;

	    for ( x = 0; x < this.cols; x++ ) {

    	    for ( y = 0; y < this.rows; y++) {

    	    	index = y * this.cols + x;

       	     	this.nodes[ index ] = new AStar_GraphNode(
       	     			x,
       	     			y,
       	     			grid,
       	     			index
       	     	);

        	}

    	}

	}

	public get( x: number, y: number ): AStar_GraphNode {
		return ( x >= 0 && y >= 0 && x < this.cols && y < this.rows )
			? ( this.nodes[ y * this.cols + x ] || null )
			: null;
	}

	public set( x: number, y: number, data: AStar_GraphNode ) {
		if ( x >= 0 && y >= 0 && x < this.cols && y < this.rows ){
			this.nodes[ y * this.cols + x ] = data;
		} else throw "AStar_Graph: Invalid x,y: " + x + "," + y;
		
	}

	public reset() {

	    var x: number,
	        y: number,
	        index: number;

	    for ( x = 0; x < this.cols; x++ ) {

    	    for ( y = 0; y < this.rows; y++) {

    	    	index = y * this.cols + x;

       	     	this.nodes[ index ].reset();

        	}

    	}
	}

}