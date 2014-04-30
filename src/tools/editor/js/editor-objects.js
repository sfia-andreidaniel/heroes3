var currentObject   = null

map.on( 'load', function() {

    var object_max_rows = 8,
        object_max_cols = 8;

    function gr_set_size( table, cols, rows ) {
        
        if ( cols > object_max_cols )
            cols = object_max_cols;
        
        if ( rows > object_max_rows )
            rows = object_max_rows;
        
        var dcell,
            drow;
        
        for ( var row = 0; row < object_max_rows; row++ ) {

            drow = $(table).find( 'tr.r' + row );
            
            for ( var col = 0; col < object_max_cols; col++ ) {

                dcell = $(drow).find( 'td.c' + col );

                if ( col < cols && row < rows ) {
                    dcell.removeClass( 'unused' );
                } else {
                    dcell.addClass( 'unused' );
                }
                
            }
            
        }
        
        $(table).css({
            "width": cols * 32 + "px",
            "height": rows * 32 + "px"
        });
        
    }
    
    function gr_reset( table ) {
        
        $(table).css( { 'background-image': 'none' } );
        
        $(table).find( 'td' ).removeClass( 'unused' ).removeClass( 'hotspot' ).removeClass( 'enter' );
        $(table).find( 'td.hotspot' ).removeClass( 'hotstpot' ).removeClass('entrypoint');
        
    }
    
    function editor_load_object( obj ) {
        
        currentObject = obj;
        
        console.log( "editor_load_object" );
        
        gr_reset( '#object-grid' );
        gr_set_size( '#object-grid', obj.cols, obj.rows );
        
        $('#object-grid').css({
            "background-image": "url(" + obj.sprite.node.src + ")"
        });
        
        /* Load the object values */
        
        $('input[data-property-name=object_caption]').val( obj.caption );
        $('input[data-property-name=object_type]').val( obj.type + '' );
        $('input[data-property-name=object_id]').val( obj.id + '' );
        
        $('input[data-property-name=object_cols]').val( obj.cols + '' );
        $('input[data-property-name=object_rows]').val( obj.rows + '' );
        $('input[data-property-name=object_is_animated]').get(0).checked = !!obj.animated;
        $('input[data-property-name=object_frames]').val( obj.frames + '' );

        $('input[data-property-name=object_hsx]').val( obj.hsx + '' );
        $('input[data-property-name=object_hsy]').val( obj.hsy + '' );

        $('input[data-property-name=object_epx]').val( obj.epx + '' );
        $('input[data-property-name=object_epy]').val( obj.epy + '' );

        $('input[data-property-name=object_hsx],input[data-property-name=object_epx]').attr('max', obj.cols - 1 );
        $('input[data-property-name=object_hsy],input[data-property-name=object_epy]').attr('max', obj.rows - 1 );
        
        // set hotspot and enter point
        
        $('#object-grid tr.r' + obj.hsy + ' > td.c' + obj.hsx ).addClass( 'hotspot' );
        $('#object-grid tr.r' + obj.epy + ' > td.c' + obj.epx ).addClass( 'entrypoint' );
        
        console.log( '#object-grid tr.r' + obj.epy + ' > td.c' + obj.epx );
        
        /* End of load the object values */
        
        $('#object-editor').removeClass( 'unloaded' );
        
    }
    
    $.ajax( 'tools/editor/assets/objects.tpl?_=' + ( new Date() ).getTime(), {
        
        "type": "GET",
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer );
            
            for ( var i=0, len = map.objects.store.length; i<len; i++ ) {
                
                tpl.assign( 'id', i + '' );
                tpl.assign( 'name', map.objects.store[i].name );
                tpl.assign( 'src', map.objects.getObjectBase64Src( i ) );
                
                tpl.parse( 'object' );
                
            }
            
            for ( var row = 0; row < object_max_rows; row++ ) {
                tpl.assign( 'row_index', row + '' );
                for ( var col = 0; col < object_max_cols; col++ ) {
                    tpl.assign( 'col_index', col + '' );
                    tpl.parse( 'collision_row.collision_cell' );
                }
                tpl.parse( 'collision_row' );
            }
            
            tpl.parse();
            
            $('#editor > div').append( tpl.text + '' );
            
            $('#object-editor > .tabs' ).tabs();
            
            $('#btn-set-hotspot').on( 'click', function() {
                
                if ( $(this).hasClass( 'pressed' ) ) {
                    
                    $(this).removeClass( 'pressed' );
                    
                    $('#object-grid' ).removeClass( 'set-hotspot' );
                    
                } else {
                    
                    $(this).addClass( 'pressed' );
                    
                    $('#object-grid').addClass( 'set-hotspot' ).removeClass('set-entrypoint');
                    
                }
                
            } );
            
            $('#btn-set-entrypoint').on('click', function() {
                
                if ( $(this).hasClass( 'pressed' ) ) {
                    
                    $(this).removeClass( 'pressed' );
                    
                    $('#object-grid').removeClass( 'set-entrypoint' );
                    
                } else {
                    
                    $(this).addClass( 'pressed' );
                    
                    $('#object-grid').addClass( 'set-entrypoint').removeClass( 'set-hotspot' );
                    
                }
                
            } );
            
            $('#object-grid td').on( 'click', function() {
                
                var mode = null,
                    grid = $('#object-grid'),
                    cellX, cellY;
                
                switch ( true ) {
                    
                    case grid.hasClass( 'set-hotspot' ):
                        mode = 'hotspot';
                        break;
                    
                    case grid.hasClass( 'set-entrypoint' ):
                        mode = 'entrypoint';
                        break;
                    
                }
                
                console.log( mode );
                
                if ( mode !== null ) {
                    
                    grid.find( 'td' ).removeClass( mode );
                    
                    $(this).addClass( mode );
                    
                    cellX = this.cellIndex;
                    cellY = this.parentNode.rowIndex;
                    
                    switch ( mode ) {
                        
                        case 'hotspot':
                            
                            $('input[data-property-name=object_hsx]').val( cellX );
                            $('input[data-property-name=object_hsy]').val( cellY );
                            
                            currentObject.hsx = cellX;
                            currentObject.hsy = cellY;
                            
                            $('#btn-set-hotspot').click();
                            
                            break;
                        
                        case 'entrypoint':
                            
                            $('input[data-property-name=object_epx]').val( cellX );
                            $('input[data-property-name=object_epy]').val( cellY );
                            
                            currentObject.epx = cellX;
                            currentObject.epy = cellY;
                            
                            $('#btn-set-entrypoint').click();
                            
                            break;
                        
                    }
                    
                }
                
            } );
            
            $('#cmd-editor-toggle-borders').on( 'click', function() {
                
                $('#object-grid')[ !this.checked ? 'addClass' : 'removeClass' ]( 'no-guidelines' );
                
            } );
            
            $('#objects > .scroller > div.object').on( 'click', function() {
                
                $('#object-editor').addClass( 'unloaded' );
                
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