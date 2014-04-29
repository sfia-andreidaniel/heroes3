function XTemplate( buffer ) {

    function XTemplateVar( blockName, globals ) {
        this.toString = function() {
            return globals[ blockName ] || '';
        }
        return this;
    }

    function XTemplateBlock( buffer, index, blockName, globals, blockPath ) {
        
        var blockStartExpr = /^<!-- BEGIN: ([\S]+?) -->/,
            blockEndExpr   = /^<!-- END: ([\S]+?) -->/,
            blockVarExpr   = /^\{([\S]+?)\}/,
            items          = [],
            blocks         = {},
            len            = 0,
            parsed         = '',
            i              = index || 0,
            stLen          = buffer.length,
            myName         = blockName || '',
            contents       = [];
            
        globals = globals || {};
        
        Object.defineProperty( this, "items", {
            "get": function( ) {
                return items;
            }
        } );
        
        var addChar = function( ch ) {
            if ( len == 0 ) {
                items.push( ch );
                len = 1;
            } else {
                if ( typeof items[ len - 1 ] == 'string' ) {
                    items[ len - 1 ] += ch;
                } else {
                    len++;
                    items.push( ch );
                }
            }
        };
        
        var addBlock = function( XTemplateBlockName ) {
            if ( blocks[ XTemplateBlockName ] )
                throw "ERR_DUPLICATE_BLOCK";
            
            items.push( blocks[ XTemplateBlockName ] = new XTemplateBlock( buffer, i, XTemplateBlockName, globals, (blockPath || '<root>' ) + '.' + XTemplateBlockName ) );
            
            i = blocks[ XTemplateBlockName ]._init();
            
            len++;
        };              
    
        var addVar = function( variableName ) {
            items.push( new XTemplateVar( variableName, globals ) );
            len++;
            
        }       
    
        this.assign = function( name, value ) {
            globals[ name ] = value;
        }
        
        this.text = function() {
            var out = [];
            
        }       
    
        this._init = function( ) {
            
            var tmp;
            
            while ( i < stLen ) {
                
                switch ( true ) {
                    
                    case !!( tmp = blockStartExpr.exec( buffer.substr( i ) ) ):
                        var blockName = tmp[ 1 ];
                        i += tmp[0].length;
                        addBlock( blockName, i );
                        break;
                    
                    case !!( tmp = blockEndExpr.exec( buffer.substr( i ) ) ):
                        i += tmp[0].length;
                        
                        if ( myName != tmp[1] )
                            throw "ILLEGAL_BLOCK_END: " + tmp[1];
                        
                        return i;
                        break;
                    
                    case !!( tmp = blockVarExpr.exec( buffer.substr( i ) ) ):
                        i += tmp[0].length;
                        addVar( tmp[1] );
                        break;
                    
                    default:
                        addChar( buffer.charAt( i ) );
                        i++;
                }
                
            }
            
            return i;
        }               
    
        
        Object.defineProperty( this, "childBlocks", {
            "get": function() {
                return blocks;
            }
        } );    
    
        this.block = function( blockDottedNotation ) {
            if ( !blockDottedNotation )
                return this;
            
            var blockNames = blockDottedNotation.split('.'),
                cursor = this;
            
            for ( var i=0, len=blockNames.length; i<len; i++ )
                cursor = cursor.childBlocks[ blockNames[i] ];
            
            return cursor;
        }
        
        this.takeSnapshot = function() {
            var out = [],
                result = '';
            
            for ( var i=0, len=items.length; i<len; i++ ) {
                out.push(
                    typeof items[i] == 'string'
                        ? items[i]
                        : (
                            items[i] instanceof XTemplateBlock
                                ? items[i].toString()
                                : (
                                    items[i] instanceof XTemplateVar
                                        ? items[i].toString()
                                        : ''
                                )
                        )
                );
            }
            
            for ( var k in blocks )
                if ( blocks[k] instanceof XTemplateBlock )
                    blocks[k].reset();
            
            contents.push( result = out.join('') );
        }
        
        this.toString = function() {
            return contents.join( '' );
        }
        
        Object.defineProperty( this, "text", {
            "get": function() {
                return this.toString();
            }
        } );
        
        this.reset = function() {
            contents = [];
            for ( var k in blocks ) {
                if ( blocks[k] instanceof XTemplateBlock )
                    blocks[k].reset();
            }
        }
        
        this.parse = function( blockName ) {
            try {
                this.block( blockName ).takeSnapshot();
            } catch ( e ) {
                console.error("Failed to parse block: " + blockName );
                throw e;
            }
        }
        
        Object.defineProperty( this, "out", {
            "get": function() {
            
                if ( !contents.length )
                    this.parse();
            
                var r = this.text;
                this.reset();
                return r;
            }
        } );
        
        this.parseLoop = function( arrayOfObjects, htmlSafe ) {
            for ( var i=0, len=arrayOfObjects.length; i<len; i++ ) {
                ( function( item, myself ) {
                    
                    for ( var k in item ) {
                        if ( item.propertyIsEnumerable( k ) && item.hasOwnProperty( k ) ) {
                            myself.assign( k, htmlSafe ? String( item[ k ] ).htmlEntities() : String( item[k] ) );
                        }
                    }
                    
                    myself.parse();
                    
                } )( arrayOfObjects[i], this );
            }
        }
        
        if ( i == 0 )
            this._init();
    
    }

    return new XTemplateBlock( buffer );

}