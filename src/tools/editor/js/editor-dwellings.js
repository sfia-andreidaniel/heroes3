map.on( 'load', function() {
    
    $$.ajax( {
        "url": "tools/editor/assets/dwellings.tpl",
        "success": function( html ) {
            var tpl = new XTemplate( html );
            
            /* Group dwellings by castleTypeName */
            var castles = {};
            
            for ( var i=0, len = map.dm.items.length; i<len; i++ ) {
                
                castles[ map.dm.items[i].castleTypeName ] = castles[ map.dm.items[i].castleTypeName ] || [];
                
                castles[ map.dm.items[i].castleTypeName ].push( map.dm.items[i] );
                
            }
            
            for ( var k in castles ) {
                
                tpl.assign( 'castle', k );
                
                for ( var i=0, len = castles[ k ].length; i<len; i++ ) {
                    
                    for ( var j=0, n = castles[ k ][ i ].levels.length; j<n; j++ ) {

                        tpl.assign( 'dwelling_id', castles[ k ][ i ].id + '' );
                        tpl.assign( 'name', castles[ k ][ i ].levels[ j ].name );
                        tpl.assign( 'level', j + '' );
                        tpl.parse( 'castle.dwelling' );
                    
                    }
                    
                    
                    
                }
                
                tpl.parse( 'castle' );
                
            }
            
            tpl.parse();
            
            $("#editor > div").append( tpl.text );
            
            $('#dwellings').on( 'click', '> .dwelling', function() {
                
                map.objectHandle = null;

                currentObject = null;
                currentObjectConfig = null;

                
                var dwellingId = ~~$(this).attr('data-item-id'),
                    obj        = map.dm.getDwellingTypeById( dwellingId ).getMapObject(),
                    upgLevel   = ~~$(this).attr('data-upgrade-level');
                
                $(this).parent().find( '> .dwelling.active' ).removeClass( 'active' );
                
                $(this).addClass( 'active' );
                
                currentObjectConfig = {
                    "dwellingType": dwellingId,
                    "upgradeLevel": upgLevel,
                    "population"  : map.dm.getDwellingTypeById( dwellingId ).growth
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