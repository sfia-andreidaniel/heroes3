/// <reference path="GraphNode.ts" />

class AStar_Graph {
	
	public nodes = [];
	public input;
	
	constructor( grid ) {
	    for (var x = 0; x < grid.length; x++) {
	        this.nodes[x] = [];

    	    for (var y = 0, row = grid[x]; y < row.length; y++) {
       	     	this.nodes[x][y] = new AStar_GraphNode(x, y, row[y]);
        	}
    	}

    	this.input = grid;
	}

	public toString() {
		var graphString = "\n";
    	var rowDebug, row, y, l;
    
    	for (var x = 0, len = this.nodes.length; x < len; x++) {
        	rowDebug = "";
        	row = this.nodes[x];
        	for (y = 0, l = row.length; y < l; y++) {
            	rowDebug += row[y].type + " ";
        	}
        	graphString = graphString + rowDebug + "\n";
    	}
    	return graphString;
	}

}