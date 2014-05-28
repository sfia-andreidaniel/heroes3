<?php
    
    class Mines extends BaseClass {
        
        public function __construct( ) {
            
            $result = Database( 'main' )->query(
                "
                    SELECT id AS id,
                           name AS name,
                           resource_type AS resourceType,
                           object_type_id AS objectTypeId
                    FROM mines
                    ORDER BY resource_type, id
                
                "
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row[ 'id' ];
                $row[ 'objectTypeId' ] = (int)$row[ 'objectTypeId' ];
                
                $this->_properties[] = new Mines_Mine( $this, $row );
                
            }
            
        }
        
        private function __toJSON() {
            
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