<?php

    header( 'Content-Type: application/json' );

    try {
    
        require_once __DIR__ . '/bootstrap.php';
        
        $out = [];
        
        $maps = new Maps();
        
        foreach ( $maps as $map ) {
            
            $out[] = [
                'id' => $map->id,
                'name' => $map->name
            ];
            
        }
        
        echo json_encode( $out );
    
    } catch (Exception $e) {
        
        echo json_encode( [
            'error' => $e->getMessage(),
            'ok' => FALSE
        ], JSON_PRETTY_PRINT );
        
    }

?>