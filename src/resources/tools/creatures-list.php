<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    $creatures = new Creatures();
    
    echo json_encode( $creatures->toJSON, JSON_PRETTY_PRINT );
    
?>