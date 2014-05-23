<?php

    $mc_conn = memcache_connect( '127.0.0.1', 11211 );
    
    if ( !$mc_conn )
        throw new Exception( "Failed to connect to memcached!" );

    function memcache_file_put_contents( $key, $buffer ) {
        
        global $mc_conn;
        
        memcache_set( $mc_conn, $key, $buffer, 0, 30 );
        
        return TRUE;
    }
    
    function memcache_file_get_contents( $key ) {
        
        global $mc_conn;
        
        return memcache_get( $mc_conn, $key );
        
    }

?>