<?php
    
    chdir( __DIR__ );
    
    require_once ( __DIR__ ) . '/_lib/gd.php';
    
    $files = scandir( __DIR__ );
    
    $files = array_values( array_filter( $files, function( $fname ) {
        return preg_match( '/\.json$/', $fname ) ? TRUE : FALSE;
    } ) );
    
    $mapCols = 4;
    
    $sprWidth  = $mapCols;
    $sprHeight = ( count( $files ) / $mapCols == 0 ) ? floor( count( $files ) / $mapCols ) : floor( count( $files ) / $mapCols ) + 1;

    $tileWidth = 64;
    $tileHeight = 64;
    
    $img = imagecreatetruecolor( $sprWidth * $tileWidth, $sprHeight * $tileHeight );
    
    $cyan = imagecolorallocate( $img, 0, 255, 255 );
    
    imagefilledrectangle( $img, 0, 0, imagesx( $img ), imagesy ($img), $cyan );
    
    imagecolortransparent( $img, $cyan );
    
    $id = 0;
    
    $paintX = 0;
    $paintY = 0;
    
    $oWidth = 0;
    $oHeight = 0;
    
    $scale = 0;
    
    $out = [
        'objects' => [],
        'cols' => $sprWidth,
        'rows' => $sprHeight,
        'width' => $sprWidth * $tileWidth,
        'height' => $sprHeight * $tileHeight,
        'tileWidth' => $tileWidth,
        'tileHeight' => $tileHeight
    ];
    
    foreach ( $files as $file ) {
        
        $data = json_decode( file_get_contents( $file ) , TRUE );
        
        $oWidth = $data[ 'width' ];
        $oHeight = $data[ 'height' ];
        
        $scale = min( $tileWidth, $tileHeight ) / max( $oWidth, $oHeight );
        
        $thumbW = $oWidth * $scale;
        $thumbH = $oHeight * $scale;
        
        $thumbX = floor( ( $tileWidth  - $thumbW ) / 2 );
        $thumbY = floor( ( $tileHeight - $thumbH ) / 2 );
        
        $buffer = base64_decode( substr( $data['frame'], 22 ) );
        
        $tile = imagecreatefromstring( $buffer );
        
        $cc = imagecolorallocate( $tile, 0, 255, 255 );
        imagecolortransparent( $tile, $cc );
        
        if ( !is_resource( $tile ) )
            die( "Failed to make: in file $file, the frame data is not a picture!\n" );
        
        imagecopyresized( 
            $img,
            $tile,
            
            $paintX + $thumbX,
            $paintY + $thumbY,
            
            0, 0,
            
            $thumbW,
            $thumbH,
            
            $oWidth,
            $oHeight
        );
        
        @imagedestroy( $tile );
        
        $out['objects'][] = [
            'id' => $id,
            'name' => $data['name'],
            'cols' => $data['cols'],
            'rows' => $data['rows'],
            'width' => $data['width'],
            'height' => $data['height']
        ];
        
        $id++;
        
        $paintX += $tileWidth;
        
        if ( $id % $sprWidth == 0 ) {
            $paintX = 0;
            $paintY +=  ( $tileHeight );
        }
    }
    
    $out[ 'sprite' ] = gdtobuffer( $img );
    
    imagedestroy( $img );
    
    file_put_contents( __DIR__ . '/objects.list', json_encode( $out, JSON_PRETTY_PRINT ) );

    echo "all made ok...\n\n";

?>