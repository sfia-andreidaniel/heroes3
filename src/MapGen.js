function MapMatrix( width, height ) {
    
    this.cells   = [];
    this.regions = [];
    this.width   = width;
    this.height  = height;
    
    var row   = [];
    
    for ( var y = 0; y < height; y++ ) {
        
        row = [];
        
        for ( var x = 0; x < width; x++ ) {
            
            row.push( null );
            
        }
        
        this.cells.push( row );
        
    }
    
    this.getCellAt = function( x, y ) {
        return this.cells[ y ][ x ];
    }
    
    this.setCellAt = function( x, y, data ) {
        this.cells[ y ][ x ] = data;
    }
    
    this.rndCell = function() {
        return {
            "x": ~~( Math.random() * width ),
            "y": ~~( Math.random() * height )
        };
    }
    
    this.isRegionSeed = function( x, y ) {
        for ( var i=0, len = this.regions.length; i<len; i++ )
            if ( this.regions[i].seedX == x && this.regions[i].seedY == y )
                return true;
        
        return false;
    }
    
    this.addRegion = function( outChar ) {
        
        var cell;
        
        do {
            
            cell = this.rndCell();
            
        } while ( this.getCellAt( cell.x, cell.y ) || this.isRegionSeed( cell.x, cell.y ) );
        
        this.regions.push( new MapRegion(
            cell.x, cell.y, this, outChar
        ) );
        
    }
    
    this.isBorderCell = function( x, y ) {
        
        if ( x == 0 || y == 0 || x == width - 1 || y == height - 1 )
            return true;
        
        var cell = this.cells[ y ][ x ];
        
        return this.cells[ y ][ x - 1 ] == cell &&
               this.cells[ y ][ x + 1 ] == cell &&
               this.cells[ y - 1 ][ x ] == cell &&
               this.cells[ y + 1 ][ x ] == cell &&
               this.cells[ y - 1 ][ x - 1 ] == cell &&
               this.cells[ y + 1 ][ x - 1 ] == cell &&
               this.cells[ y - 1 ][ x + 1 ] == cell &&
               this.cells[ y + 1 ][ x + 1 ] == cell;
        
    }
    
    this.getCellNeighbours = function( x, y ) {
        
        var mat = [];
        
        switch ( true ) {
            case ( x == 0 && y == 0 ):
                mat.push( { "y": 0, "x": 1 } );
                mat.push( { "y": 1, "x": 0 } );
                mat.push( { "y": 1, "x": 1 } );
                break;
            
            case ( x == 0 && y > 0 && y < this.height - 1 ):
                mat.push( { "y": y - 1, "x": x } );
                mat.push( { "y": y - 1, "x": x + 1 } );
                mat.push( { "y": y, "x": x + 1 } );
                mat.push( { "y": y + 1, "x": x + 1 } );
                mat.push( { "y": y + 1, "x": x } );
                break;
            
            case ( x == 0 && y == this.height - 1 ):
                mat.push( { "y": y - 1, "x": x } );
                mat.push( { "y": y - 1, "x": x + 1 } );
                mat.push( { "y": y, "x": x + 1 } );
                break;
            
            case ( x > 0 && x < this.width - 1 && y == 0 ):
                mat.push( { "y": 0, "x": x - 1 } );
                mat.push( { "y": 0, "x": x + 1 } );
                mat.push( { "y": 1, "x": x - 1 } );
                mat.push( { "y": 1, "x": x } );
                mat.push( { "y": 1, "x": x + 1 } );
                break;
            
            case ( x == this.width - 1 && y == 0 ):
                mat.push( { "y": 0, "x": x - 1 } );
                mat.push( { "y": 1, "x": x - 1 } );
                mat.push( { "y": 1, "x": x } );
                break;
            
            case ( x == this.width - 1 && y > 0 && y < this.height - 1 ):
                
                mat.push( { "y": y - 1, "x": x } );
                mat.push( { "y": y - 1, "x": x - 1 } );
                mat.push( { "y": y, "x": x - 1 } );
                mat.push( { "y": y + 1, "x": x - 1 } );
                mat.push( { "y": y + 1, "x": x } );
                
                break;
            
            case ( x == this.width - 1 && y == this.height - 1 ):
                
                mat.push( { "y": y - 1, "x": x } );
                mat.push( { "y": y - 1, "x": x - 1 } );
                mat.push( { "y": y, "x": x - 1 } );
                
                break;
            
            case ( x < this.width - 1 && x > 0 && y == this.height - 1 ):
            
                mat.push( { "y": y, "x": x - 1 } );
                mat.push( { "y": y, "x": x + 1 } );
                mat.push( { "y": y - 1, "x": x - 1 } );
                mat.push( { "y": y - 1, "x": x } );
                mat.push( { "y": y - 1, "x": x + 1 } );
            
                break;
            
            default:
                
                mat.push( { "y": y - 1, "x": x - 1 } );
                mat.push( { "y": y - 1, "x": x } );
                mat.push( { "y": y - 1, "x": x + 1 } );
                mat.push( { "y": y, "x": x - 1 } );
                mat.push( { "y": y, "x": x + 1 } );
                mat.push( { "y": y + 1, "x": x - 1 } );
                mat.push( { "y": y + 1, "x": x } );
                mat.push( { "y": y + 1, "x": x + 1 } );
                
                break;
        }
        
        return mat;
        
    }
    
    this.getFreeNeighbours = function( neighbours ) {
        var out = [];
        for ( var i=0, len = neighbours.length; i<len; i++ )
            if ( this.cells[ neighbours[i].y ][ neighbours[i].x ] === null )
                out.push( neighbours[i] );
        return out.length ? out : null;
    }
    
    this.dump = function() {
        
        var out = [],
            row = '',
            cell;
        
        for ( var y=0; y<height; y++ ) {
            
            row = '';
            
            for ( var x = 0; x < width; x++ ) {
                
                cell = this.getCellAt( x, y );
                row = row.concat( ( cell ? cell.outChar : '-' ) + ' ' );
                
            }

            out.push( row );
            
        }
        
        return out.join( '\n' );
        
    }
    
    this.fill = function() {
        
        var mCells = this.width * this.height,
            plCells = this.regions.length,
            regLen = plCells,
            rIndex = 0;
        
        while ( plCells < mCells ) {
            
            plCells += this.regions[ rIndex ].putNext();
            
            rIndex = ++rIndex < regLen ? rIndex : 0;
            
        }
        
    }
    
    return this;
    
}

function MapRegion( seedX, seedY, mapMatrix, outChar ) {
    
    this.seedX = seedX;
    this.seedY = seedY;
    
    this.matrix = mapMatrix;
    this.outChar = outChar;
    
    this.put = function( x, y ) {
        
        mapMatrix.setCellAt( x, y, this );
        
    }
    
    this.getAllocatedCells = function() {
        
        var out = [];
        
        for ( var x = 0; x < this.matrix.width; x++ ) {
            
            for ( var y = 0; y < this.matrix.height; y++ ) {
                
                if ( this.matrix.getCellAt( x, y ) == this ) {
                
                    var neighbours = this.matrix.getCellNeighbours( x, y );
                
                    out.push( {
                        "x"              : x,
                        "y"              : y,
                        "border"         : this.matrix.isBorderCell( x, y ),
                        "freeNeighbours" : this.matrix.getFreeNeighbours( neighbours )
                    } );
                }
                
            }
            
        }
        
        return out;
        
    }
    
    this.putNext = function() {
        var cells = this.getAllocatedCells(),
            placeable = [],
            rndP, rndN;
        
        for ( var i=0, len = cells.length; i<len; i++ ) {
            if ( cells[i].freeNeighbours )
                placeable.push( cells[i] );
        }
        
        if ( !placeable.length )
            return 0;
        
        rndP = ~~( Math.random() * placeable.length )
        
        rndN = ~~( Math.random() * placeable[ rndP ].freeNeighbours.length );
        
        this.put( placeable[ rndP ].freeNeighbours[ rndN ].x, placeable[ rndP ].freeNeighbours[ rndN ].y );
        
        return 1;
    }
    
    this.put( this.seedX, this.seedY );
    
    console.log( "Created map region @", seedX +','+ seedY, " with char: ", outChar );
    
    return this;
}

var m = new MapMatrix( 30, 30 ),
    c = [ '\\', '&', '+', '!' ];

for ( var i=0, len = c.length; i<len; i++ )
    m.addRegion( c[i] );

m.fill();

console.log( m.dump() );

// for ( var i=0, len = c.length; i<len; i++ ){
//    console.log( m.regions[i].getAllocatedCells() );
// }



