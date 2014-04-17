map.viewport.on( 'dom-initialization', function( viewport ) {
    
    $('.accordion').accordion({
        heightStyle: "content"
    });
    
    
    function updateMSS( mssHash ) {
        var cssRules = map.styles.land.querySelector( mssHash );
        
        var tbl = [
            '<table id="mss-cell-rules">' + 
            '<tr><td>Selector</td><td>Tile</td><td>Relevance</td><td>Edit</td></tr>'
        ];
        
        for ( var i=0, len = cssRules.length; i<len; i++ ) {
            tbl.push( '<tr><td class="c1">' + cssRules[i].rule + "</td><td class='c2'><img src='" + map.FS.unpackResource( cssRules[i].value ) + "' /></td><td class='c3'>" + cssRules[i].relevance + '</td><td><button class="delete" data-mss="' + cssRules[i].rule + '|' + cssRules[i].value + '">Delete</button></tr>' );
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
        
        console.log( data );
        
    } );
    
} );