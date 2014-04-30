map.on( 'load', function() {
    
    $.ajax( 'tools/editor/assets/layers.tpl', {
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer );
            
            for ( var i=0, len = map.layers.length; i<len; i++ ) {
                tpl.assign( 'id', i + '' );
                tpl.assign( 'name', map.layers[i].name );
                tpl.parse( 'layer' );
            }
            
            tpl.parse();
            
            $('#editor > div' ).append( tpl.text + '' );
            
            $('#editor table tbody tr[data-layer-index] input[type=checkbox]').on( "click", function() {
                
                var index = ~~$(this).parent().parent().attr('data-layer-index'),
                    on    = this.checked;
                
                map.layers[ index ].visible = on;
                
            } );
            
        }
    } );
    
} );