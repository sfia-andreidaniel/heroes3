map.on( 'load', function() {

    /* Make all editor layers to be interactive */
    for ( var i=0, len = map.layers.length; i<len; i++ )
        map.layers[i].interactive = true;

} );