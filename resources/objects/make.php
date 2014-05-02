<?php
    
    require_once __DIR__ . '/../tools/bootstrap.php';
    
    $files = scandir( __DIR__ );
    
    $files = array_values( array_filter( $files, function( $file ) {
        
        return preg_match( '/\.json$/i', $file ) ? TRUE : FALSE;
        
    } ) );
    
    $php = trim(`which php`);
    
    foreach ( $files as $file ) {
        
        echo $file, ": ";
        
        $cmd = "$php " . __DIR__ . "/../tools/fs-obj-to-db.php file=" . $file;
        
        $result = `$cmd`;
        
        echo $result, "\n";
        
    }
?>