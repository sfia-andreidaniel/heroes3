map.on( 'load', function() {

    $.ajax( 'tools/editor/assets/tools.tpl', {
        
        "type": "POST",
        "success": function( html ) {
            var tpl = new XTemplate( html );

            for ( var i=0, len = map.layers.length; i<len; i++ ) {
                
                if ( !map.layers[i].tileset )
                    continue;
                
                tpl.assign( 'layer_id', i + '' );
                tpl.assign( 'layer_name', map.layers[i].name );
                
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
            
            $('#tools').on('click','button.tileset-search', function( btn ) {
                var keyword = $(this).attr( 'data-terrain-name' ).replace(/[^a-zA-Z]+/g, ' ').toLowerCase();
                
                if ( !keyword )
                    return;
                
                $('#objects-filter').val( keyword );
                $('#objects-types').val( 'Tileset' );
                
                $('#objects-types').change();
                
                $('#btn-objects').click();
                
            } );
            
            $('#tools .tabs').tabs();
            
            /* Setup brush selector tool */
            $( '#tools .terrain-group li' ).on( 'click', function() {
                
                var brush = '<span class="brush" data-brush="' + $(this).attr('data-brush') + '">' + 
                    this.innerHTML +
                    '</span>';
                
                $('#brush-info').html( brush );
                
            } );
            
            $( '#tools .terrain-group li' ).on( 'dblclick', function() {
                
                // Explore tileset
                
                var matches,
                    layerIndex,
                    terrainIndex,
                    terrainName = $(this).text();
                
                if ( !( matches = /^([\d]+)x([\d]+)$/.exec( $(this).attr( 'data-brush' ) ) ) )
                    return; // tileset not explorable
                
                layerIndex = ~~matches[1];
                terrainIndex = ~~matches[2];
                
                $.ajax( 'tools/editor/assets/tileset-explorer.tpl', {
                    "type": "GET",
                    "success": function( str ) {
                        
                        var tpl = new XTemplate( str );
                        
                        tpl.assign( 'terrainName', terrainName );
                        
                        var tiles = map.layers[ layerIndex ].tileset.terrains[ terrainIndex ].tiles;
                        
                        if ( tiles ) {
                            
                            for ( var i=0, len = tiles.length; i<len; i++ ) {
                                tpl.assign ('index', i + '' );
                                tpl.assign ('id', tiles[i] + '' );
                                tpl.assign( 'src', map.layers[ layerIndex ].tileset.getTileBase64Src( tiles[i] ) || '' );
                                tpl.parse( 'sprite' );
                            }
                            
                        }
                        
                        tpl.parse();
                        
                        $( tpl.text + '' ).dialog({
                            "width": 500,
                            "height": 300,
                            "close": function() {
                                $(this).remove();
                            },
                            "modal": true,
                            "title": "Explore tileset terrain",
                            "resizable": false
                        });
                        
                    }
                } );
                
            } );

            $('#btn-paint').click();

        }
        
    } );

} );