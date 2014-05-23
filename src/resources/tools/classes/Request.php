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
                        
                        if ( strlen( $postFile = $arg[1] ) ) {
                            
                            $contents = memcache_file_get_contents( $postFile );
                        
                            if ( $contents === FALSE )
                                throw new Exception( "Failed to read file: " . $postFile . ", I am: " . `whoami` );
                            
                            $postFileContents = json_decode( $contents, TRUE );
                            
                            if ( !is_array( $postFileContents ) ) {
                                
                                throw new Exception( $postFileContents );
                                
                                throw new Exception_Game( "Failed to decode \$_POST file: " . $arg[1] );
                            }
                            
                            foreach ( array_keys( $postFileContents ) as $var )
                                $_POST[ $var ] = $postFileContents[ $var ];
                            
                        }
                        
                        
                    }
                    
                }
                
                $argv = [];
                
            }
            
        }
        
    }
    
    Request::init();
    
?>