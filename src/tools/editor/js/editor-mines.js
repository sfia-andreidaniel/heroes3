map.on( 'load', function() {
    
    $$.ajax( {
        "url": "tools/editor/assets/mines.tpl",
        "success": function( html ) {
            var tpl = new XTemplate( html );
            
            /* Group mines by resource types */
            var resources = {};
            
            for ( var i=0, len = map.mm.items.length; i<len; i++ ) {
                
                resources[ map.mm.items[i].resourceType ] = resources[ map.mm.items[i].resourceType ] || [];
                
                resources[ map.mm.items[i].resourceType ].push( map.mm.items[i] );
                
            }
            
            for ( var k in resources ) {
                
                tpl.assign( 'resource', k );
                
                for ( var i=0, len = resources[ k ].length; i<len; i++ ) {
                    
                    tpl.assign( 'mine_id', resources[ k ][ i ].id + '' );
                    tpl.assign( 'name', resources[ k ][ i ].name );
                    
                    tpl.parse( 'resource.mine' );
                    
                }
                
                tpl.parse( 'resource' );
                
            }
            
            tpl.parse();
            
            $("#editor > div").append( tpl.text );
            
            $('#mines').on( 'click', '> .mine', function() {
                
                map.objectHandle = null;

                currentObject = null;
                currentObjectConfig = null;

                
                var mineId = ~~$(this).attr('data-item-id'),
                    obj        = map.mm.getMineTypeById( mineId ).getMapObject();
                
                $(this).parent().find( '> .mine.active' ).removeClass( 'active' );
                
                $(this).addClass( 'active' );
                
                currentObjectConfig = {
                    "mineType": mineId
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