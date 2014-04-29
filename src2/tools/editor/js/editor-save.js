map.on( 'load', function() {

    $('#btn-save').on( 'click', function() {
        
        map.save( 'test.map', function( err ) {
            
            if ( err )
                alert( err );
            
        } );
        
    } );

} );