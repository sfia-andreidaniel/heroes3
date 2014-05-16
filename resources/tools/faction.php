<?php
    
    header( 'Content-Type: application/json' );
    
    require_once __DIR__ . '/bootstrap.php';
    
    $factions = new Factions();
    
    echo json_encode( $factions->toJSON, JSON_PRETTY_PRINT );
    
?>