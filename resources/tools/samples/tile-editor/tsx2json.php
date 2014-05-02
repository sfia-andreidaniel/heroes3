<?php
    
    require_once __DIR__ . '/lib/pq.php';
    
    $input = isset( $argv[1] ) ? $argv[1] : die("Which argv[1]?\n");
    
    if ( !file_exists( $input ) )
        die("File " . $input . " not found" );
    
    $output = $input . ".json";
    
    $doc = phpQuery::newDocumentXML( file_get_contents( $input ) );
    
    $out = [];
    
    $doc->find( '> tileset' )->each( function( $node ) use (&$out) {
        
        $out[ 'name' ] = pq($node)->attr( 'name' );
        $out[ 'tilewidth' ] = (int)pq($node)->attr( 'tilewidth' );
        $out[ 'tileheight' ]= (int)pq($node)->attr( 'tileheight' );
        
        pq($node)->find( '> image' )->each( function( $img ) use (&$out) {
            $out[ 'width' ] = (int)pq($img)->attr('width');
            $out[ 'height'] = (int)pq($img)->attr('height');
            $out[ 'src' ] = 'data:image/png;base64,' . base64_encode( file_get_contents( pq($img)->attr('source') ) );
        } );
        
        $hash = 1;
        $id   = 0;
        
        $out[ 'types' ] = [];
        
        pq($node)->find( '> terraintypes > terrain' )->each( function( $terrain ) use (&$out, &$hash, &$id) {
            
            $type = [
                'name' => pq( $terrain )->attr('name'),
                'defaultTile' => (int)pq( $terrain )->attr( 'tile' ),
                'id' => $id,
                'hash' => $hash
            ];
            
            $out[ 'types' ][] = $type;
            
            $id++;
            $hash *= 2;
            
        } );
        
        $out[ 'tiles' ] = [];
        
        pq( $node )->find( '> tile' )->each( function( $tile ) use (&$out) {
            
            $hash = 'NULL';
            
            $vals = explode( ',', $tr = pq( $tile )->attr( 'terrain' ) );
            
            if ( count($vals) == 4 ) {
                
                $hash = $tr;
                
            }
            
            $tileId = (int)pq($tile)->attr('id');
            
            $tile = [
                'hash' => $hash
            ];
            
            $out[ 'tiles' ][ $tileId . '' ] = $tile;
            
        } );
        
        // perform a reverse tile to hash value
        $out[ 'hashes' ] = [];
        
        foreach ( array_keys( $out['tiles'] ) as $tileId ) {
            
            if ( !isset( $out[ 'hashes' ][ $out['tiles'][ $tileId ][ 'hash' ] ] ) )
                $out[ 'hashes' ][ $out[ 'tiles'][ $tileId ][ 'hash' ] ] = [];
            
            $out[ 'hashes' ][ $out[ 'tiles' ][ $tileId ][ 'hash' ] ][] = $tileId;
            
        }
        
    } );
    
    echo json_encode( $out, JSON_PRETTY_PRINT ), "\n";
    
?>