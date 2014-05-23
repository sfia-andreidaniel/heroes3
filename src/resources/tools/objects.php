<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    header( 'Content-Type: application/json' );
    
    $types = new Types();
    
    echo json_encode( $types->toJSON );
    
?>