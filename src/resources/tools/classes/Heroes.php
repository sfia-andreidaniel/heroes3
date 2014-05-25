<?php
    
    class Heroes extends BaseClass {
        
        public function __construct() {
            
            $result = Database( 'main' )->query(
                "SELECT heroes.id                          AS id,
                        heroes.name                        AS name,
                        heroes.sex                         AS sex,
                        heroes.race                        AS race,
                        heroes.icon                        AS icon,
                        heroes_types.id                    AS typeId,
                        heroes_types.name                  AS typeName,
                        heroes_types.castle_type           AS castleTypeId,
                        heroes_types.pri_skills_adv_lt_10  AS primarySkillsAdvancementLt10,
                        heroes_types.pri_skills_adv_gte_10 AS primarySkillsAdvancementGTE10,
                        heroes_types.object_type_id        AS objectTypeId,
                        heroes_types.skills_advancement    AS skillsAdvancement
                 FROM heroes
                 LEFT JOIN heroes_types ON heroes.type = heroes_types.id"
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $row[ 'id' ] = (int)$row['id'];
                $row[ 'typeId' ] = (int)$row['typeId' ];
                $row[ 'castleTypeId' ] = (int)$row[ 'castleTypeId' ];
                $row[ 'objectTypeId' ] = (int)$row[ 'objectTypeId' ];
                
                $row[ 'primarySkillsAdvancement' ] = [
                    'lt10' => json_decode( $row[ 'primarySkillsAdvancementLt10' ], TRUE ),
                    'gte10'=> json_decode( $row[ 'primarySkillsAdvancementGTE10' ], TRUE )
                ];
                
                $row[ 'skillsAdvancement' ] = json_decode( $row[ 'skillsAdvancement' ], TRUE );
                
                unset( $row[ 'primarySkillsAdvancementLt10' ] );
                unset( $row[ 'primarySkillsAdvancementGTE10' ] );
                
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