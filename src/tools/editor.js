map.viewport.on( 'dom-initialization', function( viewport ) {
    
    var paintWith = null; // with what type of terrain we're currently painting on the map
    
    $('.accordion').accordion({
        heightStyle: "content"
    });
    
    
    function updateMSS( mssHash ) {
    
        var cssRules = map.styles.land.querySelector( mssHash );
        
        if ( !cssRules ) {
            $('#mss-edit').html( '<b>' + mssHash + '</b> has no  rules' );
            return;
        }
        
        var tbl = [
            '<table id="mss-cell-rules">' + 
            '<tr><td>Tile</td><td>Edit</td></tr>'
        ];
        
        for ( var i=0, len = cssRules.length; i<len; i++ ) {
            tbl.push( "<tr><td class='c2'><img src='" + map.FS.unpackResource( cssRules[i] ) + "' /></td><td><button class=\"delete\" data-mss='" + mssHash + '|' + cssRules[i] + "'>Delete</button></tr>" );
        }
        
        tbl.push( '</table>' );
        
        $('#mss-edit').html( tbl.join( '' ) );
    }
    
    $('#save-mss').on( 'click', function() {
        
        $.ajax( 'tools/save-mss.php', {
            
            "type": "POST",
            "data": {
                "buffer": map.styles.land.getStyleSheet()
            },
            "success": function( buffer ) {
                console.log( buffer );
            }
            
        } );
        
    } );
    
    var isPainting = false;
    
    function paintCell( cell ) {

        if ( paintWith === null )
            return;
        
        cell.terrain = map.terrains[ paintWith ];
        
        if ( cell._nCell  ) cell._nCell.terrain = map.terrains[ paintWith ];
        if ( cell._nwCell ) cell._nwCell.terrain = map.terrains[ paintWith ];
        if ( cell._sCell  ) cell._sCell.terrain = map.terrains[ paintWith ];
        if ( cell._neCell ) cell._neCell.terrain = map.terrains[ paintWith ];
        if ( cell._wCell  ) cell._wCell.terrain = map.terrains[ paintWith ];
        if ( cell._swCell ) cell._swCell.terrain = map.terrains[ paintWith ];
        if ( cell._eCell  ) cell._eCell.terrain = map.terrains[ paintWith ];
        if ( cell._seCell ) cell._seCell.terrain = map.terrains[ paintWith ];
        
        map.onCellsChanged( cell.x, cell.y, 6 );
        
        // console.log( "Painting cell @ " + cell.x + ", " + cell.y );

    }
    
    function onPaintMouseDown( evt ) {

        isPainting = true;

        paintCell( evt.cell );

    }
    
    function onPaintMouseMove( evt ) {

        if ( !isPainting )
            return;

        paintCell( evt.cell );

    }
    
    function onPaintMouseUp( evt ) {

        isPainting = false;

    }
    
    function addPaintListener() {
        map.on( 'cell-mousedown', onPaintMouseDown );
        map.on( 'cell-mousemove', onPaintMouseMove );
        map.on( 'cell-mouseup', onPaintMouseUp );
        
    }
    
    function removePaintListener() {
        
    }
    
    $('#widget-paint > button.btn-paint').on( 'click', function() {
        
        if ( $(this).hasClass( 'pressed' ) ) {

            $(this).removeClass( 'pressed' );

            removePaintListener();

            paintWith = null;

        } else {
            
            $(this).parent().find('button.btn-paint').removeClass( 'pressed' );
            
            if ( paintWith === null )
                addPaintListener();
            
            paintWith = $(this).attr('data-terrain');
            
            $(this).addClass( 'pressed' );
        }
        
    } );
    
    map.on( 'mss-changed', function( hash ) {
        updateMSS( hash );
    } );
    
    map.on( 'cell-click', function( evt ) {
        
        $('#cell-x').val( evt.cell.x );
        $('#cell-y').val( evt.cell.y );
        $('#cell-terrain-name').val( evt.cell.terrain.name );
        $('#cell-hash').val( evt.cell.hash );
        
        //console.log( 'cell: ', evt.cell.x, ',', evt.cell.y, ' clicked' );
        
        // Generate existing Matrix CSS for that cell
        updateMSS( evt.cell.hash );
        
    } );
    
    $('#mss-edit').on( 'click', 'table button.delete', function() {
        
        var mss = $(this).attr('data-mss').split( '|' ),
            rule = mss[0],
            value= mss[1];
        
        if ( /^\*\*\*\*[a-z]\*\*\*\*$/i.test( rule ) ) {
            alert( 'this is a built-in rule and cannot be deleted!' );
            return;
        }
        
        map.styles.land.removeSelector( rule, value );
        
    } );
    
    $('#terrain-picker').on( 'click', 'div > img', function( evt ) {
        
        var selector = $('#cell-hash').val(),
            value    = $(this).attr('data-resource');
        
        if ( !selector )
            return;
        
        map.styles.land[ evt.shiftKey ? 'removeSelector' : 'addSelector' ]( selector, value );
        
    } );
    
    $('#terrains').on( 'change', function() {
        
        // generate tileset in #terain-picker
        
        $('#terrain-picker').html('');
        
        if ( this.value == '' )
            return;
        
        var data = map.FS.open( 'terrains/' + this.value ).data;
        
        for ( var i=0, len = data.frames.length; i<len; i++ ) {
            
            var d = document.createElement( 'div' ),
                nw = d.appendChild( document.createElement( 'img' ) ),
                ne = d.appendChild( document.createElement( 'img' ) ),
                se = d.appendChild( document.createElement( 'img' ) ),
                sw = d.appendChild( document.createElement( 'img' ) );
            
            nw.src = data.nw[ data.frames[i] ];
            ne.src = data.ne[ data.frames[i] ];
            se.src = data.se[ data.frames[i] ];
            sw.src = data.sw[ data.frames[i] ];
            
            nw.className = 'nw';
            ne.className = 'ne';
            se.className = 'se';
            sw.className = 'sw';
            
            $(nw).attr('data-resource', 'terrains/' + this.value + '#nw.' + data.frames[i] );
            $(ne).attr('data-resource', 'terrains/' + this.value + '#ne.' + data.frames[i] );
            $(se).attr('data-resource', 'terrains/' + this.value + '#se.' + data.frames[i] );
            $(sw).attr('data-resource', 'terrains/' + this.value + '#sw.' + data.frames[i] );
            
            $('#terrain-picker').append( d );
            
        }
        
        // console.log( data );
        
    } );
    
} );