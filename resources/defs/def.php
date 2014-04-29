<?php
    
    $IS_ANIMATED = FALSE;
    $FRAMES      = 0;

    $COLS        = 0;
    $ROWS        = 0;
    $WIDTH       = 0;
    $HEIGHT      = 0;
    $COLLISION   = [];
    
    $FIRSTFRAME = NULL;
    
    $HSX = 0;
    $HSY = 0;
    
    $DATA = NULL;
    
    /* Animated object tool */
    
    require_once __DIR__ . '/_lib/gd.php';
    
    $def = isset( $argv[1] ) ? $argv[1] : 
        ( isset( $_GET['file'] ) 
          ? $_GET['file']
          : die( "Usage: def.php _path_to_def_extracted_folder_\n" )
        );
    
    if ( !is_dir( $def ) )
        die( "1st argument not a folder!" );
    
    $files = scandir( $def );
    
    
    $files = array_values( array_filter( $files, function( $file ) {
        return preg_match( '/\.bmp$/', $file ) ? TRUE : FALSE;
    } ) );
    
    sort( $files );
    
    $FRAMES = count( $files );
    
    $IS_ANIMATED = $FRAMES > 1;
    
    $index = 0;
    
    foreach ( $files as $file ) {
        
        $im = imagecreatefrombmp( $def . '/' . $file );
        
        if ( $index === 0 ) {
            
            $COLS = floor( ( $WIDTH  = imagesx( $im ) ) / 32 );
            $ROWS = floor( ( $HEIGHT = imagesy( $im ) ) / 32 );
            
            $IMGD = imagecreatetruecolor( $WIDTH * $FRAMES, $HEIGHT );
            
            /* Compute collision matrix, based on first frame */
            
            for ( $row = 0; $row < $ROWS; $row++ ) {
                
                $COLISION_ROW = [];
                
                for ( $col = 0; $col < $COLS; $col++ ) {
                    
                    $x1 = $col * 32;
                    $y1 = $row * 32;
                    $x2 = $x1 + 32;
                    $y2 = $y1 + 32;
                    
                    // echo 'collision: ', $x1, 'x' , $y1, ' => ', $x2, 'x', $y2, "\n";
                    
                    $occupied = 0;
                    
                    /* Determine if tile[ $col ][ $row ] is all with transparent color */
                    
                    for ( $x = $x1; $x < $x2; $x++ ) {
                        
                        for ( $y = $y1; $y < $y2; $y++ ) {
                            
                            $pix = imagepixelat( $im, $x, $y );
                            
                            // print_r( $pix );
                            
                            if ( !pixequal( $pix, [ 'r' => 0, 'g' => 255, 'b' => 255, 'a' => 0 ] ) ) {
                                
                                $occupied = 1;
                                
                                break 2;
                                
                            }
                            
                        }
                        
                    }
                    
                    $COLISION_ROW[] = $occupied;
                    
                }
                
                $COLLISION[] = $COLISION_ROW;
                
            }
            
        }
        
        if ( $FRAMES > 1 ) {
            // copy frame to global sprite
            imagecopy( $IMGD, $im, $WIDTH * $index, 0, 0, 0, $WIDTH, $HEIGHT );
        }
        
        if ( $index == 0 ) {
            
            imagecolortransparent( $im, imagecolorallocate( $im, 0, 255, 255 ) );
            
            $FIRSTFRAME = gdtobuffer( $im );
            
        }
        
        $index++;
        
        imagedestroy( $im );
        
    }
    
    if ( $FRAMES > 1 ) {
        imagecolortransparent( $IMGD, imagecolorallocate( $IMGD, 0, 255, 255 ) );
    }
    
    $out = [
        'name'   => strtolower( basename( realpath( $def ) ) ),
        'width'  => $WIDTH,
        'height' => $HEIGHT,
        'cols'   => $COLS,
        'rows'   => $ROWS,
        'tileWidth' => 32,
        'tileHeight' => 32,
        'frames' => count( $files ),
        'collision' => $COLLISION,
        'hsx'    => 0,
        'hsy'    => 0,
        'animated' => $IS_ANIMATED,
        'frame' => $FIRSTFRAME
    ];
    
    if ( $FRAMES > 1 ) {
        $out['pixmap'] = gdtobuffer( $IMGD );
    }
    
    header( "Content-Type: application/json" );
    
    echo json_encode( $out, JSON_PRETTY_PRINT );

?>