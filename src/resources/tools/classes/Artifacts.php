<?php
    
    class Artifacts extends BaseClass {
        
        public function __construct() {
            
            $result = Database( 'main' )->query(
                "SELECT id,
                        name,
                        enabled,
                        slot,
                        rank,
                        object_type_id AS objectTypeId
                 FROM artifacts
                 ORDER BY id"
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row['id'];
                $row[ 'enabled' ] = (int)$row['enabled'] == 1 ? TRUE : FALSE;
                $row[ 'objectTypeId' ] = (int)$row[ 'objectTypeId' ];
                
                $this->_properties[] = new Artifacts_Artifact( $this, $row );
            }
            
        }
        
        private function __toJSON() {
            
            $out = [];
            
            foreach ( $this->_properties as $artifact ) {
                $out[] = $artifact->toJSON;
            }
            
            return $out;
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