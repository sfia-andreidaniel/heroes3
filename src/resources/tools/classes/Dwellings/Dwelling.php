<?php
    
    class Dwellings_Dwelling extends BaseClass {
        
        private $_parent = NULL;
        
        public function __construct( Dwellings $dwl, $config ) {
            $this->_parent = $dwl;
            $this->_properties = $config;
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