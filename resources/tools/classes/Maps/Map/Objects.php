<?php
    
    class Maps_Map_Objects extends BaseClass {
        
        public  $_map = NULL;
        
        public function __construct( Maps_Map $map ) {
            
            $this->_map = $map;
            
            for ( $l = 2; $l <= 4; $l++ ) {
                
                if ( is_array( $map->layers[ $k ][ 'objects' ] ) ) {
                    
                    for ( $i = 0, $len = count( $map->layers[ $l ][ 'objects' ] ); $i<$len; $i++ ) {
                        
                        if ( is_array( $map->layers[ $l ][ 'objects' ][ $i ] ) ) {
                            
                            $this->_properties[] = new Maps_Map_Objects_Object( $map, $l, $i, $map->_layers[ $l ][ 'objects' ][ $i ][ 'id' ] );
                            
                        }
                        
                    }
                    
                }
                
            }
            
        }
        
        
        private function _toJSON() {
            
            $out = [];
            
            foreach ( $this->_properties as $property ) {
                $out[] = $property->toJSON();
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
        
    }
    
    
?>