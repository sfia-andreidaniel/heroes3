<?php

    class Resources_Resource extends BaseClass {
    
        private $_parent = NULL;
        
        public function __construct( Resources $res, $properties ) {    
        
            $this->_parent = $res;
            $this->_properties = $properties;
        
        }
        
        private function __toJSON() {
            
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