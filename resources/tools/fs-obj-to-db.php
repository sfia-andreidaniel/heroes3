<?php
    
    try {
    
    require_once __DIR__ . '/bootstrap.php';
    
    $file = isset( $_GET['file'] ) ? $_GET['file'] : Error::create( 'which file?' );
    
    if ( !file_exists( $file ) )
        Error::create( 'File ' . $file . ' not found!' );
    
    $ctx = file_get_contents( $file );
    
    $ctx = @json_decode( $ctx, TRUE );
    
    if ( !is_array( $ctx ) )
        Error::create( 'File ' . $file . ' could not be decoded as json' );
    
    Database( 'main' )->query(
        "INSERT INTO types (
            name,
            caption,
            width,
            height,
            cols,
            rows,
            tileWidth,
            tileHeight,
            frames,
            hsx,
            hsy,
            animated,
            epx,
            epy,
            objectType,
            collision,
            animationGroups,
            frame,
            pixmap
        ) VALUES (
            " . Database::string  ( $ctx[ 'name' ] ) . ",
            " . Database::string  ( $ctx[ 'caption' ] ) . ",
            " . Database::int     ( $ctx[ 'width' ] ) . ",
            " . Database::int     ( $ctx[ 'height' ] ) . ",
            " . Database::int     ( $ctx[ 'cols' ] ) . ",
            " . Database::int     ( $ctx[ 'rows' ] ) . ",
            " . Database::int     ( $ctx[ 'tileWidth' ] ) . ",
            " . Database::int     ( $ctx[ 'tileHeight' ] ) . ",
            " . Database::int     ( $ctx[ 'frames' ] ) . ",
            " . Database::int     ( $ctx[ 'hsx' ] ) . ",
            " . Database::int     ( $ctx[ 'hsy' ] ) . ",
            " . Database::boolint ( $ctx[ 'animated' ] ) . ",
            " . Database::int     ( $ctx[ 'epx' ] ) . ",
            " . Database::int     ( $ctx[ 'epy' ] ) . ",
            " . Database::int     ( $ctx[ 'objectType' ] ) . ",
            " . Database::json    ( $ctx[ 'collision' ], TRUE ) . ",
            " . Database::json    ( $ctx[ 'animationGroups' ], TRUE ) . ",
            " . Database::string  ( $ctx[ 'frame' ], TRUE ) . ",
            " . Database::string  ( $ctx[ 'pixmap' ], TRUE ) . "
        )" );
    
        echo json_encode( ['ok' => TRUE ] );
    
    } catch ( Exception $e ) {
        
        die( $e->getMessage() );
    
        die( json_encode( [
            'error' => substr( $e->getMessage(), 0, 32 ),
            'ok' => FALSE
        ], JSON_PRETTY_PRINT ) );
    }
?>