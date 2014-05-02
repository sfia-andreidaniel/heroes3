<?php

    class BaseClass implements arrayaccess, countable, iterator {
        
        protected        $_properties = array();
        
        protected        $_exports    = array();
        
        private          $_position = 0;
        private          $_keys     = array();
        private          $_len      = 0;
        
        private          $_isIndexed = FALSE;
        private          $_shiftNonNumericProperties = 0;
        
        protected static $_nativeMethods = [
            
        ];
        
        public function __construct( $properties = NULL ) {

            if ( $properties !== NULL )
                $this->_properties = $properties;
            
        }
        
        public function offsetExists ( $offset ) {
            return isset( $this->_properties[ $offset ] );
        }
        
        public function offsetGet ( $offset ) {

            return @$this->_properties[ $offset ];

        }
        
        public function offsetSet ( $offset , $value ) {
            $this->_properties[ $offset ] = $value;
        }
        
        public function offsetUnset ( $offset ) {
            if ( isset( $this->_properties[ $offset ] ) )
                unset( $this->_properties[ $offset ] );
        }
        
        public function rewind() {
        
            if ( method_exists( $this, 'isArray' ) ) {
//                echo get_class( $this ), " is indexed!\n";
                $this->_isIndexed = TRUE;
            } else {
                $this->_isIndexed = FALSE;
//                echo get_class( $this ), " is not indexed\n";
            }

//            echo "rewind a: ", get_class( $this ), "\n";
        
            $this->_position = 0;
            $this->_keys = array_keys( $this->_properties );
            $this->_len = count( $this->_keys );
            
            $this->_shiftNonNumericProperties = 0;
            
            if ( $this->_isIndexed ) {
                
                foreach ( array_keys( $this->_properties ) as $propertyName )
                    if ( !is_int( $propertyName ) ) {
                        $this->_shiftNonNumericProperties++;
//                        echo "NonNumericProperty: ", $propertyName, "\n";
                    }
                
            }
            
        }
        
        public function current() {
            if ( !$this->_isIndexed )
                return $this->_properties[ $this->_keys[ $this->_position ] ];
            else
                return $this->_properties[ $this->_position ];
        }
        
        public function key( ) {
            
            if ( !$this->_isIndexed )
                return $this->_keys[ $this->_position ];
            else
                return $this->_position;
        }
        
        public function next() {
            $this->_position++;
        }
        
        public function valid() {
            return $this->_position < $this->_len - ( $this->_isIndexed ? $this->_shiftNonNumericProperties : 0 );
        }
        
        public function count() {
            return count( $this->_properties ) - ( $this->_isIndexed ? $this->_shiftNonNumericProperties : 0 );
        }
        
        protected function getUniqueID() {
            
            if ( isset( $this->_properties[ 'id' ] ) ) {
                
                return get_class( $this ) . ':' . $this->_properties[ 'id' ];
                
            } else {
                
                return method_exists( $this, '_getPath' ) ?
                    $this->_getPath() :
                    get_class( $this );
                
            }
            
        }
        
        protected function _export( $propertyName ) {
            
            $this->_exports[] = $propertyName;
            
        }
        
        public function __get( $propertyName ) {
        
            if ( $propertyName == '_id' )
                return $this->getUniqueID();
            else {
                if ( isset ( $this->_properties[ $propertyName ] ) )
                    return $this->_properties[ $propertyName ];
                else {
                    if ( in_array( $propertyName, array_keys( $this->_properties ) ) )
                        return $this->_properties[ $propertyName ];
                    else
                        throw new Exception_Programming( "Undefined property: '" . $propertyName . "' in class '" . get_class( $this ) . "'", SEVERITY_MEDIUM );
                }
            }
        }
        
        public function __set( $propertyName, $propertyValue ) {
            throw new Exception_Programming( "Property $propertyName IS readOnly", SEVERITY_LOW );
        }
        
        public function getKeys() {
            
            return array_merge( array_keys( $this->_properties ), $this->_exports );
            
        }
        
        public function __call( $methodName, $methodArgs ) {
            throw new Exception_Programming( "Method $methodName is not implemented in class " . get_class( $this ), SEVERITY_CRITICAL );
        }
        
        public function isArray() {
            
            $keys = array_keys( $this->_properties );
            
            $expected = 0;
            
            foreach ( $keys as $key ) {
                
                if ( $key == $expected || $key == 'id') {
                    if ( $key != 'id' )
                        $expected++;
                } else return FALSE;
                
            }
            
            return count( $keys ) > 0;
        }
        
        public function getElementById( $id ) {
            
            foreach ( $this->_properties as $property  ) {
                if ( $property instanceof BaseClass ) {
                    try {
                        if ( @$property->id == $id )
                            return $property;
                    } catch ( Exception $e ) { }
                }
            }
            
            return NULL;
        }
        
        public static function noop() {
            
        }
        
        public static function defineNativeMethod( $methodName, $javaScriptMethod ) {
            self::$_nativeMethods[ $methodName ] = $javaScriptMethod;
        }
        
        public static function getNativeMethodBody( $methodName ) {
            if ( !isset( self::$_nativeMethods[ $methodName ] ) )
                throw new Exception_Programming( "The native method $methodName is not implemented", SEVERITY_CRITICAL );
            else
                return self::$_nativeMethods[ $methodName ];
        }
    
    }

?>