<?php
    
    class Maps_Map_Objects_Object extends BaseClass {
        
        private $_objects = NULL;
        private $_isDirty = FALSE;
        private $_deleted = FALSE;
        
        public function __construct( Maps_Map_Objects $objects, array $properties ) {
            
            $this->_objects = $objects;
            
            $this->_properties = [
                'id'     => isset( $properties[ 'id' ] ) ? $properties[ 'id' ] : NULL,
                'typeId' => $properties[ 'typeId' ]
            ];
            
            $this->_isDirty = $this->_properties[ 'id' ] === NULL;
            
        }
        
        public function save() {
            
            if ( $this->_isDirty === FALSE || $this->_deleted === TRUE )
                return;
            
            if ( $this->_properties[ 'id' ] === NULL ) {
                
                Database( 'main' )->query(
                    "INSERT INTO maps_objects ( map_id, type_id )
                     VALUES ( " . Database::int( $this->_objects->getMapId() ) . ",
                              " . Database::int( $this->_properties[ 'typeId' ] ) . " )" );
                
                $this->_properties[ 'id' ] = (int)mysql_insert_id( Database( 'main' )->conn );
                
            } else {
                
                Database( 'main' )->query(
                    "UPDATE map_objects SET
                        type_id = " . Database::int( $this->_properties[ 'typeId' ] ) . "
                     WHERE id = " . Database::int( $this->_properties[ 'id' ] ) . "
                     LIMIT 1"
                );
                
            }
            
            $this->_isDirty = FALSE;
            
        }
        
        public function delete() {
            
            // Delefe from db if id not null
            
            if ( $this->_properties[ 'id' ] !== NULL ) {
                
                Database( 'main' )->query( "DELETE FROM maps_objects WHERE id = " . Database::int( $this->_properties[ 'id' ] ) . " LIMIT 1" );
                
            }
            
            $this->_deleted = TRUE;
            
        }
        
        private function _toJSON() {
            
            return $this->_properties;
            
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
        
        public function __set( $propertyName, $propertyValue ) {
            
            switch ( $propertyName ) {
                
                case 'typeId':
                    
                    if ( !is_int( $propertyValue ) || $propertyValue < 1 )
                        throw new Exception_Game( "Property typeId should be of type int gte 1" );
                    
                    $this->_properties[ 'typeId' ] = $propertyValue;
                    
                    break;
                
                default:
                    parent::__set( $propertyName, $propertyValue );
                    break;
            }
            
        }
        
    }
    
?>