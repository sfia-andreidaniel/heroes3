<?php
    
    header( 'Content-Type: application/json' );
    
    try {
    
        require_once __DIR__ . '/bootstrap.php';
        
        $mapid = isset( $_POST['id'] ) ? (int)$_POST['id'] : 0;
        $objs  = isset( $_POST['objects'] ) ? json_decode( $_POST['objects'], TRUE ) : NULL;

        if ( !is_array ($objs ) )
            throw new Exception_Game( "The objects argument should be an array!" );
    
        if ( !count( $objs ) )
            die( json_encode( [ 'ok' => TRUE ] ) );
        
        foreach ( $objs as $obj ) {
            if ( !is_int( $obj ) )
                throw new Exception_Game( "Illegal data detected in objects argument" );
        }
        
        Database( 'main' )->query( 'DELETE FROM maps_objects WHERE map_id = ' . Database::int( $mapid ) . ' AND id IN (' . implode( ', ', $objs ) . ')' );
        
        echo json_encode( [
            'ok' => TRUE
        ] );
    
    } catch ( Exception $e ) {
        
        echo json_encode( [ 
            'error' => $e->getMessage(),
            'ok' => FALSE
        ], JSON_PRETTY_PRINT );
        
    }

?>