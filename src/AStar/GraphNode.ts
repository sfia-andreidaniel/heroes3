/// <reference path="IPos.ts" />
/// <reference path="../Layer/Movement.ts" />

class AStar_GraphNode {
	
	public pos: AStar_IPos = {
		"x": 0,
		"y": 0
	};

	public data = {};

	// public type
	// public x
	// public y

	public f 		: number = 0;
	public g 		: number = 0;
	public h		: number = 0;

	public parent	: AStar_GraphNode = null;
	public visited	: boolean = false;
	public cost 	: number = 0;
	public closed	: boolean = false;

	// public _index   : number = 0;

	constructor( public x: number, public y: number, public grid: Layer_Movement, public _index: number ) {
		this.pos.x = x;
		this.pos.y = y;
	}

	public type(): number {
		return this.grid._cells[ this._index ]
			? this.grid._cells[ this._index ][ 0 ]
			: 0;
	}

	public isWall() {
		return this.type() === 0;
	}

	public reset() {
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.cost = this.type();
        this.visited = false;
        this.closed = false;
        this.parent = null;
	}

}