map.on( 'load', function() {
    
    $.ajax( 'tools/editor/assets/objects.tpl', {
        
        "type": "GET",
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer );
            
            for ( var i=0, len = map.objects.store.length; i<len; i++ ) {
                
                tpl.assign( 'id', i + '' );
                tpl.assign( 'name', map.objects.store[i].name );
                tpl.assign( 'src', map.objects.getObjectBase64Src( i ) );
                
                tpl.parse( 'object' );
                
            }
            
            tpl.parse();
            
            $('#editor > div').append( tpl.text + '' );
            
            $('#objects > .scroller > div.object').on( 'click', function() {
                
                $(this).parent().find( '> .object' ).removeClass( 'focused' );
                $(this).addClass( 'focused' );
                
            } );
            
        }
        
    } );
    
});