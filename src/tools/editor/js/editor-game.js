map.on( 'load', function() {
    
    $$.ajax(  {
        "url": 'tools/editor/assets/game.tpl',
        "type": "GET",
        "cache": false,
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer );
            
            tpl.parse();
            
            $('#editor > div').append( tpl.text + '' );
            
            map.afterFire( 'add-viewport', function( viewport ) {
                var minimap = viewport.addMiniMap( $('#minimap').width(), $('#minimap').height() );
                $('#minimap').append( minimap.$node );
            } );
            
            $('.widget.panel-game').each( function() {
                
                ( function( panel ) {
                
                    $(panel).find( "#opt-walk" ).on( 'click', function() {
                        map.movementType = 'walk';
                        $(panel).find( '.option' ).removeClass( 'focused' );
                        $(this).addClass( 'focused' );
                    } );

                    $(panel).find( "#opt-fly"  ).on( 'click', function() {
                        map.movementType = 'fly';
                        $(panel).find( '.option' ).removeClass( 'focused' );
                        $(this).addClass( 'focused' );
                    } );

                    $(panel).find( "#opt-swim" ).on( 'click', function() {
                        map.movementType = 'swim';
                        $(panel).find( '.option' ).removeClass( 'focused' );
                        $(this).addClass( 'focused' );
                    } );
                
                } )( this );
                
                map.on( 'faction-changed', function( faction ) {
                    
                    faction.on( 'estates-changed', function() {
                        
                        $('#faction div[data-resource]').each( function() {
                            
                            var resName = $(this).attr( 'data-resource' );
                            
                            $(this).text( faction.resources[ resName ] + '' );
                            
                        } );
                        
                    } );
                    
                    faction.on( 'heroes-list-changed', function() {
                        
                        $('#faction-objects > div.heroes').html( '' );
                        
                        for ( var i=0, len = this.heroesList.length; i<len; i++ ) {
                            
                            ( function( hero ) {
                            
                                var btn = document.createElement( 'div' );
                                
                                btn.style.backgroundImage = 'url(' + hero.icon + ')';
                                
                                $('#faction-objects > div.heroes').append(
                                    btn
                                );
                                
                                btn.object = hero;
                                
                            })( this.heroesList[i] );
                            
                        }
                        
                    } );
                    
                    faction.on( 'castles-list-changed', function() {
                        
                        $('#faction-objects > div.castles').html( '' );
                        
                        for ( var i=0, len = this.castlesList.length; i<len; i++ ) {
                            
                            ( function( castle ) {
                                
                                var btn = document.createElement( 'div' );
                                
                                $(btn).addClass( 'g-castle id-' + castle.castleType );
                                
                                $( '#faction-objects > div.castles' ).append( btn );
                                
                                btn.object = castle;
                                
                            } )( this.castlesList[i] );
                            
                        }
                        
                    } );
                    
                    faction.afterFire( 'load', function() {
                        
                        /* Display resources */
                        this.emit( 'estates-changed' );
                        this.emit( 'heroes-list-changed' );
                        this.emit( 'castles-list-changed' );
                        
                    } );
                    
                    $('#faction-objects > div.heroes').on( 'click', '> div', function() {
                        
                        /* Mark the object as active */
                        
                        map.activeObject = this.object;
                        
                    } );

                    $('#faction-objects > div.heroes').on( 'dblclick', '> div', function() {
                        
                        /* Mark the object as active */
                        
                        this.object.edit();
                        
                    } );
                    
                    $('#faction-objects > div.castles' ).on( 'click', '> div', function() {
                        
                        map.activeObject = this.object;
                        
                    } );
                    
                    $('#faction-objects > div.castles' ).on( 'dblclick', '> div', function() {
                        
                        this.object.edit();
                        
                    } );
                    
                } );
                
                $('#faction-selector select' ).on( 'change', function() {
                    
                    if ( map.activeFaction ) {
                        /* Unbind the estate-changed from the active faction */
                        map.activeFaction.removeAllListeners( 'estates-changed' );
                        map.activeFaction.removeAllListeners( 'heroes-list-changed' );
                    }
                    
                    map.activeObject = null;
                    map.setFaction( ~~$(this).val() );
                    
                } );
                
                $('#faction-selector select').change();
                
                map.on( 'object-focus', function( object ) {
                    
                    $('#faction-objects > div.heroes > div, #faction-objects > div.castles > div' ).removeClass( 'active' ).each( function() {
                        
                        if ( this.object == map.activeObject )
                            $(this).addClass( 'active' );
                        
                    } );
                    
                } );
            } );
            
            $('#btn-game').click();
            
        }
    } );
    
} );