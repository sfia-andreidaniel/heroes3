<?php
    
    class Factions extends BaseClass {
        
        public function __construct() {
            
            $result = Database( 'main' )->query(
                'SELECT 
                    id,
                    name,
                    gold,
                    wood,
                    ore,
                    crystals,
                    gems,
                    sulfur,
                    mercury,
                    mithril
                 FROM factions'
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                $this->_properties[] = new Factions_Faction(
                    $this, [
                        'id'       => (int)$row['id'],
                        'name'     => $row['name'],
                        'gold'     => (int)$row['gold'],
                        'wood'     => (int)$row['wood'],
                        'ore'      => (int)$row['ore'],
                        'crystals' => (int)$row['crystals'],
                        'gems'     => (int)$row['gems'],
                        'sulfur'   => (int)$row['sulfur'],
                        'mercury'  => (int)$row['mercury'],
                        'mithril'  => (int)$row['mithril']
                    ]
                );
            }
            
        }
        
        private function _toJSON() {
            
            $out = [];
            
            foreach ( $this->_properties as $faction ) {
                $out[] = [
                    'id' => $faction->id,
                    'name' => $faction->name
                ];
            }
            
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