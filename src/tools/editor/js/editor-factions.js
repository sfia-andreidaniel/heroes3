map.on( 'load', function() {
    
    $$.ajax(  {
        "url": 'tools/editor/assets/faction.tpl',
        "type": "GET",
        "cache": false,
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer );
            
            /* Parse the factions selector */
            
            for ( var i=0, len = map.fm.items.length; i<len; i++ ) {
                
                tpl.assign( 'id', map.fm.items[i].id );
                tpl.assign( 'name', map.fm.items[i].name );
                tpl.parse( 'faction' );
                
            }
            
            /* End of parsing the factions selector */
            
            tpl.parse();
            
            $('#editor > div').append( tpl.text + '' );
        }
        
    } );
    
} );