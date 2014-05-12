<?php
    
    class Maps_Map_Objects_Object extends BaseClass {
        
        private $_map           = NULL;
        private $_mapLayerIndex = NULL;
        private $_objectIndex   = NULL;
        
        private $_id            = NULL;
        
        private $_deleted       = FALSE;
        
        public function __construct( $map, $mapLayerIndex, $objectIndex, $objectId ) {
            $this->_map = $map;
            $this->_mapLayerIndex = $mapLayerIndex;
            $this->_objectIndex = $objectIndex;
            
            $this->_id = $objectId;
        }
        
        public function delete() {
            $this->_deleted = TRUE;
            $this->_map->_layers[ $this->_mapLayerIndex ][ 'data' ][ $this->_objectIndex ] = NULL;
            $this->_map->_setDirty();
        }
        
        public function toJSON() {
            
            if ( $this->_deleted )
                return NULL;
            
            return $this->_map->_layers[ $this->_mapLayerIndex ][ 'data' ][ $this->_objectIndex ];
        }
        
        public function __get( $propertyName ) {
            
            if ( $propertyName == 'id' )
                return $this->_id;
            else {
            
                if ( $this->_deleted )
                    return NULL;
                
                if ( isset(  $this->_map->_layers[ $this->_mapLayerIndex ][ 'objects' ][ $this->_objectIndex ][ $propertyName ] ) )
                    return $this->_map->_layers[ $this->_mapLayerIndex ][ 'objects' ][ $this->_objectIndex ][ $propertyName ];
                else return NULL;
            
            }
            
            
            
        }
        
        public function __set( $propertyName, $propertyValue ) {
        
            if ( $propertyName == 'id' ) {
                throw new Exception_Game( "Property id is read-only!" );
            } else {
        
                if ( $this->_deleted ) {
                    throw new Exception_Game( "Attempted to set a property on a deleted object!" );
                }
            
                $this->_map->_layers[ $this->_mapLayerIndex ][ 'objects' ][ $this->_objectIndex ][ $propertyName ] = $propertyValue;
                $this->_map->_setDirty();
            
            }
        }
        
    }
    
?>