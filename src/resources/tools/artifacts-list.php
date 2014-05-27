<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    $my = new Artifacts();
    
    header( "Content-Type: application/json" );
    
    echo json_encode( $my->toJSON, JSON_PRETTY_PRINT );
    
?>