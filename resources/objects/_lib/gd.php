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
    
?>