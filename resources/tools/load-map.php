<?php
    
    header( 'Content-Type: application/json' );
    
    try {
    
        if ( !isset( $_GET['file'] ) || !file_exists( $_GET['file'] ) )
            throw new Exception("Invalid file name or file " . ( isset( $_GET['file'] ) ? "'$_GET[file]'" : '' )  . " not exists!");
        
        require_once ( __DIR__ . '/bootstrap.php' );
        
        $maps = new Maps();
        
        $new_map = $maps->create();
        
        $new_map->loadFromFile( $_GET['file'] );
    
        $new_map->save();
        
        // unlink file after loading it from disk
        unlink( $_GET['file'] );
        
        echo json_encode( [
                'ok' => TRUE,
                'id' => $new_map->id
            ], JSON_PRETTY_PRINT
        );
    
    } catch ( Exception $e ) {
        
        die( json_encode( [
                'id' => NULL,
                'ok' => FALSE,
                'error' => $e->getMessage()
            ], JSON_PRETTY_PRINT )
        );
        
    }
    
?>