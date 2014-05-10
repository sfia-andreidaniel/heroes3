map.once( 'add-viewport', function( viewport ) {
    var minimap = viewport.addMiniMap( 280, 280 );
    $('#minimap').append( minimap.$node );
} );

map.on( "load", function() {
    
    $('#minimap').on( 'click', function( evt ) {
        
        if ( ( evt.target || evt.toElement ) != this )
            return;
        
        $(this)[ $(this).hasClass( 'active' ) ? 'removeClass' : 'addClass' ]( 'active' );
        
    } );
    
} );