<?php
    
    class Resources extends BaseClass {
        public function __construct() {
            $result = Database( 'main' )->query(
                'SELECT id, name, resource_type as resourceType, object_type_id AS objectTypeId FROM resources ORDER BY id'
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row[ 'id' ];
                $row[ 'objectTypeId' ] = (int)$row[ 'objectTypeId' ];
                
                $this->_properties[] = new Resources_Resource( $this, $row );
                
            }
        }
        
        public function __toJSON() {
            $out = [];
            for ( $i=0, $len = count( $this->_properties ); $i<$len; $i++ )
                $out[] = $this->_properties[ $i ]->toJSON;
            
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