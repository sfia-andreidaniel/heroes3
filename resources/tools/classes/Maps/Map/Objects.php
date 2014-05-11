<?php
    
    class Maps_Map_Objects extends BaseClass {
        
        private $_map = NULL;
        private $_isDirty = FALSE;
        
        public function __construct( Maps_Map $map ) {
            
            $this->_map = $map;
            
            if ( $map->id ) {
                
                $result = Database('main')->query( 
                    "SELECT id, type_id 
                     FROM maps_objects
                     WHERE map_id = $map->id"
                );
                
                while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) )
                    $this->_properties[] = new Maps_Map_Objects_Object( $this, [
                        'id' => (int)$row['id'],
                        'typeId' => (int)$row['type_id']
                    ] );
                
            }
            
        }
        
        public function create( $objectTypeId ) {
            
            if ( $this->_map->id === NULL )
                throw new Exception_Game( "Cannot create a map object on unsaved maps!" );
            
            $this->_properties[] = ( $ret = new Maps_Map_Objects_Object( $this, [
                
                'id' => NULL,
                'typeId' => $objectTypeId
                
            ] ) );
            
            $this->_isDirty = TRUE;
            
            return $ret;
        }
        
        public function getMapId() {
            $id = $this->_map->id;
            
            if ( $id === NULL )
                throw new Exception_Game( "Cannot return mapId, map is not saved (yet)" );
            
            return $id;
        }
        
        public function save() {
            
            if ( $this->_isDirty ) {
                
                foreach ( $this->_properties as $object )
                    $object->save();
                
                $this->_isDirty = FALSE;
            }
            
        }
        
        private function _toJSON() {
            
            $out = [];
            
            foreach ( $this->_properties as $property ) {
                $out[] = $property->toJSON;
            }
            
            return $out;
            
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
        
        public function __destruct() {
        
            $this->save();
        
        }
    }
    
    
?>