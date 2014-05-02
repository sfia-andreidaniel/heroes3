<?php
    
    function imagecreatefrombmp( $file ) {
    
        $img = new Imagick();
        
        if ( !$img->readImage( $file ) )
            return NULL;
    
        do {
            $filename = rand();
            $filename .= '.'. str_replace(' ', '.', microtime());
            $filename .= '.'. getmypid();
            $filename .= '.png';
        } while( file_exists( ( $fullPath = '/tmp/' . $filename ) ) );
    
        $img->writeImage( $fullPath );
        
        $img->clear();
        
        $out = imagecreatefrompng( $fullPath );
        
        unlink( $fullPath );
        
        return $out;
    }
    
    function gdtobuffer( &$img ) {
        
        ob_start();
        imagepng( $img );
        $buffer = ob_get_clean();
        
        $hex = base64_encode( $buffer );
        
        return "data:image/png;base64," . $hex;
        
    }
    
    function imagepixelat( &$img, $x, $y ) {

        $rgb = imagecolorat( $img, $x, $y );
        $colors = imagecolorsforindex( $img, $rgb );
        
        return [ 
            'r' => $colors['red'],
            'g' => $colors['green'],
            'b' => $colors['blue'],
            'a' => $colors['alpha']
        ];
        
    }
    
    /* @param pix1, pix2: structures returned by imagepixelat */
    
    function pixequal( $pix1, $pix2 ) {
        return $pix1[ 'r' ] == $pix2[ 'r' ] &&
               $pix1[ 'g' ] == $pix2[ 'g' ] &&
               $pix1[ 'b' ] == $pix2[ 'b' ] &&
               $pix1[ 'a' ] == $pix2[ 'a' ];
    }
    
    function imagecreatefromdatauri( $str ) {
        if ( !preg_match( '/^data:image(\/(png|jpeg|jpg|gif));base64,/', $str, $matches ) )
            return NULL;
        $buffer = base64_decode( substr( $str, strlen( $matches[0] ) ) );
        return imagecreatefromstring( $buffer );
    }
    
    function image_shift_left( &$img, $much, $transparent ) {
        
        if ( imagesx( $img ) - $much <= 0 )
            return FALSE;
        
        $img2 = imagecreatetruecolor( imagesx( $img ) - $much, imagesy( $img ) );
        
        if ( $transparent ) {
            $color = imagecolorallocate( $img2, $transparent[ 'r' ], $transparent[ 'g' ], $transparent['b'] );
            imagefilledrectangle( $img2, 0, 0, imagesx( $img2 ), imagesy( $img2 ), $color );
            imagecolortransparent( $img2, $color );
        }
        
        imagecopyresized( $img2, $img, 0, 0, $much, 0, imagesx( $img ) - $much, imagesy( $img ), imagesx( $img ) - $much, imagesy( $img ) );
        
        return $img2;
    }
    
    function image_shift_right( &$img, $much, $transparent ) {
        
        if ( imagesx( $img ) - $much <= 0 )
            return FALSE;
        
        $img2 = imagecreatetruecolor( imagesx( $img ) - $much, imagesy( $img ) );
        
        if ( $transparent ) {
            $color = imagecolorallocate( $img2, $transparent[ 'r' ], $transparent[ 'g' ], $transparent['b'] );
            imagefilledrectangle( $img2, 0, 0, imagesx( $img2 ), imagesy( $img2 ), $color );
            imagecolortransparent( $img2, $color );
        }
        
        imagecopyresized( $img2, $img, 0, 0, 0, 0, imagesx( $img ) - $much, imagesy( $img ), imagesx( $img ) - $much, imagesy( $img ) );
        
        return $img2;
    }
    
    function image_shift_top( &$img, $much, $transparent ) {
        
        if ( imagesy( $img ) - $much <= 0 )
            return FALSE;
        
        $img2 = imagecreatetruecolor( imagesx( $img ), imagesy( $img ) - $much );
        
        if ( $transparent ) {
            $color = imagecolorallocate( $img2, $transparent[ 'r' ], $transparent[ 'g' ], $transparent['b'] );
            imagefilledrectangle( $img2, 0, 0, imagesx( $img2 ), imagesy( $img2 ), $color );
            imagecolortransparent( $img2, $color );
        }
        
        imagecopyresized( $img2, $img, 0, 0, 0, $much, imagesx( $img2 ), imagesy( $img2 ), imagesx( $img ), imagesy( $img ) - $much );
        
        return $img2;
        
    }
    
    function image_shift_bottom( &$img, $much, $transparent ) {
        
        if ( imagesy( $img ) - $much <= 0 )
            return FALSE;
        
        $img2 = imagecreatetruecolor( imagesx( $img ), imagesy( $img ) - $much );
        
        if ( $transparent ) {
            $color = imagecolorallocate( $img2, $transparent[ 'r' ], $transparent[ 'g' ], $transparent['b'] );
            imagefilledrectangle( $img2, 0, 0, imagesx( $img2 ), imagesy( $img2 ), $color );
            imagecolortransparent( $img2, $color );
        }
        
        imagecopyresized( $img2, $img, 0, 0, 0, 0, imagesx( $img2 ), imagesy( $img2 ), imagesx( $img ), imagesy( $img ) - $much );
        
        return $img2;
        
    }
?>