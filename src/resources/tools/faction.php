<?php

    try {
    
        header( 'Content-Type: application/json' );
        header( "Cache-Control: no-cache, must-revalidate" ); // HTTP/1.1
        header( "Expires: Sat, 26 Jul 1997 05:00:00 GMT" ); // Date in the past
        
        require_once __DIR__ . '/bootstrap.php';
        
        $do = isset( $_GET['do'] ) ? $_GET['do'] : NULL;
        
        if ( $do === NULL )
            throw new Exception("What to do?");
        
        $factions = new Factions();
        
        switch ( $do ) {
        
            case 'list':
                echo json_encode( $factions->toJSON, JSON_PRETTY_PRINT );
                break;
            
            case 'load-faction':
                $id = isset( $_GET['id'] ) ? (int)$_GET['id'] : NULL;
                
                if ( $id === NULL )
                    throw new Exception( 'Which id?' );
                
                $faction = $factions->getElementById( $id );
                
                if ( !$faction )
                    throw new Exception( 'Faction #' . $id . ' not found.' );
                
                echo json_encode( $faction->toJSON, JSON_PRETTY_PRINT );
                
                break;
            
            case 'add-resources':
    
                $id = isset( $_POST['id'] ) ? (int)$_POST['id'] : NULL;
                
                if ( $id === NULL || $id < 1 )
                    throw new Exception( "Bad id!" );
            
                $resources = isset( $_POST['resources'] ) ? @json_decode( $_POST['resources'], TRUE ) : NULL;
                
                if ( !is_array( $resources ) )
                    throw new Exception( "Bad resources object!" );
                
                $faction = $factions->getElementById( $id );
                
                if ( !$faction )
                    throw new Exception( "Faction #" . $id . " not found!" );
                
                foreach ( array_keys( $resources ) as $resource ) {
                
                    if ( !in_array( $resource, [
                        'gold',
                        'wood',
                        'ore',
                        'crystals',
                        'gems',
                        'sulfur',
                        'mercury',
                        'mithril'
                    ] ) ) throw new Exception( "Bad resource name!" );
                    
                    $faction->{$resource} = ( $faction->{$resource} + $resources[ $resource ] );
                    
                }
                
                echo json_encode( [
                    'ok' => TRUE
                ], JSON_PRETTY_PRINT );
                
                break;
            
            default:
                throw new Exception( "Bad handler command: $do" );
                break;
        }
        
    } catch ( Exception $e ) {
        
        echo json_encode( [
            'error' => $e->getMessage(),
            'ok' => FALSE
        ], JSON_PRETTY_PRINT );
        
    }
    
?>