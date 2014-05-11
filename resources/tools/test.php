<?php

    require_once __DIR__ . '/bootstrap.php';
    
    $my = new Maps();
    
    $map = $my->getElementById( 2 );
    
    echo json_encode( $map->toJSON, JSON_PRETTY_PRINT ), "\n";

?>