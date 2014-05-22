interface Direction {
	index: number;
	mirrored: boolean;
}

class HeroStandingDirection {

	static N: Direction = {
		"index": 0,
		"mirrored": false
	}

	static NE: Direction = {
		"index": 1,
		"mirrored": false
	}

	static E: Direction = {
		"index": 2,
		"mirrored": false
	}

	static SE: Direction = {
		"index": 3,
		"mirrored": false
	}

	static S: Direction = {
		"index": 4,
		"mirrored": false
	}

	static SW: Direction = {
		"index": 3,
		"mirrored": true
	}

	static W: Direction = {
		"index": 2,
		"mirrored": true
	}

	static NW: Direction = {
		"index": 1,
		"mirrored": true
	}

}

class HeroWalkingDirection {

	static N: Direction = {
		"index": 5,
		"mirrored": false
	}

	static NE: Direction = {
		"index": 6,
		"mirrored": false
	}

	static E: Direction = {
		"index": 7,
		"mirrored": false
	}

	static SE: Direction = {
		"index": 8,
		"mirrored": false
	}

	static S: Direction = {
		"index": 9,
		"mirrored": false
	}

	static SW: Direction = {
		"index": 8,
		"mirrored": true
	}

	static W: Direction = {
		"index": 7,
		"mirrored": true
	}

	static NW: Direction = {
		"index": 6,
		"mirrored": true
	}

}

class DirectionHelper {

	static getDirection( from: AStar_IPos, to: AStar_IPos ) {
		switch ( true ) {

			case to.x < from.x && to.y < from.y:
				return 'NW';
				break;

			case to.x == from.x && to.y < from.y:
				return 'N';
				break;

			case to.x > from.x && to.y < from.y:
				return 'NE';
				break;

			case to.x > from.x && to.y == from.y:
				return 'E';
				break;

			case to.x > from.x && to.y > from.y:
				return 'SE';
				break;

			case to.x == from.x && to.y > from.y:
				return 'S';
				break;

			case to.x < from.x && to.y > from.y:
				return 'SW';
				break;

			case to.x < from.x && to.y == from.y:
				return 'W';
				break;

			default:
				return null;
				break;

		}
	}

}