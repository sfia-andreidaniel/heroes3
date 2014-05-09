<?php
    
    Database::noop();
    
    class Maps extends BaseClass {
        
        public function __construct() {
            
            $result = Database( 'main' )->query(
                "SELECT id, name, type, width, height, num_layers, is_template FROM maps"
            );
            
            while ( $row = mysql_fetch_array( $result, MYSQL_ASSOC ) ) {
                
                $this->_properties[] = new Maps_Map( $this, [
                    'id' => (int)$row['id'],
                    'name' => $row['name'],
                    'type' => (int)$row['type'],
                    'width' => (int)$row['width'],
                    'height' => (int)$row['height'],
                    'numLayers' => (int)$row['num_layers'],
                    'isTemplate' => (int)$row['is_template']
                ] );
                
            }
        }
        
        public function create() {
            
            $result = NULL;
            
            $this->_properties[] = (
                $result = new Maps_Map( $this, [
                    'id' => 0,
                    'name' => 'map-' . time(),
                    'type' => 0,
                    'width' => 0,
                    'height' => 0,
                    'numLayers' => 0,
                    'isTemplate' => 0
                ] ) );
            
            return $result;
            
        }
        
    }
    
?>