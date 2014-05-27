map.on( 'load', function() {
    
    $$.ajax( {
        "url": 'tools/editor/assets/creatures.tpl',
        "type": "GET",
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer );
            
            /* Group objects by castle type */
            var castles = {},
                ctypes  = {
                    "1": "Castle",
                    "2": "Tower",
                    "3": "Inferno",
                    "4": "Fortress",
                    "5": "Rampart",
                    "6": "Dungeon",
                    "7": "Stronghold",
                    "8": "Necropolis",
                    "9": "Conflux",
                    "10": "Neutral"
                };
            
            for ( var i=0, len = map.cm.items.length; i<len; i++ ) {
                
                castles[ ctypes[ map.cm.items[i].castleTypeId ] ] = 
                    castles[ ctypes[ map.cm.items[i].castleTypeId ] ] || [];
                
                castles[ ctypes[ map.cm.items[i].castleTypeId ] ].push( map.cm.items[i] );
            }
            
            for ( var k in castles ) {
                
                tpl.assign( 'castle', k );
                
                for ( var i=0, len = castles[ k ].length; i<len; i++ ) {
                    
                    tpl.assign( 'creature_id', castles[ k ][ i ].id + '' );
                    tpl.assign( 'name', castles[ k ][ i ].name );
                    
                    tpl.parse( 'group.creature' );
                }
                
                tpl.parse( 'group' );
                
            }
            
            tpl.parse();
            
            $('#editor > div').append( tpl.text + "" );
            
            $( '#creatures' ).on( 'click', '> .creature', function() {

                map.objectHandle = null;
                currentObject = null;
                currentObjectConfig = null;


                var creatureTypeId = ~~$(this).attr( 'data-item-id' ),
                    creatureType   = map.cm.getCreatureTypeById( creatureTypeId ),
                    obj            = creatureType.getMapObject();
                
                currentObjectConfig = {
                    "creatureType": creatureTypeId
                };
                
                $(this).parent().find( '.creature.active' ).removeClass( 'active' );
                
                if ( !obj.loaded ) {
                    obj.on( 'load', function() {
                        editor_load_object( this );
                    } );
                    obj.load();
                } else {
                    
                    editor_load_object( obj );
                }
                
                $(this).addClass( 'active' );
            } );
            
        }
    } );
    
} );