map.on( 'load', function() {

    $.ajax( 'tools/editor/assets/tools.tpl', {
        
        "type": "POST",
        "success": function( html ) {
            var tpl = new XTemplate( html );

            for ( var i=0, len = map.layers.length; i<len; i++ ) {
                
                tpl.assign( 'layer_id', i + '' );
                tpl.assign( 'layer_name', map.layers[i].tileset.name );
                
                tpl.parse( 'layer' );
                
                for ( var j=0, n = map.layers[i].tileset.terrains.length; j<n; j++ ) {
                    
                    tpl.assign( 'terrain_id', map.layers[i].tileset.terrains[j].id + '' );
                    tpl.assign( 'terrain_name', map.layers[i].tileset.terrains[j].name );
                    tpl.assign( 'terrain_icon', map.layers[i].tileset.getTileBase64Src( map.layers[i].tileset.terrains[j].defaultTile ) || '' );
                    tpl.parse( 'tab.terrain' );
                    
                }
                
                tpl.parse( 'tab' );
                
            }

            tpl.parse();

            $('#editor > div').append( tpl.text + '' );
            
            $('#tools .tabs').tabs();
            
        }
        
    } );

} );