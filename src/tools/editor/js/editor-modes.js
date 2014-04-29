var modes = {
        "paint": 1,
        "erase": 2,
        "object": 3
    },
    editorMode = null,
    isDragging = false;
    



function paintTerrain( ) {

    if ( map.activeCell === null )
        return;

    var brushType = $('#brush-info > .brush').attr('data-brush'),
        matches;

    switch ( true ) {
        case !!( matches = /^([\d]+)x([\d]+)$/.exec( brushType ) ):
            //console.log( "paint on layer " + matches[1] + " data: " + matches[2] );
            map.activeCell.setData( ~~matches[1], ~~matches[2] );
            break;
    }

}

function eraseTerrain() {
    
    if ( map.activeCell === null )
        return;
    
    var eraseLayer = $('#eraser-scope').val(),
        rubberSize = ~~$('#eraser-size').val(),
        
        eraseCells = [ map.activeCell ],
        
        neighbours,
        
        x = map.activeCell.x(),
        y = map.activeCell.y(),
        
        x1 = x - rubberSize,
        y1 = y - rubberSize,
        x2 = x + rubberSize,
        y2 = y + rubberSize,
        
        cell;
    
    eraseLayer = eraseLayer === '' ? null : ~~eraseLayer;
    
    for ( var col = x1; col <= x2; col++ ) {
        for ( var row = y1; row <= y2; row++ ) {
            
            cell = map.cellAt( col, row, false );
            
            if ( cell ) {
                
                if ( eraseLayer === null ) {
                    
                    for ( var i=0, len = map.layers.length; i<len; i++ ) {
                        
                        cell.setData( i, null );
                        
                    }
                    
                } else {
                    
                    cell.setData( eraseLayer, null );
                    
                }
                
            }
            
        }
    }
    
}


map.on( 'load', function() {

    $( window.viewport.canvas ).on( 'mousedown', function() {
        isDragging = true;
        
        switch ( editorMode ) {

            case modes.paint:
                paintTerrain();
                break;
            
            case modes.erase:
                eraseTerrain();
                break;

        }
    } );

    $( window.viewport.canvas ).on( 'mouseup', function() {

        isDragging = false;
        
        switch ( editorMode ) {
            
            case modes.paint:
                break;
                
            
        }

    } );

    $( window.viewport.canvas ).on( 'mouseout', function() {

        isDragging = false;
        
        switch ( editorMode ) {
            
            case modes.paint:
                break;
            
        }
        
    } );

    map.on( 'selection-changed', function( cell ) {
        
        switch ( editorMode) {
            
            case modes.paint:
            
                if ( isDragging )
                    paintTerrain();
                
                break;
            
            case modes.erase:
                
                if ( isDragging )
                    eraseTerrain();
                
                break;
            
        }
        
    } );

});