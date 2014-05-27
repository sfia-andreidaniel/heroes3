<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    $creatures = new Creatures();
    
    header( "Content-Type: application/json" );
    
    echo json_encode( $creatures->toJSON, JSON_PRETTY_PRINT );
    
?>