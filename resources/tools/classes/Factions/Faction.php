<?php
    
    class Factions_Faction extends BaseClass {
        
        private $_parent = NULL;
        private $_dirty = FALSE;
        
        public function __construct( Factions $parent, $properties ) {
            
            $this->_parent = $parent;
            $this->_properties = $properties;
            
        }
        
        public function __get( $propertyName ) {
            
            switch ( $propertyName ) {
                
                case 'toJSON':
                    return $this->_properties;
                    break;
                
                default:
                    return parent::__get( $propertyName );
                    break;
                
            }
            
        }

        public function __set( $propertyName, $propertyValue ) {
            
            switch ( TRUE ) {
                case in_array( $propertyName, [
                        'gold',
                        'wood',
                        'ore',
                        'crystals',
                        'gems',
                        'sulfur',
                        'mercury',
                        'mithril'
                    ] ):
                    
                    if ( !is_int( $propertyValue ) )
                        throw new Exception_Game( "$propertyName is of type int!" );
                    
                    if ( $propertyValue < 0 )
                        throw new Exception_Game( "$propertyName should be gte 0" );
                    
                    $this->_properties[ $propertyName ] = $propertyValue;
                    
                    $this->_dirty = TRUE;
                    
                    break;
                
                default:
                    parent::__set( $propertyName, $propertyValue );
                    break;
            }
            
        }

        public function save( ) {
            
            if ( $this->_dirty === FALSE )
                return;
            
            if ( $this->id === NULL ) {
                
                Dabatabase( 'main' )->query(
                    "INSERT INTO factions (
                        name,
                        gold,
                        wood,
                        ore,
                        crystals,
                        mercury,
                        sulfur,
                        gems,
                        mithril
                    ) VALUES (
                        " . Database::string( $this->name ) . ",
                        " . Database::int( $this->gold ) . ",
                        " . Database::int( $this->wood ) . ",
                        " . Database::int( $this->ore ) . ",
                        " . Database::int( $this->crystals ) . ",
                        " . Database::int( $this->mercury ) . ",
                        " . Database::int( $this->sulfur ) . ",
                        " . Database::int( $this->gems ) . ",
                        " . Database::int( $this->mithril ) . "
                    )"
                );
                
                $this->_properties[ 'id' ] = (int)mysql_insert_id();
                
            } else {
                
                Database( 'main' )->query(
                    "UPDATE factions SET
                        name     = " . Database::string( $this->name ) . ",
                        gold     = " . Database::int( $this->gold ) . ",
                        wood     = " . Database::int( $this->wood ) . ",
                        ore      = " . Database::int( $this->ore ) . ",
                        crystals = " . Database::int( $this->crystals ) . ",
                        mercury  = " . Database::int( $this->mercury ) . ",
                        sulfur   = " . Database::int( $this->sulfur ) . ",
                        gems     = " . Database::int( $this->gems ) . ",
                        mithril  = " . Database::int( $this->mithril ) . "
                    WHERE id = " . Database::int( $this->id ) . "
                    LIMIT 1"
                );
                
            }
            
            $this->_dirty = FALSE;
            
        }
        
        public function __destruct( ) {
            
            if ( $this->_dirty )
                $this->save();
            
        }

    }
    
?>