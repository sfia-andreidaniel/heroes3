<?php
    
    class Castles extends BaseClass {
        
        public function __construct() {
            
            $buildings = new Castles_Buildings();
            
            $result = Database( 'main' )->query( "
                SELECT id,
                       name,
                       castle_type_id as castleTypeId,
                       object_type_id AS objectTypeId,
                       has_fort AS hasFort,
                       upgrades_to_castle_id AS upgradesToCastleId
                FROM castles
                ORDER BY castle_type_id ASC,
                         upgrades_to_castle_id DESC"
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row[ 'id' ];
                $row[ 'castleTypeId' ] = (int)$row[ 'castleTypeId' ];
                $row[ 'objectTypeId' ] = (int)$row[ 'objectTypeId' ];
                $row[ 'hasFort' ] = (int)$row[ 'hasFort' ] ? TRUE : FALSE;
                $row[ 'upgradesToCastleId' ] = (int)$row[ 'upgradesToCastleId' ]
                    ? (int)$row[ 'upgradesToCastleId' ]
                    : NULL;
                
                $row[ 'buildings' ] = $buildings->getElementById( $row[ 'castleTypeId' ] )->toJSON;
                
                if ( $row[ 'hasFort' ] ) {
                    
                    $row[ 'buildings' ][ 'fort' ][ 0 ][ 'built' ] = TRUE;
                    
                }
                
                $this->_properties[] = new Castles_Castle( $this, $row );
                
            }
            
        }
        
        private function __toJSON() {
            
            $out = [];
            
            foreach ( $this->_properties as $castle )
                $out[] = $castle->toJSON;
            
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