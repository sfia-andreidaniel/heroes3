<?php
    
    class Maps_Map extends BaseClass {
        
        private $_maps      = NULL;
        private $_loaded    = FALSE;
        private $_numLayers = 0;
        private $_isDirty   = FALSE;
        
        public function __construct( Maps &$collection, $data ) {
            
            $this->_maps = $collection;
            
            $this->_properties = [
                'id' => $data['id'],
                'name' => $data['name'],
                'width' => $data['width'],
                'height' => $data['height'],
                'type' => $data['type'],
                'layers' => NULL
            ];
            
            $this->_numLayers = $data['numLayers'];
            
        }
        
        public function loadFromFile( $filePath ) {
            
            if ( !file_exists( $filePath ) ) 
                throw new Exception_Game( "File $filePath doesn't exist!");
            
            $data = @file_get_contents( $filePath );
            
            if ( !is_string( $data ) || !strlen( $data ) )
                throw new Exception_Game( "Failed to read file: '$filePath'" );
            
            $data = @json_decode( $data, TRUE );
            
            if ( !is_array( $data ) )
                throw new Exception_Game("Uninterpretable file: '$filePath'" );
            
            foreach ( [ 'width', 'height', 'layers' ] as $property ) {
                
                if ( !isset( $data[ $property ] ) )
                    throw new Exception_Game( "Property '$property' doesn't exist in file '$filePath'!" );
            }
            
            $this->width  = $data['width'];
            $this->height = $data['height'];
            $this->type   = isset( $data['type'] ) && is_int( $data['type'] )
                ? $data['type']
                : 0;
            
            $this->_properties[ 'layers' ] = is_array( $data['layers'] )
                ? $data['layers']
                : [];
            
            $this->_numLayers = count( $data['layers'] );
            
            $this->_properties['id'] = isset( $data['id'] ) && is_int( $data['id'] )
                ? $data['id']
                : 0;
            
            $this->name = isset( $data['name'] ) && is_string( $data['name'] )
                ? $data['name']
                : 'map loaded on ' . time();
            
            $this->_isDirty = TRUE;
            $this->_loaded = TRUE;

        }
        
        public function loadFromObject( $data ) {
            
            if ( !is_array( $data ) )
                throw new Exception_Game( "1st argument not array!" );
            
            if ( !isset( $data['width'] ) || !is_int( $data['width'] ) )
                throw new Exception_Game( "Which data.width?" );
            
            if ( !isset( $data['height'] ) || !is_int( $data['height'] ) )
                throw new Exception_Game( "Which data.height?" );
            
            if ( !isset( $data['name'] ) || !is_string( $data['name'] ) || !strlen( $data['name'] ) )
                throw new Exception_Game( "Which data.name?" );
            
            if ( !isset( $data['layers'] ) || !is_array( $data['layers'] ) )
                throw new Exception_Game( "data.layers not array or not set!" );
            
            if ( !isset( $data['type'] ) || !is_int( $data['type'] ) || $data['type'] < 0 )
                $data['type'] = 0;
            
            $this->_properties[ 'type' ] = $data['type'];
            $this->_properties[ 'width'] = $data['width'];
            $this->_properties[ 'height' ] = $data['height'];
            $this->_properties[ 'name' ] = $data['name'];
            $this->_properties[ 'layers' ] = $data['layers'];
            
            $this->_numLayers = count( $data['layers'] );
            
            $this->_isDirty = TRUE;
            $this->_loaded = TRUE;
        }
        
        private function _load() {
            
            if ( $this->_loaded )
                return;
            
            if ( $this->_numLayers > 0 && $this->_properties['id'] > 0 ) {
                
                $result = Database('main')->query( 
                    "SELECT layer_0, layer_1, layer_2, layer_3, layer_4, layer_5, layer_6, layer_7, layer_8, layer_9 FROM maps WHERE id=" . $this->id . " LIMIT 1"
                );
                
                if ( !mysql_num_rows( $result ) )
                    throw new Exception_Game( 'Map ' . $this->name . ' was not found in database!' );
                
                $row = mysql_fetch_array( $result, MYSQL_ASSOC );
                
                $this->_properties[ 'layers' ] = [];
                
                for ( $i=0; $i<$this->_numLayers; $i++ ) {
                    
                    $this->_properties[ 'layers' ][] = json_decode( $row[ 'layer_' . $i ], TRUE );
                    
                }
                
            } else {
                
                $this->_properties[ 'layers' ] = [];
                $this->_numLayers = 0;
                
            }
            
            $this->_loaded = TRUE;
            
        }
        
        public function __set( $propertyName, $propertyValue ) {
            
            switch ( $propertyName ) {
                
                case 'id':
                    throw new Exception_Game( 'The id property of a map is read-only!' );
                    break;
                
                case 'width':
                case 'height':
                case 'type':
                    $this->_properties[ $propertyName ] = (int)$propertyValue;
                    break;
                
                case 'name':
                    $this->_properties[ 'name' ] = "$propertyValue";
                    break;
                
                case 'layers':
                    
                    throw new Exception_Game( "use setLayerData method instead!" );
                    
                    break;
                    
                
                default:
                    
                    parent::__set( $propertyName, $propertyValue );
                    
                    break;
                
            }

            $this->_isDirty = TRUE;
            
        }
        
        public function __get( $propertyName ) {
            
            switch ( $propertyName ) {
                
                case 'layers':

                    if ( !$this->_loaded )
                        $this->_load();

                    return $this->_properties[ 'layers' ];

                    break;

                case 'toJSON':
                    
                    return $this->_toJSON();
                    
                    break;

                default:

                    return parent::__get( $propertyName );

                    break;
                
            }
            
        }
        
        public function setLayerData( $layerIndex, $layerData ) {
            
            if ( $layerIndex < 0 )
                throw new Exception_Game( 'Invalid layer index!' );
            
            $this->_isDirty = TRUE;
            
            if ( !$this->_loaded )
                $this->_load();
            
            $li = $layerIndex;
            
            while ( $this->_numLayers <= $layerIndex ) {
                $this->_numLayers++;
                $this->_properties[ 'layers' ][] = NULL;
            }
            
            $this->_properties[ 'layers' ][ $layerIndex ] = $layerData;
        }
        
        public function save() {
            if ( !$this->_isDirty )
                return;
            
            if ( $this->_properties[ 'id' ] > 0 ) {
                
                $sql = [ "UPDATE maps SET
                            name = " . Database::string( $this->_properties['name'] ) . ",
                            width= " . Database::int( $this->_properties['width'] ) . ",
                            height=" . Database::int( $this->_properties['height'] ) . ",
                            num_layers = " . Database::int( $this->_numLayers ) . ",
                         " ];
                
                for ( $i=1; $i<=10; $i++ ) {
                    
                    $sql[] = "layer_" . ( $i - 1 ) ." = " . Database::string( $i <= $this->_numLayers ? json_encode( $this->_properties['layers'][ $i - 1 ] ) : NULL ) . ', ';
                    
                }
                
                $sql[] = " type = " . Database::int( $this->_properties['type'] ) . "
                            WHERE id = $this->id
                            LIMIT 1";
                
                $sql = implode( "\n", $sql );
                
                Database('main')->query( $sql );
                
            } else {
                
                $sql = [ "INSERT INTO maps (
                            name,
                            width,
                            height,
                            type,
                            num_layers,
                            layer_0,
                            layer_1,
                            layer_2,
                            layer_3,
                            layer_4,
                            layer_5,
                            layer_6,
                            layer_7,
                            layer_8,
                            layer_9
                        ) VALUES (
                            " . Database::string( $this->_properties['name'] ) . ",
                            " . Database::int   ( $this->_properties[ 'width' ] ) . ",
                            " . Database::int   ( $this->_properties[ 'height' ] ) . ",
                            " . Database::int   ( $this->_properties[ 'type' ] ) . ",
                            " . Database::int   ( $this->_numLayers ) . "
                        " ];
                
                for ( $i = 0; $i < 10; $i++ ) {
                    
                    $sql[] = ", " . Database::string( $i < $this->_numLayers ? json_encode( $this->_properties['layers'][$i] ) : NULL, TRUE );
                    
                }
                
                $sql = implode( "\n", $sql ) . ")";
                
                $result = Database('main')->query( $sql );
                
                $this->_properties[ 'id' ] = mysql_insert_id( Database('main')->conn );
                
            }
        }
        
        private function _toJSON() {
            
            if ( !$this->_loaded )
                $this->_load();
            
            return $this->_properties;
        }
        
        public function __destruct() {
            
            if ( $this->_isDirty )
                $this->save();
            
        }
        
    }
    
?>