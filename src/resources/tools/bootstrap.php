<?php

    /* Date and time */
    date_default_timezone_set('Europe/Bucharest');

    /* Memory allocation */
    ini_set( 'memory_limit', '512M' );

    /* Constants */

    // Exceptions
    
    define("SEVERITY_DEBUG",   -1);
    define("SEVERITY_NONE",     0);
    define("SEVERITY_LOW",      1);
    define("SEVERITY_MEDIUM",   2);
    define("SEVERITY_HIGH",     3);
    define("SEVERITY_CRITICAL", 4);

    // Date formats
    
    define("DATE_MYSQL_TIMESTAMP", 'Y-m-d H:i:s' );

    
    // Data paths
    
    define("PATH_ROOT",      dirname( __FILE__ ) );

    // Email settings
    
    define("SERVER_ADDRESS", "http://localhost/" );

    /* Auto-Loading... */

    spl_autoload_register( function( $className ) {
        
        $classParts = explode("_", $className );
        
        $classPath  = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'classes' . DIRECTORY_SEPARATOR . implode( DIRECTORY_SEPARATOR, $classParts ) . ".php";
        
        if ( !file_exists( $classPath ) ) {
            throw new Exception_Programming("Failed to require class: " . $className . " ( File " . $classPath . " not found)", SEVERITY_CRITICAL );
        } else
            require_once $classPath;
        
        if ( !class_exists( $className ) ) {
            throw new Exception_Programming("Failed to load class: $className ( class not defined in " . $classPath . ")", SEVERITY_HIGH );
        }
        
    } );
    
    set_exception_handler( function( $ex ) {
        
        if ( strtolower( php_sapi_name() ) == 'cli' ) {
            
            if ( $ex instanceof Exception_Game ) {
                
                // If we're running the script in 'console', we print a programmer friendly exception
                
                die( $ex->explain() . "\n" );
                
            } else {
                
                echo "Exception (" . get_class( $ex ) . "): " . $ex->getMessage() . "\n" .
                     "Trace info: ";
                
                print_r( $ex->getTrace() );
                
                die('');
                
            }
            
        } else {
            
            if ( $ex instanceof Exception_Game ) {
                
                die( $ex->explain() );
                
            } else {
                
                die( "0.FF. Unknown error\n" );
                
            }
            
        }

    } );

    require_once __DIR__ . '/lib/memcache_write.php';
    require_once __DIR__ . '/classes/Error.php';
    require_once __DIR__ . '/classes/Request.php';
    require_once __DIR__ . '/classes/Database.php';

?>