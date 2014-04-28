<?php
    
    function error( $message ) {
        
        die( json_encode( [
            'ok' => FALSE,
            'error' => $message
        ] ) );
        
    }
    
    header( "Content-type: application/json" );

    $data = isset( $_POST['data'] ) ? $_POST['data'] : NULL;
    
    if ( $data === NULL )
        error( 'Which data?' );
    
    $data = @json_decode( $data, TRUE );
    
    if ( !is_array( $data ) )
        error( 'Unserializeable map data!' );
    
    $file = isset( $_POST['file'] ) ? $_POST['file'] : NULL;
    
    if ( $file === NULL || !is_string( $file ) )
        error( 'Bad file name' );
    
    if ( strpos( $file, '..' ) !== FALSE || strpos( $file, '/' ) !== FALSE || strpos( $file, '\\' ) !== FALSE ) // '
        error( 'Illegal file name' );
    
    $filePath = __DIR__ . '/../resources/maps/' . $file;
    
    if ( @( $result = file_put_contents( $filePath, json_encode( $data, JSON_PRETTY_PRINT ) ) ) === FALSE )
        error( "Failed to write file!" );
    
    echo json_encode( [ 'ok' => TRUE ] );
    
?>