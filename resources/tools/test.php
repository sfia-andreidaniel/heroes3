<?php

    require_once __DIR__ . '/bootstrap.php';
    
    try {
    
        $my = new Types();
        
        print_r( $my->getElementById( 2314 )->imageFrame->getCollisionMatrix( 0, 32, 32 )->getTrim() );
        
    } catch ( Exception_Game $e ) {
        echo $e->explain(), "\n";
    }

?>