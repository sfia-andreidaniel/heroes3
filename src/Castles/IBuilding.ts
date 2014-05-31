interface ICastles_Building {
	
	id: number;
	
	name: string;
	
	description: string;
	
	costs: IResource;
	
	built?: boolean;
	
	requirements?: number[];

	dwelling?: {
		id     : number;
		growth : number;
		level  : number;
	}

}