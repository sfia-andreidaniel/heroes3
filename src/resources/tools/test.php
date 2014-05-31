<?php

    require_once __DIR__ . '/bootstrap.php';
    
    $my = new Castles_Buildings();
    
    echo json_encode( $my->toJSON, JSON_PRETTY_PRINT ), "\n";

?>