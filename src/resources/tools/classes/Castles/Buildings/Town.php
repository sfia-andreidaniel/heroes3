<?php
    
    class Castles_Buildings_Town extends BaseClass {
        
        private $_parent = NULL;
        
        public function __construct( Castles_Buildings $_parent, $castleTypeId, $buildingsList ) {
            
            $this->_parent = $_parent;
            
            $dwellings = new Dwellings();
            
            $this->_properties = [
                'id'            => $castleTypeId,
                'name'          => 'Buildings of ' . $buildingsList[0][ 'castleTypeName' ],
                'fort'          => [ ],
                'hall'          => [ ],
                'market'        => [ ],
                'blacksmith'    => [ ],
                'tavern'        => [ ],
                'mageGuild'     => [ ],
                'dwelling'      => [ ],
                'other'         => [ ],
                'shipyard'      => [ ]
            ];
            
            foreach ( $buildingsList as $building ) {
                
                $slotName  = NULL;
                $slotOrder = 0;
                
                switch ( TRUE ) {
                    
                    case preg_match( '/^dwelling\.([1-7])([a-b])$/', $building['buildingType'], $matches ) ? TRUE : FALSE:
                        $slotName = 'dwelling';
                        $slotOrder= ( ( (int)$matches[1] - 1 ) * 2 ) + ( $matches[2] == 'a' ? 0 : 1 );
                        break;
                    
                    case preg_match( '/^other\.([1-9])$/', $building[ 'buildingType' ], $matches ) ? TRUE : FALSE:
                        $slotName = 'other';
                        $slotOrder = (int)$matches[1] - 1;
                        break;
                    
                    case $building[ 'buildingType' ] == 'shipyard':
                        $slotName = 'shipyard';
                        $slotOrder = 0;
                        break;
                    
                    case $building[ 'buildingType' ] == 'estates.silo':
                        $slotName = 'market';
                        $slotOrder = 1;
                        break;
                    
                    case $building[ 'buildingType' ] == 'city.blacksmith':
                        $slotName = 'blacksmith';
                        $slotOrder = 0;
                        break;
                    
                    case preg_match( '/^spells\.([1-5]+)$/', $building[ 'buildingType' ], $matches ) ? TRUE : FALSE:
                        $slotName = 'mageGuild';
                        $slotOrder= (int)$matches[1] - 1;
                        break;
                    
                    case $building[ 'buildingType' ] == 'city.tavern':
                        $slotName = 'tavern';
                        $slotOrder= 0;
                        break;
                    
                    case $building[ 'buildingType' ] == 'city.market':
                        $slotName = 'market';
                        $slotOrder = 0;
                        break;
                    
                    case preg_match( '/^fort\.([1-3])$/', $building[ 'buildingType' ], $matches ) ? TRUE : FALSE:
                        $slotName = 'fort';
                        $slotOrder= (int)$matches[1] - 1;
                        break;
                    
                    case preg_match( '/^estates\.([1-3])$/', $building[ 'buildingType' ], $matches ) ? TRUE : FALSE:
                        $slotName = 'hall';
                        $slotOrder = (int)$matches[1] - 1;
                        break;
                }
                
                if ( $slotName !== NULL ) {
                    
                    $property = [
                        'id' => $building[ 'id' ],
                        'name' => $building[ 'name' ],
                        'description' => $building[ 'description' ] ? $building[ 'description' ] : 'This building has no description yet',
                        'costs' => $building[ 'costs' ],
                        'built' => FALSE
                    ];
                    
                    if ( count( $building[ 'requirements' ] ) )
                        $property[ 'requirements' ] = $building[ 'requirements' ];
                    
                    if ( $slotName == 'dwelling' ) {
                        
                        $property[ 'dwelling' ] = [
                            'id'           => $building[ 'dwellingTypeId' ],
                            'growth'       => $dwellings->getElementById( $building[ 'dwellingTypeId' ] )->growth,
                            'level'        => $slotOrder % 2
                        ];
                        
                    }
                    
                    $this->_properties[ $slotName ][ $slotOrder ] = $property;
                    
                }
            }
            
        }
        
        private function __toJSON() {
            
            return $this->_properties;
            
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