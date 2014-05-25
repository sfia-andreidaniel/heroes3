map.on( 'load', function() {

    $('#btn-save').on( 'click', function() {
        
        $$.ajax(  {
            "url": 'tools/editor/assets/save.tpl',
            "success": function( buffer ) {
                
                
                $.ajax( 'resources/tools/maps-list.php?t=' + ( new Date() ).getTime(), {
                    
                    "success": function( data ) {

                        if ( !data ) {
                            
                            alert( 'Unknown server error while loading maps list!' );
                            return;
                            
                        }
                        
                        if ( data.error ) {
                            
                            alert( 'Error: ' + data.error );
                            return;
                            
                        }
                        
                        var tpl = new XTemplate( buffer );
                
                        for ( var i=0, len = data.length || 0; i<len; i++ ) {
                            
                            tpl.assign( 'id', data[i].id );
                            tpl.assign( 'name', htmlentities( data[i].name ) );
                            tpl.parse( 'map' );
                        }
                
                        tpl.parse();
                
                        var saveFunc;
                
                        $(tpl.text + '' ).dialog( {
                    
                            "title": "Save Map",
                            "width": 500,
                            "height": 300,
                    
                            "open": function() {
                        
                                $(this).find( '#map-name' ).val( map.name || '' );
                                
                                ( function( dlg ) {
                                    
                                    var setFocus = $.debounce( 50, function() {
                                        
                                        var fname = $(dlg).find( '#map-name' ).val();
                                        
                                        $(dlg).find( '#maps-list > div.map' ).each(
                                            function() {
                                                $(this)[ $(this).attr('data-name') == fname ? 'addClass' : 'removeClass' ]( 'focused' );
                                                if ( $(this).hasClass( 'focused' ) )
                                                    this.scrollIntoViewIfNeeded();
                                            }
                                        );
                                        
                                    } );
                                    
                                    $(dlg).find( '#maps-list > div.map' ).on( 'click', function() {
                                        
                                        $(dlg).find( '#map-name' ).val( $(this).attr('data-name' ) );
                                        setFocus();
                                        
                                    } ).on( 'dblclick', function() {
                                        
                                        saveFunc.call( dlg );
                                        
                                    } );
                                    
                                    $(dlg).find( '#map-name' ).on( 'keyup', setFocus );
                                    
                                    setFocus();
                                    
                                } )( this );
                                
                            },
                    
                            "buttons": {
                        
                                "Save": saveFunc = function() {
                                    
                                    var name = $(this).find( '#map-name' ).val().replace( /(^[\s]+|[\s]+$)/g, '' ),
                                        id   = null;
                                    
                                    if ( !name ) {
                                        
                                        alert( 'Please provide a map name!' );
                                        return;
                                        
                                    }
                                    
                                    $(this).find( '#maps-list > div.map' ).each( function() {
                                        
                                        if ( $(this).attr('data-name') == name ) {
                                            
                                            id = ~~$(this).attr('data-id');
                                            
                                            return false;
                                            
                                        }
                                        
                                    } );
                                    
                                    ( function( dlg ) {
                                    
                                        if ( id ) {
                                        
                                            // map.id = id;
                                            map.name = name;
                                            
                                            map.save( function( err ) {
                                                
                                                if ( err ) {
                                                    
                                                    alert( 'Error saving map: ' + err );
                                                    return;
                                                } else $(dlg).remove();
                                                
                                            }, id );
                                        
                                        } else {
                                            
                                            // map.id = null;
                                            
                                            map.save( function( err ) {
                                                
                                                if ( err ) {
                                                    
                                                    alert( 'Error saving map: ' + err );
                                                    
                                                } else {
                                                    
                                                    map.name = name;
                                                    
                                                    map.save( function( err ) {
                                                        if ( err ) {
                                                            alert( 'Error saving map: ' + err );
                                                        } else $(dlg).remove();
                                                    }, map.id );
                                                    
                                                }
                                                
                                            }, null );
                                            
                                        }
                                    
                                    } )( this );
                                    
                                    console.log( id, name );
                                    
                                },
                                "Cancel": function() {
                                    $(this).remove();
                                }
                        
                            },
                            
                            "modal": true,
                            "close": function() {
                                $(this).remove();
                            }
                    
                        } );
                        
                    }
                    
                } );
                
                
            }
            
        } );
        
    } );

} );