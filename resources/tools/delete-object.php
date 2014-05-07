<?php
    
    try {

        require_once __DIR__ . '/bootstrap.php';
    
        header( 'Content-Type: application/json' );
    
        $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : NULL;
    
    
        if ( $id !== NULL ) {
            
            Database( 'main' )->query( "DELETE FROM types WHERE id=$id LIMIT 1" );
        
        }
    
        echo json_encode( [
            
            'ok' => TRUE
            
        ] );
    
    } catch ( Exception $e ) {
        
        echo json_encode( [
            'ok' => FALSE,
            'error' => $e->getMessage()
        ] );
        
    }
    
?>