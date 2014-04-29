map.on( 'load', function() {

    /* Create the editor viewport */
    window.viewport = map.addViewport(
        new Viewport( $('#map').width(), $('#map').height(), map )
    );
    
    $('#map > div').append( window.viewport.canvas );
    
    $(window).on( 'resize', function() {
        
        map.viewports[0].resize(
            $('#map').width(),
            $('#map').height()
        );
        
    });

} );