<?php
    
    class Heroes extends BaseClass {
        
        public function __construct() {
            
            $result = Database( 'main' )->query(
                "SELECT heroes.id                AS id,
                        heroes.name              AS name,
                        heroes.sex               AS sex,
                        heroes.race              AS race,
                        heroes.icon              AS icon,
                        heroes_types.id          AS typeId,
                        heroes_types.name        AS typeName,
                        heroes_types.castle_type AS castleTypeId
                 FROM heroes
                 LEFT JOIN heroes_types ON heroes.type = heroes_types.id"
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row['id'];
                $row[ 'typeId' ] = (int)$row['typeId' ];
                $row[ 'castleTypeId' ] = (int)$row[ 'castleTypeId' ];
                
                $this->_properties[] = new Heroes_Hero( $this, $row );
            }
        }
        
        private function _toJSON() {
            
            $out = [];
            
            foreach ( $this->_properties as $hero )
                $out[] = $hero->toJSON;
            
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