<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    $castles = new Castles();
    
    header( 'Content-Type: application/json' );
    
    echo json_encode( $castles->toJSON, JSON_PRETTY_PRINT );
    
?>