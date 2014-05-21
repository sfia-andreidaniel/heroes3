/// <reference path="Graph.ts" />
/// <reference path="GraphNode.ts" />
/// <reference path="BinaryHeap.ts" />

class AStar_Algorithm {
	
	constructor() {

	}

	public init( grid ) {
        for(var x = 0, xl = grid.length; x < xl; x++) {
            for(var y = 0, yl = grid[x].length; y < yl; y++) {
                var node = grid[x][y];
                node.f = 0;
                node.g = 0;
                node.h = 0;
                node.cost = node.type;
                node.visited = false;
                node.closed = false;
                node.parent = null;
            }
        }
	}

    private pathTo( node: AStar_GraphNode ) {
        var curr = node;
        var path = [];
        while(curr.parent) {
            path.push(curr);
            curr = curr.parent;
        }
        return path.reverse();
    }

    // astar.search
    // supported options:
    // {
    //   heuristic: heuristic function to use
    //   diagonal: boolean specifying whether diagonal moves are allowed
    //   closest: boolean specifying whether to return closest node if
    //            target is unreachable
    // }
    public search( grid, start: AStar_GraphNode, end: AStar_GraphNode, options ) {
        this.init(grid);

        options = options || {};

        var heuristic = options.heuristic || this.manhattan;
        var diagonal = !!options.diagonal;
        var closest = options.closest || false;


        var openHeap = new AStar_BinaryHeap(function(node: AStar_GraphNode) {
            return node.f;
        });

        // set the start node to be the closest if required
        var closestNode: AStar_GraphNode = start;

        start.h = heuristic(start.pos, end.pos);

        openHeap.push(start);

        while(openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode: AStar_GraphNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if( currentNode === end ) {
                return this.pathTo(currentNode);
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
            var neighbors = this.neighbors( grid, currentNode, diagonal );

            for(var i=0, il = neighbors.length; i < il; i++) {
                var neighbor = neighbors[i];

                if ( neighbor.closed || neighbor.isWall() ) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore: number = currentNode.g + neighbor.cost;
                var beenVisited: boolean = neighbor.visited;

                if(!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (closest) {
                        // If the neighbour is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                            closestNode = neighbor;
                        }
                    }



                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        if (closest) {
            return this.pathTo(closestNode);
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    }

    public manhattan(pos0: AStar_IPos, pos1: AStar_IPos ): number {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
    }

    public diagonal( pos0: AStar_IPos, pos1: AStar_IPos ): number {
        var D = 1;
        var D2 = Math.sqrt(2);
        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    }

    public neighbors( grid, node: AStar_GraphNode, diagonals: boolean ): AStar_GraphNode[] {
        var ret: AStar_GraphNode[] = [];
        var x = node.x;
        var y = node.y;

        // West
        if(grid[x-1] && grid[x-1][y]) {
            ret.push(grid[x-1][y]);
        }

        // East
        if(grid[x+1] && grid[x+1][y]) {
            ret.push(grid[x+1][y]);
        }

        // South
        if(grid[x] && grid[x][y-1]) {
            ret.push(grid[x][y-1]);
        }

        // North
        if(grid[x] && grid[x][y+1]) {
            ret.push(grid[x][y+1]);
        }

        if (diagonals) {

            // Southwest
            if(grid[x-1] && grid[x-1][y-1]) {
                ret.push(grid[x-1][y-1]);
            }

            // Southeast
            if(grid[x+1] && grid[x+1][y-1]) {
                ret.push(grid[x+1][y-1]);
            }

            // Northwest
            if(grid[x-1] && grid[x-1][y+1]) {
                ret.push(grid[x-1][y+1]);
            }

            // Northeast
            if(grid[x+1] && grid[x+1][y+1]) {
                ret.push(grid[x+1][y+1]);
            }

        }

        return ret;
    }

}