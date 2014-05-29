map.on( 'load', function() {
    
    $$.ajax( {
        "url": "tools/editor/assets/resources.tpl",
        "success": function( html ) {
            var tpl = new XTemplate( html );
            
            for ( var i=0, len = map.rm.items.length; i<len; i++ ) {
                
                tpl.assign( 'resource_id', map.rm.items[i].id + '' );
                tpl.assign( 'name', map.rm.items[ i ].name );
                
                tpl.parse( 'resource' );
                
            }
            
            tpl.parse();
            
            $("#editor > div").append( tpl.text );
            
            $('#resources').on( 'click', '> .resource', function() {
                
                map.objectHandle = null;

                currentObject = null;
                currentObjectConfig = null;

                
                var resourceId = ~~$(this).attr('data-item-id'),
                    obj        = map.rm.getResourceTypeById( resourceId ).getMapObject();
                
                $(this).parent().find( '> .resource.active' ).removeClass( 'active' );
                
                $(this).addClass( 'active' );
                
                currentObjectConfig = {
                    "resourceType": resourceId
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