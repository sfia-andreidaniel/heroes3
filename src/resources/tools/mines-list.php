<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    $mines = new Mines();
    
    header( 'Content-Type: application/json' );
    
    echo json_encode( $mines->toJSON, JSON_PRETTY_PRINT );
    
?>