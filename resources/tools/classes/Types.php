<?php
    
    require_once __DIR__ . '/../lib/gd.php';
    
    class Types extends BaseClass {
        
        public function __construct( ) {
            
            $result = Database( 'main' )->query( 
                "SELECT id,
                        name,
                        caption,
                        keywords,
                        width,
                        height,
                        cols,
                        rows,
                        tileWidth,
                        tileHeight,
                        frames,
                        hsx,
                        hsy,
                        animated,
                        epx,
                        epy,
                        objectType,
                        objectClass,
                        collision,
                        animationGroups,
                        dynamics_walk,
                        dynamics_fly,
                        dynamics_swim
                 FROM types
                 WHERE objectType IN( 3, 4 )"
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
                $this->_properties[] = new Types_Type( $this, $row );
            
        }
        
        public function __get( $propertyName ) {
            switch ( $propertyName ) {
                
                case 'toJSON':
                    return $this->_toJSON();
                    break;
                
                default:
                    return parent::__get( $propertyName );
                    break;
            }
        }
        
        /* Exports all the objects into a single
           JSON format structure
         */
        
        private function _toJSON() {
            
            $mapCols = 4;
            
            $sprWidth = $mapCols;
            $sprHeight = ( count( $this->_properties ) / $mapCols == 0 ) 
                ? floor( count( $this->_properties ) / $mapCols ) 
                : floor( count( $this->_properties ) / $mapCols ) + 1;
            
            $tileWidth  = 64;
            $tileHeight = 64;
            
            $img = imagecreatetruecolor( $sprWidth * $tileWidth, $sprHeight * $tileHeight );
            $cyan = imagecolorallocate( $img, 0, 255, 255 );
            
            imagefilledrectangle( $img, 0, 0, imagesx( $img ), imagesy ($img), $cyan );
            imagecolortransparent( $img, $cyan );
            
            $id = 0;
            
            $paintX = 0;
            $paintY = 0;
            
            $oWidth = 0;
            $oHeight = 0;
            
            $scale = 0;
            
            $out = [
                'objects'    => [],
                'cols'       => $sprWidth,
                'rows'       => $sprHeight,
                'width'      => $sprWidth * $tileWidth,
                'height'     => $sprHeight * $tileHeight,
                'tileWidth'  => $tileWidth,
                'tileHeight' => $tileHeight
            ];
            
            foreach ( $this->_properties as $object ) {
                
                $oWidth = $object->width;
                $oHeight= $object->height;
                
                if ( $oWidth < $tileWidth && $oHeight < $tileHeight ) {
                    $scale = 1;
                } else {
                    $scale  = min( $tileWidth, $tileHeight ) / max( $oWidth, $oHeight );
                }
                
                $thumbW = $oWidth * $scale;
                $thumbH = $oHeight * $scale;
                
                $thumbX = floor( ( $tileWidth  - $thumbW ) / 2 );
                $thumbY = floor( ( $tileHeight - $thumbH ) / 2 );

                $buffer = base64_decode( substr( $object->frame, 22 ) );
                
                $tile = imagecreatefromstring( $buffer );
                
                if ( !is_resource( $tile ) )
                    throw new Exception_Game( 'Failed to make: in ' . $object->name . ' ( data.frame is not a picture )' );
                
                $cc = imagecolorallocate( $tile, 0, 255, 255 );
                
                imagecolortransparent( $tile, $cc );
                
                imagecopyresized(
                    $img,
                    $tile,

                    $paintX + $thumbX,
                    $paintY + $thumbY,

                    0, 0,

                    $thumbW,
                    $thumbH,

                    $oWidth,
                    $oHeight
                );

                imagedestroy( $tile );
                
                $out[ 'objects' ][] = [
                    'id' => $object->id,
                    'name' => $object->name,
                    'cols' => $object->cols,
                    'rows' => $object->rows,
                    'width' => $object->width,
                    'height' => $object->height,
                    'type' => $object->objectType,
                    'caption' => $object->caption,
                    'keywords' => $object->keywords,
                    'objectClass' => $object->objectClass,
                    'dynamics' => $object->dynamics
                ];
                
                $id++;
                
                $paintX += $tileWidth;
                
                if ( $id % $sprWidth == 0 ) {
                    $paintX = 0;
                    $paintY += $tileHeight;
                }
            }
            
            $out[ 'sprite' ] = gdtobuffer( $img );
            
            return $out;
            
        }
        
    }

?>