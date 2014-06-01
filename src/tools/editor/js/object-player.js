$.fn.objectplayer = function( object, pauseStateInput, frameIndexInput, frameChooserInput ) {
    
    var canvas = this.length == 1 ? this.get(0) : null;
    
    if ( !canvas )
        return;

    var frames          = object.frames,
        animationFrame  = 0,
        animationIndex  = null,
        animationFrames = [];
    
    function setAnimationIndex( animationIndexValue ) {
        animationFrames = [];
        animationFrame  = 0;
        
        if ( animationIndexValue === null ) {
            if ( object.animated ) {
                for ( var i=0, len = object.frames; i<len; i++ )
                    animationFrames.push( i );
            } else {
                animationFrames.push(0);
            }
        } else {
            if ( object.animationGroups[ animationIndexValue ] ) {
                animationFrames = object.animationGroups[ animationIndexValue ];
            } else throw "Bad animation index!";
        }
        
        animationIndex = animationIndexValue;
        
        //console.log( 'setanimationindex: ', animationIndexValue );
    }
    
    if ( frameChooserInput ) {
        
        $(frameChooserInput).on( 'change', function() {
            
            setAnimationIndex( this.value === '' ? null : ~~this.value );
            
        } );
        
        setAnimationIndex( $(frameChooserInput).val() === '' ? null : ~~$(frameChooserInput).val() );
    
    } else {
    
        setAnimationIndex( null );
    
    }

    ( function() {
        
        var isPlaying = false,
            playingThreadId = null,
            ctx = canvas.getContext( '2d' );
        
        canvas.paint = function() {
            
            var sx = animationFrames[ animationFrame ] * object.width,
                sy = 0,
                sw = object.width,
                sh = object.height;
            
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.fillRect( 0,0,object.width, object.height );
            
            ctx.drawImage( 
                object.sprite.node,
                sx,
                sy,
                sw,
                sh,
                0,
                0,
                sw,
                sh
            );
        }

        canvas.paintFrame = function( fIndex, noClear, transparent ) {
            
            var sx = fIndex * object.width,
                sy = 0,
                sw = object.width,
                sh = object.height;
                
            noClear = noClear || false;
            
            transparent = transparent || false;
            
            if ( !noClear ) {
                ctx.fillStyle = 'rgb(255,255,255)';
                ctx.fillRect( 0,0,object.width, object.height );
            }
            
            if ( transparent ) {
                ctx.fillStyle = '00ffff';
                ctx.fillRect( 0,0,object.width, object.height );
            }
            
            ctx.drawImage( 
                object.sprite.node,
                sx,
                sy,
                sw,
                sh,
                0,
                0,
                sw,
                sh
            );
            
        }
        
        function threader() {
            animationFrame = ++animationFrame >= animationFrames.length ? 0 : animationFrame;
            
            if ( frameIndexInput ) {
                frameIndexInput.value = animationFrame;
            }
            
            canvas.paint();
        }
        
        canvas.play = function() {
            if ( isPlaying )
                return;
            
            isPlaying = true;
            
            playingThreadId = window.setInterval( threader, 100 );
            
            console.log( 'playing' );
        }
        
        canvas.stop = function() {
            if ( !isPlaying )
                return;
            
            isPlaying = false;
            
            window.clearInterval( playingThreadId );
            
            console.log( 'stopped' );
        }
        
    } )();
    
    if ( frameIndexInput ) {
    
        $(frameIndexInput).on( 'change', function() {
            
            animationFrame = ~~this.value;
            
            canvas.paintFrame( animationFrame );
        } );
    }
    
    if ( pauseStateInput ) {
        
        $(pauseStateInput).on( 'click', function() {
            
            if ( this.checked )
                canvas.play();
            else
                canvas.stop();
            
        } );
        
        if ( pauseStateInput.checked )
            canvas.play();
        else
            canvas.paintFrame(0);
        
    } else {
        
        canvas.paintFrame( 0 );
        
    }

    return this;
}