/// <reference path="IPos.ts" />

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

	constructor( public x: number, public y: number, public type ) {
		this.pos.x = x;
		this.pos.y = y;
	}

	public toString() {
		return "[" + this.x + " " + this.y + "]";
	}

	public isWall() {
		return this.type === 0;
	}

}