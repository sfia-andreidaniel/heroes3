<?php

    require_once __DIR__ . '/bootstrap.php';
    
    $my = new Maps();
    
    $map = $my->getElementById( 1 );
    
    
    echo $map->objects[0]->id, "\n";
    
    echo $map->objects->getElementById( 2 )->typeId, "\n";
    
    $map->objects->getElementById( 2 )->typeId = 2;
    
    

?>