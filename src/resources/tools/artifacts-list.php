<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    $my = new Artifacts();
    
    echo json_encode( $my->toJSON, JSON_PRETTY_PRINT );
    
?>