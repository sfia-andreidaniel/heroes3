<?php
    
    class Creatures extends BaseClass {
        
        public function __construct() {
            
            $result = Database( 'main' )->query("
            
                SELECT  creatures.id            AS id,
                        creatures.name          AS name,
                        creatures.upgrade_to_id AS upgradeToId,
                        creatures.castle_type   AS castleTypeId,
                        creatures.level         AS level,
                        creatures.health        AS health,
                        creatures.attack        AS attack,
                        creatures.shots         AS shots,
                        creatures.movement      AS movementType,
                        creatures.hex_size      AS hexSize,
                        creatures.defence       AS defense,
                        creatures.damage_min    AS damageMin,
                        creatures.damage_max    AS damageMax,
                        creatures.speed         AS speed,
                        creatures.resource_gold      AS rgold,
                        creatures.resource_crystals  AS rcrystals,
                        creatures.resource_gems      AS rgems,
                        creatures.resource_mercury   AS rmercury,
                        creatures.resource_sulfur    AS rsulfur,
                        creatures.resource_ore       AS rore,
                        creatures.resource_wood      AS rwood,
                        creatures.object_type_id     AS objectTypeId
                    FROM creatures
                    ORDER BY creatures.castle_type, creatures.level, IF ( creatures.upgrade_to_id IS NULL, 9999, creatures.upgrade_to_id )
            ");
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row[ 'id' ];
                $row[ 'upgradeToId' ] = (int)$row[ 'upgradeToId' ] ? (int)$row[ 'upgradeToId' ] : NULL;
                $row[ 'castleTypeId' ] = (int)$row[ 'castleTypeId' ] ? (int)$row[ 'castleTypeId' ] : NULL;
                $row[ 'level' ] = (int)$row['level'];
                $row[ 'health' ] = (int)$row['health'];
                $row[ 'shots' ] = (int)$row[ 'shots' ];
                $row[ 'hexSize' ] = (int)$row[ 'hexSize' ];
                $row[ 'defense' ] = (int)$row[ 'defense' ];
                $row[ 'damage' ] = [
                    'min' => (int)$row[ 'damageMin' ],
                    'max' => (int)$row[ 'damageMax' ]
                ];
                unset( $row[ 'damageMin' ] );
                unset( $row[ 'damageMax' ] );
                
                $row[ 'objectTypeId' ] = (int)$row[ 'objectTypeId' ];
                
                $row[ 'speed' ] = (int)$row[ 'speed' ];

                $row[ 'resources' ] = [];
                
                foreach ( [ 'rgold', 'rcrystals', 'rgems', 'rmercury', 'rsulfur', 'rore', 'rwood' ] as $rname ) {
                    
                    $row[ $rname ] = (int)$row[ $rname ];
                    
                    if ( $row[ $rname ] > 0 ) {
                        $row[ 'resources' ][ substr( $rname, 1 ) ] = $row[ $rname ];
                    }
                    
                    unset( $row[ $rname ] );
                    
                }
                
                $this->_properties[] = new Creatures_Creature( $this, $row );
                
            }
            
        }
        
        private function __toJSON() {
            
            $out = [];
            
            foreach ( $this->_properties as $creature )
                $out[] = $creature->toJSON;
            
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