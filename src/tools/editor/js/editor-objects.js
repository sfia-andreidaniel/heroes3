var currentObject   = null

var htmlentities = ( function() {
    
    var d = document.createElement( 'div' );
    
    return function( str ) {
        d.innerHTML = '';
        d.appendChild( document.createTextNode( str ) );
        return d.innerHTML;
    }
    
} )();

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
            
            $('#objects > .scroller > div.object').on( 'dblclick', function() {
                
                var objectID = ~~$(this).attr('data-object-id'),
                    object   = map.objects.getObjectById( objectID );
                
                $.ajax( 'tools/editor/assets/object-editor.tpl?_' + ( Math.random() ), {
                    
                    "success": function( buffer ) {
                        
                        function load() {

                            var tpl = new XTemplate( buffer );
                        
                            tpl.assign( 'object_id', objectID + '' );
                            tpl.assign( 'object_frames', ( object.frames - 1 ) + '' );
                            
                            tpl.assign( 'object_width', object.width + '' );
                            tpl.assign( 'object_height', object.height + '' );
                            
                            tpl.assign( 'hsx', object.hsx + '' );
                            tpl.assign( 'hsy', object.hsy + '' );
                            
                            tpl.assign( 'epx', object.epx + '' );
                            tpl.assign( 'epy', object.epy + '' );
                            
                            tpl.assign( 'maxc', object.cols - 1 + '' );
                            tpl.assign( 'maxr', object.rows - 1 + '' );
                            
                            tpl.assign( 'name', htmlentities( object.name ) );
                            tpl.assign( 'caption', htmlentities( object.caption ) );
                            tpl.assign( 'objectType', object.type + '' );
                            
                            tpl.assign( 'width', object.width + '' );
                            tpl.assign( 'height', object.height + '' );
                            
                            if ( object.animationGroups && object.animationGroups.length ) {
                                for ( var i=0, len = object.animationGroups.length; i<len; i++ ) {
                                    tpl.assign( 'index', i + '' );
                                    tpl.parse( 'animation_frame_index' );
                                }
                            }
                            
                            tpl.parse();
                            
                            
                            $(tpl.text + '').dialog({
                            
                                "title": "Object editor",
                                "width": 600,
                                "height": $('#objects').height(),
                                "open": function() {
                                    $(this).find( '.tabs' ).tabs();
                                    
                                    $(this).find( '.object-editor-sheet' ).height(
                                        $(this).height() - 80
                                    );
                                    
                                    $(this).find( 'canvas[data-property-name=player]' ).objectplayer(
                                        object,
                                        $(this).find( 'input[data-property-name=pause_play]' ).get(0),
                                        $(this).find( 'input[data-property-name=frame_index]' ).get(0),
                                        $(this).find( 'select[data-property-name=animations]').get(0)
                                    );
                                },
                                "close": function() {
                                    
                                    $(this).find( 'canvas[data-property-name=player]' ).get(0).stop();
                                    
                                    $(this).remove();
                                },
                                "buttons": {
                                    "Save": function() {
                                        
                                    },
                                    "Cancel": function() {
                                        
                                        $(this).find( 'canvas[data-property-name=player]' ).get(0).stop();
                                        
                                        $(this).remove();
                                    }
                                },
                                "resize": function() {
                                    $(this).find( '.object-editor-sheet' ).height(
                                        $(this).height() - 80
                                    );
                                }
                            });
                        
                        }
                        
                        if ( object.loaded )
                            load();
                        else {
                        
                            object.once( 'load', function() {
                                load();
                            } );
                            
                            object.load();
                        }
                        
                    }
                    
                } );
                
            } );
            
        }
        
    } );
    
});