<?php
    
    header( 'Content-Type: application/json' );
    
    try {
    
        require_once __DIR__ . '/bootstrap.php';
    
        $id = isset( $_POST['id'] ) ? $_POST['id'] : 0;
        
        if ( $id <= 0 )
            throw new Exception_Game( "Which id?" );
        
        $data = isset( $_POST['data'] ) ? @json_decode( $_POST['data'], TRUE ) : NULL;
        
        if ( !is_array( $data ) ) {
            
            throw new Exception_Game( "Unserializeable json data!" );
            
        }
        
        $maps = new Maps();
        
        $map = $maps->getElementById( $id );
        
        if ( !$map )
            throw new Exception_Game( "Map $id was not found!" );
        
        $map->loadFromObject( $data );
        
        echo json_encode( [
                'ok' => TRUE
            ], JSON_PRETTY_PRINT
        );
    
    } catch ( Exception $e ) {
        
        die( json_encode( [
            'error' => $e->getMessage(),
            'ok' => FALSE
        ], JSON_PRETTY_PRINT ) );
        
    }
    
?>