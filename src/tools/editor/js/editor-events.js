map.on( 'load', function() {
    
    $$.ajax(  {
        "url": 'tools/editor/assets/events.tpl',
        
        "type": "GET",
        
        "success": function( buffer ) {
            
            var tpl = new XTemplate( buffer );
            
            tpl.parse();
            
            $( '#editor > div' ).append( tpl.text + '' );
            
            $('#btn-clear-events-console').click( function() {
                
                $('#events > .console > .event' ).remove();
                
            } );
            
            var logging = false;
            
            $('#events > label.enable-logging > input' ).on( 'click', function() {
                
                logging = this.checked;
                
                console.log( 'map events logging is: ' + ( logging ? 'enabled' : 'disabled' ) );
                
            } );
            
            map.on( 'object-click', function( obj, clickButton, isHotSpot ) {
                
                if ( !logging )
                    return;
                
                var d = document.createElement( 'div' );
                
                $(d).html('<span class="event-type">object-click</span>, id = <span class="var">' + obj.$id + '</span>, which = <span class="var">' + clickButton + '</span>, isHotSpot = <span class="var">' + ( isHotSpot ? 'true' : 'false' ) + '</span>' );
                
                d.className = 'event';
                
                $(d).click( function() {
                    
                    $('#events > div.console > div.event' ).removeClass( 'focused' );
                    
                    $(this).addClass( 'focused' );
                    
                    window.$1 = obj;
                    
                } );
                
                $('#events > div.console').append( d );
                
                d.scrollIntoViewIfNeeded();
                
            } );
            
            map.on( 'cell-click', function( cell, clickButton ) {
                
                if ( !logging )
                    return;
                
                var d = document.createElement( 'div' );
                
                $(d).html( '<span class="event-type">cell-click</span>, x = <span class="var">' + cell.x() + '</span>, y = <span class="var">' + cell.y() + '</span>, which = <span class="var">' + clickButton + '</span>' );
                
                d.className = 'event';
                
                $(d).click( function() {
                    
                    $('#events > div.console > div.event' ).removeClass( 'focused' );
                    
                    $(this).addClass( 'focused' );
                    
                    window.$1 = cell;
                    
                } );
                
                $('#events > div.console' ).append( d );
                
                d.scrollIntoViewIfNeeded();
                
            } );
            
        }
        
    } );
    
} );