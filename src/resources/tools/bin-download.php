<?php
    
    header( "Content-Type: text/plain" );
    
    $name = $_POST[ 'name' ];
    
    $data = explode( 'base64,', $_POST['data'] );
    
    $buffer= base64_decode( $data[1] );
    
    
    $convert = trim( `which convert` );
    
    if ( is_string( $convert ) && strlen( $convert ) && preg_match( '/\.gif$/', $name ) ) {
        
        file_put_contents( '/tmp/' . $name, $buffer );
        
        $cmd = "$convert '/tmp/$name' -transparent cyan '/tmp/$name.conv.gif'";
        
        $result = `$cmd`;
        
        $buffer = file_get_contents( "/tmp/$name.conv.gif" );
        
        @unlink( "/tmp/$name.conv.gif" );
        @unlink( "/tmp/$name" );
        
    }
    
    
    header( "Content-Type: application/octet-stream" );
    header( "Content-Disposition: attachment; name=$name" );
    
    echo $buffer;
    
?>