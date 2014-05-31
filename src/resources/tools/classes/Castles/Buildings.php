<?php
    
    class Castles_Buildings extends BaseClass {
        
        static $_all = NULL;
        
        public function __construct() {
            
            if ( self::$_all === NULL )
                self::initialize();
            
            foreach ( array_keys( self::$_all ) as $castleTypeId ) {
                
                $this->_properties[] = new Castles_Buildings_Town(
                    $this,
                    (int)$castleTypeId,
                    self::$_all[ $castleTypeId ]
                );
                
            }
            
        }
        
        public static function initialize() {
            $all = [];
            
            $result = Database( 'main' )->query(
                "
                    SELECT castles_buildings.id               AS id,
                           castles_buildings.castle_type_id   AS castleTypeId,
                           castle_types.name                 AS castleTypeName,
                           castles_buildings.name             AS name,
                           castles_buildings.description      AS description,
                           castles_buildings.building_type    AS buildingType,
                           castles_buildings.costs            AS costs,
                           castles_buildings.requirements     AS requirements,
                           castles_buildings.dwelling_type_id AS dwellingTypeId
                    FROM castles_buildings
                    LEFT JOIN castle_types
                         ON castle_types.id = castles_buildings.castle_type_id
                    ORDER BY castles_buildings.castle_type_id
                "
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row['id'];
                $row[ 'castleTypeId' ] = (int)$row[ 'castleTypeId' ];
                $row[ 'costs' ] = json_decode( $row[ 'costs' ], TRUE );
                
                if ( !is_array( $row[ 'costs' ] ) )
                    throw new Exception( "Failed to decode as JSON the row.costs with id #row[id]" );
                
                // validate row.costs keys
                foreach ( array_keys( $row[ 'costs' ] ) as $resourceName ) {
                    if ( !in_array( $resourceName, [ 'gold', 'wood', 'ore', 'mithril', 'sulfur', 'mercury', 'crystals', 'gems' ] ) )
                        throw new Exception( "Invalid resource: $resourceName detected in row#$row[id] costs" );
                }
                
                $row[ 'requirements' ] = json_decode( $row[ 'requirements' ], TRUE );
                
                foreach ( $row[ 'requirements' ] as $requirement ) {
                    if ( !is_int( $requirement ) )
                        throw new Exception( "Invalid requirement met @ row#$row[id]: not int!" );
                }
                
                $row[ 'dwellingTypeId' ] = preg_match( '/^dwelling.[1-7][a-b]$/', $row[ 'buildingType' ] )
                    ? (int)$row[ 'dwellingTypeId' ]
                    : NULL;
                
                if ( $row[ 'dwellingTypeId' ] !== NULL ) {
                    if ( $row[ 'dwellingTypeId' ] <= 0 )
                        throw new Exception( "Invalid dwelling type id detected @ row # $row[id]" );
                }
                
                $all[] = $row;
            }
            
            /* Pass 2. Test if buildings requirements are met */
            foreach ( $all as $row ) {
                
                foreach( $row[ 'requirements' ] as $requirementId ) {
                    
                    $isFound = FALSE;
                    
                    for ( $i=0, $len = count( $all ); $i<$len; $i++ ) {
                        
                        if ( $all[ $i ][ 'id' ] == $requirementId ) {
                            
                            if ( $all[ $i ][ 'castleTypeId' ] != $row[ 'castleTypeId' ] )
                                throw new Exception("Error: row $row[id] is requiring a building from another castle!" );
                            
                            $isFound = TRUE;
                            break;
                            
                        }
                        
                    }
                    
                    if ( $isFound === FALSE )
                        throw new Exception( "Error: row#$row[id] has a requirement ( $requirementId ) which is not met!" );
                    
                    if ( $requirementId == $row[ 'id' ] )
                        throw new Exception( "Error: row$row[id] is required by itself!" );
                    
                }
                
            }
            
            self::$_all = [];
            
            foreach ( $all as $row ) {
                
                self::$_all[ $row[ 'castleTypeId' ] ] = isset( self::$_all[ $row['castleTypeId'] ] )
                    ? self::$_all[ $row[ 'castleTypeId' ] ]
                    : [];
                
                self::$_all[ $row[ 'castleTypeId' ] ][] = $row;
                
            }
        }
        
        private function __toJSON() {
            
            $out = [];
            
            foreach ( $this->_properties as $castle ) {
                $out[] = $castle->toJSON;
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