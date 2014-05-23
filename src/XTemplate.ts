declare class XTemplate {
    public text:string;

    constructor ( buffer: string );
    public assign( varName: string, varValue: string );
    public parse( blockName: string );
}