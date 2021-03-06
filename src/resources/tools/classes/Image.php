<?php
    
    require_once __DIR__ . '/../lib/gd.php';
    
    class Image extends BaseClass {
        
        public $_img = NULL;
        private $_updater = NULL;
        
        public function __construct( $dataURI, $numFrames, $transparentColor = NULL, $updater = NULL ) {
            
            $this->_img = $dataURI
                ? imagecreatefromdatauri( $dataURI )
                : NULL;
            
            $this->_img = is_resource( $this->_img )
                ? $this->_img
                : NULL;
            
            $this->_properties[ 'frames' ]      = $numFrames;
            $this->_properties[ 'transparentColor' ] = $transparentColor;
            
            $this->_updater = $updater;
            
            $this->_update();
        }
        
        private function _update() {
            if ( is_resource( $this->_img ) ) {
                
                $this->_properties[ 'width' ]       = imagesx( $this->_img );
                $this->_properties[ 'height']       = imagesy( $this->_img );
                $this->_properties[ 'frameWidth' ]  = $this->_properties[ 'width' ] / $this->_properties[ 'frames' ];
                $this->_properties[ 'frameHeight' ] = $this->_properties[ 'height' ];
                
            } else {
                
                $this->_properties[ 'width' ] = 0;
                $this->_properties[ 'height' ] = 0;
                $this->_properties[ 'frameWidth' ] = 0;
                $this->_properties[ 'frameHeight' ] = 0;
                
            }
        }
        
        private function _setAlpha() {
            
            if ( !$this->_properties[ 'transparentColor' ] || !is_resource( $this->_img ) )
                return;
            
            $color = imagecolorexact( $this->_img, 
                $this->_properties[ 'transparentColor' ][ 'r' ],
                $this->_properties[ 'transparentColor' ][ 'g' ],
                $this->_properties[ 'transparentColor' ][ 'b' ]
            );
            
            imagecolortransparent( $this->_img, $color );
            
        }
        
        public function trim( $direction, $much ) {
            
            if ( !$this->_img ) {
                return FALSE;
            }
                
            if ( $this->_properties[ 'frames' ] == 1 || in_array( $direction, [ 'top', 'bottom' ] ) ) {
            
                switch ( $direction ) {
                    
                    case 'left':
                        $this->_img = image_shift_left( $this->_img, $much, $this->transparentColor );
                        $this->_update();
                        $this->_setAlpha();
                        break;
                    
                    case 'top':
                        $this->_img = image_shift_top( $this->_img, $much, $this->transparentColor );
                        $this->_update();
                        $this->_setAlpha();
                        break;
                    
                    case 'right':
                        $this->_img = image_shift_right( $this->_img, $much, $this->transparentColor );
                        $this->_update();
                        $this->_setAlpha();
                        break;
                    
                    case 'bottom':
                        $this->_img = image_shift_bottom( $this->_img, $much, $this->transparentColor );
                        $this->_update();
                        $this->_setAlpha();
                        break;
                    
                    default:
                        throw new Exception_Game( "Invalid trim direction!" );
                        break;
                }
                
            } else {
                
                //echo "oldimgsize: ", $this->width, " framewidth: $this->frameWidth\n";
                
                $indexes = [];
                
                for ( $i=0; $i<$this->frames; $i++ ) {
                    $indexes[] = $this->frameAt( $i );
                }
                
                foreach ( $indexes as $index ) {
                    
                    $index->trim( $direction, $much );
                    
                }
                
                // rebuild
                
                $img2 = imagecreatetruecolor( count( $indexes ) * ( $this->_properties[ 'frameWidth' ] - $much ), $this->_properties['frameHeight'] );
                
                //echo "newimagesize: ", imagesx( $img2 ), " framewidth: ", imagesx( $img2 ) / $this->frames;
                
                $transparent = $this->_properties[ 'transparentColor' ];
                
                if ( $transparent ) {
                    $color = imagecolorallocate( $img2, $transparent[ 'r' ], $transparent[ 'g' ], $transparent['b'] );
                    imagefilledrectangle( $img2, 0, 0, imagesx( $img2 ), imagesy( $img2 ), $color );
                    imagecolortransparent( $img2, $color );
                }
                
                for ( $i=0, $len = count( $indexes ); $i<$len; $i++ ) {
                    
                    imagecopyresized( 
                        $img2, 
                        $indexes[$i]->getResource(), 
                        
                        ( $this->_properties[ 'frameWidth' ] - $much ) * $i, 0,
                        0, 0, 
                        ( $this->_properties[ 'frameWidth' ] - $much ), $this->_properties[ 'frameHeight' ],
                        $this->_properties['frameWidth'] - $much, $this->_properties[ 'frameHeight' ]
                    );
                    
                }
                
                imagedestroy( $this->_img );
                
                $this->_img = $img2;
                
                $this->_update();
                
                $this->_setAlpha();
            }
            
            if ( $this->_updater !== NULL ) {
                $obj = $this->_updater[ 0 ];
                $obj->{ $this->_updater[1] } = $this->__toString();
            }
        }
        
        public function frameAt( $index ) {
            
            if ( $index < 0 || $index >= $this->_properties[ 'frames' ] ) {
                throw new Exception_Game( "Invalid frame!" );
            }
            
            $transparent = $this->_properties[ 'transparentColor' ];
            
            if ( !is_resource( $this->_img ) )
                return new Image( NULL, 0, $transparent );
            
            $img2 = imagecreatetruecolor( $this->_properties[ 'frameWidth' ], $this->_properties[ 'frameHeight' ] );
            
            if ( $transparent ) {
                $color = imagecolorallocate( $img2, $transparent[ 'r' ], $transparent[ 'g' ], $transparent['b'] );
                imagefilledrectangle( $img2, 0, 0, imagesx( $img2 ), imagesy( $img2 ), $color );
                imagecolortransparent( $img2, $color );
            }
            
            imagecopyresized( $img2, $this->_img, 
                0, 0, 
                $index * $this->_properties['frameWidth'], 0, 
                $this->_properties['frameWidth'], $this->_properties['frameHeight'], 
                $this->_properties[ 'frameWidth' ], $this->_properties[ 'frameHeight' ] );
            
            $result = new Image( gdtobuffer( $img2 ), 1, $transparent );
            
            imagedestroy( $img2 );
            
            return $result;
            
        }
        
        public function getCollisionMatrix( $frameNo, $tileWidth, $tileHeight ) {
            
            if ( !$this->_img )
                return NULL;
            
            if ( $this->frames > 1 )
                return $this->frameAt( $frameNo )->getCollisionMatrix( 0, $tileWidth, $tileHeight );
            else {
                
                return new Image_CollisionMatrix( $this, $tileWidth, $tileHeight );
                
            }
            
        }
        
        public function reduce( $tileWidth, $tileHeight, $fixImageFrameToo = FALSE ) {
            
            if ( !is_resource( $this->_img ) )
                return;
            
            $width = ( $this->frameWidth % $tileWidth ) == 0
                ? $this->frameWidth
                : $this->frameWidth + ( $this->frameWidth % $tileWidth );
            
            $height = ( $this->height % $tileHeight ) == 0
                ? $this->height
                : $this->height + ( $this->height % $tileHeight );
            
            //echo "frameWidth: $width, frameHeight: $height\n";
            
            $cols = $width / $tileWidth;
            $rows = $height / $tileHeight;
            
            $out = [
                'left' => $cols,
                'right' => $cols,
                'top' => $rows,
                'bottom' => $rows
            ];
            
            for ( $i = 0; $i < $this->frames; $i++ ) {
            
                $m = $this->getCollisionMatrix( $i, $tileWidth, $tileHeight )->getTrim();
                
                //echo floor( $i / ( $this->frames / 100 ) ) . '% ';
                
                if ( $m[ 'left' ] < $out[ 'left' ] )
                    $out[ 'left' ] = $m[ 'left' ];
                
                if ( $m[ 'right' ] < $out[ 'right' ] )
                    $out[ 'right' ] = $m[ 'right' ];
                
                if ( $m[ 'top' ] < $out[ 'top' ] )
                    $out[ 'top' ] = $m[ 'top' ];
                
                if ( $m[ 'bottom' ] < $out[ 'bottom' ] )
                    $out[ 'bottom' ] = $m[ 'bottom' ];
            }
            
            //echo "diffX: ", $width - $this->frameWidth, ", diffY: ", $height- $this->frameHeight, "\n";
            
            $trimLeftWidth = $tileWidth * $m[ 'left' ];
            $trimRightWidth = ( $tileWidth * $m[ 'right' ] );
            $trimTopWidth = $tileHeight * $m[ 'top' ];
            $trimBottomWidth = ( $tileHeight * $m[ 'bottom' ] );
            
            //echo "\n";
            
            $reduce = [
                'top' => $trimTopWidth,
                'right' => $trimRightWidth,
                'bottom' => $trimBottomWidth,
                'left' => $trimLeftWidth,
            ];
            
            if ( $reduce[ 'top' ] )
                $this->trim( 'top', $reduce[ 'top' ] );
            
            if ( $reduce[ 'right' ])
                $this->trim( 'right', $reduce[ 'right' ] );
            
            if ( $reduce[ 'bottom' ] )
                $this->trim( 'bottom', $reduce[ 'bottom' ] );
            
            if ( $reduce[ 'left' ] )
                $this->trim( 'left', $reduce[ 'left' ] );
            
            if ( $this->_updater !== NULL ) {
                
                $obj = $this->_updater[ 0 ];
                
                if ( $fixImageFrameToo ) {
                    
                    if ( $reduce[ 'top' ] )
                        $obj->imageFrame->trim( 'top', $reduce[ 'top' ] );
                    
                    if ( $reduce[ 'right' ] )
                        $obj->imageFrame->trim( 'right', $reduce[ 'right' ] );
                    
                    if ( $reduce[ 'bottom' ] )
                        $obj->imageFrame->trim( 'bottom', $reduce[ 'bottom' ] );
                    
                    if ( $reduce ['left'] )
                        $obj->imageFrame->trim( 'left', $reduce ['left'] );
                    
                }
                
                $obj->width = (int)( $width - $reduce[ 'left' ] - $reduce[ 'right' ] );
                $obj->height= (int)( $height- $reduce[ 'top' ] - $reduce[ 'bottom' ] );
                $obj->cols = (int)($obj->width / $tileWidth);
                $obj->rows = (int)($obj->height / $tileHeight);
                
            }
            
        }
        
        public function getResource() {
            return $this->_img;
        }
        
        public function dump() {
            if ( $this->_img ) {
                @header( 'Content-Type: image/png' );
                $this->_setAlpha();
                imagepng( $this->_img );
            }
        }
        
        public function __toString() {
            
            if ( $this->_img === NULL )
                return NULL;
            else
                return gdtobuffer( $this->_img );
            
        }
        
        public function __destruct() {
            
            if ( is_resource( $this->_img ) )
                imagedestroy( $this->_img );
            
        }
        
    }
    
?>