map.on( 'load', function() {
    
    $$.ajax( {
        "url": "tools/editor/assets/towns.tpl",
        "success": function( html ) {
            var tpl = new XTemplate( html );
            
            /* Group towns by castleTypeId */
            var ranks = {};
            
            for ( var i=0, len = map.tm.items.length; i<len; i++ ) {
                
                ranks[ map.tm.items[i].castleTypeId ] = ranks[ map.tm.items[i].castleTypeId ] || [];
                
                ranks[ map.tm.items[i].castleTypeId ].push( map.tm.items[i] );
                
            }
            
            for ( var k in ranks ) {
                
                // tpl.assign( 'group', k );
                
                for ( var i=0, len = ranks[ k ].length; i<len; i++ ) {
                    
                    tpl.assign( 'town_id', ranks[ k ][ i ].id + '' );
                    tpl.assign( 'name', ranks[ k ][ i ].name );
                    tpl.assign( 'withFort', ranks[ k ][ i ].hasFort ? ' (fort built)' : '' );
                    
                    // tpl.parse( 'group.town' );
                    tpl.parse( 'town' );
                    
                }
                
                //tpl.parse( 'group' );
                
            }
            
            tpl.parse();
            
            $("#editor > div").append( tpl.text );
            
            $('#towns').on( 'click', '> .town', function() {
                
                map.objectHandle = null;

                currentObject = null;
                currentObjectConfig = null;

                
                var townId = ~~$(this).attr('data-item-id'),
                    obj        = map.tm.getCastleTypeById( townId ).getMapObject();
                
                $(this).parent().find( '> .town.active' ).removeClass( 'active' );
                
                $(this).addClass( 'active' );
                
                currentObjectConfig = {
                    "castleType": townId
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