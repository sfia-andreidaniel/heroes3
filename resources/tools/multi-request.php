<?php
    
    /* The purpose of this file is to transfer multiple ajax requests at once.
     */
    
    header( 'Content-Type: application/json' );
    
    require_once __DIR__ . '/bootstrap.php';
    
    $PHP_BIN_PATH = '/usr/bin/php';
    
    try {
    
        $requests = isset( $_POST['data'] ) ? $_POST['data'] : NULL;
        
        if ( $requests === NULL ) {
            
            throw new Exception( 'Which requests?' );
            
        }
        
        $requests = json_decode( $requests, TRUE );
        
        if ( !is_array( $requests ) )
            throw new Exception( "Bad request: E_NOT_DESERIALIZABLE" );
        
        $out = [
            "data" => [
                
            ],
            "ok" => TRUE
        ];
        
        foreach ( $requests as $request ) {
            
            $url    = explode( '?', $request[ 'url' ] );
            $url    = $url[0];
            
            $query  = $url == $request[ 'url' ] ? NULL : substr( $request['url'], strlen( $url ) + 1 );
            
            $get    = [];
            $post   = [];
            
            if ( $query != NULL ) {
                
                $query = explode( '&', $query );
                
                foreach ( $query as $arg ) {
                    
                    if ( strpos( $arg, '=' ) !== FALSE ) {
                        
                        $argName = substr( $arg, 0, strpos( $arg, '=' ) );
                        $argVal  = substr( $arg, strlen( $argName ) + 1 );
                        
                        $get[ urldecode( $argName ) ] = urldecode( $argVal );
                        
                    } else {
                        
                        $get[ urldecode( $arg ) ] = '';
                        
                    }
                    
                }
                
            }
            
            $type   = strtolower( $request[ 'type' ] );
            
            if ( isset( $request[ 'data' ] ) && is_array( $request['data'] ) ) {
                
                foreach ( array_keys( $request[ 'data' ] ) as $argName ) {
                    
                    switch ( $type ) {
                        
                        case 'get':
                        case 'post':
                            ${$type}[ $argName ] = $request[ 'data' ][ $argName ];
                            break;
                        
                        default:
                            throw new Exception( "Invalid request method: " . $type );
                        
                    }
                    
                }
                
            }
            
            $parsed = [
                'get' => $get,
                'post' => $post,
                'url' => $url,
                'id' => $request[ 'id' ]
            ];
            
            $rFilePath = realpath( __DIR__ . '/../../' . $url );
            
            if ( $rFilePath === NULL ) {
                
                $parsed[ 'error' ] = 'File not found!';
                $out[ 'data' ][] = $parsed;
                
                continue;
            }
            
            switch ( TRUE ) {
                
                case ( preg_match( '/\.php$/', $rFilePath ) ? TRUE : FALSE ):
                
                    /* Exec php file with get and post data, and set the parsed.data to resulting buffer! */
                    
                    $cmdLine = $PHP_BIN_PATH . ' ' . escapeshellarg( $rFilePath );
                    
                    foreach ( array_keys( $get ) as $getVar ) {
                        
                        $cmdLine .= ( ' ' . escapeshellarg( $getVar . '=' . $get[ $getVar] ) );
                        
                    }
                    
                    $postFilePath = NULL;
                    
                    if ( count( array_keys( $post ) ) ) {
                        
                        $postFilePath = '/tmp/postfile-' . time() . '-' . rand( 0, 1024 ) . '-' . rand( 0, 1024 ) . '-' . rand( 0, 1024 ) . '.post';

                        file_put_contents( $postFilePath, json_encode( $post ) );
                        
                        $cmdLine .= ( ' ' . escapeshellarg( '--post=' . $postFilePath ) );
                        
                    }
                    
                    $buffer = `$cmdLine`;
                    $jBuffer = json_decode( `$cmdLine`, TRUE );
                    
                    $parsed[ 'cmdLine' ] = $cmdLine;
                    
                    $parsed[ 'data' ] = is_array( $jBuffer ) ? $jBuffer : $buffer;
                
                    break;
                
                default:
                    
                    $parsed[ 'data' ] = file_get_contents( $rFilePath );
                    
                    break;
                
            }
            
            $out[ 'data' ][] = $parsed;
            
        }
        
        echo json_encode( $out );
    
    } catch ( Exception $e ) {
        
        echo json_encode( [
            'error' => $e->getMessage(),
            'ok' => FALSE
        ] );
        
    }
    
?>