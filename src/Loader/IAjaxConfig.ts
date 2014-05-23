interface Loader_IAjaxConfig {

	url: string;

	__requestID__?: number;

	success? : any;
	error?: any;
	type?: string;
	cache?: boolean;
	dataType?: any;
	data?: any;

}