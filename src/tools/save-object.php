<?php
    
    header( "Content-Type: application/json" );
    
    function error( $err ) {
        
        die( json_encode( [ 'ok' => false, 'error' => $err ] ) );
        
    }
    
    $data = isset( $_POST['data'] ) ? $_POST['data'] : error( "Which data?" );
    
    $data = @json_decode( $data, TRUE );
    
    if ( !is_array( $data ) )
        error( "Bad data!" );
    
    if ( !is_int( $data['id'] ) )
        error( "Which data.id?" );
    
    error( 'ToDO' );
    
?>