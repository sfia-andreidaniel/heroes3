<?php
    
    /* The purpose of this class is to make the scripts to run
       either under a webserver, either via a cli interface
     */
    
    class Request {
        
        static public function init() {
            
            global $argv;
            
            if ( is_array( $argv ) && count( $argv ) > 1 ) {
                
                $index = 0;
                
                foreach ( $argv as $arg ) {
                    
                    $index++;
                    
                    if ( $index == 1 )
                        continue;
                    
                    $arg = explode( '=', $arg );
                    
                    if ( $arg[0] != '--post' ) {
                    
                        $_GET[ $arg[0] ] = isset( $arg[1] ) ? $arg[1] : '';
                    
                    } else {
                        
                        if ( strlen( $arg[1] ) ) {
                        
                            $postFileContents = file_get_contents( $arg[1] );
                        
                            unlink( $arg[1] );
                        
                            throw new Exception( $postFileContents );
                        
                        }
                        
                        
                    }
                    
                }
                
            }
            
        }
        
    }
    
    Request::init();
    
?>