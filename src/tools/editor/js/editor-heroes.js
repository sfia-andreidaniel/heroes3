map.on( 'load', function() {
    
    $$.ajax( {
        "url": "tools/editor/assets/heroes.tpl",
        "success": function( html ) {
            var tpl = new XTemplate( html );
            
            /* Group heroes by races */
            var races = {};
            
            for ( var i=0, len = map.hm.items.length; i<len; i++ ) {
                races[ map.hm.items[i].typeName ] = races[ map.hm.items[i].typeName ] || [];
                races[ map.hm.items[i].typeName ].push( map.hm.items[i] );
            }
            
            for ( var tn in races ) {
                
                tpl.assign( 'race_name', tn );
                
                for ( var i=0, len = races[ tn ].length; i<len; i++ ) {
                    tpl.assign( 'hero_id', races[ tn ][ i ].id );
                    tpl.assign( 'hero_name', htmlentities( races[tn][i].name ) );
                    tpl.assign( 'icon', races[ tn ][ i ].icon );
                    tpl.parse( 'race.hero' );
                }
                
                tpl.parse( 'race' );
            }
            
            tpl.parse();
            
            $("#editor > div").append( tpl.text );
            
            $('#heroes').on( 'click', 'div.hero', function() {
                
                $(this).parent().find( '.hero' ).removeClass( 'active' );
                $(this).addClass( 'active' );
                
                var heroId = ~~$(this).attr('data-hero-id');
                
                currentObjectConfig = {
                    "heroType": heroId,
                    "faction": ~~$("#faction-selector select").val()
                };
                
                var obj = map.hm.getHeroTypeById( heroId ).getMapObject();
                
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