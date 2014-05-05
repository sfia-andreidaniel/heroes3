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
                tpl.assign( 'name', map.objects.store[i].caption );
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
                            
                            tpl.assign( 'keywords', htmlentities( ( object.keywords || [] ).join(', ') ) );
                            
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

                                    var dlg = this;
                                    
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
                                    
                                    function update_hotspot() {
                                        $(dlg).find( '.object-player > div.hotspot' ).css({
                                            "left": ( object.hsx * 32 ) + "px",
                                            "top" : ( object.hsy * 32 ) + "px"
                                        });
                                    }
                                    
                                    function update_crop_region() {
                                        
                                        var crop_left   = ~~$(dlg).find('input[data-property-name=crop_left]').val(),
                                            crop_right  = ~~$(dlg).find('input[data-property-name=crop_right]').val(),
                                            crop_top    = ~~$(dlg).find('input[data-property-name=crop_top]').val(),
                                            crop_bottom = ~~$(dlg).find('input[data-property-name=crop_bottom]').val(),

                                            player      = $(dlg).find( 'div.object-player' ),

                                            width       = ( object.cols - crop_left - crop_right ) * 32,
                                            height      = ( object.rows - crop_top - crop_bottom ) * 32,
                                            
                                            canvas      = player.find( '> canvas' );
                                        
                                        width = width > 0 ? width : 0;
                                        height= height> 0 ? height: 0;
                                        
                                        player.css({
                                            "width" : width + "px",
                                            "height": height + "px"
                                        });
                                        
                                        canvas.css({
                                            "margin-left": crop_left  == 0 ? '0px' : -( crop_left * 32 ) + "px",
                                            "margin-top" : crop_top   == 0 ? '0px' : -( crop_top  * 32 ) + "px"
                                        });
                                        
                                    }
                                    
                                    function update_enterpoint() {
                                        $(dlg).find( '.object-player > div.enterpoint' ).css({
                                            "left": ( object.epx * 32 ) + "px",
                                            "top" : ( object.epy * 32 ) + "px"
                                        });
                                    }
                                    
                                    $(this).find( 'input[data-property-name=hsx]').on( 'change', function() {
                                        object.hsx = ~~this.value;
                                        update_hotspot();
                                    } );
                                    
                                    $(this).find( 'input[data-property-name=hsy]').on('change', function() {
                                        object.hsy = ~~this.value;
                                        update_hotspot();
                                    });
                                    
                                    $(this).find( 'input[data-property-name=epx]').on('change', function() {
                                        object.epx = ~~this.value;
                                        update_enterpoint();
                                    });
                                    
                                    $(this).find( 'input[data-property-name=epy]').on('change', function() {
                                        object.epy = ~~this.value;
                                        update_enterpoint();
                                    });
                                    
                                    $(this).find( 'input[data-property-name=crop_left]'   ).on('change', update_crop_region );
                                    $(this).find( 'input[data-property-name=crop_right]'  ).on('change', update_crop_region );
                                    $(this).find( 'input[data-property-name=crop_top]'    ).on('change', update_crop_region );
                                    $(this).find( 'input[data-property-name=crop_bottom]' ).on('change', update_crop_region );
                                    
                                    
                                    update_hotspot();
                                    update_enterpoint();
                                    update_crop_region();
                                },
                                "close": function() {
                                    
                                    $(this).find( 'canvas[data-property-name=player]' ).get(0).stop();
                                    
                                    $(this).remove();
                                },
                                "buttons": {
                                    "Save": function() {
                                        
                                        var caption     = $(this).find( 'input[data-property-name=caption]' ).val(),
                                            keywords    = $(this).find( 'input[data-property-name=keywords]').val(),
                                            hsx         = ~~$(this).find( 'input[data-property-name=hsx]' ).val(),
                                            hsy         = ~~$(this).find( 'input[data-property-name=hsy]' ).val(),
                                            epx         = ~~$(this).find( 'input[data-property-name=epx]' ).val(),
                                            epy         = ~~$(this).find( 'input[data-property-name=epy]' ).val(),
                                            crop_top    = ~~$(this).find( 'input[data-property-name=crop_top]').val(),
                                            crop_left   = ~~$(this).find( 'input[data-property-name=crop_left]').val(),
                                            crop_right  = ~~$(this).find( 'input[data-property-name=crop_right]').val(),
                                            crop_bottom = ~~$(this).find( 'input[data-property-name=crop_bottom]').val(),
                                            new_cols    = object.cols - crop_left - crop_right,
                                            new_rows    = object.rows - crop_top  - crop_bottom,
                                            new_width   = new_cols * 32,
                                            new_height  = new_rows * 32,
                                            questions   = [];
                                        
                                        keywords = keywords.split( ',' );
                                        
                                        for ( var i=0, len = keywords.length; i<len; i++ ) {
                                            keywords[i] = keywords[i].replace( /(^[\s]+|[\s]+$)/g, '' );
                                        }
                                        
                                        for ( var i = keywords.length - 1; i >= 0; i-- ) {
                                            if ( !keywords[i] )
                                                keywords.splice( i, 1 );
                                        }
                                        
                                        if ( crop_top )
                                            questions.push( "- crop the object at top with " + crop_top + " rows" );
                                        
                                        if ( crop_bottom )
                                            questions.push( "- crop the object at bottom with " + crop_bottom + " rows" );
                                        
                                        if ( crop_left )
                                            questions.push( "- crop the object at left with " + crop_left + " cols" );
                                        
                                        if ( crop_right )
                                            questions.push( "- crop the object at right with " + crop_right + " cols" );
                                        
                                        if ( new_width <= 0 ) {
                                            alert("Cannot save: The width of the object is less or equal with 0" );
                                            return;
                                        }
                                        
                                        if ( new_height <= 0 ) {
                                            alert("Cannot save: the height of the object is less or equal with 0" );
                                            return;
                                        }
                                        
                                        if ( epx < 0 || epx > new_cols - 1 || epy < 0 || epy > new_rows - 1 ) {
                                            alert( "Cannot save: The enter point is outside the object region" );
                                            return;
                                        }
                                        
                                        if ( hsx < 0 || hsx > new_cols - 1 || hsx < 0 || hsy > new_rows - 1 ) {
                                            alert( "Cannot save: The hot spot is outside the object region" );
                                            return;
                                        }
                                        
                                        if ( questions.length && !confirm( "Are you sure you want to:\n" + questions.join( "\n" ) ) )
                                            return;
                                        
                                        var dlg = this;
                                        
                                        $.ajax( 'resources/tools/save-object.php', {
                                            'type'     : "POST",
                                            'dataType' : 'json',
                                            'data'     : {
                                                'id': object.id,
                                                
                                                'caption': caption,
                                                
                                                'width' : new_width,
                                                'height': new_height,
                                                
                                                'crop[left]'   : crop_left,
                                                'crop[right]'  : crop_right,
                                                'crop[top]'    : crop_top,
                                                'crop[bottom]' : crop_bottom,
                                                
                                                'hsx': hsx,
                                                'hsy': hsy,
                                                
                                                'epx': epx,
                                                'epy': epy,
                                                
                                                'cols': new_cols,
                                                'rows': new_rows,
                                                
                                                'keywords': keywords.join( ', ' )
                                                
                                            },
                                            'success': function( response ) {
                                                
                                                if ( !response.ok ) {

                                                    alert( response.error || 'Unknown server save error' );

                                                } else {
                                                    
                                                    object.width = new_width;
                                                    object.height= new_height;
                                                    
                                                    object.hsx   = hsx;
                                                    object.hsy   = hsy;
                                                    
                                                    object.epx   = epx;
                                                    object.epy   = epy;
                                                    
                                                    object.cols  = new_cols;
                                                    object.rows  = new_rows;
                                                    
                                                    object.caption= caption;
                                                    
                                                    object.keywords = keywords;
                                                    
                                                    $(dlg).find( 'canvas[data-property-name=player]' ).get(0).stop();
                                                    $(dlg).remove();
                                                }
                                                
                                            },
                                            'error': function() {
                                                alert("Failed to save object!");
                                            }
                                        } );
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