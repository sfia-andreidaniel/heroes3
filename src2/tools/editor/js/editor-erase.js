map.on( 'load', function() {

    $.ajax( 'tools/editor/assets/erase.tpl', {
        
        "type": "POST",
        "success": function( html ) {
            
            var tpl = new XTemplate( html );
            
            for ( var i=0, len = map.layers.length; i<len; i++ ) {
                
                tpl.assign( 'layer_id', i + '' );
                tpl.assign( 'layer_name', map.layers[i].name );
                
                tpl.parse( 'scope' );
                
            }
            
            tpl.parse();
            
            $('#editor > div').append( tpl.text + '' );
            
        }
        
    } );

} );