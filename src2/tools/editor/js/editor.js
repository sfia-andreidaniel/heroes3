map.on( 'load', function() {

    /* Create the editor viewport */
    window.viewport = map.addViewport(
        new Viewport( $('#map').width(), $('#map').height(), map )
    );
    
    $('#map > div').append( window.viewport.canvas );
    
    $(window).on( 'resize', function() {
        
        map.viewports[0].resize(
            $('#map').width(),
            $('#map').height()
        );
        
    });
    
    var isDragging = false;
    
    function paintTerrain( ) {
        
        if ( map.activeCell === null )
            return;
        
        var brushType = $('#brush-info > .brush').attr('data-brush'),
            matches;
        
        switch ( true ) {
            
            case brushType == 'rubber':
                console.log( "rubber!" );
                break;
            
            case !!( matches = /^([\d]+)x([\d]+)$/.exec( brushType ) ):
                console.log( "paint on layer " + matches[1] + " data: " + matches[2] );
                map.activeCell.layers[ ~~matches[1] ] = ~~matches[2];
                break;
            
        }
        
    }
    
    $( window.viewport.canvas ).on( 'mousedown', function() {
        isDragging = true;
        paintTerrain();
    } );
    
    $( window.viewport.canvas ).on( 'mouseup', function() {
        isDragging = false;
    } );
    
    $( window.viewport.canvas ).on( 'mouseout', function() {
        isDragging = false;
    } );
    
    map.on( 'selection-changed', function( cell ) {
        if ( isDragging )
            paintTerrain();
    } );
    
    $.ajax( 'tools/editor/assets/tools.tpl', {
        
        "type": "POST",
        "success": function( html ) {
            var tpl = new XTemplate( html );

            for ( var i=0, len = map.layers.length; i<len; i++ ) {
                
                tpl.assign( 'layer_id', i + '' );
                tpl.assign( 'layer_name', map.layers[i].tileset.name );
                
                tpl.parse( 'layer' );
                
                for ( var j=0, n = map.layers[i].tileset.terrains.length; j<n; j++ ) {
                    
                    tpl.assign( 'terrain_id', map.layers[i].tileset.terrains[j].id + '' );
                    tpl.assign( 'terrain_name', map.layers[i].tileset.terrains[j].name );
                    tpl.assign( 'terrain_icon', map.layers[i].tileset.getTileBase64Src( map.layers[i].tileset.terrains[j].defaultTile ) || '' );
                    tpl.parse( 'tab.terrain' );
                    
                }
                
                tpl.parse( 'tab' );
                
            }

            tpl.parse();

            $('#editor > div').append( tpl.text + '' );
            
            $('#tools .tabs').tabs();
            
            /* Setup brush selector tool */
            $( '#tools .terrain-group li' ).on( 'click', function() {
                
                var brush = '<span class="brush" data-brush="' + $(this).attr('data-brush') + '">' + 
                    this.innerHTML +
                    '</span>';
                
                $('#brush-info').html( brush );
                
            } );
            
            $( '#tools .terrain-group li' ).on( 'dblclick', function() {
                
                // Explore tileset
                
                var matches,
                    layerIndex,
                    terrainIndex,
                    terrainName = $(this).text();
                
                if ( !( matches = /^([\d]+)x([\d]+)$/.exec( $(this).attr( 'data-brush' ) ) ) )
                    return; // tileset not explorable
                
                layerIndex = ~~matches[1];
                terrainIndex = ~~matches[2];
                
                $.ajax( 'tools/editor/assets/tileset-explorer.tpl', {
                    "type": "GET",
                    "success": function( str ) {
                        
                        var tpl = new XTemplate( str );
                        
                        tpl.assign( 'terrainName', terrainName );
                        
                        var tiles = map.layers[ layerIndex ].tileset.terrains[ terrainIndex ].tiles;
                        
                        if ( tiles ) {
                            
                            for ( var i=0, len = tiles.length; i<len; i++ ) {
                                tpl.assign ('index', i + '' );
                                tpl.assign ('id', tiles[i] + '' );
                                tpl.assign( 'src', map.layers[ layerIndex ].tileset.getTileBase64Src( tiles[i] ) || '' );
                                tpl.parse( 'sprite' );
                            }
                            
                        }
                        
                        tpl.parse();
                        
                        $( tpl.text + '' ).dialog({
                            "width": 500,
                            "height": 300,
                            "close": function() {
                                $(this).remove();
                            },
                            "modal": true,
                            "title": "Explore tileset terrain",
                            "resizable": false
                        });
                        
                    }
                } );
                
            } );
            
            $('#btn-eraser').on( 'click', function() {
                $('#brush-info').html(
                    '<span class="brush" data-brush="rubber">'
                    + '<img src="data:image/png;base64,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" />'
                    + 'Rubber</span>'
                );
            });
        }
        
    } );
    
    $('#btn-save').on( 'click', function() {
        
        map.save( 'test.map', function( err ) {
            
            if ( err )
                alert( err );
            
        } );
        
    } );

} );