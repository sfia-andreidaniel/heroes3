<?php

    require_once __DIR__ . '/bootstrap.php';
    
    $types = new Types();
    $obj   = $types->getElementById( 1921 );
    
    $img = $obj->imagePixmap;
    
    if ( !$img || !$img->frames )
        $img = $obj->imageFrame;
    
    /* Convert the images to GIF */
    
    //echo $img->width, "x", $img->height, "x", $img->frames;
    
    $frames = [];
    $delayTimes = [];
    
    for ( $i=0, $len = $img->frames; $i<$len; $i++ ) {
        
        $im = $img->frameAt( $i );
        
        header( 'Content-Type: image/png' );
        
        echo gdtogifrawbuffer( $im->_img );
        
        die('');
        
        $frames[] = gdtogifrawbuffer( $im->_img );
        $delayTimes[] = 10;
        
        $im = NULL;
        
    }
    
    $encoder = new GIFEncoder(
        $frames,
        $delayTimes,
        0,
        2,
        0, 255, 255,
        'bin'
    );
    
    $animation = $encoder->GetAnimation();
    
    header( 'Content-Type: image/gif' );
    echo $animation;
    
    //echo strlen( $animation );

?>