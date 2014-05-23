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
    
    $files_list = scandir( '.' );
    
    $files_list = array_filter( $files_list, function( $file ) {
        
        return preg_match( '/\.bmp$/i', $file );
        
    } );
    
    usort( $files_list, function( $a, $b ) {
        
        if ( preg_match( '/([\d]+)/', $a, $matches ) )
            $intPartA = (int)$matches[1];
        else
            $intPartA = 0;
        
        if ( preg_match( '/([\d]+)/', $b, $matches ) )
            $intPartB = (int)$matches[1];
        else
            $intPartB = 0;
        
        return $intPartA - $intPartB;
        
    } );
    
    function gdtobuffer( &$img ) {
        
        ob_start();
        imagepng( $img );
        $buffer = ob_get_clean();
        
        $hex = base64_encode( $buffer );
        
        return "data:image/png;base64," . $hex;
        
    }
    
    $JSON = [
        "nw" => [],
        "ne" => [],
        "sw" => [],
        "se" => [],
        "frames" => []
    ];
    
    foreach ( $files_list as $fileName ) {
        
        $img = imagecreatefrombmp( $fileName );
        
        $imageKey = str_replace( '.bmp', '', strtolower( $fileName ) );
        
        $JSON[ "nw" ][ $imageKey ] = gdtobuffer( $img );
        
        $img1 = imagerotate( $img, 270, 0 );
        
        $JSON[ "ne" ][ $imageKey ] = gdtobuffer( $img1 );
        
        $img2 = imagerotate( $img, 180, 0 );
        
        $JSON[ "se" ][ $imageKey ] = gdtobuffer( $img2 );
        
        $img3 = imagerotate( $img, 90, 0 );
        
        $JSON[ "sw" ][ $imageKey ] = gdtobuffer( $img3 );
        
        $JSON[ "frames" ][] = $imageKey;
        
        imagedestroy( $img );
        imagedestroy( $img1 );
        imagedestroy( $img2 );
        imagedestroy( $img3 );
        
    }
    
    
    $buffer = json_encode( $JSON, JSON_PRETTY_PRINT );
    
    echo $buffer;
    
?>