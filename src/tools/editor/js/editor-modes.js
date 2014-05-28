var currentObject = null;
var currentObjectConfig = null;




var modes = {
        "paint": 1,
        "erase": 2,
        "object": 3,
        "interactive": 4,
        "game": 5
    },
    editorMode = null,
    isDragging = false,
    l5VisibilitySave = true;


function editor_load_object( obj ) {

    currentObject = obj;

    if ( editorMode && editorMode == modes.object )
    map.objectHandle = {
        "cols": currentObject.cols,
        "rows": currentObject.rows,
        "hsx": currentObject.hsx,
        "hsy": currentObject.hsy,
        "supported": true,
        "bitmap": currentObject.sprite
    }

}

function setEditorMode( mode ) {
    
    /* Remove all focused items in the panels:
       #objects .object,
       #heroes  .hero,
       #artifacts .artifact,
       #creatures .creature,
       #dwellings .dwelling,
       #mines .mine
       
       and set: map.objectHandle    to NULL,
                currentObject       to NULL
                currentObjectConfig to NULL
     */
    
    $('#objects .object, #heroes .hero, #artifacts .artifact, #creatures.creature, #dwellings .dwelling, #mines .mine').removeClass( 'active' ).removeClass( 'focused' );
    
    map.objectHandle = null;

    currentObject = null;
    currentObjectConfig = null;
    
    
    
    if ( ( mode == modes.interactive ) || ( mode == modes.game ) ) {
        
        l5VisibilitySave = map.layers[5].visible;
        map.layers[5].visible = false;
        map.viewports[0].interactive = true;
    
    } else {
        
        map.layers[5].visible = l5VisibilitySave;
        map.viewports[0].interactive = false;
        
    }
    
    if ( editorMode === mode )
        return;
    
    if ( editorMode === modes.object || editorMode === modes.erase ) {
        map.objectHandle = null;
    }
    
    editorMode = mode;
    
    if ( editorMode === modes.object ) {
        
        if ( currentObject && currentObject.loaded ) {
            
            map.objectHandle = {
                "cols": currentObject.cols,
                "rows": currentObject.rows,
                "hsx": currentObject.hsx,
                "hsy": currentObject.hsy,
                "supported": true,
                "bitmap": currentObject.sprite
            }
            
        }
        
    }
    
    if ( editorMode === modes.erase ) {
        
        var erSize = ~~$('#eraser-size').val();
        
        switch ( true ) {
            
            case erSize == 0:
                map.objectHandle = null;
                break;
            
            default:
                map.objectHandle = {
                    "cols": 2 * erSize + 1,
                    "rows": 2 * erSize + 1,
                    "hsx": erSize,
                    "hsy": erSize,
                    "supported": false
                };
                break;
        }
        
    }
}

function paintObject() {
    if ( map.activeCell === null || !currentObject )
        return;
    
    var destinationLayer = currentObject.getDestinationLayerIndex();
    
    if ( destinationLayer === null )
        return;
    
    map.activeCell.setData( destinationLayer, currentObject.id );
    
    if ( currentObjectConfig ) {
        
        /* Get back object from the map */
        //var paintedObject = map.activeCell.getData( destinationLayer );
        //console.log( paintedObject, destinationLayer );
        
        var paintedObject = map.layers[ destinationLayer ]._objects[
            
            map.activeCell.y() * map.cols + map.activeCell.x()
            
        ];
        
        for ( var prop in currentObjectConfig ) {
            
            paintedObject[ prop ] = currentObjectConfig[ prop ];
            
        }
        
    }
    
}

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
        onlyVisible = false,
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
    
    eraseLayer = eraseLayer === ''
        ?  null 
        : ( eraseLayer == '*'
            ? ( function() { onlyVisible = true; return null; } )()
            : ~~eraseLayer
          );
    
    for ( var col = x1; col <= x2; col++ ) {
        for ( var row = y1; row <= y2; row++ ) {
            
            cell = map.cellAt( col, row, false );
            
            if ( cell ) {
                
                if ( eraseLayer === null ) {
                    
                    for ( var i=0, len = map.layers.length; i<len; i++ ) {
                        
                        if ( onlyVisible && !map.layers[i].visible )
                            continue;
                        
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

    $( window.viewport.canvas ).on( 'mousedown', function( evt ) {
        
        if ( evt.which != 1 )
            return;
        
        isDragging = true;
        
        switch ( editorMode ) {

            case modes.paint:
                paintTerrain();
                break;
            
            case modes.object:
                paintObject();
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
        
        if ( cell ) {
            $('#cell > div').text( cell.x() + ' : ' + cell.y() + ' (' + cell.index + ')' );
        }
        
    } );

    map.on( 'selection-changed', function( cell ) {
        
        switch ( editorMode) {
            
            case modes.paint:
            
                if ( isDragging )
                    paintTerrain();
                
                break;
            
            case modes.object:
                
                if ( isDragging )
                    paintObject();
                
                break;
            
            case modes.erase:
                
                if ( isDragging )
                    eraseTerrain();
                
                break;
            
        }
        
    } );

});