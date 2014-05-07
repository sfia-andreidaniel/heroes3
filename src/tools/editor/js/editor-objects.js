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
            "supported": true,
            "bitmap": currentObject.sprite
        }

        
    }
    
    $.ajax( 'tools/editor/assets/objects.tpl?_=' + ( new Date() ).getTime(), {
        
        "type": "GET",
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer ),
                objectTypes = {};
            
            for ( var i=0, len = map.objects.store.length; i<len; i++ ) {
                
                tpl.assign( 'id', map.objects.store[i].id + '' );
                
                tpl.assign( 'type', map.objects.store[i].objectClass );
                
                objectTypes[ map.objects.store[i].objectClass || '' ] = true;
                
                tpl.assign( 'name', map.objects.store[i].caption );
                tpl.assign( 'src', map.objects.getObjectBase64Src( map.objects.store[i].id ) );
                
                tpl.parse( 'object' );
                
            }
            
            for ( var t in objectTypes ) {
                
                if ( objectTypes.hasOwnProperty( t ) && t ) {
                
                    tpl.assign( 'objectType', t );
                    tpl.parse( 'object_type' );
                
                }
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
            
            var applyFilter = $.debounce(500, function () {
                
                var keywords = $('#objects-filter').val().toLowerCase(),
                    type     = $('#objects-types').val();
                
                keywords = keywords.replace( /(^[\s]+|[\s]+$)/g, '' ).replace( /[\s]+/g, ' ' ).split( ' ' );
                
                keywords = keywords[0] ? keywords : null;
                
                $('#objects > .scroller > div.object[data-object-id]').each( function() {
                    
                    var oid = ~~$(this).attr('data-object-id'),
                        obj = map.objects.getObjectById( oid ),
                        tp  = obj.objectClass,
                        kw  = obj.keywords,
                        
                        visible = true;
                    
                    if ( type == '*' || ( type == '' && tp === null ) || tp == type ) {
                        
                        // visible = true
                        
                    } else {
                        
                        visible = false;
                        
                    }
                    
                    if ( visible && keywords ) {
                        
                        for ( var i=0, len = keywords.length; i<len; i++ ) {
                            
                            if ( kw.indexOf( keywords[i] ) == -1 ) {
                                visible = false;
                                break;
                            }
                            
                        }
                        
                    }
                    
                    $(this)[ visible ? 'show' : 'hide' ]();
                    
                } );
                
            } );
            
            $('#objects-types').on( 'change', applyFilter );
            $('#objects-filter').on( 'keyup', applyFilter );
            
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
                                    
                                    $(this).find( 'select[data-property-name=objectClass]').val( object.objectClass || '' );
                                    
                                    update_hotspot();
                                    update_enterpoint();
                                    update_crop_region();
                                    
                                    $(this).find( 'td > .joystick > div' ).on( 'click', function() {
                                        
                                        var dir = $(this).attr('class'),
                                            x = 0,
                                            y = 0;
                                        
                                        switch ( dir ) {
                                            case 'n':
                                                x = .5;
                                                y = 0;
                                                break;
                                            case 's':
                                                x = .5;
                                                y = 1;
                                                break;
                                            case 'w':
                                                x = 0;
                                                y = .5;
                                                break;
                                            case 'e':
                                                x = 1;
                                                y = .5;
                                                break;
                                            case 'nw':
                                                x = 0;
                                                y = 0;
                                                break;
                                            case 'ne':
                                                x = 1;
                                                y = 0;
                                                break;
                                            case 'sw':
                                                x = 0;
                                                y = 1;
                                                break;
                                            case 'se':
                                                x = 1;
                                                y = 1;
                                                break;
                                            case 'c':
                                                x = .5;
                                                y = .5;
                                                break;
                                        }
                                        
                                        var cx = ~~$('input[data-property-name=crop_left]').val() + 
                                                 ~~$('input[data-property-name=crop_right]').val(),
                                            cy = ~~$('input[data-property-name=crop_top]').val() +
                                                 ~~$('input[data-property-name=crop_bottom]').val();
                                        
                                        x *= ( object.cols - 1 - cx );
                                        y *= ( object.rows - 1 - cy );
                                        
                                        x = ~~x;
                                        y = ~~y;
                                        
                                        object.hsx = x;
                                        object.hsy = y;
                                        object.epx = x;
                                        object.epy = y;
                                        
                                        $('input[data-property-name=hsx], input[data-property-name=epx]').val( x + '' );
                                        $('input[data-property-name=hsy], input[data-property-name=epy]').val( y + '' );
                                        
                                        update_hotspot();
                                        update_enterpoint();
                                        
                                    } );
                                    
                                },
                                "close": function() {
                                    
                                    $(this).find( 'canvas[data-property-name=player]' ).get(0).stop();
                                    
                                    $('#objects > .scroller > .object[data-object-id=' + object.id + '] > span' ).text( object.caption );
                                    
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
                                            objectClass = $(this).find( 'select[data-property-name=objectClass]').val() || null,
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
                                                
                                                'objectClass': objectClass || null,
                                                
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
                                                    
                                                    object.objectClass = objectClass;
                                                    
                                                    $(dlg).find( 'canvas[data-property-name=player]' ).get(0).stop();
                                                    $(dlg).remove();
                                                    
                                                    $('#objects > .scroller > .object[data-object-id=' + object.id + '] > span' ).text( object.caption );
                                                }
                                                
                                            },
                                            'error': function() {
                                                alert("Failed to save object!");
                                            }
                                        } );
                                    },
                                    "Delete": function() {
                                        if ( !confirm( "Are you sure you want to delete this object?" ) )
                                            return;
                                        
                                        var dlg = this;
                                        
                                        $.ajax( 'resources/tools/delete-object.php', {
                                            
                                            'type': "POST",
                                            'data': {
                                                "id": object.id
                                            },
                                            "success": function( response ) {
                                                
                                                if ( response && response.ok ) {
                                                    
                                                    $(dlg).remove();
                                                    
                                                    $('#objects > .scroller > .object[data-object-id=' + object.id + ']' ).remove();

                                                    
                                                } else {
                                                    alert( ( response && response.error ) ? response.error : 'unknown server error while deleting object!' );
                                                }
                                                
                                            },
                                            "error": function() {
                                                alert( 'server error while deleting object!' );
                                            }
                                            
                                        } );
                                        
                                        $(this).remove();
                                        
                                        $('#objects > .scroller > .object[data-object-id=' + object.id + '] > span' ).text( object.caption );
                                    },
                                    "Cancel": function() {
                                        
                                        $(this).find( 'canvas[data-property-name=player]' ).get(0).stop();
                                        
                                        $(this).remove();
                                        
                                        $('#objects > .scroller > .object[data-object-id=' + object.id + '] > span' ).text( object.caption );
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