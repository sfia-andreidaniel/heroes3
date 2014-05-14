<?php
    require_once __DIR__ . '/bootstrap.php';
    
    header( "Content-Type: application/json" );
    
    function error( $reason ) {
        
        die( json_encode( [ 'ok' => FALSE, 'error' => $reason ] ) );
        
    }
    
    $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : error("Which id?" );
    
    try {
    
    $types = new Types();
    
    $object = $types->getElementById( $id );
    
    $crop = is_array( $_POST['crop'] ) ? $_POST['crop'] : error("Which post.crop?" );
    
    $crop[ 'left' ] = isset( $crop['left'] ) ? (int)$crop['left'] : error("Which post.crop.left?" );
    $crop[ 'right'] = isset( $crop['right'] ) ? (int)$crop['right'] : error( "Which post.crop.right?" );
    $crop[ 'top'  ] = isset( $crop['top'] ) ? (int)$crop['top'] : error("Which post.crop.top?" );
    $crop[ 'bottom'] = isset( $crop['bottom'] ) ? (int)$crop['bottom'] : error( "Which post.crop.bottom?" );
    
    $caption = isset( $_POST['caption'] ) ? $_POST['caption' ] : error( "Which post.caption?" );
    
    $width = isset( $_POST['width'] ) ? (int)$_POST['width'] : error( "Which post.width?" );
    $height= isset( $_POST['height']) ? (int)$_POST['height']: error( "Which post.height?" );
    
    $hsx = isset( $_POST['hsx'] ) ? (int)$_POST['hsx'] : error( "Which post.hsx?" );
    $hsy = isset( $_POST['hsy'] ) ? (int)$_POST['hsy'] : error( "Which post.hsy?" );
    
    $epx = isset( $_POST['epx'] ) ? (int)$_POST['epx'] : error( 'Which post.epx?' );
    $epy = isset( $_POST['epy'] ) ? (int)$_POST['epy'] : error( 'Which post.epy?' );
    
    $cols = isset( $_POST['cols'] ) ? (int)$_POST['cols'] : error('Which post.cols?' );
    $rows = isset( $_POST['rows'] ) ? (int)$_POST['rows'] : error('Which post.rows?' );
    
    $objectClass = isset( $_POST['objectClass'] ) ? $_POST['objectClass'] : error( 'Which post.objectClass?' );
    
    $keywords = isset( $_POST['keywords'] ) ? $_POST['keywords'] : error( 'Which post.keywords?' );
    
    $dynamics = isset( $_POST['dynamics' ] ) ? json_decode( $_POST['dynamics'], TRUE ) : error('Which dynamics?' );
    
    if ( $crop['top'] > 0 || $crop['left'] > 0 || $crop['bottom'] > 0 || $crop['right'] > 0 ) {
        
        $imgs = [];
        
        if ( $object->imagePixmap->width )
            $imgs[] = $object->imagePixmap;
        
        if ( $object->imageFrame->width ) {
            $imgs[] = $object->imageFrame;
        }
        
        for ( $i=0, $len = count( $imgs ); $i < $len; $i++ ) {
            
            foreach ( [ 'top', 'left', 'right', 'bottom' ] as $direction ) {
                
                if ( $crop[ $direction ] <= 0 )
                    continue;
                
                $imgs[$i]->trim( $direction, $crop[ $direction ] * 32 );
                
            }
            
        }
        
    }
    
    $object->hsx = $hsx;
    $object->hsy = $hsy;
    
    $object->epx = $epx;
    $object->epy = $epy;
    
    $object->cols= $cols;
    $object->rows = $rows;
    
    $object->width = $width;
    $object->height= $height;
    
    $object->caption = $caption;
    
    $object->keywords = $keywords;
    
    $object->objectClass = $objectClass;
    
    $object->dynamics = $dynamics;
    
    $object->save();
    
    //error( json_encode( $_POST, JSON_PRETTY_PRINT ) );
    echo json_encode( [ 'ok' => TRUE ] );
    
    } catch ( Exception $e ) {
        error( $e->getMessage() );
    }
    
    
?>