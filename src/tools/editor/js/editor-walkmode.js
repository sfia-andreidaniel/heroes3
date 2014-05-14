map.on( 'load', function() {
    
    $('#btn-walkmode').on( 'click', function() {
        
        $(this)[ $(this).hasClass( 'opened' ) ? 'removeClass' : 'addClass' ]( 'opened' );
        
        $(this).find( "#opt-walk" ).on( 'click', function() {
            map.movementType = 'walk';
        } );
        
        $(this).find( "#opt-fly"  ).on( 'click', function() {
            map.movementType = 'fly';
        } );
        
        $(this).find( "#opt-swim" ).on( 'click', function() {
            map.movementType = 'swim';
        } );
        
        $(this).mouseleave( function() {
            $('#btn-walkmode' ).removeClass( 'opened' );
        } );
    } );
    
} );