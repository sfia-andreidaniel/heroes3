<?php
    
    class Artifacts_Artifact extends BaseClass {
        
        private $_collection = NULL;
        
        public function __construct( Artifacts $collection, $properties ) {
            
            $this->_collection = $collection;
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