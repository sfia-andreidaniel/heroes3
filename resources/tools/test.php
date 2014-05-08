<?php

    require_once __DIR__ . '/bootstrap.php';
    
    $my = new Maps();
    
    $map = $my->getElementById( 9 );

    echo $map->layers[0], "\n";

?>