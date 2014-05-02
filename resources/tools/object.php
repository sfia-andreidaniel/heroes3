<?php
    
    require_once __DIR__ . '/bootstrap.php';
    
    try {
        
        header('Content-Type: application/json' );
        
        $id = isset( $_GET['id'] ) ? (int)$_GET['id'] : NULL;
        
        if ( $id === NULL )
            throw new Exception_Game( 'Invalid object id!' );
        
        $my = new Types();
        
        echo json_encode( $my->getElementById( $id )->toJSON );
        
    } catch ( Exception_Game $e ) {
        
        die( json_encode([
            'error' => $e->explain(),
            'ok' => FALSE
        ]) );
        
    }
    
?>