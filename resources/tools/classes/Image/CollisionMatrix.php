<?php
    
    class Image_CollisionMatrix extends BaseClass {
        
        private $_img = NULL;
        private $_tileWidth = NULL;
        private $_tileHeight = NULL;
        
        private $_cols = 0;
        private $_rows = 0;
        
        public function __construct( Image $img, $tileWidth, $tileHeight ) {
            $this->_img = $img;
            $this->_tileWidth = $tileWidth;
            $this->_tileHeight = $tileHeight;
            
            $this->_rows = floor( $img->height / $tileHeight ); //+ ( (  $img->height % $tileHeight ) > 0 ) ? 1 : 0;
            
            if ( $img->height % $tileHeight > 0 )
                $this->_rows++;
            
            $this->_cols = floor( $img->width / $tileWidth ); // + ( ( $img->width % $tileWidth ) > 0 ) ? 1 : 0;
            
            if ( $img->width % $tileWidth > 0 )
                $this->_cols++;
            
            for ( $y = 0; $y < $this->_rows; $y++ ) {
                
                $row = [];
                
                for ( $x = 0; $x < $this->_cols; $x++ ) {
                    $row[] = FALSE;
                }
                
                $this->_properties[] = $row;
            }
            
            $this->_compute();
        }
        
        private function _compute() {
            
            if ( !( $cmp = $this->_img->transparentColor ) ) {
                return;
            }
            
            $res = $this->_img->getResource();
            
            if ( !$res )
                return;
            
            $mx = imagesx( $res );
            $my = imagesy( $res );
            
            for ( $row = 0, $rows = count( $this->_properties ); $row < $rows; $row++ ) {
                
                for ( $col = 0, $cols = count( $this->_properties[ $row ] ); $col < $cols; $col++ ) {
                    
                    for ( $x = 0; $x < $this->_tileWidth; $x++ ) {
                        
                        for ( $y = 0; $y < $this->_tileHeight; $y++ ) {
                            
                            $px = $col * $this->_tileWidth + $x;
                            $py = $row * $this->_tileHeight + $y;
                            
                            if ( $px >= $mx || $py >= $my )
                                continue;
                            
                            $pixel = imagepixelat( $res, $px, $py );
                            
                            if ( $pixel[ 'r' ] != $cmp[ 'r' ] || $pixel['g'] != $cmp[ 'g' ] || $pixel[ 'b' ] != $cmp[ 'b' ] ) {
                                
                                $this->_properties[ $row ][ $col ] = TRUE;
                                
                                break 2;
                                
                            }
                            
                        }
                        
                    }
                    
                }
                
            }
            
        }
        
        public function getTrimLeft() {
            
            $inc = 0;
            
            for ( $col = 0; $col < $this->_cols; $col++ ) {
                
                for ( $row = 0; $row < $this->_rows; $row++ ) {
                    
                    if ( $this->_properties[ $row ][ $col ] === TRUE ) {
                        
                        return $inc;
                    }
                    
                }
                
                $inc++;
                
            }
            
            return $inc;
        }
        
        public function getTrimRight() {
            
            $inc = 0;
            
            for ( $col = $this->_cols - 1; $col >= 0; $col-- ) {
                
                for ( $row = 0; $row < $this->_rows; $row++ ) {
                    
                    if ( $this->_properties[ $row ][ $col ] === TRUE ) {
                        
                        return $inc;
                        
                    }
                    
                }
                
                $inc++;
                
            }
            
            return $inc;
            
        }
        
        public function getTrimTop() {
            
            $inc = 0;
            
            for ( $row = 0; $row < $this->_rows; $row++ ) {
                
                for ( $col = 0; $col < $this->_cols; $col++ ) {
                    
                    if ( $this->_properties[ $row ][ $col ] === TRUE ) {
                    
                        return $inc;
                    
                    }
                }
                
                $inc++;
                
            }
            
            return $inc;
        }
        
        public function getTrimBottom() {
            
            $inc = 0;
            
            for ( $row = $this->_rows - 1; $row >= 0; $row-- ) {
                
                for ( $col = 0; $col < $this->_cols; $col++ ) {
                    
                    if ( $this->_properties[ $row ][ $col ] === TRUE ) {
                        
                        return $inc;
                        
                    }
                    
                }
                
                $inc++;
                
            }
            
            return $inc;
            
        }
        
        public function getTrim() {
            
            $trim = [
                'top' => $this->getTrimTop(),
                'bottom' => $this->getTrimBottom(),
                'left' => $this->getTrimLeft(),
                'right' => $this->getTrimRight()
            ];
            
            if ( $trim[ 'top' ] + $trim[ 'bottom' ] > $this->_rows )
                $trim[ 'bottom' ] = $this->_rows - $trim[ 'top' ];
            
            if ( $trim[ 'left' ] + $trim[ 'right' ] > $this->_cols )
                $trim[ 'right' ] = $this->_cols - $trim[ 'left' ];
            
            return $trim;
            
        }
        
        public function __get( $propertyName ) {
            
            switch ( $propertyName ) {
                case 'toJSON':
                    return $this->_properties;
                    break;
                
                default:
                    return self::__get( $propertyName );
                    break;
            }
            
        }
    }
    
?>