<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    $resources = new Resources();
    
    header( 'Content-Type: application/json' );
    
    echo json_encode( $resources->toJSON, JSON_PRETTY_PRINT );
    
?>