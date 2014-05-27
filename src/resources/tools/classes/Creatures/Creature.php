<?php
    
    class Creatures_Creature extends BaseClass {
        
        private $_parent = NULL;
        
        public function __construct( Creatures $parent, $config ) {
            
            $this->_properties = $config;
            $this->_parent = $parent;
            
        }
        
        private function __toJSON( ) {
            return $this->_properties;
        }
        
        public function __get( $propertyName ) {
            
            switch ( $propertyName ) {
                
                case 'toJSON':
                    return $this->__toJSON();
                    break;
                
                default:
                    return parent::__get( $propertyName );
                    break;
                
            }
            
        }
    }
    
?>