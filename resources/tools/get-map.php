<?php
    
    header( 'Content-Type: application/json' );
    
    require_once __DIR__ . '/bootstrap.php';
    
    try {
        
        $id = isset( $_GET['id'] ) ? (int)$_GET['id'] : 0;
        
        if ( $id <= 0 )
            throw new Exception_Game( "invalid map id: $id" );
        
        $maps = new Maps();
        
        $map = $maps->getElementById( $id );
        
        if ( !$map )
            throw new Exception_Game( "Invalid map id: $id" );
        
        echo json_encode( $map->toJSON, JSON_PRETTY_PRINT );
    
    } catch ( Exception $e ) {
        
        die( json_encode( [ 
            'ok' => FALSE,
            'error' => $e->getMessage()
        ] ) );
        
    }
    
?>