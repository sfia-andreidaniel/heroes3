map.on( 'load', function() {

    $('#btn-open').on( 'click', function() {
        
        $$.ajax( {
            "url": 'tools/editor/assets/load.tpl',
            "success": function( buffer ) {
                
                $.ajax( 'resources/tools/maps-list.php', {
                    
                    "success": function( data ) {
                        
                        if ( !data || data.error ) {
                            
                            alert( 'Eror loading existing maps list: ' + ( data ? ( data.error || 'Unknown error' ) : 'Unknown error' ) );
                            return;
                            
                        }
                        
                        var tpl = new XTemplate( buffer );
                        
                        for ( var i=0, len = data.length || 0; i<len; i++ ) {
                            
                            tpl.assign( 'id', data[i].id );
                            tpl.assign( 'name', htmlentities( data[i].name ) );
                            tpl.parse( 'map' );
                            
                        }
                        
                        tpl.parse();
                        
                        var loadFunc;
                        
                        $(tpl.text + '').dialog({
                            
                            "width": 500,
                            "height": 300,
                            "title": "Load map",
                            
                            "close": function() {
                                $(this).remove();
                            },
                            
                            "open": function() {
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
                                    
                                    $(dlg).find( '#maps-list' ).on( 'click', '> .map', function() {
                                        
                                        $(dlg).find( '#map-name' ).val( $(this).attr( 'data-name' ) );
                                        
                                        setFocus();
                                        
                                    } ).on( 'dblclick', function(){
                                        
                                        loadFunc.call( dlg );
                                    
                                    });
                                    
                                    $(dlg).find( '#map-name' ).val( map.name || '' ).on( 'keyup', setFocus );
                                    
                                    setFocus();
                                    
                                })( this );

                            },
                            
                            "buttons": {
                                
                                "Load": loadFunc = function() {
                                    
                                    var name = $(this).find( '#map-name' ).val(),
                                        id = null;
                                    
                                    if ( !name ) {
                                        
                                        alert( 'Please input a valid map name, or select one from the list!' );
                                        return;
                                        
                                    }
                                    
                                    $(this).find( '#maps-list > .map' ).each( function() {
                                        if ( $(this).attr('data-name') == name ) {
                                            id = ~~$(this).attr('data-id');
                                            return false;
                                        }
                                    } );
                                    
                                    if ( id === null ) {
                                        
                                        alert( 'Map ' + name + ' does not exist on server!' );
                                        return;
                                        
                                    }
                                    
                                    ( function( me ) {
                                        map.loadMap( id, function( err ) {
                                            
                                            if ( err ) {
                                                alert( err );
                                            } else {
                                                $(me).remove();
                                            }
                                        
                                        } );
                                    })( this );
                                    
                                },
                                "Cancel": function() {
                                    $(this).remove();
                                }
                                
                            },
                            
                            "modal": true
                            
                        });
                        
                    }
                    
                } );
                
            }
            
        });
        
    } );

} );