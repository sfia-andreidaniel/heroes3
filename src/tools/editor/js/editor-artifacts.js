map.on( 'load', function() {
    
    $$.ajax( {
        "url": "tools/editor/assets/artifacts.tpl",
        "success": function( html ) {
            var tpl = new XTemplate( html );
            
            /* Group artifacts by rank */
            var ranks = {};
            
            for ( var i=0, len = map.am.items.length; i<len; i++ ) {
                
                ranks[ map.am.items[i].rank ] = ranks[ map.am.items[i].rank ] || [];
                
                ranks[ map.am.items[i].rank ].push( map.am.items[i] );
                
            }
            
            for ( var k in ranks ) {
                
                tpl.assign( 'group', k );
                
                for ( var i=0, len = ranks[ k ].length; i<len; i++ ) {
                    
                    tpl.assign( 'artifact_id', ranks[ k ][ i ].id + '' );
                    tpl.assign( 'name', ranks[ k ][ i ].name );
                    
                    tpl.parse( 'group.artifact' );
                    
                }
                
                tpl.parse( 'group' );
                
            }
            
            tpl.parse();
            
            $("#editor > div").append( tpl.text );
            
            $('#artifacts').on( 'click', '> .artifact', function() {
                
                map.objectHandle = null;

                currentObject = null;
                currentObjectConfig = null;

                
                var artifactId = ~~$(this).attr('data-item-id'),
                    obj        = map.am.getArtifactTypeById( artifactId ).getMapObject();
                
                $(this).parent().find( '> .artifact.active' ).removeClass( 'active' );
                
                $(this).addClass( 'active' );
                
                currentObjectConfig = {
                    "artifactType": artifactId
                };
                
                if ( !obj.loaded ) {
                    
                    obj.on( 'load', function() {
                        editor_load_object( this );
                    } );
                    
                    obj.load();
                
                } else {
                
                    editor_load_object( obj );
                
                }

                
            } );
            
        }
    } );
    
} );