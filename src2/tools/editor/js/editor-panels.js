var panels = [
    "paint",
    "erase"
];

$('div.button[data-panels]').on( 'click', function() {
        
    for ( var i=0, len = panels.length; i<len; i++ )
        $('body').removeClass( 'panel-' + panels[i] );
    
    var pan = $(this).attr('data-panels').split( ' ' );
    
    if ( !pan || !pan[0] )
        return;
    
    for ( var i=0, len = pan.length; i<len; i++ ) {
        $('body').addClass( 'panel-' + pan[i] );
    }
    
    var mode = $(this).attr( 'data-editor-mode' );
    
    if ( mode.length ) {
        editorMode = ~~mode;
    } else {
        editorMode = null;
    }
    
} );