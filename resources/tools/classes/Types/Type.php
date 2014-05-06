<?php
    
    class Types_Type extends BaseClass {
        
        private $_parentNode = NULL;
        private $_loaded     = FALSE;
        private $_dirty      = FALSE;
        
        public function __construct( Types $collection, $row ) {
            $this->_parentNode = $collection;

            $this->_properties[ 'id' ] = (int)$row['id'];
            $this->_properties[ 'name' ] = $row['name'];
            $this->_properties[ 'caption' ] = $row['caption'];
            $this->_properties[ 'width' ] = (int)$row['width'];
            $this->_properties[ 'height' ] = (int)$row['height'];
            $this->_properties[ 'cols' ] = (int)$row['cols'];
            $this->_properties[ 'rows' ] = (int)$row[ 'rows' ];
            $this->_properties[ 'tileWidth' ] = (int)$row['tileWidth' ];
            $this->_properties[ 'tileHeight' ] = (int)$row['tileHeight' ];
            $this->_properties[ 'frames' ] = (int)$row['frames'];
            $this->_properties[ 'hsx' ] = (int)$row['hsx'];
            $this->_properties[ 'hsy' ] = (int)$row['hsy' ];
            $this->_properties[ 'animated' ] = $row[ 'animated' ] ? TRUE : FALSE;
            $this->_properties[ 'epx' ] = (int)$row['epx'];
            $this->_properties[ 'epy' ] = (int)$row['epy'];
            $this->_properties[ 'objectType' ] = (int)$row['objectType'];
            $this->_properties[ 'collision' ] = json_decode( $row[ 'collision' ], TRUE );
            $this->_properties[ 'animationGroups' ] = json_decode( $row[ 'animationGroups' ], TRUE );
            $this->_properties[ 'keywords' ] = preg_split( '/(([\s]+)?,([\s]+)?)+/', trim( $row['keywords'], ', ' ) );
            $this->_properties[ 'objectClass' ] = strlen( $row['objectClass'] ) ? $row[ 'objectClass' ] : NULL;
        }
        
        public function __get( $propertyName ) {
            
            switch ( $propertyName ) {
            
                case 'toJSON':
                    return $this->_toJSON();
                    break;
                
                case 'imagePixmap':
                    return $this->_pixmap();
                    break;
                
                case 'imageFrame':
                    return $this->_frame();
                    break;
                
                default:
                
                    if ( $this->_loaded || !in_array( $propertyName, [ 'frame', 'pixmap' ] ) )
                        return parent::__get( $propertyName );
                    else {
                
                        $this->_load();
                
                        return parent::__get( $propertyName );
                
                    }
                
                    break;
            }
            
        }
        
        private function _load() {
            
            if ( $this->_loaded )
                return;
            
            $result = Database('main')->query( 
                'SELECT frame,
                        pixmap
                FROM types
                WHERE id = ' . $this->_properties['id'] . ' LIMIT 1' );
            
            if ( !mysql_num_rows( $result ) ) {
                
                throw new Exception_Programming( 'Failed to instantiate object #' . $this->_id . ': not found!' );
                
            }
            
            $row = mysql_fetch_array( $result, MYSQL_ASSOC );
            
            $this->_properties[ 'frame' ] = strlen( $row['frame'] ) ? $row['frame'] : NULL;
            $this->_properties[ 'pixmap' ] = strlen( $row['pixmap'] ) ? $row['pixmap'] : NULL;
            
            $this->_loaded = TRUE;
        }
        
        private function _pixmap() {
        
            return new Image( $this->pixmap, $this->frames, [ 'r' => 0, 'g' => 255, 'b' => 255, 'a' => 0 ], [ $this, 'pixmap' ] );
            
        }
        
        private function _frame() {
            
            return new Image( $this->frame, 1, [ 'r' => 0, 'g' => 255, 'b' => 255, 'a' => 0 ], [ $this, 'frame' ] );
            
        }
        
        public function fix() {
            
            $iWidth = $this->imageFrame->width;
            $iHeight = $this->imageFrame->height;
            
            if ( ( $iWidth % 32 ) != 0 || ( $iHeight % 32 ) != 0 ) {
                
                $addX = 32  - ( $iWidth % 32 );
                $addY = 32 - ( $iHeight % 32 );
                
                if ( $addX > 0 ) {
                
                    $this->imageFrame->trim( 'right', -$addX );
                    
                    if ( $this->imagePixmap->width ) {
                        $this->imagePixmap->trim( 'right', -$addX );
                    }
                    
                    $this->cols = ( $iWidth + $addX ) / 32;
                    
                    $this->width += $addX;
                }
                
                if ( $addY > 0 ) {
                    
                    $this->imageFrame->trim( 'bottom', -$addY );
                    
                    if ( $this->imagePixmap->height ) {
                        $this->imagePixmap->trim( 'bottom', -$addY );
                    }
                    
                    $this->rows = ( $iHeight + $addY ) / 32;
                    
                    $this->height += $addY;
                }
                
                //echo " width = ", $this->width, ", height = ", $this->height, ", cols = ", $this->cols, ", rows = ", $this->rows, ", addX = ", $addX, ", addY = ", $addY, "\n";
            }
            
        }
        
        public function __set( $propertyName, $propertyValue ) {
            
            if ( !in_array( $propertyName, array_keys( $this->_properties ) ) ) {
                throw new Exception_Game( "Illegal property: $propertyName" );
            }
            
            if ( $propertyName == 'id' && $propertyValue !== $this->_properties[ 'id' ] ) {
                throw new Exception( 'Property id is read-only!' );
            }
            
            switch ( $propertyName ) {
                
                case 'name':
                case 'caption':
                    if ( !is_string( $propertyValue ) )
                        throw new Exception_Game( 'Illegal property type! Expected (string)' );
                    
                    break;

                case 'keywords':
                    if ( is_string( $propertyValue ) ) {
                        $propertyValue = preg_split( '/(([\s]+)?,([\s]+)?)+/', trim( $propertyValue, ', ' ) );
                    } else {
                        if ( is_array( $propertyValue ) ) {
                        } else
                        throw new Exception_Game( 'Illegal property type! Expected array[string] or string' );
                    }
                    break;
                
                case 'width':
                case 'height':
                case 'cols':
                case 'rows':
                case 'tileWidth':
                case 'tileHeight':
                case 'frames':
                case 'hsx':
                case 'hsy':
                case 'epx':
                case 'epy':

                case 'objectType':
                    
                    if ( !is_numeric( $propertyValue ) )
                        throw new Exception_Game( 'Illegal property type (property=' . $propertyName . '). Expected (int)!' );
                    
                    break;
                
                case 'objectClass':
                    if ( !is_string( $propertyValue ) || $propertyValue == '' )
                        $propertyValue = NULL;
                    break;
                
                case 'animated':
                    
                    $propertyValue = $propertyValue ? TRUE : FALSE;
                    
                    break;
                
                case 'collision':
                case 'animationGroups':
                    
                    if ( $propertyValue !== NULL && !is_array( $propertyValue ) )
                        throw new Exception_Game( 'Illegal property type. Expected nullable array!' );
                    
                    break;
                
                case 'frame':
                case 'pixmap':
                    
                    if ( $propertyValue !== NULL && !is_string( $propertyValue ) ) {
                        throw new Exception_Game( 'Illegal property type. Expected nullable string!' );
                    }
                    
                    break;
            }
            
            $this->_dirty = TRUE;
            
            $this->_properties[ $propertyName ] = $propertyValue;
            
        }
        
        private function _toJSON() {
            
            $this->_load();
            
            return $this->_properties;
        
        }
        
        public function save() {
            $sql = "UPDATE types SET
                        name            = " . Database::string( $this->name ) . ",
                        caption         = " . Database::string( $this->caption ) . ",
                        keywords        = " . Database::string( implode( ', ', $this->keywords ) ) . ",
                        width           = " . Database::int( $this->width ) . ",
                        height          = " . Database::int( $this->height ) . ",
                        cols            = " . Database::int( $this->cols ) . ",
                        rows            = " . Database::int( $this->rows ) . ",
                        tileWidth       = " . Database::int( $this->tileWidth ) . ",
                        tileHeight      = " . Database::int( $this->tileHeight ) . ",
                        frames          = " . Database::int( $this->frames ) . ",
                        hsx             = " . Database::int( $this->hsx ) . ",
                        hsy             = " . Database::int( $this->hsy ) . ",
                        animated        = " . Database::boolint( $this->animated ) . ",
                        epx             = " . Database::int( $this->epx ) . ",
                        epy             = " . Database::int( $this->epy ) . ",
                        objectType      = " . Database::int( $this->objectType ) . ",
                        objectClass     = " . Database::string( $this->objectClass, TRUE ) . ",
                        collision       = " . Database::json( $this->collision, TRUE ) . ",
                        animationGroups = " . Database::json( $this->animationGroups, TRUE ) . ",
                        frame           = " . Database::string( $this->frame, TRUE ) . ",
                        pixmap          = " . Database::string( $this->pixmap, TRUE ) . "
                    WHERE id = " . $this->id . " LIMIT 1";
            
            Database('main')->query( $sql );

            $this->_dirty = FALSE;
        }
        
        public function __destruct() {
            
            if ( !$this->_dirty )
                return;
            
            $this->save();
            
        }
        
    }
    
?>