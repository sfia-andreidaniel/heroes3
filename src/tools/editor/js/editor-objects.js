var currentObject   = null

map.on( 'load', function() {

    function editor_load_object( obj ) {
        
        currentObject = obj;
        
        if ( editorMode && editorMode == modes.object )
        map.objectHandle = {
            "cols": currentObject.cols,
            "rows": currentObject.rows,
            "hsx": currentObject.hsx,
            "hsy": currentObject.hsy,
            "supported": true
        }

        
    }
    
    $.ajax( 'tools/editor/assets/objects.tpl?_=' + ( new Date() ).getTime(), {
        
        "type": "GET",
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer );
            
            for ( var i=0, len = map.objects.store.length; i<len; i++ ) {
                
                tpl.assign( 'id', map.objects.store[i].id + '' );
                tpl.assign( 'name', map.objects.store[i].name );
                tpl.assign( 'src', map.objects.getObjectBase64Src( map.objects.store[i].id ) );
                
                tpl.parse( 'object' );
                
            }
            
            tpl.parse();
            
            $('#editor > div').append( tpl.text + '' );
            
            $('#objects > .scroller > div.object').on( 'click', function() {
                
                var objectId,
                    obj;
                
                $( this ).parent().find( '> .object' ).removeClass( 'focused' );
                $( this ).addClass( 'focused' );
                
                objectId = ~~$(this).attr('data-object-id'),
                obj      = map.objects.getObjectById( objectId );
                
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
    
});