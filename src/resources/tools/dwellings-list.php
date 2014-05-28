<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    $dwellings = new Dwellings();
    
    header( "Content-Type: application/json" );
    
    echo json_encode( $dwellings->toJSON, JSON_PRETTY_PRINT );
    
?>