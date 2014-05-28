<?php
    
    class Dwellings extends BaseClass {
        
        public function __construct( ) {
            
            $result = Database( 'main' )->query( "
                SELECT dwellings.id                     AS id,
                        dwellings.l1_name               AS l1Name,
                        dwellings.l2_name               AS l2Name,
                        dwellings.object_type_id        AS objectTypeId,
                        dwellings.castle_type_id        AS castleTypeId,
                        castle_types.name               AS castleTypeName,
                        dwellings.l1_creature_type_id   AS l1CreatureTypeId,
                        dwellings.l2_creature_type_id   AS l2CreatureTypeId,
                        dwellings.max_upgrade_levels    AS maxUpgradeLevels,
                        dwellings.dwelling_level        AS level,
                        dwellings.weekly_growth         AS growth
                
                FROM dwellings
                
                LEFT JOIN castle_types ON castle_types.id = dwellings.castle_type_id

                ORDER BY dwellings.castle_type_id ASC,
                         dwellings.dwelling_level ASC,
                         dwellings.max_upgrade_levels DESC" 
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row[ 'id' ];
                $row[ 'objectTypeId' ] = (int)$row[ 'objectTypeId' ];
                $row[ 'castleTypeId' ] = (int)$row[ 'castleTypeId' ];
                $row[ 'l1CreatureTypeId' ] = (int)$row[ 'l1CreatureTypeId' ];
                $row[ 'l2CreatureTypeId' ] = (int)$row[ 'l2CreatureTypeId' ];
                $row[ 'maxUpgradeLevels' ] = (int)$row[ 'maxUpgradeLevels' ];
                $row[ 'level' ]= (int)$row[ 'level' ];
                $row[ 'growth' ] = (int)$row[ 'growth' ];
                
                $row2 = [
                    'id' => $row[ 'id' ],
                    'levels' => [],
                    'objectTypeId' => $row[ 'objectTypeId' ],
                    'castleTypeId' => $row[ 'castleTypeId' ],
                    'castleTypeName' => $row[ 'castleTypeName' ],
                    'maxUpgradeLevel' => $row[ 'maxUpgradeLevels' ],
                    'dwellingLevel' => $row[ 'level' ],
                    'growth' => $row[ 'growth' ]
                ];
                
                switch ( $row[ 'maxUpgradeLevels' ] ) {
                    
                    case 1:
                        $row2[ 'levels' ][] = [
                            'name' => $row[ 'l1Name' ],
                            'creatureTypesIds' => [ $row[ 'l1CreatureTypeId' ] ]
                        ];
                        break;
                    
                    case 2:
                        $row2[ 'levels' ][] = [
                            'name' => $row[ 'l1Name' ],
                            'creatureTypesIds' => [ $row[ 'l1CreatureTypeId' ] ]
                        ];
                        $row2[ 'levels' ][] = [
                            'name' => $row[ 'l2Name' ],
                            'creatureTypesIds' => [ $row[ 'l1CreatureTypeId' ], $row[ 'l2CreatureTypeId' ] ]
                        ];
                        break;
                    
                }
                
                $this->_properties[] = new Dwellings_Dwelling( $this, $row2 );
                
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