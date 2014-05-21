<?php

    class Heroes_Hero extends BaseClass {
        
        private $_root = NULL;
        
        public function __construct( Heroes $root, $properties ) {
            
            $this->_root = $root;
            $this->_properties = $properties;
            
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
        
    }