<?php
    
    $php = trim( `which php` );

    $dirs = scandir( __DIR__ );
    
    $dirs = array_values( array_filter( $dirs, function( $name ) {
        return substr( $name, 0, 1 ) != '.' && !in_array( $name, [ '_lib', 'def.php', 'build-all.php' ] );
    } ) );
    
    foreach ( $dirs as $dir ) {
        
        echo "processing: ", $dir, ": ";
        
        $cmd = "$php " . __DIR__ . "/def.php $dir";
        
        $buffer = `$cmd`;
        
        echo strlen( $buffer ), "b\n";
        
        file_put_contents( __DIR__ . '/../objects/' . strtolower( $dir ) . '.json', $buffer );
        
    }
    
?>