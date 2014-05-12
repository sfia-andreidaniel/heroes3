<?php
    
    class Maps_Map_Objects extends BaseClass {
        
        public  $_map = NULL;
        
        public function __construct( Maps_Map $map ) {
            
            $this->_map = $map;
            
            $index = 0;
            
            if ( is_array( $map->layers[2]['objects'] ) ) {
                
                for ( $i=0, $len = count( $map->layers[2][ 'objects' ] ); $i < $len; $i++ ) {
                    
                    if ( is_array( $map->_layers[2]['objects'][ $i ] ) ) {
                        
                        $this->_properties[] = new Maps_Map_Objects_Object( $map, 2, $i, $index );
                        
                        $index++;
                        
                    }
                    
                }
                
            }

            if ( is_array( $map->layers[3]['objects'] ) ) {
                
                for ( $i=0, $len = count( $map->layers[3][ 'objects' ] ); $i < $len; $i++ ) {
                    
                    if ( is_array( $map->_layers[3]['objects'][ $i ] ) ) {
                        
                        $this->_properties[] = new Maps_Map_Objects_Object( $map, 3, $i, $map->_layers[3]['objects'][ $i ][ 'id' ] );
                        
                        $index++;
                        
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