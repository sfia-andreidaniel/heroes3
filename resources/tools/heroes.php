<?php

    require_once __DIR__ . '/bootstrap.php';
    
    $my = new Heroes();
    
    echo json_encode( $my->toJSON );

?>